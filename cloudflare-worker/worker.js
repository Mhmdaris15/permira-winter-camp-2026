/**
 * Cloudflare Worker - Multi-purpose API Proxy
 * 
 * Routes:
 * 1. /api/chat - Chutes.ai API proxy for chatbot
 * 2. /api/register - Google Sheets form submission + Email notification
 * 3. /api/upload - Google Drive file upload for KBRI proof
 * 
 * Deploy this to Cloudflare Workers (free tier: 100,000 requests/day)
 */

// DeepSeek API Configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// Resend Email Configuration
const RESEND_API_KEY = 're_GGE5qsJR_14U6zsjF9MgY1Cc5WjCBRHfk';
const RESEND_API_URL = 'https://api.resend.com/emails';

// Google Apps Script Configuration (for Google Sheets & Drive)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9pS8XWDLzChFibtFfyNflaOIfNojz1DupkwICnVOm-QGBREPo_rMgU79x_80Qnfs/exec';

// Allowed origins (add your domains here)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://mhmdaris15.github.io',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Check for DeepSeek API Key in environment variables
    if (!env.DEEPSEEK_API_KEY) {
      console.warn('DEEPSEEK_API_KEY secret is not set!');
    }

    // Route requests based on path
    if (path === '/api/chat' || path === '/') {
      return handleChatRequest(request, env);
    } else if (path === '/api/register') {
      return handleRegisterRequest(request);
    } else if (path === '/api/upload') {
      return handleUploadRequest(request);
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders(),
      });
    }
  },
};

// ... (CORS Headers and handleCORS remain the same) ...

// Handle DeepSeek Chat requests
async function handleChatRequest(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const apiKey = env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: Missing API Key' }), {
        status: 500,
        headers: corsHeaders(),
      });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders(),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

// Send confirmation email via Resend
async function sendConfirmationEmail(formData) {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                PERMIRA Winter Camp 2026
              </h1>
              <p style="margin: 10px 0 0; color: #a0c4e8; font-size: 16px;">
                Registration Confirmation
              </p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; color: #333; font-size: 18px;">
                Dear <strong>${formData.fullName}</strong>,
              </p>
              <p style="margin: 15px 0 0; color: #555; font-size: 15px; line-height: 1.6;">
                Thank you for registering for <strong>PERMIRA Winter Camp 2026</strong>! We are excited to have you join us for this unforgettable winter experience in Saint Petersburg.
              </p>
            </td>
          </tr>
          
          <!-- Event Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 15px; color: #0a1628; font-size: 18px;">Event Details</h2>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; width: 120px;">Dates:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">February 12-14, 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Camp:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">Центр «Молодёжный», Saint Petersburg</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Museum:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px;">Central Naval Museum</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Registration Summary -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 15px; color: #0a1628; font-size: 18px;">Your Registration Details</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${formData.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">University:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${formData.university}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Citizenship:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${formData.citizenship}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${formData.phoneNumber}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Join Group CTA -->
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 15px; color: #0a1628; font-size: 16px; font-weight: 600;">
                      Join our Telegram Group for Updates!
                    </p>
                    <a href="https://t.me/+JOsH5fKgo2I3ZTc1" style="display: inline-block; padding: 12px 30px; background-color: #0a1628; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      Join Telegram Group
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What to Bring -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 15px; color: #0a1628; font-size: 18px;">Don't Forget to Bring</h2>
              <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Warm winter clothes (coat, gloves, hat, scarf)</li>
                <li>Personal toiletries & medications</li>
                <li>Reusable utensils (eco-friendly policy!)</li>
                <li>Passport/ID & KBRI proof (Indonesian citizens)</li>
                <li>Camera for memories!</li>
              </ul>
            </td>
          </tr>
          
          <!-- Contact Info -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 15px; color: #0a1628; font-size: 18px;">Contact Us</h2>
              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.8;">
                <strong>Fikriya:</strong> +79111495385 (WA/TG)<br>
                <strong>Aris:</strong> +79810409453 (WA/TG)<br>
                <strong>Abil:</strong> +6285121080413 (WA/TG)<br>
                <strong>Telegram Channel:</strong> <a href="https://t.me/permiraspb" style="color: #4facfe;">@permiraspb</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 10px; color: #666; font-size: 12px;">
                2026 PERMIRA Saint Petersburg
              </p>
              <p style="margin: 0; color: #999; font-size: 11px;">
                Persatuan Mahasiswa Indonesia di Rusia
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PERMIRA Winter Camp <onboarding@resend.dev>',
        to: formData.email,
        subject: 'Registration Confirmed - PERMIRA Winter Camp 2026',
        html: emailHtml,
      }),
    });

    const result = await response.json();
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}

// Handle Registration Form submission to Google Sheets
async function handleRegisterRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.json();

    // Add action type for Google Apps Script routing
    const payload = {
      action: 'register',
      data: formData,
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Google Apps Script returns text, try to parse as JSON
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { success: true, message: responseText };
    }

    // Send confirmation email if registration was successful
    if (result.success !== false && formData.email) {
      await sendConfirmationEmail(formData);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

// Handle File Upload to Google Drive
async function handleUploadRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName') || 'kbri-proof';
    const registrantName = formData.get('registrantName') || 'unknown';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    // Convert file to base64 for Google Apps Script
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const payload = {
      action: 'upload',
      fileName: `${registrantName}_${fileName}_${Date.now()}`,
      mimeType: file.type,
      base64Data: base64Data,
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { success: true, fileUrl: responseText };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}
