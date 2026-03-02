import { after } from 'next/server';
import { getProviderName } from '../../../services/payment/index.js';
import { claimSession } from '../../../services/payment/session-store.js';
import { appendFileSync } from 'fs';

// Debug log to file (PM2 doesn't capture console.log)
const WLOG = '/tmp/payarc-webhook.log';
function wlog(msg, data) {
  try { appendFileSync(WLOG, `[${new Date().toISOString()}] ${msg} ${JSON.stringify(data)}\n`); } catch (_) {}
}

// Fix para certificados self-signed en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendDonationNotification, sendOrderNotification, sendUserOrderConfirmation, sendUserDonationConfirmation } from '../../../services/emailService.js';
import { calculateTotal } from '../../../utils/siteConfigHelper.js';
import {
  saveDonationToStrapi,
  saveShabbatOrder,
  saveShabbatBoxOrder,
  saveCustomEventDeliveryOrder,
  saveOrderWithStructuredItems,
  detectOrderType
} from '../../../services/strapi-orders.js';

export async function POST(request) {
  const provider = getProviderName();
  wlog('HIT', { provider, envVar: process.env.PAYMENT_PROVIDER });

  if (provider !== 'payarc') {
    wlog('REJECTED', { provider });
    return Response.json({ error: 'PayArc webhooks not enabled' }, { status: 400 });
  }

  try {
    const body = await request.json();
    wlog('BODY', { keys: Object.keys(body), event_type: body.event_type, hasPayload: !!body.payload });

    const eventType = body.event_type || body.type || body.event || 'order.completed';

    // PayArc sends request_payload and api_response as JSON STRINGS, not objects.
    // Parse them so we can access nested fields.
    const payload = body.payload || body;
    let apiResponse = payload.api_response;
    let requestPayload = payload.request_payload;
    if (typeof apiResponse === 'string') {
      try { apiResponse = JSON.parse(apiResponse); } catch (_) {}
    }
    if (typeof requestPayload === 'string') {
      try { requestPayload = JSON.parse(requestPayload); } catch (_) {}
    }

    let orderId = null;
    // Priority 1: orderId from "Order Charged" event (matches our session-store key)
    if (apiResponse?.original?.orderId) {
      orderId = apiResponse.original.orderId;
    }
    // Priority 2: order_id from request_payload (numeric PayArc internal ID)
    else if (requestPayload?.order_id) {
      orderId = requestPayload.order_id;
    }
    // Priority 3: charge ID from "Charges Created" event
    else if (apiResponse?.original?.data?.id) {
      orderId = apiResponse.original.data.id;
    }
    // Priority 4: other formats
    else if (body.data?.id) {
      orderId = body.data.id;
    } else if (body.order_id) {
      orderId = body.order_id;
    }

    // Normalize to string to match session-store key type
    if (orderId != null) orderId = String(orderId);

    wlog('PARSED', { eventType, orderId, payloadKeys: Object.keys(payload) });
    console.log('🔔 PayArc webhook extracted orderId:', orderId, 'from event:', eventType);

    if (!orderId) {
      console.error('PayArc webhook: missing order ID');
      return Response.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // Atomically claim the session — claimSession retrieves AND deletes in one step + removes the sibling key.
    let stored = claimSession(orderId);
    if (!stored) stored = claimSession(Number(orderId));
    wlog('CLAIM', { orderId, found: !!stored });
    if (!stored) {
      return Response.json({ received: true, message: 'Already processed or not found' });
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

    // Respond to PayArc immediately to avoid timeout (PayArc has ~10-15s timeout, 1 retry).
    // Heavy processing (emails + Strapi saves) runs via Next.js after() API.
    after(async () => {
      try {
        await handleCheckoutSessionCompleted(session, stored);
        // No removeSession needed — claimSession already removed it
        console.log('✅ PayArc webhook processing completed for orderId:', orderId);
      } catch (err) {
        console.error('❌ PayArc webhook background processing failed:', err);
      }
    });

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
        structuredItems: stored?.structuredItems || null,
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

      // Save order to Strapi - try structured path first
      if (stored?.structuredItems) {
        console.log('✅ PayArc: Using structured items from session-store');
        try {
          const result = await saveOrderWithStructuredItems(session, metadata, stored.structuredItems);
          if (result) console.log('✅ PayArc structured order saved to Strapi:', result.data?.documentId);
        } catch (err) {
          console.error('❌ PayArc saveOrderWithStructuredItems failed, falling back:', err);
          // Fallback to legacy
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
            if (result) console.log('✅ PayArc legacy order saved to Strapi:', result.data?.documentId);
          } catch (error) {
            console.error('❌ Failed to save PayArc order to Strapi:', error);
          }
        }
      } else {
        // Legacy flow
        console.warn('⚠️ PayArc: No structured items, using legacy flow');
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
