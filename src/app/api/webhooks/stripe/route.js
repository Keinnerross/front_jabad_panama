import Stripe from 'stripe';
import { headers } from 'next/headers';

// Fix para certificados self-signed en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendDonationNotification, sendOrderNotification, sendUserOrderConfirmation, sendUserDonationConfirmation } from '../../../services/emailService.js';
import { formatCustomerInfo, parseLineItems, calculateTotal } from '../../../utils/siteConfigHelper.js';
import { 
  saveDonationToStrapi, 
  saveShabbatOrder, 
  saveShabbatBoxOrder, 
  saveCustomEventDeliveryOrder,
  detectOrderType,
  formatOrderDescription,
  extractDateRange
} from '../../../services/strapi-orders.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Procesar eventos y esperar a que terminen antes de responder
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Esperar a que se complete el procesamiento
        await handleCheckoutSessionCompleted(event.data.object);
        console.log('✅ Checkout session processing completed');
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        console.log('✅ Invoice payment processing completed');
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        console.log('✅ Subscription created processing completed');
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        console.log('✅ Subscription updated processing completed');
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        console.log('✅ Subscription deleted processing completed');
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('❌ Error processing webhook event:', err);
    // Log the error but still respond success to Stripe to avoid retries
    // The error is already logged and we don't want Stripe to keep retrying
  }

  // Responder a Stripe después de completar el procesamiento
  return Response.json({ received: true });
}

async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);
  
  try {
    // Recuperar la sesión completa con line_items expandidos
    // El webhook solo recibe datos básicos, necesitamos más información
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product']
    });
    
    // Usar fullSession en lugar de session para tener toda la información
    session = fullSession;
    
    // Obtener email de notificación
    const notificationEmail = await getNotificationEmail();
    
    if (session.mode === 'subscription') {
      // Manejar suscripciones (donaciones recurrentes)
      let subscription = await stripe.subscriptions.retrieve(session.subscription);
      console.log('Subscription created:', subscription.id);
      
      // Obtener metadata de la sesión
      const metadata = session.metadata || {};
      
      // Si es una suscripción limitada, programar cancelación
      if (metadata.subscriptionType === 'limited' && metadata.cancel_at_timestamp) {
        const cancelAt = parseInt(metadata.cancel_at_timestamp);
        console.log(`📅 Setting subscription to auto-cancel at timestamp: ${cancelAt}`);
        
        // Actualizar la suscripción con la fecha de cancelación
        subscription = await stripe.subscriptions.update(subscription.id, {
          cancel_at: cancelAt
        });
        
        const cancelDate = new Date(cancelAt * 1000);
        console.log(`✅ Subscription ${subscription.id} will auto-cancel on: ${cancelDate.toISOString()}`);
      }
      
      // Log de información de cancelación si existe
      if (subscription.cancel_at) {
        const cancelDate = new Date(subscription.cancel_at * 1000);
        console.log(`📅 Subscription scheduled to auto-cancel on: ${cancelDate.toISOString()}`);
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
        try {
          const adminResult = await sendDonationNotification(notificationEmail, donationData);
          if (adminResult.success) {
            logNotification('DONATION', notificationEmail, donationData);
          }
        } catch (error) {
          handleNotificationError(error, 'webhook donation notification');
        }

        // Enviar confirmación al usuario
        try {
          const userResult = await sendUserDonationConfirmation(customerInfo.email, donationData);
          if (userResult.success) {
            logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
          }
        } catch (error) {
          handleNotificationError(error, 'webhook user donation confirmation');
        }

        // Guardar donación de suscripción en Strapi después de emails exitosos
        try {
          const strapiResult = await saveDonationToStrapi(session, metadata, 'subscription');
          if (strapiResult) {
            console.log('✅ Subscription donation successfully saved to Strapi:', strapiResult.data?.documentId);
          }
        } catch (error) {
          console.error('❌ Failed to save subscription donation to Strapi:', error);
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
          try {
            const adminResult = await sendDonationNotification(notificationEmail, donationData);
            if (adminResult.success) {
              logNotification('DONATION', notificationEmail, donationData);
            }
          } catch (error) {
            handleNotificationError(error, 'webhook donation notification');
          }

          // Confirmación al usuario
          try {
            const userResult = await sendUserDonationConfirmation(customerInfo.email, donationData);
            if (userResult.success) {
              logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
            }
          } catch (error) {
            handleNotificationError(error, 'webhook user donation confirmation');
          }

          // Guardar donación en Strapi después de emails exitosos
          try {
            const strapiResult = await saveDonationToStrapi(session, metadata, 'one-time');
            if (strapiResult) {
              console.log('✅ Donation successfully saved to Strapi:', strapiResult.data?.documentId);
            }
          } catch (error) {
            console.error('❌ Failed to save donation to Strapi:', error);
          }

        } else {
          // Enviar emails de pedido regular
          // Usar line_items de la sesión expandida si están disponibles
          const items = session.line_items?.data ? 
            parseLineItems(session.line_items.data) : 
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
          try {
            const adminResult = await sendOrderNotification(notificationEmail, orderData);
            if (adminResult.success) {
              logNotification('ORDER', notificationEmail, orderData);
            }
          } catch (error) {
            handleNotificationError(error, 'webhook order notification');
          }

          // Confirmación al usuario
          try {
            const userResult = await sendUserOrderConfirmation(customerInfo.email, orderData);
            if (userResult.success) {
              logNotification('USER_ORDER_CONFIRMATION', customerInfo.email, orderData);
            }
          } catch (error) {
            handleNotificationError(error, 'webhook user order confirmation');
          }

          // Guardar orden en Strapi después de emails exitosos
          // Decidir si es Shabbat/Holiday o una orden regular
          const orderType = detectOrderType(metadata, enrichedItems);
          
          console.log('🔍 Order type detected:', orderType);
          console.log('🔍 Metadata orderType:', metadata.orderType);
          console.log('🔍 EventDate from metadata:', metadata.eventDate);
          
          if (orderType === 'shabbat or holiday') {
            // Guardar en shabbat-orders
            console.log('📝 Saving to shabbat-orders collection');
            try {
              const result = await saveShabbatOrder(session, metadata, enrichedItems);
              if (result) {
                console.log('✅ Shabbat order successfully saved to Strapi:', result.data?.documentId);
              }
            } catch (error) {
              console.error('❌ Failed to save Shabbat order to Strapi:', error);
            }
          } else if (orderType === 'shabbatBox') {
            // Guardar Shabbat Box usando la función específica
            console.log('📝 Saving Shabbat Box order');
            console.log('📝 Session ID:', session.id);
            console.log('📝 Metadata:', JSON.stringify(metadata));
            try {
              const result = await saveShabbatBoxOrder(session, metadata, enrichedItems);
              if (result) {
                console.log('✅ Shabbat Box order successfully saved to Strapi:', result.data?.documentId);
              } else {
                console.log('⚠️ saveShabbatBoxOrder returned null or undefined');
              }
            } catch (error) {
              console.error('❌ Failed to save Shabbat Box order to Strapi:', error);
              console.error('❌ Full error:', JSON.stringify(error));
            }
          } else if (orderType === 'customEvent') {
            // Guardar Custom Event usando la función específica
            console.log('📝 Saving Custom Event order');
            console.log('📝 Session ID:', session.id);
            console.log('📝 Metadata:', JSON.stringify(metadata));
            try {
              const result = await saveCustomEventDeliveryOrder(session, metadata, enrichedItems);
              if (result) {
                console.log('✅ Custom Event order successfully saved to Strapi:', result.data?.documentId);
              } else {
                console.log('⚠️ saveCustomEventDeliveryOrder returned null or undefined');
              }
            } catch (error) {
              console.error('❌ Failed to save Custom Event order to Strapi:', error);
              console.error('❌ Full error:', JSON.stringify(error));
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
    handleNotificationError(error, 'checkout session completed handler');
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Solo log informativo, Stripe maneja la cancelación automática con cancel_at
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    if (subscription.cancel_at) {
      const cancelDate = new Date(subscription.cancel_at * 1000);
      console.log(`📅 Subscription ${subscription.id} scheduled to cancel on: ${cancelDate.toISOString()}`);
    }
    
    console.log(`✅ Monthly payment processed for subscription: ${subscription.id}`);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  // Log de información útil
  if (subscription.cancel_at) {
    const cancelDate = new Date(subscription.cancel_at * 1000);
    console.log(`📅 Will auto-cancel on: ${cancelDate.toISOString()}`);
  }
  
  const metadata = subscription.metadata || {};
  console.log('Subscription type:', metadata.frequency || 'monthly');
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Log de información útil
  if (subscription.cancel_at) {
    const cancelDate = new Date(subscription.cancel_at * 1000);
    console.log(`📅 Scheduled to cancel on: ${cancelDate.toISOString()}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const metadata = subscription.metadata || {};
  
  // Log para distinguir si fue cancelación automática o manual
  if (subscription.canceled_at && subscription.cancel_at) {
    if (subscription.canceled_at >= subscription.cancel_at) {
      console.log(`✅ Subscription ${subscription.id} completed successfully (auto-canceled as scheduled)`);
      
      // Opcional: Enviar notificación de completado
      if (metadata.frequency && ['12-months', '24-months', 'other'].includes(metadata.frequency)) {
        await sendSubscriptionCompletedNotification(subscription, metadata);
      }
    } else {
      console.log(`⚠️ Subscription ${subscription.id} canceled before scheduled end date`);
    }
  } else {
    console.log(`Subscription ${subscription.id} canceled`);
  }
}

async function sendSubscriptionCompletedNotification(subscription, metadata) {
  try {
    if (validateEmailConfig()) {
      const notificationEmail = await getNotificationEmail();
      
      if (notificationEmail) {
        // Obtener información del cliente de Stripe
        let customerInfo = { email: 'unknown@email.com' };
        
        if (subscription.customer) {
          try {
            const customer = await stripe.customers.retrieve(subscription.customer);
            customerInfo = {
              email: customer.email || 'unknown@email.com',
              firstName: customer.name?.split(' ')[0] || '',
              lastName: customer.name?.split(' ').slice(1).join(' ') || ''
            };
          } catch (err) {
            console.error('Error retrieving customer:', err);
          }
        }

        const donationData = {
          customer: customerInfo,
          amount: parseFloat(metadata.originalAmount || '0'),
          frequency: metadata.frequency || 'monthly',
          donationType: 'subscription_completed',
          metadata: {
            ...metadata,
            subscriptionId: subscription.id,
            totalPayments: metadata.paymentsCount,
            completionReason: 'Subscription completed successfully'
          }
        };

        // Enviar notificación de suscripción completada
        const result = await sendDonationNotification(notificationEmail, donationData);
        
        if (result.success) {
          logNotification('SUBSCRIPTION_COMPLETED', notificationEmail, donationData);
        } else {
          handleNotificationError(result.error, 'subscription completed notification');
        }
      }
    }
  } catch (error) {
    handleNotificationError(error, 'subscription completed notification setup');
  }
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