import { getNotificationEmail, validateEmailConfig, logNotification, handleNotificationError } from '../../../utils/siteConfigHelper.js';
import { sendContactNotification } from '../../../services/emailService.js';

export async function POST(request) {
  try {
    const { name, email, phone, city, message, website, _formTime } = await request.json();

    // Anti-spam: Check honeypot field (should be empty)
    if (website) {
      // Log potential spam attempt but return success to not reveal honeypot
      console.log(`🚫 Spam blocked (honeypot): attempted from IP ${request.headers.get('x-forwarded-for') || 'unknown'}`);
      return Response.json({
        success: true,
        message: 'Your message has been sent successfully.',
        contactId: `SPAM-${Date.now()}`
      });
    }

    // Anti-spam: Check if form was submitted too quickly (less than 2 seconds server-side)
    if (_formTime && _formTime < 2000) {
      console.log(`🚫 Spam blocked (too fast): ${_formTime}ms from IP ${request.headers.get('x-forwarded-for') || 'unknown'}`);
      return Response.json({ error: 'Please take your time filling out the form' }, { status: 400 });
    }

    // Anti-spam: Basic content checks for common spam patterns
    const spamPatterns = [
      /\[url=/i,
      /\[link=/i,
      /<a\s+href/i,
      /viagra|cialis|casino|lottery|winner|congratulations.*won/i,
      /click\s+here\s+to\s+(claim|win|get)/i,
      /http[s]?:\/\/[^\s]{50,}/i // Very long URLs
    ];

    const messageToCheck = `${name} ${email} ${message}`;
    for (const pattern of spamPatterns) {
      if (pattern.test(messageToCheck)) {
        console.log(`🚫 Spam blocked (content pattern): ${pattern} from IP ${request.headers.get('x-forwarded-for') || 'unknown'}`);
        return Response.json({
          success: true,
          message: 'Your message has been sent successfully.',
          contactId: `SPAM-${Date.now()}`
        });
      }
    }

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