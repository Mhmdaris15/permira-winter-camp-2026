/**
 * Cloudflare Worker - Multi-purpose API Proxy
 * 
 * Routes:
 * 1. /api/chat - Chutes.ai API proxy for chatbot
 * 2. /api/register - Google Sheets form submission
 * 3. /api/upload - Google Drive file upload for KBRI proof
 * 
 * Deploy this to Cloudflare Workers (free tier: 100,000 requests/day)
 */

// Chutes.ai Configuration
const CHUTES_API_URL = 'https://llm.chutes.ai/v1/chat/completions';
const CHUTES_API_KEY = 'cpk_2d6fffb89cee42898c51bb1fa2008eab.9fc77daccdea5b69b631c41d6f6cf3a8.E1nxscbWCtwYS7nv2hr5ZVB5TPtF52vX';

// Google Apps Script Configuration (for Google Sheets & Drive)
// Deploy a Google Apps Script with doPost function and get the URL
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

    // Route requests based on path
    if (path === '/api/chat' || path === '/') {
      return handleChatRequest(request);
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

// CORS Headers
function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function handleCORS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle Chutes.ai Chat requests
async function handleChatRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();

    const response = await fetch(CHUTES_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHUTES_API_KEY}`,
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
