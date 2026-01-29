// ============================================
// CHATBOT CONFIGURATION
// ============================================
// Toggle between AI API mode and Local Pattern Matching mode
// 
// AI_MODE: true  = Use external AI API (Chutes.ai via Cloudflare Worker)
//                  - More natural conversations
//                  - Better understanding of complex questions
//                  - Requires valid API key
//                  - Depends on external service
//
// AI_MODE: false = Use local pattern matching
//                  - Works offline
//                  - Faster responses
//                  - More reliable (no API dependency)
//                  - Limited to predefined patterns
//
// ============================================

export const CHATBOT_CONFIG = {
  // Set to true to use AI API, false for local pattern matching
  USE_AI_API: true,

  // Cloudflare Worker Proxy URL (Secures your API Key)
  PROXY_URL: 'https://winter-camp-chatbot-proxy.muhammadaris1945.workers.dev',

  // AI Model to use (DeepSeek V3)
  AI_MODEL: 'deepseek-chat',

  // Max tokens for AI response
  MAX_TOKENS: 512,

  // Temperature for AI (0-1, higher = more creative)
  TEMPERATURE: 0.7,

  // Fallback to local mode if API fails
  FALLBACK_TO_LOCAL: true,

  // Show which mode is active in the UI
  SHOW_MODE_INDICATOR: true,
};

// System prompt for the AI
export const SYSTEM_PROMPT = (knowledgeBase) => `You are a friendly and helpful AI assistant for Winter Camp 2026. Your role is to answer questions about the event based on the knowledge base provided below.

INSTRUCTIONS:
1. Answer questions accurately based ONLY on the knowledge base information
2. Be enthusiastic and welcoming - this is an exciting winter adventure event in Saint Petersburg!
3. If someone asks something not covered in the knowledge base, politely say you don't have that specific information and suggest they contact the organizers via Telegram: @permiraspb
4. Keep responses concise but helpful (2-4 sentences when possible)
5. Use emojis sparingly to keep the tone friendly (❄️ 🏰 🎭 🇮🇩 🇷🇺)
6. Always encourage users to register if they seem interested
7. If asked about the developer, mention Muhammad Aris Septanugroho and his LinkedIn
8. The event is in Pushkin (near Saint Petersburg), NOT Murmansk
9. All food is 100% Halal
10. Indonesian citizens need to provide KBRI proof (Lapor Diri)

KNOWLEDGE BASE:
${knowledgeBase}

Remember: Be helpful, accurate, and enthusiastic about Winter Camp 2026!`;

export default CHATBOT_CONFIG;
