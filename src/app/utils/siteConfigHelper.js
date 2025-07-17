// Helper para obtener siteConfig en API routes
export async function getSiteConfig() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const strapiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    
    if (!strapiUrl || !strapiToken) {
      console.error('Missing Strapi configuration');
      return null;
    }

    const response = await fetch(`${strapiUrl}/api/site-config?populate=*`, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data for notifications
    });

    if (!response.ok) {
      console.error('Failed to fetch siteConfig:', response.statusText);
      return null;
    }

    const data = await response.json();
    // Manejar diferentes estructuras de respuesta de Strapi
    return data.data || data.attributes || data;
  } catch (error) {
    console.error('Error fetching siteConfig:', error);
    return null;
  }
}

// Helper específico para obtener notification_email
export async function getNotificationEmail() {
  try {
    const siteConfig = await getSiteConfig();
    
    if (!siteConfig?.notification_email) {
      console.warn('No notification_email found in siteConfig');
      return process.env.EMAIL_USER; // Fallback al email configurado
    }

    return siteConfig.notification_email;
  } catch (error) {
    console.error('Error getting notification email:', error);
    return process.env.EMAIL_USER; // Fallback al email configurado
  }
}

// Helper para validar configuración de email
export function validateEmailConfig() {
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing email configuration:', missing);
    return false;
  }
  
  return true;
}

// Helper para formatear información del cliente
export function formatCustomerInfo(customer) {
  return {
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    nationality: customer?.nationality || '',
    fullName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'N/A'
  };
}

// Helper para generar ID único de orden
export function generateOrderId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper para parsear items del carrito desde line_items de Stripe
export function parseLineItems(lineItems) {
  if (!Array.isArray(lineItems)) {
    return [];
  }

  return lineItems.map(item => {
    // Para items con price_data (creados dinámicamente)
    if (item.price_data) {
      return {
        name: item.price_data.product_data?.name || 'Unknown Item',
        price: item.price_data.unit_amount / 100, // Convertir de centavos a dólares
        quantity: item.quantity || 1,
      };
    }
    
    // Para items con price ID (productos predefinidos)
    if (item.price) {
      return {
        name: 'Product', // Necesitarías hacer fetch del producto para obtener el nombre
        price: 0, // Necesitarías hacer fetch del price para obtener el monto
        quantity: item.quantity || 1,
      };
    }

    return {
      name: 'Unknown Item',
      price: 0,
      quantity: 1,
    };
  });
}

// Helper para calcular total de items
export function calculateTotal(items, donation = 0) {
  const itemsTotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const donationAmount = parseFloat(donation) || 0;
  
  return itemsTotal + donationAmount;
}

// Helper para logging de notificaciones
export function logNotification(type, recipient, data) {
  console.log(`📧 [${new Date().toISOString()}] ${type} notification sent to: ${recipient}`);
  console.log('Data:', JSON.stringify(data, null, 2));
}

// Helper para manejar errores de notificaciones
export function handleNotificationError(error, context) {
  console.error(`❌ Email notification error in ${context}:`, error);
  
  // En producción, podrías enviar esto a un servicio de logging como Sentry
  if (process.env.NODE_ENV === 'production') {
    // Ejemplo: Sentry.captureException(error, { extra: { context } });
  }
}