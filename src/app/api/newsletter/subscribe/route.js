import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendNewsletterNotification, sendUserNewsletterWelcome } from '../../../services/emailService.js';

export async function POST(request) {
  console.log('🔥 Newsletter subscription endpoint called');
  try {
    const { email } = await request.json();
    console.log('📧 Email received:', email);

    // Validar email
    if (!email || !email.trim()) {
      console.log('❌ Email validation failed: empty email');
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email validation failed: invalid format');
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    console.log('✅ Email validation passed');

    const subscriberData = {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      source: 'website_newsletter',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    // Enviar notificación al admin
    console.log('🔧 Starting email configuration check...');
    try {
      const emailConfigValid = validateEmailConfig();
      console.log('📋 Email config valid:', emailConfigValid);
      
      if (emailConfigValid) {
        const notificationEmail = await getNotificationEmail();
        console.log('📬 Notification email:', notificationEmail);
        
        if (notificationEmail) {
          console.log('📤 Sending admin notification...');
          // Enviar notificación al admin
          sendNewsletterNotification(notificationEmail, subscriberData)
            .then((result) => {
              console.log('📧 Admin notification result:', result);
              if (result.success) {
                logNotification('NEWSLETTER', notificationEmail, subscriberData);
              } else {
                handleNotificationError(result.error, 'newsletter subscription notification');
              }
            })
            .catch((error) => {
              console.error('❌ Admin notification error:', error);
              handleNotificationError(error, 'newsletter subscription notification async');
            });

          console.log('🎉 Sending user welcome email...');
          // Enviar email de bienvenida al usuario
          sendUserNewsletterWelcome(subscriberData.email, subscriberData)
            .then((result) => {
              console.log('📧 User welcome result:', result);
              if (result.success) {
                logNotification('USER_NEWSLETTER_WELCOME', subscriberData.email, subscriberData);
              } else {
                handleNotificationError(result.error, 'user newsletter welcome');
              }
            })
            .catch((error) => {
              console.error('❌ User welcome error:', error);
              handleNotificationError(error, 'user newsletter welcome async');
            });
        } else {
          console.log('❌ No notification email found');
        }
      } else {
        console.log('❌ Email config validation failed');
      }
    } catch (emailError) {
      console.error('❌ Email setup error:', emailError);
      // No fallar la suscripción si hay error en el email
      handleNotificationError(emailError, 'newsletter subscription notification setup');
    }

    // TODO: Aquí podrías guardar el email en una base de datos o servicio de newsletter
    // Por ejemplo: MailChimp, ConvertKit, etc.
    
    console.log(`📧 New newsletter subscription: ${email}`);
    console.log('✅ Returning success response');

    return Response.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      email: subscriberData.email 
    });

  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}