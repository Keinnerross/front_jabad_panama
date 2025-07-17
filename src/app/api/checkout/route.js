import Stripe from 'stripe';
import { generateOrderId } from '../../utils/siteConfigHelper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { line_items, customer, metadata } = await request.json();

    // Validar que el email esté presente
    if (!customer?.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generar ID único para el pedido
    const orderId = generateOrderId();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customer.email,
      phone_number_collection: { enabled: true },
      metadata: {
        ...metadata,
        // Agregar información del cliente a metadata
        customer_firstName: customer.firstName || '',
        customer_lastName: customer.lastName || '',
        customer_nationality: customer.nationality || '',
        customer_phone: customer.phone || '',
        orderId: orderId,
        // Agregar line_items como string para el webhook
        line_items: JSON.stringify(line_items),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    // Los emails se envían desde el webhook después del pago exitoso

    return Response.json({ id: session.id, orderId });
  } catch (err) {
    console.error('Checkout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}