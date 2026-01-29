# Cloudflare Worker - Chutes.ai Proxy

This Cloudflare Worker acts as a proxy to bypass CORS restrictions when calling the Chutes.ai API from the browser.

## Quick Setup (5 minutes)

### Step 1: Create Cloudflare Account
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/sign-up)
2. Sign up for a free account

### Step 2: Deploy via Dashboard (Easiest)
1. Go to [Cloudflare Workers](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. Click **"Create"** → **"Create Worker"**
3. Give it a name like `winter-camp-chatbot-proxy`
4. Delete the default code
5. Copy and paste the contents of `worker.js`
6. Click **"Deploy"**
7. Copy your Worker URL (looks like: `https://winter-camp-chatbot-proxy.muhammadaris1945.workers.dev`)

### Step 3: Update Your App
Update the `PROXY_URL` in `src/components/Chatbot/Chatbot.jsx`:
```javascript
const PROXY_URL = 'https://winter-camp-chatbot-proxy.muhammadaris1945.workers.dev';
```

## Alternative: Deploy via CLI

### Install Wrangler
```bash
npm install -g wrangler
```

### Login to Cloudflare
```bash
wrangler login
```

### Deploy
```bash
cd cloudflare-worker
wrangler deploy
```

## Free Tier Limits
- 100,000 requests per day
- 10ms CPU time per request
- More than enough for a chatbot!

## Security Notes
- The API key is stored in the worker (server-side), not exposed to browsers
- Consider adding rate limiting for production
- You can restrict origins in the `ALLOWED_ORIGINS` array
