import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Simple markdown formatter for chat messages
const formatMessage = (text) => {
  if (!text) return '';
  
  // Split into lines for processing
  let lines = text.split('\n');
  let result = [];
  let inList = false;
  
  lines.forEach((line, index) => {
    // Handle bullet points (- or •)
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const content = line.trim().substring(2);
      result.push(
        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '8px', marginBottom: '4px' }}>
          <span style={{ marginRight: '8px', color: '#00f2fe' }}>•</span>
          <span>{formatInlineMarkdown(content)}</span>
        </div>
      );
      inList = true;
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s(.*)$/);
      if (match) {
        result.push(
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '8px', marginBottom: '4px' }}>
            <span style={{ marginRight: '8px', color: '#00f2fe', minWidth: '20px' }}>{match[1]}.</span>
            <span>{formatInlineMarkdown(match[2])}</span>
          </div>
        );
      }
      inList = true;
    }
    // Handle headers (## or ###)
    else if (line.trim().startsWith('## ')) {
      result.push(
        <div key={index} style={{ fontWeight: 'bold', marginTop: '8px', marginBottom: '4px', color: '#00f2fe' }}>
          {formatInlineMarkdown(line.trim().substring(3))}
        </div>
      );
      inList = false;
    }
    // Empty lines
    else if (line.trim() === '') {
      if (!inList) {
        result.push(<div key={index} style={{ height: '8px' }} />);
      }
      inList = false;
    }
    // Regular text
    else {
      result.push(
        <div key={index} style={{ marginBottom: '4px' }}>
          {formatInlineMarkdown(line)}
        </div>
      );
      inList = false;
    }
  });
  
  return result;
};

// Format inline markdown (bold, italic, links)
const formatInlineMarkdown = (text) => {
  if (!text) return text;
  
  const parts = [];
  let remaining = text;
  let key = 0;
  
  // Process text for **bold** and *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
    }
    
    // Add formatted text
    if (match[2]) {
      // Bold **text**
      parts.push(<strong key={key++} style={{ fontWeight: 'bold', color: '#fff' }}>{match[2]}</strong>);
    } else if (match[3]) {
      // Italic *text*
      parts.push(<em key={key++} style={{ fontStyle: 'italic' }}>{match[3]}</em>);
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : text;
};

// RAG Knowledge Base Context
const KNOWLEDGE_BASE = `
# Winter Camp 2026 Knowledge Base

## EVENT OVERVIEW
Winter Camp 2026 is an exciting winter adventure event organized by PERMIRA (Persatuan Mahasiswa Indonesia di Rusia) Saint Petersburg. This is a unique opportunity to experience the magical Northern Lights (Aurora Borealis) in Murmansk, Russia!

## EVENT DETAILS
- Event Name: Winter Camp 2026
- Organizer: PERMIRA Saint Petersburg (Persatuan Mahasiswa Indonesia di Rusia)
- Dates: February 2-3, 2026
- Location: Murmansk, Russia
- Duration: 2 days / 1 night
- Registration Fee: Contact organizers for details
- Target Audience: Indonesian students in Russia and international participants

## ABOUT MURMANSK
- Murmansk is the largest city north of the Arctic Circle
- Famous for Aurora Borealis (Northern Lights) viewing
- Located in the Kola Peninsula, Russia
- Winter temperatures can reach -20°C to -30°C
- One of the best places in the world to see the Northern Lights

## ACTIVITIES INCLUDED

### Day 1 - Arrival & Aurora Hunting
- Arrival in Murmansk
- Check-in and orientation
- Camping setup
- Dinner and bonfire
- Aurora Borealis viewing (Northern Lights hunting)
- Photography sessions

### Day 2 - Exploration & Departure
- Breakfast at camp
- Local exploration activities
- Group photos
- Farewell and departure

## HIGHLIGHTS
- **Aurora Borealis Viewing** - Witness the magical Northern Lights dancing across the Arctic sky
- **Arctic Camping Experience** - Camp under the stars in the Arctic Circle
- **Photography Opportunities** - Capture stunning photos of the aurora
- **Cultural Exchange** - Meet Indonesian students from across Russia
- **Bonfire & Community** - Enjoy warm drinks and food around the campfire

## WHAT TO BRING
- **Essential Cold Weather Gear:**
  - Thermal underwear (base layer)
  - Fleece or wool mid-layer
  - Waterproof and windproof outer jacket
  - Insulated winter pants
  - Warm winter boots (rated for -30°C)
  - Thick wool socks (multiple pairs)
  - Warm hat covering ears
  - Balaclava or face mask
  - Insulated gloves/mittens
  - Hand and toe warmers (recommended)
- **Other Essentials:**
  - Camera with fully charged batteries
  - Extra camera batteries (cold drains them fast!)
  - Tripod for aurora photography
  - Power bank
  - Personal medications
  - Snacks and hot drinks thermos
  - Sleeping bag rated for extreme cold
  - Valid documents (passport, visa)

## WEATHER CONDITIONS
- Temperature: -15°C to -30°C (very cold!)
- Dress in multiple layers
- Polar night conditions (limited daylight)
- Best aurora viewing is during clear, dark nights

## REGISTRATION PROCESS
1. Fill out the online registration form on this website
2. Provide accurate personal information
3. Specify any dietary restrictions or health conditions
4. Accept terms and conditions
5. Submit your application
6. Wait for confirmation from PERMIRA organizers

## FREQUENTLY ASKED QUESTIONS

Q: When can we see the Aurora?
A: The Northern Lights are best viewed between 9 PM and 2 AM on clear nights. February is an excellent month for aurora viewing in Murmansk.

Q: How cold will it be?
A: Expect temperatures between -15°C to -30°C. Proper winter gear is absolutely essential!

Q: Do I need special equipment for aurora photography?
A: A camera with manual settings and a tripod are recommended. Smartphones can capture aurora too, but dedicated cameras work better.

Q: What if the aurora doesn't appear?
A: Aurora sightings depend on solar activity and weather. Even without aurora, the Arctic camping experience is unforgettable!

Q: Is this event only for Indonesian students?
A: The event is organized by PERMIRA for Indonesian students in Russia, but international participants may be welcome. Contact organizers for details.

Q: What language is used?
A: Indonesian and English are the main languages. Russian may also be used.

Q: How do I get to Murmansk?
A: You can travel by train or plane from Saint Petersburg or Moscow. The organizers will provide travel information.

## CONTACT & ORGANIZER
- Organizer: PERMIRA Saint Petersburg
- PERMIRA: Persatuan Mahasiswa Indonesia di Rusia (Indonesian Students Association in Russia)
- For inquiries, contact PERMIRA Saint Petersburg through their official channels

## DEVELOPER INFORMATION
This web application was developed by Muhammad Aris Septanugroho.
LinkedIn: https://www.linkedin.com/in/muhammad-aris-septanugroho/
`;

// System prompt for the AI
const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for Winter Camp 2026. Your role is to answer questions about the event based on the knowledge base provided below.

INSTRUCTIONS:
1. Answer questions accurately based ONLY on the knowledge base information
2. Be enthusiastic and welcoming - this is an exciting winter adventure event!
3. If someone asks something not covered in the knowledge base, politely say you don't have that specific information and suggest they contact the organizers or check the registration form
4. Keep responses concise but helpful (2-4 sentences when possible)
5. Use emojis sparingly to keep the tone friendly (❄️ 🏔️ ⛷️ 🎿)
6. Always encourage users to register if they seem interested
7. If asked about the developer, mention Muhammad Aris Septanugroho and his LinkedIn

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}

Remember: Be helpful, accurate, and enthusiastic about Winter Camp 2026!`;

// Cloudflare Worker Proxy URL
// Deploy the worker from /cloudflare-worker folder, then replace this URL
const PROXY_URL = 'https://winter-camp-chatbot.muhammadaris1945.workers.dev';

function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t('chatbotWelcome') || "Hi! 👋 Welcome to Winter Camp 2026! I'm your AI assistant. Ask me anything about the event - activities, registration, accommodation, or any other questions you might have! ❄️🏔️"
      }]);
    }
  }, [isOpen, t]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen3-32B',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: inputMessage }
          ],
          stream: false,
          max_tokens: 512,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        let content = data.choices[0].message.content;
        // Clean up any thinking tags if present
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        const assistantMessage = {
          role: 'assistant',
          content: content
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${data.error.message || 'Please try again.'}`
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm sorry, I couldn't process that request. Please try again! ❄️"
        }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🏔️"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Fixed position with high z-index */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79, 172, 254, 0.5)',
          background: isOpen 
            ? '#dc2626' 
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          animation: isOpen ? 'none' : 'pulse-glow 2s infinite',
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span style={{ fontSize: '28px' }}>💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            backgroundColor: 'rgba(10, 22, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div 
            style={{ 
              padding: '16px',
              background: 'linear-gradient(90deg, #4facfe, #00f2fe)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '20px' }}>🏔️</span>
              </div>
              <div>
                <h3 style={{ 
                  margin: 0,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '18px',
                  color: 'white',
                  letterSpacing: '0.05em'
                }}>
                  {t('chatbot') || 'Winter Camp Assistant'}
                </h3>
                <p style={{ 
                  margin: 0,
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  Powered by Qwen AI • RAG System
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            style={{
              height: '320px',
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    ...(message.role === 'user'
                      ? {
                          background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                          color: 'white',
                          borderBottomRightRadius: '4px'
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#e8f4fc',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderBottomLeftRadius: '4px'
                        }
                    )
                  }}
                >
                  {message.role === 'user' ? message.content : formatMessage(message.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderBottomLeftRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#00f2fe',
                      animation: 'bounce 1s infinite'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#00f2fe',
                      animation: 'bounce 1s infinite 0.15s'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#00f2fe',
                      animation: 'bounce 1s infinite 0.3s'
                    }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ 
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatPlaceholder') || "Ask about Winter Camp..."}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#e8f4fc',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  color: 'white',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  opacity: inputMessage.trim() && !isLoading ? 1 : 0.5,
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide up animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default Chatbot;
