#!/usr/bin/env node

/**
 * Script de recuperación de órdenes perdidas
 *
 * Las órdenes de los últimos 9 días no se guardaron en Strapi porque el webhook
 * tenía los saves anidados dentro del bloque validateEmailConfig().
 *
 * Este script:
 * 1. Lista todos los checkout.session.completed de los últimos 9 días desde Stripe
 * 2. Para cada sesión, extrae los datos y determina el tipo de orden
 * 3. Guarda en Strapi usando las mismas funciones del servicio strapi-orders.js
 * 4. NO envía emails
 *
 * Uso: node --env-file=.env scripts/recover-orders.js [--dry-run]
 */

import Stripe from 'stripe';

// --- Inline helpers (no podemos importar ESM de Next.js directamente) ---

function detectProductType(name, description) {
  const nameStr = (name || '').toLowerCase();
  const descStr = (description || '').toLowerCase();

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

function parseLineItems(lineItems) {
  if (!Array.isArray(lineItems)) return [];
  return lineItems.map(item => {
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
    if (item.price) {
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

function detectOrderType(metadata, parsedItems) {
  if (metadata.orderType === 'customEvent' || metadata.isCustomEvent === 'true') {
    return 'customEvent';
  }
  if (metadata.orderType === 'shabbatBox') {
    return 'shabbatBox';
  }
  if (metadata.orderType === 'mealReservation' && metadata.isCustomEvent === 'true') {
    return 'customEvent';
  }
  if (metadata.orderType === 'reservation' || metadata.orderType === 'mealReservation') {
    return 'shabbat or holiday';
  }
  const hasCustomEvent = parsedItems.some(item =>
    item.productType === 'customEvent' || item.productType === 'customEventDelivery'
  );
  if (hasCustomEvent) return 'customEvent';
  const hasShabbatBox = parsedItems.some(item =>
    item.productType === 'shabbatBox' ||
    item.name.toLowerCase().includes('shabbat box')
  );
  if (hasShabbatBox) return 'shabbatBox';
  return 'shabbat or holiday';
}

function extractDateRange(dateString) {
  if (!dateString) return { start: null, end: null };
  const rangeMatch = dateString.match(/(\d{1,2})-(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (rangeMatch) {
    const [_, startDayStr, endDayStr, monthStr, yearStr] = rangeMatch;
    const startDay = parseInt(startDayStr);
    const endDay = parseInt(endDayStr);
    let startMonth = parseInt(monthStr);
    let endMonth = parseInt(monthStr);
    let startYear = parseInt(yearStr);
    let endYear = parseInt(yearStr);
    if (endDay < startDay) {
      startMonth = endMonth - 1;
      if (startMonth < 1) { startMonth = 12; startYear = endYear - 1; }
    }
    return {
      start: `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
      end: `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`
    };
  }
  const simpleMatch = dateString.match(/(\d{1,2})\/(\d{2})\/(\d{4})/);
  if (simpleMatch) {
    const [_, dayStr, monthStr, yearStr] = simpleMatch;
    const startDate = `${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}`;
    const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    date.setDate(date.getDate() + 1);
    const endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { start: startDate, end: endDate };
  }
  return { start: null, end: null };
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

function getSponsorshipLabel(value, customAmount) {
  if (!value || value === '') return null;
  if (value === 'other') return `Custom Sponsorship: $${customAmount}`;
  const label = SPONSORSHIP_OPTIONS[value];
  return label ? `${label}: $${value}` : `Sponsorship: $${value}`;
}

function buildCustomerDetailInfo(metadata) {
  if (!metadata.koreaConnection && !metadata.judaismConnection && !metadata.sponsorship && !metadata.localPhone) {
    return null;
  }
  const lines = [];
  if (metadata.koreaConnection) {
    const connection = metadata.koreaConnection === 'other' ? metadata.koreaConnectionOther : metadata.koreaConnection;
    lines.push(`Country Connection: ${connection}`);
  }
  if (metadata.localPhone) lines.push(`Local Phone: ${metadata.localPhone}`);
  if (metadata.judaismConnection) lines.push(`Judaism Connection: ${metadata.judaismConnection}`);
  if (metadata.sponsorship && metadata.sponsorship !== '') {
    const sponsorshipLabel = getSponsorshipLabel(metadata.sponsorship, metadata.sponsorshipAmount);
    if (sponsorshipLabel) lines.push(sponsorshipLabel);
  }
  return lines.length > 0 ? lines.join('\n') : null;
}

function parseSelectionsFromName(itemName) {
  const dashIndex = itemName.indexOf(' - ');
  if (dashIndex === -1) return { baseName: itemName, selections: [] };
  const baseName = itemName.substring(0, dashIndex);
  const selectionsString = itemName.substring(dashIndex + 3);
  const selections = selectionsString.split(' | ').map(s => s.trim()).filter(s => s.includes(':'));
  return { baseName, selections };
}

function formatOrderDescription(parsedItems, totalAmount, deliveryFee = 0, deliveryZoneName = null, metadata = {}) {
  const lines = [];
  lines.push('=== ORDER ITEMS ===');
  parsedItems.forEach(item => {
    if (item.productType !== 'fee' && item.productType !== 'donation') {
      const { baseName, selections } = parseSelectionsFromName(item.name);
      lines.push(baseName);
      lines.push(`  Quantity: ${item.quantity}`);
      lines.push(`  Unit Price: $${item.price.toFixed(2)}`);
      lines.push(`  Subtotal: $${item.total.toFixed(2)}`);
      if (selections.length > 0) {
        lines.push('  Selections:');
        selections.forEach(sel => lines.push(`    - ${sel}`));
      }
      lines.push('');
    }
  });
  const fees = [];
  if (deliveryFee > 0) fees.push(`Delivery Fee (${deliveryZoneName || 'Delivery'}): $${deliveryFee.toFixed(2)}`);
  const donation = parsedItems.find(item => item.productType === 'donation');
  if (donation) fees.push(`Donation: $${donation.total.toFixed(2)}`);
  const fee = parsedItems.find(item => item.productType === 'fee');
  if (fee) fees.push(`Processing Fee: $${fee.total.toFixed(2)}`);
  if (fees.length > 0) {
    lines.push('=== FEES ===');
    fees.forEach(f => lines.push(f));
    lines.push('');
  }
  lines.push('=== TOTAL ===');
  lines.push(`$${totalAmount.toFixed(2)}`);
  if (metadata.deliveryType === 'delivery' || deliveryZoneName || metadata.eventTime || metadata.reservationName) {
    lines.push('');
    lines.push('=== DELIVERY INFO ===');
    if (deliveryZoneName) lines.push(`Hotel/Zone: ${deliveryZoneName}`);
    if (deliveryFee > 0) lines.push(`Delivery Fee: $${deliveryFee.toFixed(2)}`);
    if (metadata.deliveryAddress) lines.push(`Address: ${metadata.deliveryAddress}`);
    if (metadata.eventTime) lines.push(`Requested Time: ${metadata.eventTime}`);
    if (metadata.reservationName) lines.push(`Reservation Name: ${metadata.reservationName}`);
  }
  if (metadata.koreaConnection || metadata.judaismConnection || metadata.sponsorship) {
    lines.push('');
    lines.push('=== GUEST INFO ===');
    if (metadata.koreaConnection) {
      const connection = metadata.koreaConnection === 'other' ? metadata.koreaConnectionOther : metadata.koreaConnection;
      lines.push(`Country Connection: ${connection}`);
    }
    if (metadata.localPhone) lines.push(`Local Phone: ${metadata.localPhone}`);
    if (metadata.judaismConnection) lines.push(`Judaism Connection: ${metadata.judaismConnection}`);
    if (metadata.sponsorship && metadata.sponsorship !== '') {
      const sponsorshipLabel = getSponsorshipLabel(metadata.sponsorship, metadata.sponsorshipAmount);
      if (sponsorshipLabel) lines.push(sponsorshipLabel);
    }
  }
  return lines.join('\n');
}

// --- Strapi save functions ---

const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_API_URL;
const strapiToken = process.env.STRAPI_API_TOKEN;

async function strapiPost(endpoint, data) {
  const response = await fetch(`${strapiUrl}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${strapiToken}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Strapi ${endpoint} error ${response.status}: ${errorText}`);
  }
  return response.json();
}

async function saveDonation(session, metadata, donationType) {
  const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  let finalDonationType = metadata.frequency || donationType || 'one-time';
  let finalCustomMonths = null;
  let finalIsDonationCustom = false;

  if (metadata.frequency === '12-months') {
    finalDonationType = 'Custom'; finalCustomMonths = 12; finalIsDonationCustom = true;
  } else if (metadata.frequency === '24-months') {
    finalDonationType = 'Custom'; finalCustomMonths = 24; finalIsDonationCustom = true;
  } else if (metadata.frequency === 'other' && metadata.customMonths) {
    finalDonationType = 'Custom'; finalCustomMonths = parseInt(metadata.customMonths); finalIsDonationCustom = true;
  } else if (metadata.selectedPresetAmount === 'custom') {
    finalIsDonationCustom = true;
  }

  return strapiPost('donations', {
    data: {
      donationId,
      subscriptionId: session.subscription || null,
      donorEmail: session.customer_email || session.customer_details?.email || 'unknown@email.com',
      totalAmount: session.amount_total / 100,
      donationType: finalDonationType,
      customMonths: finalCustomMonths,
      isDonationCustom: finalIsDonationCustom,
      donationStatus: 'completed'
    }
  });
}

async function saveShabbatOrder(session, metadata, parsedItems) {
  const fridayDinner = { supporter_quantity: 0, supporter_price: 180, adult_quantity: 0, adult_price: 62, kids_3_10_quantity: 0, kids_3_10_price: 42, baby_1_2_quantity: 0, baby_1_2_price: 1, idf_soldier_quantity: 0, idf_soldier_price: 22, subtotal: 0, total_people: 0 };
  const shabbatLunch = { supporter_quantity: 0, supporter_price: 180, adult_quantity: 0, adult_price: 56, kids_3_10_quantity: 0, kids_3_10_price: 42, baby_1_2_quantity: 0, baby_1_2_price: 1, idf_soldier_quantity: 0, idf_soldier_price: 22, subtotal: 0, total_people: 0 };

  parsedItems?.forEach(item => {
    let targetMeal = null;
    const fullName = (item.name || item.meal || '').toLowerCase();
    if (fullName.includes('friday') || fullName.includes('dinner')) targetMeal = fridayDinner;
    else if (fullName.includes('lunch') || fullName.includes('shabbat lunch')) targetMeal = shabbatLunch;

    if (targetMeal) {
      const priceType = fullName.toLowerCase();
      const unitPrice = item.price || item.unitPrice || 0;
      if (priceType.includes('supporter')) { targetMeal.supporter_quantity += item.quantity; targetMeal.supporter_price = unitPrice || targetMeal.supporter_price; }
      else if (priceType.includes('adult') && !priceType.includes('supporter')) { targetMeal.adult_quantity += item.quantity; targetMeal.adult_price = unitPrice || targetMeal.adult_price; }
      else if (priceType.includes('teens') || priceType.includes('kids')) { targetMeal.kids_3_10_quantity += item.quantity; targetMeal.kids_3_10_price = unitPrice || targetMeal.kids_3_10_price; }
      else if (priceType.includes('children') || priceType.includes('baby')) { targetMeal.baby_1_2_quantity += item.quantity; targetMeal.baby_1_2_price = unitPrice || targetMeal.baby_1_2_price; }
      else if (priceType.includes('idf') || priceType.includes('soldier')) { targetMeal.idf_soldier_quantity += item.quantity; targetMeal.idf_soldier_price = unitPrice || targetMeal.idf_soldier_price; }
      targetMeal.subtotal += item.quantity * unitPrice;
      targetMeal.total_people += item.quantity;
    }
  });

  let startDateISO, endDateISO;
  if (metadata.eventDate) {
    const { start, end } = extractDateRange(metadata.eventDate);
    if (start && end) { startDateISO = start; endDateISO = end; }
    else if (start) { startDateISO = start; const d = new Date(start); d.setDate(d.getDate() + 1); endDateISO = d.toISOString().split('T')[0]; }
  }
  if (!startDateISO) {
    const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    startDateISO = today.toISOString().split('T')[0]; endDateISO = tomorrow.toISOString().split('T')[0];
  }

  let notes = metadata.notes || '';
  if (metadata.koreaConnection || metadata.judaismConnection || metadata.sponsorship) {
    if (notes) notes += '\n\n';
    notes += '--- Guest Information ---\n';
    if (metadata.koreaConnection) { const c = metadata.koreaConnection === 'other' ? metadata.koreaConnectionOther : metadata.koreaConnection; notes += `Country Connection: ${c}\n`; }
    if (metadata.localPhone) notes += `Local Phone: ${metadata.localPhone}\n`;
    if (metadata.judaismConnection) notes += `Judaism Connection: ${metadata.judaismConnection}\n`;
    if (metadata.sponsorship && metadata.sponsorship !== '') { const l = metadata.sponsorship === 'other' ? `Custom: $${metadata.sponsorshipAmount}` : `$${metadata.sponsorship}`; notes += `Sponsorship: ${l}`; }
  }

  return strapiPost('shabbat-orders', {
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
      notes,
      customer_detail_info: buildCustomerDetailInfo(metadata)
    }
  });
}

async function saveShabbatBoxOrder(session, metadata, parsedItems) {
  const firstItem = parsedItems[0] || {};
  const deliveryType = metadata.deliveryType || firstItem.deliveryType || 'pickup';
  const deliveryAddress = metadata.deliveryAddress || firstItem.deliveryAddress || null;
  const shabbatName = metadata.shabbat_name || firstItem.shabbatName || 'Shabbat';

  let shabbatStart, shabbatEnd;
  if (metadata.shabbatHolidayStart && metadata.shabbatHolidayEnd && metadata.shabbatHolidayStart !== metadata.shabbatHolidayEnd) {
    shabbatStart = metadata.shabbatHolidayStart; shabbatEnd = metadata.shabbatHolidayEnd;
  } else {
    const dateString = metadata.eventDate || firstItem.shabbatDate || metadata.shabbatDate;
    if (dateString) {
      const { start, end } = extractDateRange(dateString);
      if (start && end) { shabbatStart = start; shabbatEnd = end; }
      else if (start) { shabbatStart = start; const d = new Date(start); d.setDate(d.getDate() + 1); shabbatEnd = d.toISOString().split('T')[0]; }
    }
    if (!shabbatStart) {
      const s = new Date(); const e = new Date(s); e.setDate(e.getDate() + 1);
      shabbatStart = s.toISOString().split('T')[0]; shabbatEnd = e.toISOString().split('T')[0];
    }
  }

  return strapiPost('orders', {
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
      delivery_addres: deliveryAddress,
      typeOfDelivery: deliveryType,
      shabbat_holiday_start: shabbatStart,
      shabbat_holiday_end: shabbatEnd,
      orderType: 'shabbatBox',
      serviceDate: null,
      customer_detail_info: buildCustomerDetailInfo(metadata)
    }
  });
}

async function saveCustomEventDeliveryOrder(session, metadata, parsedItems) {
  const firstItem = parsedItems[0] || {};
  const deliveryType = metadata.deliveryType || firstItem.deliveryType || 'pickup';
  const deliveryAddress = metadata.deliveryAddress || firstItem.deliveryAddress || null;
  const eventName = metadata.eventName || firstItem.shabbatName || 'Custom Event';
  const eventDate = metadata.eventDate || firstItem.shabbatDate || null;

  const deliveryFee = parseFloat(metadata.deliveryFee) || 0;
  let deliveryZoneName = null;
  if (metadata.deliveryZone) {
    try { const z = JSON.parse(metadata.deliveryZone); deliveryZoneName = z?.zone_name || null; } catch (e) {}
  }

  let serviceDateISO = null;
  if (eventDate) {
    const { start } = extractDateRange(eventDate);
    if (start) serviceDateISO = start;
  }

  return strapiPost('orders', {
    data: {
      orderId: metadata.orderId || `CE-${Date.now()}`,
      shabbat_or_holiday: eventName,
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
      shabbat_holiday_start: null,
      shabbat_holiday_end: null,
      orderType: eventName,
      serviceDate: serviceDateISO,
      customer_detail_info: buildCustomerDetailInfo(metadata)
    }
  });
}

// --- Check for existing orders in Strapi to avoid duplicates ---

async function checkExistingOrder(stripeSessionId, endpoint) {
  try {
    const response = await fetch(
      `${strapiUrl}/api/${endpoint}?filters[stripeSessionId][$eq]=${stripeSessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch {
    return false;
  }
}

async function checkExistingDonation(session, metadata) {
  try {
    // Para suscripciones, verificar por subscriptionId (es único)
    if (session.subscription) {
      const response = await fetch(
        `${strapiUrl}/api/donations?filters[subscriptionId][$eq]=${session.subscription}`,
        { headers: { 'Authorization': `Bearer ${strapiToken}`, 'Content-Type': 'application/json' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) return true;
      }
    }

    // Para one-time, verificar por donorEmail + totalAmount exacto
    const email = session.customer_email || session.customer_details?.email;
    const amount = session.amount_total / 100;
    if (email) {
      const response = await fetch(
        `${strapiUrl}/api/donations?filters[donorEmail][$eq]=${encodeURIComponent(email)}&filters[totalAmount][$eq]=${amount}`,
        { headers: { 'Authorization': `Bearer ${strapiToken}`, 'Content-Type': 'application/json' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

// --- Main recovery logic ---

async function recoverOrders() {
  const DRY_RUN = process.argv.includes('--dry-run');

  console.log('='.repeat(60));
  console.log(DRY_RUN ? '🔍 DRY RUN MODE - No changes will be made' : '🚀 RECOVERY MODE - Orders will be saved to Strapi');
  console.log('='.repeat(60));

  // Validate env vars
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is not set');
    process.exit(1);
  }
  if (!strapiUrl || !strapiToken) {
    console.error('❌ STRAPI_INTERNAL_URL/STRAPI_API_URL or STRAPI_API_TOKEN is not set');
    process.exit(1);
  }

  console.log(`📡 Strapi URL: ${strapiUrl}`);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // 12 days ago
  const nineDaysAgo = Math.floor((Date.now() - 12 * 24 * 60 * 60 * 1000) / 1000);

  console.log(`\n📅 Fetching checkout.session.completed events since ${new Date(nineDaysAgo * 1000).toISOString()}\n`);

  let allEvents = [];
  let hasMore = true;
  let startingAfter = undefined;

  // Paginate through all events
  while (hasMore) {
    const params = {
      type: 'checkout.session.completed',
      created: { gte: nineDaysAgo },
      limit: 100
    };
    if (startingAfter) params.starting_after = startingAfter;

    const events = await stripe.events.list(params);
    allEvents = allEvents.concat(events.data);
    hasMore = events.has_more;
    if (events.data.length > 0) {
      startingAfter = events.data[events.data.length - 1].id;
    }
  }

  console.log(`📋 Found ${allEvents.length} checkout.session.completed events\n`);

  const stats = { donations: 0, shabbat: 0, shabbatBox: 0, customEvent: 0, skipped: 0, errors: 0, duplicates: 0 };

  for (const event of allEvents) {
    const sessionBasic = event.data.object;
    const created = new Date(event.created * 1000).toISOString();

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📌 Session: ${sessionBasic.id}`);
    console.log(`   Created: ${created}`);
    console.log(`   Email: ${sessionBasic.customer_email || sessionBasic.customer_details?.email || 'N/A'}`);
    console.log(`   Amount: $${(sessionBasic.amount_total / 100).toFixed(2)}`);
    console.log(`   Mode: ${sessionBasic.mode}`);

    try {
      // Retrieve full session with expanded line_items
      const session = await stripe.checkout.sessions.retrieve(sessionBasic.id, {
        expand: ['line_items', 'line_items.data.price.product']
      });

      const metadata = session.metadata || {};

      if (session.mode === 'subscription') {
        // Subscription donation
        console.log(`   Type: Subscription donation`);
        console.log(`   Frequency: ${metadata.frequency || 'monthly'}`);

        const donationExists = await checkExistingDonation(session, metadata);
        if (donationExists) { console.log('   ⏭️  Already exists in Strapi, skipping'); stats.duplicates++; continue; }

        if (DRY_RUN) { console.log('   ⏭️  [DRY RUN] Would save subscription donation'); stats.donations++; continue; }

        try {
          const result = await saveDonation(session, metadata, 'subscription');
          console.log(`   ✅ Saved subscription donation: ${result.data?.documentId || result.data?.id}`);
          stats.donations++;
        } catch (error) {
          console.error(`   ❌ Failed to save subscription donation:`, error.message);
          stats.errors++;
        }

      } else if (session.mode === 'payment') {
        const isDonation = metadata.purpose === 'Donation' || metadata.donationType === 'one-time';

        if (isDonation) {
          console.log(`   Type: One-time donation`);

          const donationExists = await checkExistingDonation(session, metadata);
          if (donationExists) { console.log('   ⏭️  Already exists in Strapi, skipping'); stats.duplicates++; continue; }

          if (DRY_RUN) { console.log('   ⏭️  [DRY RUN] Would save one-time donation'); stats.donations++; continue; }

          try {
            const result = await saveDonation(session, metadata, 'one-time');
            console.log(`   ✅ Saved one-time donation: ${result.data?.documentId || result.data?.id}`);
            stats.donations++;
          } catch (error) {
            console.error(`   ❌ Failed to save donation:`, error.message);
            stats.errors++;
          }

        } else {
          // Regular order - parse items and detect type
          const items = session.line_items?.data ? parseLineItems(session.line_items.data) : [{ name: 'Order', price: session.amount_total / 100, quantity: 1, total: session.amount_total / 100, productType: 'product' }];

          // Enrich items
          const enrichedItems = items.map(item => {
            const enrichedItem = { ...item };
            if (item.productType === 'mealReservation' || metadata.orderType === 'reservation') {
              enrichedItem.shabbatName = metadata.eventName || metadata.shabbatName || null;
              enrichedItem.shabbatDate = metadata.eventDate || metadata.shabbatDate || metadata.serviceDate;
              enrichedItem.eventType = 'Shabbat Meal';
            }
            if (item.productType === 'shabbatBox' || metadata.orderType === 'shabbatBox') {
              enrichedItem.shabbatName = metadata.parashahName || null;
              enrichedItem.shabbatDate = metadata.deliveryDate || metadata.shabbatDate;
              enrichedItem.eventType = 'Shabbat Box Delivery';
            }
            return enrichedItem;
          });

          const orderType = detectOrderType(metadata, enrichedItems);
          console.log(`   Type: ${orderType}`);
          console.log(`   Items: ${enrichedItems.map(i => i.name).join(', ')}`);

          if (orderType === 'shabbat or holiday') {
            // Check for duplicate
            const exists = await checkExistingOrder(session.id, 'shabbat-orders');
            if (exists) { console.log('   ⏭️  Already exists in Strapi, skipping'); stats.duplicates++; continue; }

            if (DRY_RUN) { console.log('   ⏭️  [DRY RUN] Would save shabbat order'); stats.shabbat++; continue; }

            try {
              const result = await saveShabbatOrder(session, metadata, enrichedItems);
              console.log(`   ✅ Saved shabbat order: ${result.data?.documentId || result.data?.id}`);
              stats.shabbat++;
            } catch (error) {
              console.error(`   ❌ Failed to save shabbat order:`, error.message);
              stats.errors++;
            }

          } else if (orderType === 'shabbatBox') {
            const exists = await checkExistingOrder(session.id, 'orders');
            if (exists) { console.log('   ⏭️  Already exists in Strapi, skipping'); stats.duplicates++; continue; }

            if (DRY_RUN) { console.log('   ⏭️  [DRY RUN] Would save shabbat box order'); stats.shabbatBox++; continue; }

            try {
              const result = await saveShabbatBoxOrder(session, metadata, enrichedItems);
              console.log(`   ✅ Saved shabbat box order: ${result.data?.documentId || result.data?.id}`);
              stats.shabbatBox++;
            } catch (error) {
              console.error(`   ❌ Failed to save shabbat box order:`, error.message);
              stats.errors++;
            }

          } else if (orderType === 'customEvent') {
            const exists = await checkExistingOrder(session.id, 'orders');
            if (exists) { console.log('   ⏭️  Already exists in Strapi, skipping'); stats.duplicates++; continue; }

            if (DRY_RUN) { console.log('   ⏭️  [DRY RUN] Would save custom event order'); stats.customEvent++; continue; }

            try {
              const result = await saveCustomEventDeliveryOrder(session, metadata, enrichedItems);
              console.log(`   ✅ Saved custom event order: ${result.data?.documentId || result.data?.id}`);
              stats.customEvent++;
            } catch (error) {
              console.error(`   ❌ Failed to save custom event order:`, error.message);
              stats.errors++;
            }
          } else {
            console.log(`   ⏭️  Unknown order type: ${orderType}, skipping`);
            stats.skipped++;
          }
        }
      } else {
        console.log(`   ⏭️  Unsupported mode: ${session.mode}`);
        stats.skipped++;
      }

    } catch (error) {
      console.error(`   ❌ Error processing session ${sessionBasic.id}:`, error.message);
      stats.errors++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 RECOVERY SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Donations saved:     ${stats.donations}`);
  console.log(`   Shabbat orders:      ${stats.shabbat}`);
  console.log(`   Shabbat Box orders:  ${stats.shabbatBox}`);
  console.log(`   Custom Event orders: ${stats.customEvent}`);
  console.log(`   Duplicates skipped:  ${stats.duplicates}`);
  console.log(`   Other skipped:       ${stats.skipped}`);
  console.log(`   Errors:              ${stats.errors}`);
  console.log(`   Total processed:     ${allEvents.length}`);
  console.log('='.repeat(60));
}

recoverOrders().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
