import { validateEmailConfig, getNotificationEmail } from '../../utils/siteConfigHelper.js';
import { sendNotificationEmail } from '../../services/emailService.js';

export async function GET(request) {
  console.log('🧪 Testing email configuration...');
  
  try {
    // Test 1: Verificar variables de entorno
    console.log('1️⃣ Environment variables:');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    
    // Test 2: Validar configuración
    console.log('2️⃣ Testing validateEmailConfig()...');
    const configValid = validateEmailConfig();
    console.log('   Config valid:', configValid);
    
    // Test 3: Obtener notification email
    console.log('3️⃣ Testing getNotificationEmail()...');
    let notificationEmail;
    try {
      notificationEmail = await getNotificationEmail();
      console.log('   Notification email:', notificationEmail);
    } catch (error) {
      console.error('   Error getting notification email:', error);
      return Response.json({ 
        success: false, 
        error: 'Failed to get notification email',
        details: error.message 
      });
    }
    
    // Test 4: Enviar email de prueba
    console.log('4️⃣ Testing email send...');
    if (configValid && notificationEmail) {
      try {
        const testTemplate = `
          <h1>🧪 Email Test</h1>
          <p>This is a test email from your Chabad Boquete website.</p>
          <p>If you receive this, your email configuration is working correctly!</p>
          <p>Time: ${new Date().toISOString()}</p>
        `;
        
        const result = await sendNotificationEmail(
          notificationEmail, 
          '🧪 Email Configuration Test - Chabad Boquete', 
          testTemplate
        );
        
        console.log('   Email send result:', result);
        
        return Response.json({
          success: true,
          message: 'Email configuration test completed',
          results: {
            environmentVariables: {
              EMAIL_USER: !!process.env.EMAIL_USER,
              EMAIL_PASS: !!process.env.EMAIL_PASS
            },
            configValid,
            notificationEmail,
            emailSent: result.success,
            emailError: result.error || null
          }
        });
        
      } catch (emailError) {
        console.error('   Email send error:', emailError);
        return Response.json({
          success: false,
          error: 'Failed to send test email',
          details: emailError.message
        });
      }
    } else {
      return Response.json({
        success: false,
        error: 'Email configuration invalid',
        details: {
          configValid,
          notificationEmail
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return Response.json({
      success: false,
      error: 'Email test failed',
      details: error.message
    });
  }
}