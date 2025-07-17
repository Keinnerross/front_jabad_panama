import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendContactNotification } from '../../../services/emailService.js';

export async function POST(request) {
  try {
    const { name, email, phone, city, message } = await request.json();

    // Validar campos obligatorios
    if (!name || !name.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validar longitud del mensaje
    if (message.trim().length < 10) {
      return Response.json({ error: 'Message must be at least 10 characters long' }, { status: 400 });
    }

    if (message.trim().length > 1000) {
      return Response.json({ error: 'Message must be less than 1000 characters' }, { status: 400 });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      city: city?.trim() || '',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      source: 'website_contact_form',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    // Enviar notificación al admin
    try {
      if (validateEmailConfig()) {
        const notificationEmail = await getNotificationEmail();
        
        if (notificationEmail) {
          // Enviar notificación en background
          sendContactNotification(notificationEmail, contactData)
            .then((result) => {
              if (result.success) {
                logNotification('CONTACT', notificationEmail, contactData);
              } else {
                handleNotificationError(result.error, 'contact form notification');
              }
            })
            .catch((error) => {
              handleNotificationError(error, 'contact form notification async');
            });
        }
      }
    } catch (emailError) {
      // No fallar el envío del formulario si hay error en el email
      handleNotificationError(emailError, 'contact form notification setup');
    }

    // TODO: Aquí podrías guardar el mensaje en una base de datos para gestión posterior
    
    console.log(`📞 New contact form submission from: ${name} (${email})`);

    return Response.json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contactId: `CONTACT-${Date.now()}` // ID único para tracking
    });

  } catch (err) {
    console.error('Contact form submission error:', err);
    return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}