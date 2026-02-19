import { getProviderName } from '../../../services/payment/index.js';
import { retrieveSession, removeSession } from '../../../services/payment/session-store.js';

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

export async function POST(request) {
  // Only active when provider is payarc
  if (getProviderName() !== 'payarc') {
    return Response.json({ error: 'PayArc webhooks not enabled' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('🔔 PayArc webhook received:', JSON.stringify(body).substring(0, 500));

    // PayArc sends order/payment events
    const eventType = body.type || body.event || 'order.completed';
    const orderData = body.data || body;
    const orderId = orderData.id || orderData.order_id;

    if (!orderId) {
      console.error('PayArc webhook: missing order ID');
      return Response.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // Retrieve stored session data
    const stored = retrieveSession(orderId);
    if (!stored) {
      console.warn('PayArc webhook: no stored session for orderId:', orderId);
      // Could be a duplicate or late webhook — respond OK to avoid retries
      return Response.json({ received: true, message: 'Session not found or already processed' });
    }

    // Build a normalized session object compatible with handleCheckoutSessionCompleted
    const session = {
      id: orderId,
      mode: 'payment',
      amount_total: stored.amount_total,
      customer_email: stored.customer_email,
      customer_details: { email: stored.customer_email },
      metadata: stored.metadata || {},
      line_items: null,
    };

    await handleCheckoutSessionCompleted(session, stored);

    // Clean up session store after successful processing
    removeSession(orderId);

    return Response.json({ received: true });
  } catch (error) {
    console.error('PayArc webhook error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session, stored) {
  console.log('Processing PayArc checkout session:', session.id);

  try {
    const notificationEmail = await getNotificationEmail();
    const metadata = session.metadata || {};

    if (!validateEmailConfig() || !notificationEmail) {
      console.warn('Email config not valid, skipping notifications');
      return;
    }

    const customerInfo = {
      email: session.customer_email || 'unknown@email.com',
      firstName: metadata.customer_firstName || '',
      lastName: metadata.customer_lastName || '',
      phone: metadata.customer_phone || '',
      nationality: metadata.customer_nationality || '',
    };

    const isDonation = metadata.purpose === 'Donation' || metadata.donationType === 'one-time';

    if (isDonation) {
      const donationData = {
        customer: customerInfo,
        amount: session.amount_total / 100,
        frequency: 'one-time',
        donationType: 'one-time',
        metadata: { ...metadata, sessionId: session.id },
      };

      try {
        const adminResult = await sendDonationNotification(notificationEmail, donationData);
        if (adminResult.success) logNotification('DONATION', notificationEmail, donationData);
      } catch (error) {
        handleNotificationError(error, 'payarc webhook donation notification');
      }

      try {
        const userResult = await sendUserDonationConfirmation(customerInfo.email, donationData);
        if (userResult.success) logNotification('USER_DONATION_CONFIRMATION', customerInfo.email, donationData);
      } catch (error) {
        handleNotificationError(error, 'payarc webhook user donation confirmation');
      }

      try {
        const strapiResult = await saveDonationToStrapi(session, metadata, 'one-time');
        if (strapiResult) console.log('✅ PayArc donation saved to Strapi:', strapiResult.data?.documentId);
      } catch (error) {
        console.error('❌ Failed to save PayArc donation to Strapi:', error);
      }
    } else {
      // Regular order
      // For PayArc, line_items come from stored data, not from the payment provider
      const storedLineItems = stored?.lineItems || [];
      const items = storedLineItems.map(item => ({
        name: item.price_data?.product_data?.name || 'Item',
        description: item.price_data?.product_data?.description || '',
        price: (item.price_data?.unit_amount || 0) / 100,
        quantity: item.quantity || 1,
        productType: extractProductTypeFromDescription(item.price_data?.product_data?.description),
      }));

      const enrichedItems = items.map(item => {
        const enrichedItem = { ...item };
        if (item.productType === 'mealReservation' || metadata.orderType === 'reservation') {
          enrichedItem.shabbatName = metadata.eventName || metadata.shabbatName;
          enrichedItem.shabbatDate = metadata.eventDate || metadata.shabbatDate || metadata.serviceDate;
          enrichedItem.eventType = 'Shabbat Meal';
        }
        if (item.productType === 'shabbatBox' || metadata.orderType === 'shabbatBox') {
          enrichedItem.shabbatName = metadata.parashahName;
          enrichedItem.shabbatDate = metadata.deliveryDate || metadata.shabbatDate;
          enrichedItem.eventType = 'Shabbat Box Delivery';
        }
        return enrichedItem;
      });

      const total = calculateTotal(enrichedItems, metadata.donation);

      const orderDataForEmail = {
        orderId: metadata.orderId || `ORDER-${session.id}`,
        customer: customerInfo,
        items: enrichedItems,
        total,
        metadata: { ...metadata, sessionId: session.id },
      };

      try {
        const adminResult = await sendOrderNotification(notificationEmail, orderDataForEmail);
        if (adminResult.success) logNotification('ORDER', notificationEmail, orderDataForEmail);
      } catch (error) {
        handleNotificationError(error, 'payarc webhook order notification');
      }

      try {
        const userResult = await sendUserOrderConfirmation(customerInfo.email, orderDataForEmail);
        if (userResult.success) logNotification('USER_ORDER_CONFIRMATION', customerInfo.email, orderDataForEmail);
      } catch (error) {
        handleNotificationError(error, 'payarc webhook user order confirmation');
      }

      // Save order to Strapi
      const orderType = detectOrderType(metadata, enrichedItems);
      try {
        let result;
        if (orderType === 'customEvent' || metadata.isCustomEvent === true) {
          result = await saveCustomEventDeliveryOrder(session, metadata, enrichedItems);
        } else if (orderType === 'shabbatBox') {
          result = await saveShabbatBoxOrder(session, metadata, enrichedItems);
        } else if (orderType === 'shabbat or holiday') {
          result = await saveShabbatOrder(session, metadata, enrichedItems);
        }
        if (result) console.log('✅ PayArc order saved to Strapi:', result.data?.documentId);
      } catch (error) {
        console.error('❌ Failed to save PayArc order to Strapi:', error);
      }
    }
  } catch (error) {
    console.error('Error in PayArc handleCheckoutSessionCompleted:', error);
    handleNotificationError(error, 'payarc checkout session completed handler');
    throw error;
  }
}

function extractProductTypeFromDescription(description) {
  if (!description) return null;
  if (description.includes('shabbatBox')) return 'shabbatBox';
  if (description.includes('mealReservation')) return 'mealReservation';
  if (description.includes('customEvent')) return 'customEvent';
  return null;
}
