import nodemailer from 'nodemailer';
import { getSiteConfig } from '../utils/siteConfigHelper.js';

// Crear transportador de email
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail', // Cambiar según el servicio que uses
    auth: {
      user: process.env.EMAIL_USER, // Tu email
      pass: process.env.EMAIL_PASS, // Tu contraseña de app o password
    },
  });
}

// Función para obtener colores dinámicos basados en el tema configurado
function getThemeColors(siteConfig = {}) {
  const theme = siteConfig?.color_theme || 'blue';
  
  // Mapeo directo desde globals.css
  const themeColors = {
    blue: {
      primary: '#3B82F6',
      secondary: '#1E1E1E',
      accent: '#F4F7FB',
      dark: '#111828'
    },
    teal: {
      primary: '#008286',
      secondary: '#1E1E1E',
      accent: '#FAFAF7',
      dark: '#111828'
    },
    green: {
      primary: '#1EA572',
      secondary: '#2A1F09',
      accent: '#ECFDF5',
      dark: '#111828'
    },
    turquoise: {
      primary: '#06AED5',
      secondary: '#1E1E1E',
      accent: '#ECFDF5',
      dark: '#111828'
    },
    red: {
      primary: '#dc2626',
      secondary: '#1E1E1E',
      accent: '#FEF2F2',
      dark: '#111828'
    },
    coral: {
      primary: '#FC5761',
      secondary: '#1E1E1E',
      accent: '#F3F4F6',
      dark: '#1E1E1E'
    },
    orange: {
      primary: '#ea580c',
      secondary: '#1E1E1E',
      accent: '#FFF7ED',
      dark: '#111828'
    },
    gold: {
      primary: '#ffb700',
      secondary: '#1E1E1E',
      accent: '#FDF2F8',
      dark: '#111828'
    }
  };

  const selectedTheme = themeColors[theme] || themeColors.blue;
  
  // Generar colores derivados
  const primaryHex = selectedTheme.primary;
  const primaryDark = adjustBrightness(primaryHex, -20); // Más oscuro
  
  return {
    primary: primaryHex,
    primaryDark: primaryDark,
    gradient: `linear-gradient(135deg, ${primaryHex}, ${primaryDark})`,
    secondary: selectedTheme.secondary,
    accent: selectedTheme.accent,
    dark: selectedTheme.dark,
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  };
}

// Helper para ajustar brillo de colores hex
function adjustBrightness(hex, percent) {
  // Remover # si existe
  hex = hex.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Ajustar brillo
  const factor = percent / 100;
  const newR = Math.max(0, Math.min(255, Math.round(r * (1 + factor))));
  const newG = Math.max(0, Math.min(255, Math.round(g * (1 + factor))));
  const newB = Math.max(0, Math.min(255, Math.round(b * (1 + factor))));
  
  // Convertir de vuelta a hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}


// Template base para emails (con datos dinámicos de Strapi)
const baseTemplate = (content, title, siteConfig = {}) => {
  const siteTitle = siteConfig.site_title || 'Website';
  const address = siteConfig.address || '';
  const city = siteConfig.city || '';
  const phone = siteConfig.phone || '';
  
  // Obtener colores dinámicos basados en el tema
  const emailColors = getThemeColors(siteConfig);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: ${emailColors.gradient};
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 20px;
            background: white;
            border-radius: 20px 20px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
            padding: 40px 30px;
        }
        .info-section {
            background: #f8fafc;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 3px solid ${emailColors.primary};
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .info-section h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
            flex: 1;
        }
        .info-value {
            color: #1f2937;
            text-align: right;
            flex: 1;
        }
        .total {
            font-size: 20px;
            font-weight: 700;
            color: ${emailColors.primaryDark};
            background: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
            border: 1px solid #e2e8f0;
        }
        .footer {
            background: #f8fafc;
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-contact {
            margin-top: 15px;
            font-size: 13px;
        }
        .footer-contact strong {
            color: #374151;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header {
                padding: 30px 20px;
            }
            .content {
                padding: 30px 20px;
            }
            .info-section {
                padding: 20px;
            }
            .info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            .info-value {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p><strong>This notification was sent automatically from your website.</strong></p>
            <div class="footer-contact">
                <p><strong>${siteTitle}</strong></p>
                <p>${address}, ${city}</p>
                <p>Phone: ${phone}</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};

// Template para notificaciones de pedidos
export const orderNotificationTemplate = (orderData, siteConfig = {}) => {
  const { customer, items, total, orderId, metadata } = orderData;
  
  // Obtener información del evento de los items
  const eventInfo = items.length > 0 ? {
    shabbatName: items[0].shabbatName,
    shabbatDate: items[0].shabbatDate,
    productType: items[0].productType
  } : null;
  
  const itemsHtml = items.map(item => {
    const itemName = item.meal || item.name;
    const priceType = item.priceType ? ` (${item.priceType})` : '';
    return `
      <div class="info-row">
        <span class="info-label">${itemName}${priceType}</span>
        <span class="info-value">$${item.unitPrice ? item.unitPrice.toFixed(2) : item.price.toFixed(2)} x ${item.quantity}</span>
      </div>
    `;
  }).join('');

  const content = `
    <div class="info-section">
      <h3>Order Details</h3>
      <div class="info-row">
        <span class="info-label">Order ID:</span>
        <span class="info-value">${orderId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date().toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
    </div>

    ${eventInfo ? `
    <div class="info-section">
      <h3>Event Information</h3>
      <div class="info-row">
        <span class="info-label">Event:</span>
        <span class="info-value">${eventInfo.shabbatName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${eventInfo.shabbatDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${eventInfo.productType === 'mealReservation' ? 'Meal Reservation' : eventInfo.productType}</span>
      </div>
    </div>` : ''}

    <div class="info-section">
      <h3>Customer Information</h3>
      <div class="info-row">
        <span class="info-label">Name:</span>
        <span class="info-value">${customer.firstName} ${customer.lastName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${customer.email}</span>
      </div>
      ${customer.phone ? `
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">${customer.phone}</span>
      </div>` : ''}
      ${customer.nationality ? `
      <div class="info-row">
        <span class="info-label">Nationality:</span>
        <span class="info-value">${customer.nationality}</span>
      </div>` : ''}
    </div>

    <div class="info-section">
      <h3>Items Ordered</h3>
      ${itemsHtml}
    </div>

    <div class="total">
      Total: $${total.toFixed(2)} USD
    </div>

    ${metadata?.donation && parseFloat(metadata.donation) > 0 ? `
    <div class="info-section">
      <h3>Additional Donation</h3>
      <div class="info-row">
        <span class="info-label">Donation Amount:</span>
        <span class="info-value">$${parseFloat(metadata.donation).toFixed(2)} USD</span>
      </div>
    </div>` : ''}
  `;

  return baseTemplate(content, 'New Order Received', siteConfig);
};

// Template para notificaciones de donaciones
export const donationNotificationTemplate = (donationData, siteConfig = {}) => {
  const { customer, amount, frequency, donationType, metadata } = donationData;
  const siteTitle = siteConfig.site_title || 'Website';
  
  const content = `
    <div class="info-section">
      <h3>Donation Details</h3>
      <div class="info-row">
        <span class="info-label">Amount:</span>
        <span class="info-value">$${amount.toFixed(2)} USD</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${donationType === 'subscription' ? 'Recurring' : 'One-time'}</span>
      </div>
      ${frequency && frequency !== 'one-time' ? `
      <div class="info-row">
        <span class="info-label">Frequency:</span>
        <span class="info-value">${getFrequencyLabel(frequency, metadata?.customMonths)}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date().toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>Donor Information</h3>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${customer.email}</span>
      </div>
    </div>

    <div class="total">
      Thank you for supporting ${siteTitle}!
    </div>
  `;

  return baseTemplate(content, 'New Donation Received', siteConfig);
};

// Template para notificaciones de newsletter
export const newsletterNotificationTemplate = (subscriberData, siteConfig = {}) => {
  const { email, timestamp } = subscriberData;
  
  const content = `
    <div class="info-section">
      <h3>Newsletter Subscription</h3>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date(timestamp).toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time:</span>
        <span class="info-value">${new Date(timestamp).toLocaleTimeString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
    </div>

    <div class="total">
      New newsletter subscriber!
    </div>
  `;

  return baseTemplate(content, 'New Newsletter Subscription', siteConfig);
};

// Template para notificaciones de contacto
export const contactNotificationTemplate = (contactData, siteConfig = {}) => {
  const { name, email, phone, city, message, timestamp } = contactData;
  
  const content = `
    <div class="info-section">
      <h3>Contact Information</h3>
      <div class="info-row">
        <span class="info-label">Name:</span>
        <span class="info-value">${name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${email}</span>
      </div>
      ${phone ? `
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">${phone}</span>
      </div>` : ''}
      ${city ? `
      <div class="info-row">
        <span class="info-label">City:</span>
        <span class="info-value">${city}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date(timestamp).toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>Message</h3>
      <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  return baseTemplate(content, 'New Contact Form Submission', siteConfig);
};

// Helper para obtener label de frecuencia
function getFrequencyLabel(frequency, customMonths) {
  switch (frequency) {
    case 'monthly':
      return 'Monthly (recurring)';
    case '12-months':
      return '12 Monthly payments';
    case '24-months':
      return '24 Monthly payments';
    case 'other':
      return `${customMonths} Monthly payments`;
    default:
      return frequency;
  }
}

// Función principal para enviar emails
export async function sendNotificationEmail(to, subject, template) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Funciones específicas para cada tipo de notificación
export async function sendOrderNotification(notificationEmail, orderData) {
  const siteConfig = await getSiteConfig();
  const template = orderNotificationTemplate(orderData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `New Order #${orderData.orderId} - ${siteName}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendDonationNotification(notificationEmail, donationData) {
  const siteConfig = await getSiteConfig();
  const template = donationNotificationTemplate(donationData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `New Donation - $${donationData.amount.toFixed(2)} USD - ${siteName}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendNewsletterNotification(notificationEmail, subscriberData) {
  const siteConfig = await getSiteConfig();
  const template = newsletterNotificationTemplate(subscriberData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `New Newsletter Subscription - ${subscriberData.email} - ${siteName}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendContactNotification(notificationEmail, contactData) {
  const siteConfig = await getSiteConfig();
  const template = contactNotificationTemplate(contactData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `New Contact Form - ${contactData.name} - ${siteName}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

// ========================================
// TEMPLATES PARA USUARIOS (CONFIRMACIONES)
// ========================================

// Template base para confirmaciones de usuarios (con datos dinámicos de Strapi)
const userConfirmationTemplate = (content, title, siteConfig = {}) => {
  const siteTitle = siteConfig.site_title || 'Website';
  const address = siteConfig.address || '';
  const city = siteConfig.city || '';
  const phone = siteConfig.phone || '';
  
  // Obtener colores dinámicos basados en el tema
  const emailColors = getThemeColors(siteConfig);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: ${emailColors.gradient};
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            right: 0;
            height: 30px;
            background: white;
            border-radius: 30px 30px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .content {
            padding: 50px 40px;
        }
        .success-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 40px;
        }
        .success-icon div {
            width: 80px;
            height: 80px;
            background: #10b981;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .info-section {
            background: #f8fafc;
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            border-left: 3px solid ${emailColors.primary};
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .info-section h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #1f2937;
            font-size: 20px;
            font-weight: 600;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
            flex: 1;
        }
        .info-value {
            color: #1f2937;
            text-align: right;
            flex: 1;
            font-weight: 500;
        }
        .total {
            font-size: 24px;
            font-weight: 700;
            color: ${emailColors.primaryDark};
            background: #f1f5f9;
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .message-box {
            background: #f0f9ff;
            border: 1px solid ${emailColors.primary};
            padding: 25px;
            border-radius: 16px;
            margin: 30px 0;
            color: #1f2937;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .message-box h4 {
            margin-top: 0;
            color: ${emailColors.primaryDark};
            font-size: 18px;
        }
        .footer {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            padding: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-brand {
            font-size: 18px;
            font-weight: 700;
            color: ${emailColors.primaryDark};
            margin-bottom: 15px;
        }
        .footer-contact {
            margin-top: 20px;
            font-size: 14px;
        }
        .footer-contact p {
            margin: 5px 0;
        }
        .btn {
            display: inline-block;
            background: ${emailColors.gradient};
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            margin: 25px 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        @media (max-width: 600px) {
            body {
                padding: 15px;
            }
            .header {
                padding: 40px 25px;
            }
            .content {
                padding: 40px 25px;
            }
            .footer {
                padding: 30px 25px;
            }
            .info-section {
                padding: 25px;
            }
            .info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            .info-value {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div class="footer-brand">${siteTitle}</div>
            <p><strong>Thank you for choosing us!</strong></p>
            <div class="footer-contact">
                <p>${address}, ${city}</p>
                <p>Phone: ${phone}</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};

// Template para confirmación de compra del usuario
export const userOrderConfirmationTemplate = (orderData, siteConfig = {}) => {
  const { customer, items, total, orderId, metadata } = orderData;
  const siteTitle = siteConfig.site_title || 'Website';
  
  // Obtener información del evento de los items
  const eventInfo = items.length > 0 ? {
    shabbatName: items[0].shabbatName,
    shabbatDate: items[0].shabbatDate,
    productType: items[0].productType
  } : null;
  
  // Obtener colores dinámicos basados en el tema
  const emailColors = getThemeColors(siteConfig);
  
  const itemsHtml = items.map(item => {
    const itemName = item.meal || item.name;
    const priceType = item.priceType ? ` (${item.priceType})` : '';
    return `
      <div class="info-row">
        <span class="info-label">${itemName}${priceType}</span>
        <span class="info-value">$${item.unitPrice ? item.unitPrice.toFixed(2) : item.price.toFixed(2)} x ${item.quantity}</span>
      </div>
    `;
  }).join('');

  const content = `
    <h2 style="color: ${emailColors.primaryDark}; margin-bottom: 20px; font-size: 24px;">Your order has been confirmed!</h2>
    <p style="font-size: 16px; margin-bottom: 30px; color: #374151; line-height: 1.6;">
      Thank you for your order, ${customer.firstName}! We're preparing everything for your visit to ${siteTitle}.
    </p>

    <div class="info-section">
      <h3>Order Details</h3>
      <div class="info-row">
        <span class="info-label">Order Number:</span>
        <span class="info-value">${orderId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Order Date:</span>
        <span class="info-value">${new Date().toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">Confirmed</span>
      </div>
    </div>

    ${eventInfo ? `
    <div class="info-section">
      <h3>Event Information</h3>
      <div class="info-row">
        <span class="info-label">Event:</span>
        <span class="info-value">${eventInfo.shabbatName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Event Date:</span>
        <span class="info-value">${eventInfo.shabbatDate}</span>
      </div>
    </div>` : ''}

    <div class="info-section">
      <h3>Items Ordered</h3>
      ${itemsHtml}
    </div>

    <div class="total">
      Total Paid: $${total.toFixed(2)} USD
    </div>

    ${metadata?.donation && parseFloat(metadata.donation) > 0 ? `
    <div class="message-box">
      <h4 style="margin-top: 0;">Thank you for your additional donation!</h4>
      <p>Your generous donation of $${parseFloat(metadata.donation).toFixed(2)} USD helps support our community programs and services.</p>
    </div>` : ''}

    <div class="info-section">
      <h3>What's Next?</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>You'll receive a receipt via email from our payment processor</li>
        <li>Our team will contact you with any additional details about your ${eventInfo ? eventInfo.shabbatName : 'reservation'}</li>
        <li>We look forward to welcoming you${eventInfo ? ` on ${eventInfo.shabbatDate}` : ''} to ${siteTitle}!</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      ${siteConfig.phone ? `<p>Questions about your order? Contact us at ${siteConfig.phone}</p>` : ''}
    </div>
  `;

  return userConfirmationTemplate(content, 'Order Confirmation', siteConfig);
};

// Template para confirmación de donación del usuario
export const userDonationConfirmationTemplate = (donationData, siteConfig = {}) => {
  const { amount, frequency, donationType, metadata } = donationData;
  const siteTitle = siteConfig.site_title || 'Website';
  
  const content = `
    <h2 style="color: ${emailColors.primaryDark}; margin-bottom: 20px; font-size: 24px;">Thank you for your generous donation!</h2>
    <p style="font-size: 16px; margin-bottom: 30px; color: #374151; line-height: 1.6;">
      Your contribution makes a real difference in our community. With your support, we can continue our mission of bringing warmth, learning, and joy to everyone who walks through our doors.
    </p>

    <div class="info-section">
      <h3>Donation Details</h3>
      <div class="info-row">
        <span class="info-label">Amount:</span>
        <span class="info-value">$${amount.toFixed(2)} USD</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${donationType === 'subscription' ? 'Recurring Donation' : 'One-time Donation'}</span>
      </div>
      ${frequency && frequency !== 'one-time' ? `
      <div class="info-row">
        <span class="info-label">Frequency:</span>
        <span class="info-value">${getFrequencyLabel(frequency, metadata?.customMonths)}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date().toLocaleDateString('en-US', { timeZone: 'America/Panama' })}</span>
      </div>
    </div>

    <div class="total">
      Total Donation: $${amount.toFixed(2)} USD
    </div>

    <div class="message-box">
      <h4 style="margin-top: 0;">Your impact</h4>
      <p>Your donation helps us:</p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Host uplifting Shabbat dinners and holiday celebrations</li>
        <li>Offer free educational programs and Torah classes</li>
        <li>Provide spiritual guidance and community support</li>
        <li>Welcome Jewish travelers and locals alike</li>
      </ul>
    </div>

    ${donationType === 'subscription' ? `
    <div class="info-section">
      <h3>Recurring Donation Info</h3>
      <p>Your recurring donation will be processed automatically. You can manage or cancel your subscription at any time by contacting us.</p>
    </div>` : ''}

    <div style="text-align: center; margin: 30px 0;">
      <p><strong>From all of us at ${siteTitle} - Thank you!</strong></p>
      ${siteConfig.phone ? `<p>Questions? Contact us at ${siteConfig.phone}</p>` : ''}
    </div>
  `;

  return userConfirmationTemplate(content, 'Donation Confirmation', siteConfig);
};

// Template para bienvenida de newsletter
export const userNewsletterWelcomeTemplate = (subscriberData, siteConfig = {}) => {
  // subscriberData no se usa actualmente pero se mantiene para consistencia de API
  const siteName = siteConfig?.site_title || 'Website';
  
  const content = `
    <h2 style="color: ${emailColors.primaryDark}; margin-bottom: 20px; font-size: 24px;">Welcome to our community!</h2>
    <p style="font-size: 16px; margin-bottom: 30px; color: #374151; line-height: 1.6;">
      Thank you for subscribing to our newsletter! You're now part of the ${siteName} family, and we're excited to share our journey with you.
    </p>

    <div class="info-section">
      <h3>What to expect</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Community Updates:</strong> News about our programs and events</li>
        <li><strong>Jewish Travel Tips:</strong> Insights for your time in Panama</li>
        <li><strong>Holiday Information:</strong> Shabbat times and celebration details</li>
      </ul>
    </div>

    <div class="message-box">
      <h4 style="margin-top: 0;">Visit us anytime!</h4>
      <p>Whether you're looking for a Shabbat meal, Torah class, or just a friendly face, our doors are always open. We'd love to welcome you to our community in person!</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      ${siteConfig.phone ? `<a href="tel:${siteConfig.phone}" class="btn" style="color: white;">Contact Us: ${siteConfig.phone}</a>` : ''}
    </div>

    <div style="text-align: center; margin: 30px 0; font-size: 14px; color: #6b7280;">
      <p>You can unsubscribe at any time by contacting us.</p>
    </div>
  `;

  return userConfirmationTemplate(content, `Welcome to ${siteName}!`, siteConfig);
};

// Funciones para enviar emails a usuarios
export async function sendUserOrderConfirmation(customerEmail, orderData) {
  const siteConfig = await getSiteConfig();
  const template = userOrderConfirmationTemplate(orderData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `Order Confirmation #${orderData.orderId} - ${siteName}`;
  return await sendNotificationEmail(customerEmail, subject, template);
}

export async function sendUserDonationConfirmation(customerEmail, donationData) {
  const siteConfig = await getSiteConfig();
  const template = userDonationConfirmationTemplate(donationData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `Thank you for your donation - ${siteName}`;
  return await sendNotificationEmail(customerEmail, subject, template);
}

export async function sendUserNewsletterWelcome(customerEmail, subscriberData) {
  const siteConfig = await getSiteConfig();
  const template = userNewsletterWelcomeTemplate(subscriberData, siteConfig);
  const siteName = siteConfig?.site_title || 'Website';
  const subject = `Welcome to ${siteName}!`;
  return await sendNotificationEmail(customerEmail, subject, template);
}