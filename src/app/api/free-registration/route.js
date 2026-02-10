// Fix para certificados self-signed en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError, generateOrderId, parseLineItems } from '../../utils/siteConfigHelper.js';
import { sendOrderNotification, sendUserOrderConfirmation } from '../../services/emailService.js';
import {
  saveShabbatOrder,
  saveShabbatBoxOrder,
  saveCustomEventDeliveryOrder,
  detectOrderType,
  formatOrderDescription
} from '../../services/strapi-orders.js';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return Response.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { customer, metadata, line_items } = body;

    if (!customer?.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return Response.json({ error: 'Line items are required' }, { status: 400 });
    }

    const orderId = generateOrderId();
    console.log('🆓 Processing free registration:', orderId);

    // Build a session-like object to reuse existing save functions
    const freeSession = {
      id: `free_${orderId}`,
      customer_email: customer.email,
      customer_details: { email: customer.email },
      amount_total: 0,
      line_items: { data: line_items }
    };

    // Merge orderId into metadata
    const fullMetadata = {
      ...metadata,
      orderId,
      customer_firstName: customer.name?.split(' ')[0] || customer.firstName || '',
      customer_lastName: customer.name?.split(' ').slice(1).join(' ') || customer.lastName || '',
      customer_nationality: customer.metadata?.nationality || customer.nationality || '',
      customer_phone: customer.phone || '',
      isFreeRegistration: true
    };

    // Parse line items for order processing
    const parsedItems = parseLineItems(line_items);

    // Detect order type and save to Strapi
    const orderType = detectOrderType(fullMetadata, parsedItems);
    console.log('🆓 Order type detected:', orderType);

    let strapiResult = null;

    if (orderType === 'customEvent' || fullMetadata.isCustomEvent === true) {
      strapiResult = await saveCustomEventDeliveryOrder(freeSession, fullMetadata, parsedItems);
    } else if (orderType === 'shabbatBox') {
      strapiResult = await saveShabbatBoxOrder(freeSession, fullMetadata, parsedItems);
    } else {
      strapiResult = await saveShabbatOrder(freeSession, fullMetadata, parsedItems);
    }

    if (strapiResult) {
      console.log('✅ Free registration saved to Strapi:', strapiResult.data?.documentId);
    }

    // Send emails
    if (validateEmailConfig()) {
      const notificationEmail = await getNotificationEmail();
      const customerInfo = {
        email: customer.email,
        firstName: fullMetadata.customer_firstName,
        lastName: fullMetadata.customer_lastName,
        phone: fullMetadata.customer_phone,
        nationality: fullMetadata.customer_nationality
      };

      const orderData = {
        orderId,
        customer: customerInfo,
        items: parsedItems,
        total: 0,
        metadata: {
          ...fullMetadata,
          sessionId: freeSession.id
        }
      };

      // Admin notification
      if (notificationEmail) {
        const adminResult = await sendOrderNotification(notificationEmail, orderData);
        if (adminResult.success) {
          logNotification('FREE_REGISTRATION', notificationEmail, orderData);
        } else {
          handleNotificationError(adminResult.error, 'admin free registration notification');
        }
      }

      // User confirmation
      const userResult = await sendUserOrderConfirmation(customer.email, orderData);
      if (userResult.success) {
        logNotification('USER_FREE_REGISTRATION_CONFIRMATION', customer.email, orderData);
      } else {
        handleNotificationError(userResult.error, 'user free registration confirmation');
      }
    }

    return Response.json({ success: true, orderId });

  } catch (error) {
    console.error('❌ Free registration error:', error);
    return Response.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
