import Stripe from 'stripe';

export class StripeProvider {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.provider = 'stripe';
  }

  async createCheckoutSession({ lineItems, customer, metadata, successUrl, cancelUrl }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      phone_number_collection: { enabled: true },
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      sessionId: session.id,
      redirectUrl: null, // Stripe uses client-side redirect via stripe.js
      orderId: metadata.orderId || null,
      provider: 'stripe',
    };
  }

  async retrieveSession(sessionId) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });
    return session;
  }

  getClientConfig() {
    return {
      provider: 'stripe',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    };
  }
}
