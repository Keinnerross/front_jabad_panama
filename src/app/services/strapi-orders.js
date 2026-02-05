/**
 * Servicio centralizado para gestionar todas las operaciones de guardado en Strapi
 * Este archivo contiene las funciones que funcionan correctamente en process-success
 * y serán reutilizadas tanto por process-success como por webhook
 */

import { handleNotificationError } from '../utils/siteConfigHelper.js';

// Fix para certificados self-signed en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Sponsorship options mapping
const SPONSORSHIP_OPTIONS = {
  '26': 'Sponsor My Meal for a Student/Backpacker',
  '54': 'Sponsor My Shabbat Meal',
  '72': 'Sponsor My Shabbat Dinner and Lunch Meals',
  '108': 'Sponsor a Student',
  '180': 'Sponsor 2 Students',
  '360': 'Co-Sponsor Shabbat Lunch',
  '540': 'Co-Sponsor Shabbat Dinner',
  '720': 'Co-Sponsor Shabbat @ Chabad',
  '1800': 'Sponsor Shabbat @ Chabad'
};

/**
 * Helper to get sponsorship label with full name
 */
function getSponsorshipLabel(value, customAmount) {
  if (!value || value === '') return null;
  if (value === 'other') {
    return `Custom Sponsorship: $${customAmount}`;
  }
  const label = SPONSORSHIP_OPTIONS[value];
  return label ? `${label}: $${value}` : `Sponsorship: $${value}`;
}

/**
 * Builds customer_detail_info from Korea fields
 */
function buildCustomerDetailInfo(metadata) {
  if (!metadata.koreaConnection && !metadata.judaismConnection && !metadata.sponsorship && !metadata.localPhone) {
    return null;
  }

  const lines = [];

  if (metadata.koreaConnection) {
    const connection = metadata.koreaConnection === 'other'
      ? metadata.koreaConnectionOther
      : metadata.koreaConnection;
    lines.push(`Country Connection: ${connection}`);
  }

  if (metadata.localPhone) {
    lines.push(`Local Phone: ${metadata.localPhone}`);
  }

  if (metadata.judaismConnection) {
    lines.push(`Judaism Connection: ${metadata.judaismConnection}`);
  }

  if (metadata.sponsorship && metadata.sponsorship !== '') {
    const sponsorshipLabel = getSponsorshipLabel(metadata.sponsorship, metadata.sponsorshipAmount);
    if (sponsorshipLabel) {
      lines.push(sponsorshipLabel);
    }
  }

  return lines.length > 0 ? lines.join('\n') : null;
}

/**
 * Guarda una donación en Strapi
 */
export async function saveDonationToStrapi(session, metadata, donationType) {
  try {
    console.log('📝 Attempting to save donation to Strapi...');
    console.log('Session data:', { 
      id: session.id, 
      amount: session.amount_total / 100,
      email: session.customer_email,
      subscription: session.subscription 
    });
    console.log('Metadata:', metadata);
    
    // Generar ID único para la donación
    const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determinar el tipo de donación y meses personalizados
    let finalDonationType = metadata.frequency || donationType || 'one-time';
    let finalCustomMonths = null;
    let finalIsDonationCustom = false;
    
    // Manejar casos especiales de 12 y 24 meses
    if (metadata.frequency === '12-months') {
      finalDonationType = 'Custom';
      finalCustomMonths = 12;
      finalIsDonationCustom = true;
    } else if (metadata.frequency === '24-months') {
      finalDonationType = 'Custom';
      finalCustomMonths = 24;
      finalIsDonationCustom = true;
    } else if (metadata.frequency === 'other' && metadata.customMonths) {
      finalDonationType = 'Custom';
      finalCustomMonths = parseInt(metadata.customMonths);
      finalIsDonationCustom = true;
    } else if (metadata.selectedPresetAmount === 'custom') {
      finalIsDonationCustom = true;
    }
    
    const donationData = {
      data: {
        donationId: donationId,
        subscriptionId: session.subscription || null,
        donorEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
        totalAmount: session.amount_total / 100,
        donationType: finalDonationType,
        customMonths: finalCustomMonths,
        isDonationCustom: finalIsDonationCustom,
        donationStatus: 'completed'
      }
    };
    
    console.log('📤 Sending to Strapi:', JSON.stringify(donationData, null, 2));

    // Usar URL interna para server-side requests
    const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_API_URL;
    const response = await fetch(`${strapiUrl}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(donationData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Strapi error response:', errorText);
      console.error('❌ Status:', response.status);
      throw new Error(`Strapi API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Donation saved to Strapi:', result.data?.donationId);
    return result;

  } catch (error) {
    console.error('❌ Error saving donation to Strapi:', error);
    handleNotificationError(error, 'donation save to Strapi');
    return null;
  }
}

/**
 * Guarda una orden de Shabbat/Holiday en Strapi
 */
export async function saveShabbatOrder(session, metadata, parsedItems) {
  try {
    console.log('📝 Processing Shabbat order from parsed items:', parsedItems);
    console.log('📝 Session line_items:', session.line_items?.data?.length, 'items');
    
    // Inicializar estructuras para las comidas
    const fridayDinner = {
      supporter_quantity: 0,
      supporter_price: 180,
      adult_quantity: 0,
      adult_price: 62,
      kids_3_10_quantity: 0,
      kids_3_10_price: 42,
      baby_1_2_quantity: 0,
      baby_1_2_price: 1,
      idf_soldier_quantity: 0,
      idf_soldier_price: 22,
      subtotal: 0,
      total_people: 0
    };
    
    const shabbatLunch = {
      supporter_quantity: 0,
      supporter_price: 180,
      adult_quantity: 0,
      adult_price: 56,
      kids_3_10_quantity: 0,
      kids_3_10_price: 42,
      baby_1_2_quantity: 0,
      baby_1_2_price: 1,
      idf_soldier_quantity: 0,
      idf_soldier_price: 22,
      subtotal: 0,
      total_people: 0
    };
    
    // Procesar cada item desde parsedItems
    parsedItems?.forEach(item => {
      console.log('Processing cart item:', item);
      
      let targetMeal = null;
      const fullName = (item.name || item.meal || '').toLowerCase();
      console.log('Processing item name:', fullName);
      
      // Determinar a qué comida pertenece
      if (fullName.includes('friday') || fullName.includes('dinner')) {
        targetMeal = fridayDinner;
      } else if (fullName.includes('lunch') || fullName.includes('shabbat lunch')) {
        targetMeal = shabbatLunch;
      }
      
      if (targetMeal) {
        const priceType = fullName.toLowerCase();
        const unitPrice = item.price || item.unitPrice || 0;
        
        // Detectar el tipo específico
        if (priceType.includes('supporter')) {
          targetMeal.supporter_quantity += item.quantity;
          targetMeal.supporter_price = unitPrice || targetMeal.supporter_price;
        } else if (priceType.includes('adult') && !priceType.includes('supporter')) {
          targetMeal.adult_quantity += item.quantity;
          targetMeal.adult_price = unitPrice || targetMeal.adult_price;
        } else if (priceType.includes('teens') || priceType.includes('kids')) {
          // Teens y Kids se guardan como kids_3_10
          targetMeal.kids_3_10_quantity += item.quantity;
          targetMeal.kids_3_10_price = unitPrice || targetMeal.kids_3_10_price;
        } else if (priceType.includes('children') || priceType.includes('baby')) {
          // Children y Baby se guardan como baby_1_2
          targetMeal.baby_1_2_quantity += item.quantity;
          targetMeal.baby_1_2_price = unitPrice || targetMeal.baby_1_2_price;
        } else if (priceType.includes('idf') || priceType.includes('soldier')) {
          targetMeal.idf_soldier_quantity += item.quantity;
          targetMeal.idf_soldier_price = unitPrice || targetMeal.idf_soldier_price;
        }
        
        // Calcular subtotal y total de personas
        const itemTotal = item.quantity * unitPrice;
        targetMeal.subtotal += itemTotal;
        targetMeal.total_people += item.quantity;
      }
    });
    
    // Procesar fecha del formato DD-DD/MM/YYYY o DD/MM/YYYY
    let startDateISO, endDateISO;
    
    if (metadata.eventDate) {
      // Usar la función extractDateRange que maneja correctamente el cruce de meses
      const { start, end } = extractDateRange(metadata.eventDate);
      
      if (start && end) {
        // Las fechas ya vienen en formato ISO correcto YYYY-MM-DD
        startDateISO = start;
        endDateISO = end;
      } else if (start) {
        // Si solo hay fecha de inicio (fecha simple), agregar un día para el fin
        startDateISO = start;
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + 1);
        endDateISO = endDate.toISOString().split('T')[0];
      }
    }
    
    // Fallback a fecha actual si no hay fecha válida
    if (!startDateISO) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      startDateISO = today.toISOString().split('T')[0];
      endDateISO = tomorrow.toISOString().split('T')[0];
    }
    
    // Construir notas con info de Korea
    let notes = metadata.notes || '';
    if (metadata.koreaConnection || metadata.judaismConnection || metadata.sponsorship) {
      if (notes) notes += '\n\n';
      notes += '--- Guest Information ---\n';
      if (metadata.koreaConnection) {
        const connection = metadata.koreaConnection === 'other'
          ? metadata.koreaConnectionOther
          : metadata.koreaConnection;
        notes += `Country Connection: ${connection}\n`;
      }
      if (metadata.localPhone) {
        notes += `Local Phone: ${metadata.localPhone}\n`;
      }
      if (metadata.judaismConnection) {
        notes += `Judaism Connection: ${metadata.judaismConnection}\n`;
      }
      if (metadata.sponsorship && metadata.sponsorship !== '') {
        const sponsorshipLabel = metadata.sponsorship === 'other'
          ? `Custom: $${metadata.sponsorshipAmount}`
          : `$${metadata.sponsorship}`;
        notes += `Sponsorship: ${sponsorshipLabel}`;
      }
    }

    const shabbatOrder = {
      data: {
        orderId: metadata.orderId || `SHB-${Date.now()}`,
        shabbat_name: metadata.shabbat_name || metadata.eventName || 'Shabbat',
        startDate: startDateISO,
        endDate: endDateISO,
        customerName: `${metadata.customer_firstName || ''} ${metadata.customer_lastName || ''}`.trim(),
        customerEmail: session.customer_email || session.customer_details?.email,
        customerPhone: metadata.customer_phone || session.customer_details?.phone || '',
        customerNationality: metadata.customer_nationality || '',
        totalAmount: session.amount_total / 100,
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        friday_dinner_details: fridayDinner,
        shabbat_lunch_details: shabbatLunch,
        notes: notes,
        customer_detail_info: buildCustomerDetailInfo(metadata)
      }
    };

    console.log('📤 Sending Shabbat order to Strapi:', JSON.stringify(shabbatOrder, null, 2));
    
    // Usar URL interna para server-side requests
    const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_API_URL;
    const response = await fetch(`${strapiUrl}/api/shabbat-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(shabbatOrder)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Shabbat order error response:', errorText);
      throw new Error(`Strapi shabbat-orders error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Shabbat order saved to Strapi:', result.data?.documentId);
    return result;
    
  } catch (error) {
    console.error('❌ Error saving shabbat order:', error);
    // No lanzar error para no bloquear el proceso
    return null;
  }
}

/**
 * Guarda una orden de Shabbat Box en Strapi
 */
export async function saveShabbatBoxOrder(session, metadata, parsedItems) {
  try {
    // Extraer información de delivery desde metadata y items
    const firstItem = parsedItems[0] || {};
    const deliveryType = metadata.deliveryType || firstItem.deliveryType || 'pickup';
    const deliveryAddress = metadata.deliveryAddress || firstItem.deliveryAddress || null;
    const shabbatName = metadata.shabbat_name || firstItem.shabbatName || 'Shabbat';
    
    // Procesar fechas para Shabbat Box
    let shabbatStart, shabbatEnd;
    
    // PRIMERO: Verificar si ya vienen las fechas formateadas en metadata
    // PERO si son iguales, significa que el frontend envió la misma fecha para ambos
    if (metadata.shabbatHolidayStart && metadata.shabbatHolidayEnd && 
        metadata.shabbatHolidayStart !== metadata.shabbatHolidayEnd) {
      // Usar directamente las fechas ya formateadas solo si son diferentes
      shabbatStart = metadata.shabbatHolidayStart;
      shabbatEnd = metadata.shabbatHolidayEnd;
      console.log('📦 Using pre-formatted dates from metadata:', {
        shabbatStart,
        shabbatEnd
      });
    } else {
      // FALLBACK: Procesar eventDate si no vienen las fechas formateadas
      const dateString = metadata.eventDate || firstItem.shabbatDate || metadata.shabbatDate;
      
      console.log('📦 Shabbat Box date processing from eventDate:', {
        dateString,
        metadata_eventDate: metadata.eventDate,
        firstItem_shabbatDate: firstItem.shabbatDate,
        metadata_shabbatDate: metadata.shabbatDate
      });
      
      if (dateString) {
        // Usar extractDateRange que maneja correctamente el cruce de meses
        const { start, end } = extractDateRange(dateString);
        
        if (start && end) {
          // Las fechas ya vienen en formato ISO correcto YYYY-MM-DD
          shabbatStart = start;
          shabbatEnd = end;
        } else if (start) {
          // Si solo hay fecha de inicio (fecha simple), agregar un día para el fin
          shabbatStart = start;
          const endDate = new Date(start);
          endDate.setDate(endDate.getDate() + 1);
          shabbatEnd = endDate.toISOString().split('T')[0];
        }
      }
      
      // Fallback a fecha actual si no hay fecha válida
      if (!shabbatStart) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        shabbatStart = startDate.toISOString().split('T')[0];
        shabbatEnd = endDate.toISOString().split('T')[0];
      }
    }
    
    console.log('📦 Shabbat Box processed dates:', {
      shabbatStart,
      shabbatEnd
    });
    
    const orderData = {
      data: {
        orderId: metadata.orderId || `SB-${Date.now()}`,
        shabbat_or_holiday: shabbatName,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        customerName: `${metadata.customer_firstName || ''} ${metadata.customer_lastName || ''}`.trim() || 'N/A',
        customerEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
        customerPhone: metadata.customer_phone || null,
        customerNationality: metadata.customer_nationality || null,
        orderDescription: formatOrderDescription(parsedItems, session.amount_total / 100, 0, null, metadata),
        orderStatus: 'paid',
        isDelivery: deliveryType === 'delivery',
        delivery_addres: deliveryAddress, // Nota: el campo en Strapi se llama 'delivery_addres' sin 's'
        typeOfDelivery: deliveryType,
        shabbat_holiday_start: shabbatStart,
        shabbat_holiday_end: shabbatEnd,
        orderType: 'shabbatBox',
        serviceDate: null, // No usado en Shabbat Box
        customer_detail_info: buildCustomerDetailInfo(metadata)
      }
    };

    console.log('📦 Saving Shabbat Box order to Strapi:', JSON.stringify(orderData, null, 2));
    
    // Usar URL interna para server-side requests
    const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_API_URL;
    const response = await fetch(`${strapiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Shabbat Box order error response:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Order data that failed:', JSON.stringify(orderData, null, 2));
      // No lanzar error para no bloquear el proceso
      return null;
    }

    const result = await response.json();
    console.log('✅ Shabbat Box order saved to Strapi:', result.data?.documentId);
    return result;

  } catch (error) {
    console.error('❌ Error saving Shabbat Box order:', error);
    handleNotificationError(error, 'Shabbat Box order save to Strapi');
    return null;
  }
}

/**
 * Guarda una orden de Custom Event con Delivery en Strapi
 */
export async function saveCustomEventDeliveryOrder(session, metadata, parsedItems) {
  try {
    // Extraer información de delivery desde metadata y items
    const firstItem = parsedItems[0] || {};
    const deliveryType = metadata.deliveryType || firstItem.deliveryType || 'pickup';
    const deliveryAddress = metadata.deliveryAddress || firstItem.deliveryAddress || null;
    const eventName = metadata.eventName || firstItem.shabbatName || 'Custom Event';
    const eventDate = metadata.eventDate || firstItem.shabbatDate || null;
    const customEventType = metadata.customEventType || firstItem.eventType || 'delivery';

    // Extraer delivery fee y zone name
    const deliveryFee = parseFloat(metadata.deliveryFee) || 0;
    let deliveryZoneName = null;
    if (metadata.deliveryZone) {
      try {
        const zoneData = JSON.parse(metadata.deliveryZone);
        deliveryZoneName = zoneData?.zone_name || null;
      } catch (e) {
        console.log('Could not parse deliveryZone:', metadata.deliveryZone);
      }
    }

    // Extraer nuevos campos de delivery
    const eventTime = metadata.eventTime || null;  // Hora solicitada: "HH:MM" o "ASAP"
    const reservationName = metadata.reservationName || null;  // Nombre para la reservación

    // Convertir fecha de DD/MM/YYYY o DD-DD/MM/YYYY a YYYY-MM-DD para serviceDate
    let serviceDateISO = null;
    if (eventDate) {
      // Usar extractDateRange que maneja correctamente el cruce de meses
      const { start } = extractDateRange(eventDate);

      if (start) {
        // La fecha ya viene en formato ISO (YYYY-MM-DD)
        serviceDateISO = start;
      }
    }

    const orderData = {
      data: {
        orderId: metadata.orderId || `CE-${Date.now()}`,
        shabbat_or_holiday: eventName, // Nombre del evento
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        customerName: `${metadata.customer_firstName || ''} ${metadata.customer_lastName || ''}`.trim() || 'N/A',
        customerEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
        customerPhone: metadata.customer_phone || null,
        customerNationality: metadata.customer_nationality || null,
        orderDescription: formatOrderDescription(parsedItems, session.amount_total / 100, deliveryFee, deliveryZoneName, metadata),
        orderStatus: 'paid',
        isDelivery: deliveryType === 'delivery',
        delivery_addres: deliveryAddress,
        typeOfDelivery: deliveryType,
        shabbat_holiday_start: null, // No usar para custom events
        shabbat_holiday_end: null,   // No usar para custom events
        orderType: eventName,  // Enviar el nombre real del evento (Catering Orders, Pizza & BBQ Night, etc.)
        serviceDate: serviceDateISO,  // Solo serviceDate para custom events
        customer_detail_info: buildCustomerDetailInfo(metadata)
      }
    };

    console.log('📅 Custom Event order data prepared:', {
      eventName,
      orderType: orderData.data.orderType,
      serviceDateOriginal: eventDate,
      serviceDateISO: serviceDateISO,
      isDelivery: orderData.data.isDelivery,
      deliveryType,
      deliveryAddress,
      deliveryZoneName,
      eventTime,
      reservationName
    });
    
    console.log('📅 Saving Custom Event Delivery order to Strapi:', JSON.stringify(orderData, null, 2));
    
    // Usar URL interna para server-side requests
    const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_API_URL;
    const response = await fetch(`${strapiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Custom Event Delivery order error response:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Order data that failed:', JSON.stringify(orderData, null, 2));
      // No lanzar error para no bloquear el proceso
      return null;
    }

    const result = await response.json();
    console.log('✅ Custom Event Delivery order saved to Strapi:', result.data?.documentId);
    return result;

  } catch (error) {
    console.error('❌ Error saving Custom Event Delivery order:', error);
    handleNotificationError(error, 'Custom Event Delivery order save to Strapi');
    return null;
  }
}

/**
 * Detecta el tipo de orden basándose en metadata y items
 */
export function detectOrderType(metadata, parsedItems) {
  console.log('🔍 detectOrderType function start:', {
    metadata_orderType: metadata.orderType,
    metadata_isCustomEvent: metadata.isCustomEvent,
    parsedItems_productTypes: parsedItems.map(item => item.productType),
    parsedItemsCount: parsedItems.length
  });
  
  // PRIMERO: Verificar si es Custom Event
  if (metadata.orderType === 'customEvent' || metadata.isCustomEvent === true) {
    console.log('🔍 detectOrderType: detected as customEvent');
    return 'customEvent';
  }
  
  // SEGUNDO: Verificar Shabbat Box
  if (metadata.orderType === 'shabbatBox') {
    console.log('🔍 detectOrderType: detected as shabbatBox via metadata');
    return 'shabbatBox';
  }
  
  // TERCERO: Verificar si es mealReservation pero con flag de Custom Event
  if (metadata.orderType === 'mealReservation' && metadata.isCustomEvent === true) {
    console.log('🔍 detectOrderType: mealReservation but has isCustomEvent flag - treating as customEvent');
    return 'customEvent';
  }
  
  // ÚLTIMO: Verificar Shabbat/Holiday solo si NO es Custom Event
  if (metadata.orderType === 'reservation' || metadata.orderType === 'mealReservation') {
    console.log('🔍 detectOrderType: detected as shabbat or holiday via metadata');
    return 'shabbat or holiday';
  }

  // Verificar por los nombres de productos - Custom Events primero
  const hasCustomEvent = parsedItems.some(item => 
    item.productType === 'customEvent' || item.productType === 'customEventDelivery'
  );

  console.log('🔍 detectOrderType: checking for customEvent in parsedItems:', {
    hasCustomEvent,
    itemsWithProductType: parsedItems.filter(item => item.productType).map(item => ({ name: item.name, productType: item.productType }))
  });

  if (hasCustomEvent) {
    console.log('🔍 detectOrderType: detected as customEvent via parsedItems');
    return 'customEvent';
  }

  // Verificar por shabbatBox
  const hasShabbatBox = parsedItems.some(item => 
    item.productType === 'shabbatBox' || 
    item.name.toLowerCase().includes('shabbat box')
  );

  if (hasShabbatBox) {
    console.log('🔍 detectOrderType: detected as shabbatBox via parsedItems');
    return 'shabbatBox';
  }

  // Default para otros tipos (incluyendo mealReservation sin isCustomEvent)
  console.log('🔍 detectOrderType: defaulting to shabbat or holiday - no specific type detected');
  return 'shabbat or holiday';
}

/**
 * Parsea las selecciones del nombre del item
 * Formato esperado: "Premium meals #1 - Main Dish: Option | Carbohidrato: Option"
 */
function parseSelectionsFromName(itemName) {
  // Buscar el patrón " - " que separa el nombre base de las selecciones
  const dashIndex = itemName.indexOf(' - ');
  if (dashIndex === -1) return { baseName: itemName, selections: [] };

  const baseName = itemName.substring(0, dashIndex);
  const selectionsString = itemName.substring(dashIndex + 3);

  // Las selecciones están separadas por " | "
  const selections = selectionsString.split(' | ')
    .map(s => s.trim())
    .filter(s => s.includes(':'));

  return { baseName, selections };
}

/**
 * Formatea la descripción de una orden con estructura clara y secciones separadas
 */
export function formatOrderDescription(parsedItems, totalAmount, deliveryFee = 0, deliveryZoneName = null, metadata = {}) {
  const lines = [];

  // === ORDER ITEMS ===
  lines.push('=== ORDER ITEMS ===');
  parsedItems.forEach(item => {
    if (item.productType !== 'fee' && item.productType !== 'donation') {
      // Parsear selecciones del nombre si existen
      const { baseName, selections } = parseSelectionsFromName(item.name);

      lines.push(baseName);
      lines.push(`  Quantity: ${item.quantity}`);
      lines.push(`  Unit Price: $${item.price.toFixed(2)}`);
      lines.push(`  Subtotal: $${item.total.toFixed(2)}`);

      // Agregar selecciones si existen
      if (selections.length > 0) {
        lines.push('  Selections:');
        selections.forEach(sel => {
          lines.push(`    - ${sel}`);
        });
      }

      lines.push('');  // línea en blanco entre items
    }
  });

  // === FEES === (solo si hay fees)
  const fees = [];
  if (deliveryFee > 0) {
    fees.push(`Delivery Fee (${deliveryZoneName || 'Delivery'}): $${deliveryFee.toFixed(2)}`);
  }
  const donation = parsedItems.find(item => item.productType === 'donation');
  if (donation) {
    fees.push(`Donation: $${donation.total.toFixed(2)}`);
  }
  const fee = parsedItems.find(item => item.productType === 'fee');
  if (fee) {
    fees.push(`Processing Fee: $${fee.total.toFixed(2)}`);
  }

  if (fees.length > 0) {
    lines.push('=== FEES ===');
    fees.forEach(f => lines.push(f));
    lines.push('');
  }

  // === TOTAL ===
  lines.push('=== TOTAL ===');
  lines.push(`$${totalAmount.toFixed(2)}`);

  // === DELIVERY INFO === (solo si hay delivery)
  if (metadata.deliveryType === 'delivery' || deliveryZoneName || metadata.eventTime || metadata.reservationName) {
    lines.push('');
    lines.push('=== DELIVERY INFO ===');
    if (deliveryZoneName) lines.push(`Hotel/Zone: ${deliveryZoneName}`);
    if (deliveryFee > 0) lines.push(`Delivery Fee: $${deliveryFee.toFixed(2)}`);
    if (metadata.deliveryAddress) lines.push(`Address: ${metadata.deliveryAddress}`);
    if (metadata.eventTime) lines.push(`Requested Time: ${metadata.eventTime}`);
    if (metadata.reservationName) lines.push(`Reservation Name: ${metadata.reservationName}`);
  }

  // === GUEST INFO === (solo si hay info de Korea)
  if (metadata.koreaConnection || metadata.judaismConnection || metadata.sponsorship) {
    lines.push('');
    lines.push('=== GUEST INFO ===');
    if (metadata.koreaConnection) {
      const connection = metadata.koreaConnection === 'other'
        ? metadata.koreaConnectionOther
        : metadata.koreaConnection;
      lines.push(`Country Connection: ${connection}`);
    }
    if (metadata.localPhone) lines.push(`Local Phone: ${metadata.localPhone}`);
    if (metadata.judaismConnection) lines.push(`Judaism Connection: ${metadata.judaismConnection}`);
    if (metadata.sponsorship && metadata.sponsorship !== '') {
      const sponsorshipLabel = getSponsorshipLabel(metadata.sponsorship, metadata.sponsorshipAmount);
      if (sponsorshipLabel) {
        lines.push(sponsorshipLabel);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Extrae el rango de fechas de un string con formato DD-DD/MM/YYYY o DD/MM/YYYY
 */
export function extractDateRange(dateString) {
  if (!dateString) return { start: null, end: null };
  
  console.log('📅 Processing date string:', dateString);
  
  // Patrón para "DD-DD/MM/YYYY"
  const rangeMatch = dateString.match(/(\d{1,2})-(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (rangeMatch) {
    const [_, startDayStr, endDayStr, monthStr, yearStr] = rangeMatch;
    const startDay = parseInt(startDayStr);
    const endDay = parseInt(endDayStr);
    let startMonth = parseInt(monthStr);
    let endMonth = parseInt(monthStr);
    let startYear = parseInt(yearStr);
    let endYear = parseInt(yearStr);
    
    // Si el día final es menor que el inicial, cruza meses
    // Ejemplo: 31-01/11/2025 significa 31 de octubre al 1 de noviembre
    if (endDay < startDay) {
      console.log('📅 Date crosses month boundary');
      // El día inicial pertenece al mes ANTERIOR
      startMonth = endMonth - 1;
      
      // Si el mes anterior es 0, es diciembre del año anterior
      if (startMonth < 1) {
        startMonth = 12;
        startYear = endYear - 1;
      }
    }
    
    // Crear fechas válidas
    const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    
    console.log('📅 Extracted date range:', { start: startDate, end: endDate });
    return { start: startDate, end: endDate };
  }
  
  // Patrón para fecha simple "DD/MM/YYYY"
  const simpleMatch = dateString.match(/(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (simpleMatch) {
    const [_, dayStr, monthStr, yearStr] = simpleMatch;
    const startDate = `${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}`;
    
    // Para fecha simple, end es el día siguiente
    const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    date.setDate(date.getDate() + 1);
    const endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    console.log('📅 Single date converted to range:', { start: startDate, end: endDate });
    return { start: startDate, end: endDate };
  }
  
  console.log('📅 Could not parse date string, returning null');
  return { start: null, end: null };
}

/**
 * Helpers adicionales para compatibilidad
 */

export function extractServiceDate(metadata, parsedItems) {
  // Buscar fecha en diferentes ubicaciones - prioridad a eventDate
  if (metadata.eventDate) {
    return metadata.eventDate; // Mantener formato original del texto
  }
  
  // Mantener compatibilidad con shabbatDate
  if (metadata.shabbatDate) {
    return metadata.shabbatDate; // Mantener formato original del texto
  }

  // Buscar en items
  const itemWithDate = parsedItems.find(item => item.shabbatDate);
  if (itemWithDate) {
    return itemWithDate.shabbatDate; // Mantener formato original del texto
  }

  // Default a próximo viernes en formato DD/MM/YYYY
  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay()));
  const day = nextFriday.getDate().toString().padStart(2, '0');
  const month = (nextFriday.getMonth() + 1).toString().padStart(2, '0');
  const year = nextFriday.getFullYear();
  return `${day}/${month}/${year}`;
}

export function extractEventNameFromDescription(description) {
  if (!description) return null;
  
  // Buscar patrones como "Parashat [nombre]" o nombres específicos
  const parashahMatch = description.match(/Parashat\s+(\w+)/i);
  if (parashahMatch) {
    return `Parashat ${parashahMatch[1]}`;
  }
  
  // Para Shabbat Box, extraer el nombre del evento
  if (description.includes('shabbatBox')) {
    return description.split(' - ')[0] || 'Shabbat';
  }
  
  return null;
}

export function extractParashahFromDescription(description) {
  if (!description) return null;
  
  const parashahMatch = description.match(/Parashat\s+(\w+)/i);
  return parashahMatch ? `Parashat ${parashahMatch[1]}` : null;
}