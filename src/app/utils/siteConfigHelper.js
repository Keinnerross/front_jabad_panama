// Helper para obtener variables de entorno según el contexto (servidor/cliente)
function getEnvVars() {
  // En server components, usar conexión interna. En client, usar externa
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer 
    ? (process.env.STRAPI_INTERNAL_URL || 'http://localhost:1437')  // Configurable para server components
    : (process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://212.85.22.57/chabbat'); // Externa para client
  
  return {
    STRAPI_BASE_URL: baseUrl,
    STRAPI_TOKEN: process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
  };
}

// Helper para obtener siteConfig en API routes
export async function getSiteConfig() {
  try {
    const { STRAPI_BASE_URL, STRAPI_TOKEN } = getEnvVars();
    const isServer = typeof window === 'undefined';
    
    console.log('🔍 getSiteConfig() - Environment info:', {
      isServer,
      STRAPI_BASE_URL,
      STRAPI_TOKEN: STRAPI_TOKEN ? 'EXISTS' : 'MISSING'
    });
    
    if (!STRAPI_BASE_URL || !STRAPI_TOKEN) {
      console.error('❌ Missing Strapi configuration:', { STRAPI_BASE_URL, STRAPI_TOKEN: !!STRAPI_TOKEN });
      return null;
    }

    const url = `${STRAPI_BASE_URL}/api/site-config?populate=*`;
    console.log('🚀 Fetching siteConfig from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data for notifications
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch siteConfig:', {
        status: response.status,
        statusText: response.statusText,
        url
      });
      return null;
    }

    const data = await response.json();
    const siteConfig = data.data || data.attributes || data;
    
    console.log('✅ siteConfig fetched successfully:', {
      notification_email: siteConfig?.notification_email || 'NOT_FOUND',
      site_title: siteConfig?.site_title || 'NOT_FOUND'
    });
    
    return siteConfig;
  } catch (error) {
    console.error('❌ Error fetching siteConfig:', error);
    return null;
  }
}

// Helper específico para obtener notification_email
export async function getNotificationEmail() {
  try {
    console.log('📧 Getting notification email...');
    const siteConfig = await getSiteConfig();
    
    if (!siteConfig) {
      console.warn('⚠️ siteConfig is null, using fallback email');
      console.log('📧 Fallback email:', process.env.EMAIL_USER);
      return process.env.EMAIL_USER; // Fallback al email configurado
    }
    
    if (!siteConfig.notification_email) {
      console.warn('⚠️ notification_email not found in siteConfig:', siteConfig);
      console.log('📧 Available fields:', Object.keys(siteConfig));
      console.log('📧 Fallback email:', process.env.EMAIL_USER);
      return process.env.EMAIL_USER; // Fallback al email configurado
    }

    console.log('✅ notification_email found:', siteConfig.notification_email);
    return siteConfig.notification_email;
  } catch (error) {
    console.error('❌ Error getting notification email:', error);
    console.log('📧 Fallback email:', process.env.EMAIL_USER);
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

// Helper para generar ID único de orden (formato compacto con fecha)
export function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
  const day = now.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 caracteres random
  return `ORD-${year}${month}${day}-${random}`;
}

// Helper para parsear items del carrito desde line_items de Stripe
export function parseLineItems(lineItems) {
  if (!Array.isArray(lineItems)) {
    return [];
  }

  return lineItems.map(item => {
    // Log para debug
    console.log('🔍 Parsing line item:', {
      has_price_data: !!item.price_data,
      has_price: !!item.price,
      description: item.description,
      amount_total: item.amount_total,
      quantity: item.quantity
    });
    
    // Para items con price_data (creados dinámicamente) - este es el caso normal
    if (item.price_data) {
      return {
        name: item.price_data.product_data?.name || 'Unknown Item',
        description: item.price_data.product_data?.description || '',
        price: item.price_data.unit_amount / 100, // Convertir de centavos a dólares
        quantity: item.quantity || 1,
        total: (item.price_data.unit_amount / 100) * (item.quantity || 1),
        // Detectar el tipo de producto basado en el nombre o descripción
        productType: detectProductType(item.price_data.product_data?.name, item.price_data.product_data?.description),
        // Mantener datos originales para procesamiento posterior
        unitPrice: item.price_data.unit_amount / 100,
        meal: item.price_data.product_data?.name
      };
    }
    
    // Para items con price object expandido
    if (item.price?.product) {
      const product = item.price.product;
      const unitAmount = item.price.unit_amount || item.amount_total / item.quantity;
      
      return {
        name: product.name || item.description || 'Product',
        description: product.description || item.description || '',
        price: unitAmount / 100,
        quantity: item.quantity || 1,
        total: (item.amount_total || (unitAmount * item.quantity)) / 100,
        productType: detectProductType(product.name || item.description, product.description),
        unitPrice: unitAmount / 100,
        meal: product.name || item.description
      };
    }
    
    // Para items con price ID pero sin producto expandido
    if (item.price) {
      // Usar description como fallback para el nombre
      const unitAmount = item.price.unit_amount || item.amount_total / item.quantity;
      return {
        name: item.description || 'Product',
        description: item.description || '',
        price: unitAmount / 100,
        quantity: item.quantity || 1,
        total: (item.amount_total || (unitAmount * item.quantity)) / 100,
        productType: detectProductType(item.description, ''),
        unitPrice: unitAmount / 100,
        meal: item.description || 'Product'
      };
    }

    // Fallback final
    return {
      name: item.description || 'Unknown Item',
      description: item.description || '',
      price: (item.amount_total / item.quantity) / 100,
      quantity: item.quantity || 1,
      total: (item.amount_total || 0) / 100,
      productType: 'unknown',
      unitPrice: (item.amount_total / item.quantity) / 100,
      meal: item.description || 'Unknown Item'
    };
  });
}

// Helper para detectar el tipo de producto
function detectProductType(name, description) {
  const nameStr = (name || '').toLowerCase();
  const descStr = (description || '').toLowerCase();
  
  // Buscar shabbatBox tanto en nombre como en descripción
  if (nameStr.includes('shabbat box') || nameStr.includes('shabatbox') || 
      descStr.includes('shabbatbox') || descStr.includes('shabbat box')) {
    return 'shabbatBox';
  }
  
  if (nameStr.includes('donation') || nameStr.includes('donación')) {
    return 'donation';
  }
  
  if (nameStr.includes('transaction fee') || nameStr.includes('processing fee')) {
    return 'fee';
  }
  
  if (descStr.includes('shabbat') || descStr.includes('meal') || descStr.includes('reservation')) {
    return 'mealReservation';
  }
  
  return 'product';
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