import { storeSession, retrieveSession } from './session-store.js';

const PAYARC_BASE_URLS = {
  sandbox: 'https://testapi.payarc.net',
  prod: 'https://api.payarc.net',
};

export class PayarcProvider {
  constructor() {
    this.apiKey = process.env.PAYARC_API_KEY;
    this.env = (process.env.PAYARC_ENV || 'sandbox').toLowerCase();
    this.baseUrl = PAYARC_BASE_URLS[this.env] || PAYARC_BASE_URLS.sandbox;
    this.provider = 'payarc';
  }

  async createCheckoutSession({ lineItems, customer, metadata, successUrl, cancelUrl }) {
    // Calculate total amount in cents from line_items
    const totalCents = lineItems.reduce((sum, item) => {
      const unitAmount = item.price_data?.unit_amount || 0;
      const quantity = item.quantity || 1;
      return sum + unitAmount * quantity;
    }, 0);

    if (totalCents < 50) {
      throw new Error('PayArc minimum amount is $0.50 USD');
    }

    const response = await fetch(`${this.baseUrl}/v1/orders/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        amount: totalCents,
        currency: 'usd',
        success_url: successUrl,
        cancellation_url: cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('PayArc create order error:', response.status, errorBody);
      throw new Error(`PayArc API error: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    const order = result.data || result;
    const orderId = order.id || order.object_id;
    const paymentFormUrl = order.payment_form_url;

    if (!paymentFormUrl) {
      console.error('PayArc response missing payment_form_url:', JSON.stringify(result));
      throw new Error('PayArc did not return a payment form URL');
    }

    // Store metadata locally since PayArc doesn't support arbitrary metadata
    storeSession(orderId, {
      lineItems,
      customer,
      metadata,
      amount_total: totalCents,
      customer_email: customer.email,
      mode: 'payment',
      provider: 'payarc',
    });

    return {
      sessionId: orderId,
      redirectUrl: paymentFormUrl,
      orderId: metadata.orderId || orderId,
      provider: 'payarc',
    };
  }

  async retrieveSession(orderId) {
    const stored = retrieveSession(orderId);
    if (!stored) {
      console.error('PayArc session not found in store for orderId:', orderId);
      throw new Error(`PayArc session not found for order: ${orderId}`);
    }

    // Return a normalized session object compatible with the Stripe session shape
    // used by handleCheckoutSessionCompleted
    return {
      id: orderId,
      mode: 'payment',
      amount_total: stored.amount_total,
      customer_email: stored.customer_email,
      customer_details: { email: stored.customer_email },
      metadata: stored.metadata || {},
      line_items: null, // PayArc doesn't have line_items on the session — use stored data
      _stored: stored, // Keep full stored data accessible
    };
  }

  getClientConfig() {
    return {
      provider: 'payarc',
    };
  }
}
