import { getPaymentProvider, getProviderName } from '../../services/payment/index.js';
import { generateOrderId } from '../../utils/siteConfigHelper.js';
import { getFullUrl } from '../../utils/urlHelper.js';
import { storeSession } from '../../services/payment/session-store.js';

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

    const { line_items, customer, metadata, structuredItems } = body;

    // Validar que el email esté presente
    if (!customer?.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validar que haya line_items
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return Response.json({ error: 'Line items are required' }, { status: 400 });
    }

    // Validar variables de entorno según el provider
    const providerName = getProviderName();

    if (providerName === 'payarc') {
      if (!process.env.PAYARC_API_KEY) {
        console.error('PAYARC_API_KEY is not configured');
        return Response.json({ error: 'Payment system not configured' }, { status: 500 });
      }
    } else {
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not configured');
        return Response.json({ error: 'Payment system not configured' }, { status: 500 });
      }
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
      paymentProvider: providerName,
    });

    // Generar ID único para el pedido
    const orderId = generateOrderId();

    // Build metadata with customer info
    const fullMetadata = {
      ...metadata,
      customer_firstName: customer.name?.split(' ')[0] || customer.firstName || '',
      customer_lastName: customer.name?.split(' ').slice(1).join(' ') || customer.lastName || '',
      customer_nationality: customer.metadata?.nationality || customer.nationality || '',
      customer_phone: customer.phone || '',
      orderId: orderId,
      items_count: line_items.length.toString(),
      items_total: line_items.reduce((sum, item) => sum + (item.quantity || 0), 0).toString()
    };

    // Build success/cancel URLs
    const successUrlBase = getFullUrl('/success');
    const cancelUrl = getFullUrl('/');

    // For Stripe, use the {CHECKOUT_SESSION_ID} template; for PayArc, append order_id later
    const successUrl = providerName === 'stripe'
      ? `${successUrlBase}?session_id={CHECKOUT_SESSION_ID}`
      : successUrlBase; // PayArc: we'll append order_id after we get the orderId

    console.log('🔧 Payment URLs:', { successUrl, cancelUrl, provider: providerName });

    const provider = getPaymentProvider();

    // Store structured items in session-store for webhook retrieval
    if (structuredItems && providerName !== 'payarc') {
      storeSession(orderId, {
        structuredItems,
        lineItems: line_items,
        customer,
        metadata: fullMetadata,
        amount_total: line_items.reduce((sum, item) => {
          return sum + (item.price_data?.unit_amount || 0) * (item.quantity || 1);
        }, 0),
        customer_email: customer.email,
        provider: providerName
      });
    }

    // For PayArc, append order_id to success URL so the success page can retrieve the session
    const finalSuccessUrl = providerName === 'payarc'
      ? `${successUrlBase}?order_id=${orderId}`
      : successUrl;

    const result = await provider.createCheckoutSession({
      lineItems: line_items,
      customer,
      metadata: fullMetadata,
      successUrl: finalSuccessUrl,
      cancelUrl,
      structuredItems,
    });

    // Los emails se envían desde el webhook/process-success después del pago exitoso

    return Response.json({
      id: result.sessionId,
      orderId: result.orderId || orderId,
      provider: result.provider,
      redirectUrl: result.redirectUrl || null,
    });
  } catch (err) {
    console.error('Checkout error:', err);

    // Manejar errores de Stripe específicos
    if (err.type?.startsWith?.('Stripe')) {
      const statusMap = {
        'StripeCardError': 400,
        'StripeRateLimitError': 429,
        'StripeInvalidRequestError': 400,
        'StripeAPIError': 500,
        'StripeConnectionError': 500,
        'StripeAuthenticationError': 500,
      };
      const status = statusMap[err.type] || 500;
      return Response.json({ error: err.message || 'Payment processing error.' }, { status });
    }

    return Response.json({ error: err.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
