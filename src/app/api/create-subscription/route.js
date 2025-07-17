import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, frequency, customMonths, customer, metadata } = await request.json();

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

    // 3. Crear sesión de suscripción
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      customer_email: customer.email,
      metadata: expandedMetadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/donation`,
    });

    // Los emails se envían desde el webhook después del pago exitoso

    return Response.json({ 
      id: session.id,
      subscriptionConfig: subscriptionConfig // Para debugging
    });
  } catch (err) {
    console.error('Error creating subscription:', err);
    return Response.json({ error: err.message }, { status: 500 });
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