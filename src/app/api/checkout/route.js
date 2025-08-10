import Stripe from 'stripe';
import { generateOrderId } from '../../utils/siteConfigHelper.js';
import { getFullUrl } from '../../utils/urlHelper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test method para diagnosticar
export async function GET() {
  return Response.json({ message: 'Checkout API is working', method: 'GET' });
}

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

    const { line_items, customer, metadata } = body;

    // Validar que el email esté presente
    if (!customer?.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validar que haya line_items
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return Response.json({ error: 'Line items are required' }, { status: 400 });
    }

    // Validar variables de entorno necesarias
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return Response.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not configured');
      return Response.json({ error: 'Base URL not configured' }, { status: 500 });
    }

    // Debug: Verificar variables de entorno
    console.log('🔧 Checkout API Environment Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY
    });

    // Generar ID único para el pedido
    const orderId = generateOrderId();

    // Debug: Ver las URLs que se van a enviar a Stripe
    const successUrl = `${getFullUrl('/success')}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = getFullUrl('/');
    console.log('🔧 Stripe URLs:', { successUrl, cancelUrl });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customer.email,
      phone_number_collection: { enabled: true },
      metadata: {
        ...metadata,
        // Agregar información del cliente a metadata
        customer_firstName: customer.name?.split(' ')[0] || customer.firstName || '',
        customer_lastName: customer.name?.split(' ').slice(1).join(' ') || customer.lastName || '',
        customer_nationality: customer.metadata?.nationality || customer.nationality || '',
        customer_phone: customer.phone || '',
        orderId: orderId,
        // Agregar line_items como string para el webhook
        line_items: JSON.stringify(line_items),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Los emails se envían desde el webhook después del pago exitoso

    return Response.json({ id: session.id, orderId });
  } catch (err) {
    console.error('Checkout error:', err);
    
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
      return Response.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
    }
  }
}