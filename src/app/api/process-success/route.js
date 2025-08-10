import Stripe from 'stripe';

// Fix para certificados self-signed en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../utils/siteConfigHelper.js';
import { sendDonationNotification, sendOrderNotification, sendUserOrderConfirmation, sendUserDonationConfirmation } from '../../services/emailService.js';
import { formatCustomerInfo, parseLineItems, calculateTotal } from '../../utils/siteConfigHelper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// In-memory store to track processed sessions (in production, use Redis or database)
const processedSessions = new Set();

export async function POST(request) {
  try {
    // Check if we should process payments here (only in development/non-webhook mode)
    const useWebhookProcessing = process.env.USE_WEBHOOK_PROCESSING === 'true';
    
    if (useWebhookProcessing) {
      console.log('❌ Process-success API disabled - webhook processing is enabled');
      return Response.json({ 
        error: 'Payment processing is handled by webhook in this environment' 
      }, { status: 400 });
    }

    console.log('🔄 Process-success API enabled for development mode');
    
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Check if already processed
    if (processedSessions.has(sessionId)) {
      console.log('ℹ️ Session already processed:', sessionId);
      return Response.json({ success: true, message: 'Session already processed', alreadyProcessed: true });
    }

    console.log('🔄 Processing success for session:', sessionId);

    // Mark as processed immediately
    processedSessions.add(sessionId);

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      // Remove from processed set if session not found
      processedSessions.delete(sessionId);
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    try {
      // Process the session the same way as webhook
      await handleCheckoutSessionCompleted(session);
      return Response.json({ success: true, message: 'Payment processed successfully' });
    } catch (processingError) {
      // Remove from processed set if processing failed
      processedSessions.delete(sessionId);
      throw processingError;
    }
    
  } catch (error) {
    console.error('Error processing success:', error);
    return Response.json({ error: 'Processing failed', details: error.message }, { status: 500 });
  }
}

// Copy the same logic from webhook
async function handleCheckoutSessionCompleted(session) {
  console.log('Processing checkout session:', session.id);
  
  try {
    // Obtener email de notificación
    const notificationEmail = await getNotificationEmail();
    
    if (session.mode === 'subscription') {
      // Manejar suscripciones (donaciones recurrentes)
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      console.log('Subscription created:', subscription.id);
      
      // Obtener metadata de la sesión
      const metadata = session.metadata || {};
      
      // Si es una suscripción limitada, agregar metadata a la suscripción
      if (metadata.subscriptionType === 'limited' && metadata.maxPayments) {
        await stripe.subscriptions.update(subscription.id, {
          metadata: {
            ...metadata,
            paymentsCount: '0', // Inicializar contador
            createdAt: new Date().toISOString()
          }
        });
      }

      // Enviar emails de confirmación de donación
      if (validateEmailConfig() && notificationEmail) {
        const customerInfo = {
          email: session.customer_email || session.customer_details?.email || 'unknown@email.com',
          firstName: metadata.customer_firstName || '',
          lastName: metadata.customer_lastName || '',
          phone: metadata.customer_phone || '',
          nationality: metadata.customer_nationality || ''
        };

        const donationData = {
          customer: customerInfo,
          amount: session.amount_total / 100, // Convertir de centavos
          frequency: metadata.frequency || 'monthly',
          donationType: 'subscription',
          metadata: {
            ...metadata,
            sessionId: session.id,
            subscriptionId: subscription.id
          }
        };

        // Enviar notificación al admin
        const adminResult = await sendDonationNotification(notificationEmail, donationData);
        if (adminResult.success) {
          logNotification('DONATION', notificationEmail, donationData);
        } else {
          handleNotificationError(adminResult.error, 'admin donation notification');
        }

        // Enviar confirmación al usuario
        const userResult = await sendUserDonationConfirmation(customerInfo.email, donationData);
        if (userResult.success) {
          logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
        } else {
          handleNotificationError(userResult.error, 'user donation confirmation');
        }

        // Guardar donación de suscripción en Strapi después de emails exitosos
        const strapiResult = await saveDonationToStrapi(session, metadata, 'subscription');
        if (strapiResult) {
          console.log('✅ Subscription donation successfully saved to Strapi:', strapiResult.data?.documentId);
        }
      }

    } else if (session.mode === 'payment') {
      // Manejar pagos únicos (pedidos/donaciones únicas)
      const metadata = session.metadata || {};
      
      if (validateEmailConfig() && notificationEmail) {
        const customerInfo = {
          email: session.customer_email || session.customer_details?.email || 'unknown@email.com',
          firstName: metadata.customer_firstName || '',
          lastName: metadata.customer_lastName || '',
          phone: metadata.customer_phone || '',
          nationality: metadata.customer_nationality || ''
        };

        // Verificar si es donación única o pedido regular
        const isDonation = metadata.purpose === 'Donation' || 
                          metadata.donationType === 'one-time';

        if (isDonation) {
          // Enviar emails de donación única
          const donationData = {
            customer: customerInfo,
            amount: session.amount_total / 100,
            frequency: 'one-time',
            donationType: 'one-time',
            metadata: {
              ...metadata,
              sessionId: session.id
            }
          };

          // Notificación al admin
          const adminResult = await sendDonationNotification(notificationEmail, donationData);
          if (adminResult.success) {
            logNotification('DONATION', notificationEmail, donationData);
          } else {
            handleNotificationError(adminResult.error, 'admin donation notification');
          }

          // Confirmación al usuario
          const userResult = await sendUserDonationConfirmation(customerInfo.email, donationData);
          if (userResult.success) {
            logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
          } else {
            handleNotificationError(userResult.error, 'user donation confirmation');
          }

          // Guardar donación en Strapi después de emails exitosos
          const strapiResult = await saveDonationToStrapi(session, metadata, 'one-time');
          if (strapiResult) {
            console.log('✅ Donation successfully saved to Strapi:', strapiResult.data?.documentId);
          }

        } else {
          // Enviar emails de pedido regular
          const items = metadata.line_items ? 
            parseLineItems(JSON.parse(metadata.line_items)) : 
            [{ name: 'Order', price: session.amount_total / 100, quantity: 1 }];
          
          // Enriquecer items con información específica por tipo de producto desde metadata
          const enrichedItems = items.map(item => {
            const enrichedItem = { ...item };
            
            // Para reservas de comidas
            if (item.productType === 'mealReservation' || metadata.orderType === 'reservation') {
              enrichedItem.shabbatName = metadata.eventName || metadata.shabbatName || extractEventNameFromDescription(item.description);
              enrichedItem.shabbatDate = metadata.eventDate || metadata.shabbatDate || metadata.serviceDate;
              enrichedItem.eventType = 'Shabbat Meal';
            }
            
            // Para Shabbat Box
            if (item.productType === 'shabbatBox' || metadata.orderType === 'shabbatBox') {
              enrichedItem.shabbatName = metadata.parashahName || extractParashahFromDescription(item.description);
              enrichedItem.shabbatDate = metadata.deliveryDate || metadata.shabbatDate;
              enrichedItem.eventType = 'Shabbat Box Delivery';
            }
            
            return enrichedItem;
          });
          
          const total = calculateTotal(enrichedItems, metadata.donation);
          
          const orderData = {
            orderId: metadata.orderId || `ORDER-${session.id}`,
            customer: customerInfo,
            items: enrichedItems,
            total,
            metadata: {
              ...metadata,
              sessionId: session.id
            }
          };

          // Notificación al admin
          const adminResult = await sendOrderNotification(notificationEmail, orderData);
          if (adminResult.success) {
            logNotification('ORDER', notificationEmail, orderData);
          } else {
            handleNotificationError(adminResult.error, 'admin order notification');
          }

          // Confirmación al usuario
          const userResult = await sendUserOrderConfirmation(customerInfo.email, orderData);
          if (userResult.success) {
            logNotification('USER_ORDER_CONFIRMATION', customerInfo.email, orderData);
          } else {
            handleNotificationError(userResult.error, 'user order confirmation');
          }

          // Guardar orden en Strapi después de emails exitosos
          const strapiResult = await saveOrderToStrapi(session, metadata, enrichedItems);
          if (strapiResult) {
            console.log('✅ Order successfully saved to Strapi:', strapiResult.data?.documentId);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
    handleNotificationError(error, 'checkout session completed handler');
    throw error; // Re-throw to be handled by the main function
  }
}

// Helper para guardar donaciones en Strapi
async function saveDonationToStrapi(session, metadata, donationType) {
  try {
    console.log('📝 Attempting to save donation to Strapi...');
    console.log('Session data:', { 
      id: session.id, 
      amount: session.amount_total / 100,
      email: session.customer_email,
      subscription: session.subscription 
    });
    console.log('Metadata:', metadata);
    
    // Generar ID único para la donación
    const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const donationData = {
      data: {
        donationId: donationId,
        subscriptionId: session.subscription || null,
        donorName: `${metadata.customer_firstName || ''} ${metadata.customer_lastName || ''}`.trim() || 'Anonymous',
        donorEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
        donorPhone: metadata.customer_phone || null,
        totalAmount: session.amount_total / 100,
        donationType: metadata.frequency || donationType || 'one-time',
        customMonths: metadata.customMonths ? parseInt(metadata.customMonths) : null,
        isDonationCustom: metadata.selectedPresetAmount === 'custom' || false,
        donationStatus: 'completed'
      }
    };
    
    console.log('📤 Sending to Strapi:', JSON.stringify(donationData, null, 2));

    // Fix para certificados SSL en desarrollo
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const response = await fetch(`${process.env.STRAPI_API_URL}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(donationData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Strapi error response:', errorText);
      console.error('❌ Status:', response.status);
      throw new Error(`Strapi API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Donation saved to Strapi:', result.data?.donationId);
    return result;

  } catch (error) {
    console.error('❌ Error saving donation to Strapi:', error);
    handleNotificationError(error, 'donation save to Strapi');
    return null;
  }
}

// Helper para guardar órdenes en Strapi
async function saveOrderToStrapi(session, metadata, parsedItems) {
  try {
    // Solo guardar para reservaciones y shabbatBox (no donaciones)
    if (metadata.purpose === 'Donation') {
      return null;
    }

    const orderData = {
      data: {
        orderId: metadata.orderId || `ORDER-${session.id}`,
        orderType: detectOrderType(metadata, parsedItems),
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        customerName: `${metadata.customer_firstName || ''} ${metadata.customer_lastName || ''}`.trim() || 'N/A',
        customerEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
        customerPhone: metadata.customer_phone || null,
        customerNationality: metadata.customer_nationality || null,
        serviceDate: extractServiceDate(metadata, parsedItems),
        orderDescription: formatOrderDescription(parsedItems, session.amount_total / 100),
        orderStatus: 'paid'
      }
    };

    const response = await fetch(`${process.env.STRAPI_API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Order saved to Strapi:', result.data?.orderId);
    return result;

  } catch (error) {
    console.error('❌ Error saving order to Strapi:', error);
    handleNotificationError(error, 'order save to Strapi');
    return null;
  }
}

// Helper para detectar tipo de orden
function detectOrderType(metadata, parsedItems) {
  // Verificar en metadata primero
  if (metadata.orderType === 'reservation' || metadata.orderType === 'mealReservation') {
    return 'shabbat or holiday';
  }
  
  if (metadata.orderType === 'shabbatBox') {
    return 'shabbatBox';
  }

  // Verificar por los nombres de productos
  const hasShabbatBox = parsedItems.some(item => 
    item.productType === 'shabbatBox' || 
    item.name.toLowerCase().includes('shabbat box')
  );

  if (hasShabbatBox) {
    return 'shabbatBox';
  }

  // Default para reservaciones
  return 'shabbat or holiday';
}

// Helper para extraer fecha de servicio
function extractServiceDate(metadata, parsedItems) {
  // Buscar fecha en diferentes ubicaciones - prioridad a eventDate
  if (metadata.eventDate) {
    return metadata.eventDate; // Mantener formato original del texto
  }
  
  // Mantener compatibilidad con shabbatDate
  if (metadata.shabbatDate) {
    return metadata.shabbatDate; // Mantener formato original del texto
  }

  // Buscar en items
  const itemWithDate = parsedItems.find(item => item.shabbatDate);
  if (itemWithDate) {
    return itemWithDate.shabbatDate; // Mantener formato original del texto
  }

  // Default a próximo viernes en formato DD/MM/YYYY
  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay()));
  const day = nextFriday.getDate().toString().padStart(2, '0');
  const month = (nextFriday.getMonth() + 1).toString().padStart(2, '0');
  const year = nextFriday.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper para formatear fecha para Strapi (DEPRECATED - ya no se usa)
// Ahora el campo serviceDate es texto y mantiene el formato original
function formatDateForStrapi(dateString) {
  // Esta función ya no se usa, pero se mantiene por si hay otras partes del código que la llamen
  return dateString; // Devolver el texto original sin conversión
}

// Helper para formatear descripción de orden
function formatOrderDescription(parsedItems, totalAmount) {
  const lines = [];
  
  parsedItems.forEach(item => {
    if (item.productType !== 'fee' && item.productType !== 'donation') {
      const unitPrice = item.price.toFixed(2);
      const totalPrice = item.total.toFixed(2);
      lines.push(`${item.name} x${item.quantity} - $${unitPrice} cada - $${totalPrice}`);
    }
  });

  // Agregar donación si existe
  const donation = parsedItems.find(item => item.productType === 'donation');
  if (donation) {
    lines.push(`Donación - $${donation.total.toFixed(2)}`);
  }

  // Agregar fee si existe
  const fee = parsedItems.find(item => item.productType === 'fee');
  if (fee) {
    lines.push(`Cargo por procesamiento - $${fee.total.toFixed(2)}`);
  }

  lines.push('----------------------');
  lines.push(`Total: $${totalAmount.toFixed(2)}`);

  return lines.join('\n');
}

// Helper para extraer nombre del evento de la descripción
function extractEventNameFromDescription(description) {
  if (!description) return null;
  
  // Buscar patrones como "Parashat [nombre]" o nombres específicos
  const parashahMatch = description.match(/Parashat\s+(\w+)/i);
  if (parashahMatch) {
    return `Parashat ${parashahMatch[1]}`;
  }
  
  // Para Shabbat Box, extraer el nombre del evento
  if (description.includes('shabbatBox')) {
    return description.split(' - ')[0] || 'Shabbat';
  }
  
  return null;
}

// Helper para extraer nombre de parashá de la descripción  
function extractParashahFromDescription(description) {
  if (!description) return null;
  
  const parashahMatch = description.match(/Parashat\s+(\w+)/i);
  return parashahMatch ? `Parashat ${parashahMatch[1]}` : null;
}