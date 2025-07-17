import Stripe from 'stripe';
import { headers } from 'next/headers';
import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendDonationNotification, sendOrderNotification, sendUserOrderConfirmation, sendUserDonationConfirmation } from '../../../services/emailService.js';
import { formatCustomerInfo, parseLineItems, calculateTotal } from '../../../utils/siteConfigHelper.js';

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

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);
  
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
        sendDonationNotification(notificationEmail, donationData)
          .then((result) => {
            if (result.success) {
              logNotification('DONATION', notificationEmail, donationData);
            }
          })
          .catch((error) => {
            handleNotificationError(error, 'webhook donation notification');
          });

        // Enviar confirmación al usuario
        sendUserDonationConfirmation(customerInfo.email, donationData)
          .then((result) => {
            if (result.success) {
              logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
            }
          })
          .catch((error) => {
            handleNotificationError(error, 'webhook user donation confirmation');
          });
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
          sendDonationNotification(notificationEmail, donationData)
            .then((result) => {
              if (result.success) {
                logNotification('DONATION', notificationEmail, donationData);
              }
            })
            .catch((error) => {
              handleNotificationError(error, 'webhook donation notification');
            });

          // Confirmación al usuario
          sendUserDonationConfirmation(customerInfo.email, donationData)
            .then((result) => {
              if (result.success) {
                logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
              }
            })
            .catch((error) => {
              handleNotificationError(error, 'webhook user donation confirmation');
            });

        } else {
          // Enviar emails de pedido regular
          const items = metadata.line_items ? 
            parseLineItems(JSON.parse(metadata.line_items)) : 
            [{ name: 'Order', price: session.amount_total / 100, quantity: 1 }];
          
          const total = calculateTotal(items, metadata.donation);
          
          const orderData = {
            orderId: metadata.orderId || `ORDER-${session.id}`,
            customer: customerInfo,
            items,
            total,
            metadata: {
              ...metadata,
              sessionId: session.id
            }
          };

          // Notificación al admin
          sendOrderNotification(notificationEmail, orderData)
            .then((result) => {
              if (result.success) {
                logNotification('ORDER', notificationEmail, orderData);
              }
            })
            .catch((error) => {
              handleNotificationError(error, 'webhook order notification');
            });

          // Confirmación al usuario
          sendUserOrderConfirmation(customerInfo.email, orderData)
            .then((result) => {
              if (result.success) {
                logNotification('USER_ORDER_CONFIRMATION', customerInfo.email, orderData);
              }
            })
            .catch((error) => {
              handleNotificationError(error, 'webhook user order confirmation');
            });
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
  
  // Solo procesar si es una suscripción
  if (!invoice.subscription) return;
  
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const metadata = subscription.metadata || {};
  
  // Solo procesar suscripciones limitadas
  if (metadata.subscriptionType !== 'limited' || !metadata.maxPayments) {
    return;
  }
  
  const maxPayments = parseInt(metadata.maxPayments);
  const currentPayments = parseInt(metadata.paymentsCount || '0') + 1;
  
  console.log(`Pago ${currentPayments} de ${maxPayments} para suscripción ${subscription.id}`);
  
  // Actualizar contador de pagos
  await stripe.subscriptions.update(subscription.id, {
    metadata: {
      ...metadata,
      paymentsCount: currentPayments.toString(),
      lastPaymentDate: new Date().toISOString()
    }
  });
  
  // Si se alcanzó el máximo de pagos, cancelar la suscripción
  if (currentPayments >= maxPayments) {
    console.log(`Cancelando suscripción ${subscription.id} - se alcanzó el máximo de pagos`);
    
    await stripe.subscriptions.cancel(subscription.id, {
      prorate: false // No prorratear el último pago
    });
    
    // Opcional: Enviar notificación al usuario
    await sendSubscriptionCompletedNotification(subscription, metadata);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  // Log para debugging
  const metadata = subscription.metadata || {};
  console.log('Subscription metadata:', metadata);
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Log para debugging
  const metadata = subscription.metadata || {};
  if (metadata.subscriptionType === 'limited') {
    console.log(`Suscripción limitada actualizada - Pagos: ${metadata.paymentsCount}/${metadata.maxPayments}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const metadata = subscription.metadata || {};
  
  // Log específico para suscripciones completadas vs canceladas
  if (metadata.subscriptionType === 'limited') {
    const paymentsCount = parseInt(metadata.paymentsCount || '0');
    const maxPayments = parseInt(metadata.maxPayments || '0');
    
    if (paymentsCount >= maxPayments) {
      console.log(`Suscripción ${subscription.id} completada exitosamente - ${paymentsCount} pagos realizados`);
    } else {
      console.log(`Suscripción ${subscription.id} cancelada prematuramente - ${paymentsCount}/${maxPayments} pagos realizados`);
    }
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