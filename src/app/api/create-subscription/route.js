import Stripe from 'stripe';
import { getFullUrl } from '../../utils/urlHelper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Validar el Content-Type
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

    const { amount, frequency, customMonths, customer, metadata } = body;

    // Validar variables de entorno necesarias
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return Response.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not configured');
      return Response.json({ error: 'Base URL not configured' }, { status: 500 });
    }

    // Validar datos de entrada
    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!frequency) {
      return Response.json({ error: 'Frequency required' }, { status: 400 });
    }

    if (!customer?.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Calcular configuración de suscripción según frecuencia
    const subscriptionConfig = getSubscriptionConfig(frequency, customMonths);
    
    if (!subscriptionConfig) {
      return Response.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    // 1. Crear precio recurrente dinámico
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100),
      currency: 'usd',
      recurring: { interval: subscriptionConfig.interval },
      product_data: {
        name: `Donación ${subscriptionConfig.description} - ${metadata?.project || 'Chabad Boquete'}`,
      },
    });

    // 2. Preparar metadata expandida
    const expandedMetadata = {
      ...metadata,
      frequency,
      customMonths: customMonths || '',
      maxPayments: subscriptionConfig.maxPayments || '',
      subscriptionType: subscriptionConfig.type,
      originalAmount: amount.toString(),
    };

    // Debug: Ver las URLs que se van a enviar a Stripe
    const successUrl = `${getFullUrl('/success')}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = getFullUrl('/donation');
    console.log('🔧 Subscription Stripe URLs:', { successUrl, cancelUrl });

    // 3. Crear sesión de suscripción
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      customer_email: customer.email,
      metadata: expandedMetadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Los emails se envían desde el webhook después del pago exitoso

    return Response.json({ 
      id: session.id,
      subscriptionConfig: subscriptionConfig // Para debugging
    });
  } catch (err) {
    console.error('Error creating subscription:', err);
    
    // Manejar diferentes tipos de errores de Stripe
    if (err.type === 'StripeCardError') {
      return Response.json({ error: 'Your card was declined.' }, { status: 400 });
    } else if (err.type === 'StripeRateLimitError') {
      return Response.json({ error: 'Too many requests made to the API too quickly.' }, { status: 429 });
    } else if (err.type === 'StripeInvalidRequestError') {
      return Response.json({ error: 'Invalid parameters were supplied to Stripe API.' }, { status: 400 });
    } else if (err.type === 'StripeAPIError') {
      return Response.json({ error: 'An error occurred internally with Stripe API.' }, { status: 500 });
    } else if (err.type === 'StripeConnectionError') {
      return Response.json({ error: 'Network communication with Stripe failed.' }, { status: 500 });
    } else if (err.type === 'StripeAuthenticationError') {
      return Response.json({ error: 'Authentication with Stripe API failed.' }, { status: 500 });
    } else {
      return Response.json({ error: err.message || 'An unexpected error occurred creating subscription.' }, { status: 500 });
    }
  }
}

// Función auxiliar para configurar suscripciones según frecuencia
function getSubscriptionConfig(frequency, customMonths) {
  switch (frequency) {
    case 'monthly':
      return {
        interval: 'month',
        description: 'mensual recurrente',
        type: 'unlimited',
        maxPayments: null
      };
    
    case '12-months':
      return {
        interval: 'month',
        description: 'por 12 meses',
        type: 'limited',
        maxPayments: 12
      };
    
    case '24-months':
      return {
        interval: 'month',
        description: 'por 24 meses',
        type: 'limited',
        maxPayments: 24
      };
    
    case 'other':
      if (!customMonths || customMonths <= 0 || customMonths > 60) {
        return null;
      }
      return {
        interval: 'month',
        description: `por ${customMonths} meses`,
        type: 'limited',
        maxPayments: parseInt(customMonths)
      };
    
    default:
      return null;
  }
}