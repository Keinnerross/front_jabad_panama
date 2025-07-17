import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return Response.json({ error: 'Session ID requerido' }, { status: 400 });
    }

    // Obtener información de la sesión
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Información básica que es segura devolver al frontend
    const sessionData = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      status: session.status,
      metadata: session.metadata,
      mode: session.mode,
      created: session.created
    };

    // Si es una suscripción, obtener información adicional
    if (session.mode === 'subscription' && session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        sessionData.subscription = {
          id: subscription.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          metadata: subscription.metadata
        };
      } catch (subError) {
        console.error('Error retrieving subscription:', subError);
        // No fallar si no se puede obtener la suscripción
      }
    }

    return Response.json(sessionData);
  } catch (err) {
    console.error('Error retrieving session:', err);
    return Response.json({ error: 'Error al obtener información de la sesión' }, { status: 500 });
  }
}