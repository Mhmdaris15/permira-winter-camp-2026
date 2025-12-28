/**
 * Cloudflare Worker - Chutes.ai API Proxy
 * This worker proxies requests to Chutes.ai API to bypass CORS restrictions
 * 
 * Deploy this to Cloudflare Workers (free tier: 100,000 requests/day)
 */

const CHUTES_API_URL = 'https://llm.chutes.ai/v1/chat/completions';
const CHUTES_API_KEY = 'cpk_2d6fffb89cee42898c51bb1fa2008eab.9fc77daccdea5b69b631c41d6f6cf3a8.E1nxscbWCtwYS7nv2hr5ZVB5TPtF52vX';

// Allowed origins (add your domains here)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mhmdaris15.github.io', // Replace with your GitHub Pages URL
];

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get the request body
      const body = await request.json();

      // Forward to Chutes.ai
      const response = await fetch(CHUTES_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHUTES_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Return response with CORS headers
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

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
