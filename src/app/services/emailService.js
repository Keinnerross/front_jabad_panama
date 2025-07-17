import nodemailer from 'nodemailer';

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

// Template base para emails
const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background: white;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 12px 12px;
        }
        .info-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .info-section h3 {
            margin-top: 0;
            color: #1e3a8a;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        .info-value {
            color: #1f2937;
        }
        .total {
            font-size: 18px;
            font-weight: 700;
            color: #1e3a8a;
            background: #dbeafe;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .logo {
            font-size: 20px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🕍 Chabad Boquete Panama</div>
        <h1>${title}</h1>
    </div>
    <div class="content">
        ${content}
        <div class="footer">
            <p>This notification was sent automatically from your website.<br>
            Chabad House Panama City | Boquete, Panama</p>
        </div>
    </div>
</body>
</html>
`;

// Template para notificaciones de pedidos
export const orderNotificationTemplate = (orderData) => {
  const { customer, items, total, orderId, metadata } = orderData;
  
  const itemsHtml = items.map(item => `
    <div class="info-row">
      <span class="info-label">${item.name}</span>
      <span class="info-value">$${item.price.toFixed(2)} x ${item.quantity}</span>
    </div>
  `).join('');

  const content = `
    <div class="info-section">
      <h3>📦 Order Details</h3>
      <div class="info-row">
        <span class="info-label">Order ID:</span>
        <span class="info-value">${orderId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date().toLocaleDateString()}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>👤 Customer Information</h3>
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
      <h3>🛍️ Items Ordered</h3>
      ${itemsHtml}
    </div>

    <div class="total">
      💰 Total: $${total.toFixed(2)} USD
    </div>

    ${metadata?.donation && parseFloat(metadata.donation) > 0 ? `
    <div class="info-section">
      <h3>❤️ Additional Donation</h3>
      <div class="info-row">
        <span class="info-label">Donation Amount:</span>
        <span class="info-value">$${parseFloat(metadata.donation).toFixed(2)} USD</span>
      </div>
    </div>` : ''}
  `;

  return baseTemplate(content, 'New Order Received');
};

// Template para notificaciones de donaciones
export const donationNotificationTemplate = (donationData) => {
  const { customer, amount, frequency, donationType, metadata } = donationData;
  
  const content = `
    <div class="info-section">
      <h3>❤️ Donation Details</h3>
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
        <span class="info-value">${new Date().toLocaleDateString()}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>👤 Donor Information</h3>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${customer.email}</span>
      </div>
    </div>

    <div class="total">
      🙏 Thank you for supporting Chabad Boquete!
    </div>
  `;

  return baseTemplate(content, 'New Donation Received');
};

// Template para notificaciones de newsletter
export const newsletterNotificationTemplate = (subscriberData) => {
  const { email, timestamp } = subscriberData;
  
  const content = `
    <div class="info-section">
      <h3>📧 Newsletter Subscription</h3>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date(timestamp).toLocaleDateString()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time:</span>
        <span class="info-value">${new Date(timestamp).toLocaleTimeString()}</span>
      </div>
    </div>

    <div class="total">
      📬 New newsletter subscriber!
    </div>
  `;

  return baseTemplate(content, 'New Newsletter Subscription');
};

// Template para notificaciones de contacto
export const contactNotificationTemplate = (contactData) => {
  const { name, email, phone, city, message, timestamp } = contactData;
  
  const content = `
    <div class="info-section">
      <h3>📞 Contact Information</h3>
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
        <span class="info-value">${new Date(timestamp).toLocaleDateString()}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>💬 Message</h3>
      <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  return baseTemplate(content, 'New Contact Form Submission');
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
  const template = orderNotificationTemplate(orderData);
  const subject = `🛍️ New Order #${orderData.orderId} - Chabad Boquete`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendDonationNotification(notificationEmail, donationData) {
  const template = donationNotificationTemplate(donationData);
  const subject = `❤️ New Donation - $${donationData.amount.toFixed(2)} USD`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendNewsletterNotification(notificationEmail, subscriberData) {
  const template = newsletterNotificationTemplate(subscriberData);
  const subject = `📧 New Newsletter Subscription - ${subscriberData.email}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

export async function sendContactNotification(notificationEmail, contactData) {
  const template = contactNotificationTemplate(contactData);
  const subject = `📞 New Contact Form - ${contactData.name}`;
  return await sendNotificationEmail(notificationEmail, subject, template);
}

// ========================================
// TEMPLATES PARA USUARIOS (CONFIRMACIONES)
// ========================================

// Template base para confirmaciones de usuarios
const userConfirmationTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        .content {
            padding: 40px 30px;
        }
        .success-icon {
            text-align: center;
            margin-bottom: 30px;
        }
        .success-icon div {
            width: 80px;
            height: 80px;
            background: #10b981;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
        }
        .info-section {
            background: #f8fafc;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #3b82f6;
        }
        .info-section h3 {
            margin-top: 0;
            color: #1e3a8a;
            font-size: 18px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        .info-value {
            color: #1f2937;
            text-align: right;
        }
        .total {
            font-size: 20px;
            font-weight: 700;
            color: #1e3a8a;
            background: #dbeafe;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .message-box {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            color: #065f46;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .contact-info {
            margin-top: 20px;
            font-size: 13px;
        }
        .btn {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕍 Chabad Boquete Panama</div>
            <h1>${title}</h1>
        </div>
        <div class="content">
            <div class="success-icon">
                <div>✅</div>
            </div>
            ${content}
        </div>
        <div class="footer">
            <p><strong>Thank you for choosing Chabad Boquete!</strong></p>
            <div class="contact-info">
                <p>📍 Calle 4a con Calle C, Bajo Boquete, Chiriquí, Panama</p>
                <p>📞 507-6243-0666 | 🌐 Chabad Boquete</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Template para confirmación de compra del usuario
export const userOrderConfirmationTemplate = (orderData) => {
  const { customer, items, total, orderId, metadata } = orderData;
  
  const itemsHtml = items.map(item => `
    <div class="info-row">
      <span class="info-label">${item.name}</span>
      <span class="info-value">$${item.price.toFixed(2)} x ${item.quantity}</span>
    </div>
  `).join('');

  const content = `
    <h2 style="color: #1e3a8a; margin-bottom: 20px;">Your order has been confirmed!</h2>
    <p style="font-size: 16px; margin-bottom: 30px;">
      Thank you for your order, ${customer.firstName}! We're preparing everything for your visit to Chabad Boquete.
    </p>

    <div class="info-section">
      <h3>📦 Order Details</h3>
      <div class="info-row">
        <span class="info-label">Order Number:</span>
        <span class="info-value">${orderId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date().toLocaleDateString()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">Confirmed</span>
      </div>
    </div>

    <div class="info-section">
      <h3>🛍️ Items Ordered</h3>
      ${itemsHtml}
    </div>

    <div class="total">
      💰 Total Paid: $${total.toFixed(2)} USD
    </div>

    ${metadata?.donation && parseFloat(metadata.donation) > 0 ? `
    <div class="message-box">
      <h4 style="margin-top: 0;">❤️ Thank you for your additional donation!</h4>
      <p>Your generous donation of $${parseFloat(metadata.donation).toFixed(2)} USD helps support our community programs and services.</p>
    </div>` : ''}

    <div class="info-section">
      <h3>📅 What's Next?</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>You'll receive a receipt via email from our payment processor</li>
        <li>Our team will contact you with any additional details</li>
        <li>We look forward to welcoming you to Chabad Boquete!</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p>Questions about your order? Contact us at 507-6243-0666</p>
    </div>
  `;

  return userConfirmationTemplate(content, 'Order Confirmation');
};

// Template para confirmación de donación del usuario
export const userDonationConfirmationTemplate = (donationData) => {
  const { customer, amount, frequency, donationType, metadata } = donationData;
  
  const content = `
    <h2 style="color: #1e3a8a; margin-bottom: 20px;">Thank you for your generous donation!</h2>
    <p style="font-size: 16px; margin-bottom: 30px;">
      Your contribution makes a real difference in our community. With your support, we can continue our mission of bringing warmth, learning, and joy to everyone who walks through our doors.
    </p>

    <div class="info-section">
      <h3>❤️ Donation Details</h3>
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
        <span class="info-value">${new Date().toLocaleDateString()}</span>
      </div>
    </div>

    <div class="total">
      🙏 Total Donation: $${amount.toFixed(2)} USD
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
      <h3>📅 Recurring Donation Info</h3>
      <p>Your recurring donation will be processed automatically. You can manage or cancel your subscription at any time by contacting us.</p>
    </div>` : ''}

    <div style="text-align: center; margin: 30px 0;">
      <p><strong>From all of us at Chabad Boquete - Thank you!</strong></p>
      <p>Questions? Contact us at 507-6243-0666</p>
    </div>
  `;

  return userConfirmationTemplate(content, 'Donation Confirmation');
};

// Template para bienvenida de newsletter
export const userNewsletterWelcomeTemplate = (subscriberData) => {
  const { email } = subscriberData;
  
  const content = `
    <h2 style="color: #1e3a8a; margin-bottom: 20px;">Welcome to our community!</h2>
    <p style="font-size: 16px; margin-bottom: 30px;">
      Thank you for subscribing to our newsletter! You're now part of the Chabad Boquete family, and we're excited to share our journey with you.
    </p>

    <div class="info-section">
      <h3>📧 What to expect</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Exclusive Packages:</strong> Hand-picked experiences and Shabbat-friendly tours</li>
        <li><strong>Community Updates:</strong> News about our programs and events</li>
        <li><strong>Jewish Travel Tips:</strong> Insights for your time in Panama</li>
        <li><strong>Holiday Information:</strong> Shabbat times and celebration details</li>
      </ul>
    </div>

    <div class="message-box">
      <h4 style="margin-top: 0;">🏠 Visit us anytime!</h4>
      <p>Whether you're looking for a Shabbat meal, Torah class, or just a friendly face, our doors are always open. We'd love to welcome you to our community in person!</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="tel:507-6243-0666" class="btn">Contact Us: 507-6243-0666</a>
    </div>

    <div style="text-align: center; margin: 30px 0; font-size: 14px; color: #6b7280;">
      <p>You can unsubscribe at any time by contacting us.</p>
    </div>
  `;

  return userConfirmationTemplate(content, 'Welcome to Chabad Boquete!');
};

// Funciones para enviar emails a usuarios
export async function sendUserOrderConfirmation(customerEmail, orderData) {
  const template = userOrderConfirmationTemplate(orderData);
  const subject = `✅ Order Confirmation #${orderData.orderId} - Chabad Boquete`;
  return await sendNotificationEmail(customerEmail, subject, template);
}

export async function sendUserDonationConfirmation(customerEmail, donationData) {
  const template = userDonationConfirmationTemplate(donationData);
  const subject = `🙏 Thank you for your donation - Chabad Boquete`;
  return await sendNotificationEmail(customerEmail, subject, template);
}

export async function sendUserNewsletterWelcome(customerEmail, subscriberData) {
  const template = userNewsletterWelcomeTemplate(subscriberData);
  const subject = `🏠 Welcome to Chabad Boquete!`;
  return await sendNotificationEmail(customerEmail, subject, template);
}