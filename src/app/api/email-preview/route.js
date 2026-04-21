import {
  orderNotificationTemplate,
  donationNotificationTemplate,
  newsletterNotificationTemplate,
  contactNotificationTemplate,
  userOrderConfirmationTemplate,
  userDonationConfirmationTemplate,
  userNewsletterWelcomeTemplate,
} from '../../services/emailService.js';

const MOCK_SITE_CONFIG = {
  site_title: 'Chabad Demo',
  address: '123 Main Street',
  city: 'Panama City',
  phone: '+507 123-4567',
  color_theme: 'blue',
};

const MOCK_ORDER_DATA = {
  orderId: 'ORD-2024-001',
  customer: {
    firstName: 'John',
    lastName: 'Cohen',
    email: 'john.cohen@example.com',
    phone: '+1 555-0100',
    nationality: 'USA',
  },
  items: [
    { meal: 'Shabbat Dinner', priceType: 'Adult', unitPrice: 45, quantity: 2 },
    { meal: 'Shabbat Dinner', priceType: 'Child', unitPrice: 25, quantity: 1 },
  ],
  total: 115,
  metadata: {
    eventName: 'Shabbat Dinner',
    eventDate: 'Friday, March 21, 2025',
    productType: 'mealReservation',
    eventType: 'Shabbat or Holiday',
    donation: '18',
  },
};

const MOCK_DONATION_DATA = {
  customer: { email: 'donor@example.com' },
  amount: 180,
  frequency: 'monthly',
  donationType: 'subscription',
  metadata: {},
};

const MOCK_SUBSCRIBER_DATA = {
  email: 'subscriber@example.com',
  timestamp: new Date().toISOString(),
};

const MOCK_CONTACT_DATA = {
  name: 'Sarah Levy',
  email: 'sarah@example.com',
  phone: '+1 555-0200',
  city: 'Miami',
  message: 'Hi! I will be visiting Panama next month and would love to join for Shabbat.\n\nPlease let me know the details.',
  timestamp: new Date().toISOString(),
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const templateKey = searchParams.get('template');
  const theme = searchParams.get('theme') || 'blue';

  const siteConfig = { ...MOCK_SITE_CONFIG, color_theme: theme };

  if (!templateKey) {
    return Response.json({
      templates: [
        'order-admin',
        'donation-admin',
        'newsletter-admin',
        'contact-admin',
        'order-user',
        'donation-user',
        'newsletter-user',
      ],
    });
  }

  let html;
  switch (templateKey) {
    case 'order-admin':
      html = orderNotificationTemplate(MOCK_ORDER_DATA, siteConfig);
      break;
    case 'donation-admin':
      html = donationNotificationTemplate(MOCK_DONATION_DATA, siteConfig);
      break;
    case 'newsletter-admin':
      html = newsletterNotificationTemplate(MOCK_SUBSCRIBER_DATA, siteConfig);
      break;
    case 'contact-admin':
      html = contactNotificationTemplate(MOCK_CONTACT_DATA, siteConfig);
      break;
    case 'order-user':
      html = userOrderConfirmationTemplate(MOCK_ORDER_DATA, siteConfig);
      break;
    case 'donation-user':
      html = userDonationConfirmationTemplate(MOCK_DONATION_DATA, siteConfig);
      break;
    case 'newsletter-user':
      html = userNewsletterWelcomeTemplate(MOCK_SUBSCRIBER_DATA, siteConfig);
      break;
    default:
      return new Response('Template not found', { status: 404 });
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
