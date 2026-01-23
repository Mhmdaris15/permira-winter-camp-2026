import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { knowledgeBase } from './knowledgeBase';
import { CHATBOT_CONFIG, SYSTEM_PROMPT } from './chatbotConfig';

// ============================================
// HYBRID CHATBOT - AI API + Local Fallback
// ============================================

// Knowledge patterns for smart matching
const knowledgePatterns = [
  {
    keywords: ['when', 'date', 'kapan', 'tanggal', 'когда', 'дата', 'time'],
    response: `**Winter Camp 2026** will be held on **February 2-3, 2026** ❄️\n\nThe event spans 2 full days with activities starting from the afternoon on Day 1 and ending around noon on Day 3. Mark your calendars! 📅`
  },
  {
    keywords: ['where', 'location', 'dimana', 'lokasi', 'где', 'место', 'address', 'alamat', 'venue'],
    response: `**Location:** Pushkin (Tsarskoye Selo), Saint Petersburg, Russia 🏰\n\nPushkin is about 24 km south of Saint Petersburg city center. It's famous for the beautiful Catherine Palace with the legendary Amber Room!\n\nWe'll stay at a cozy Russian dacha (country house) with heating, banya (sauna), and bonfire area. ❄️🔥`
  },
  {
    keywords: ['food', 'eat', 'meal', 'makan', 'makanan', 'halal', 'еда', 'питание', 'menu', 'breakfast', 'lunch', 'dinner', 'sarapan', 'makan siang', 'makan malam'],
    response: `**🍽️ ALL FOOD IS 100% HALAL! 🍽️**\n\n**Menu highlights:**\n- Day 1 Dinner: Plov (Pilaf), Sate Taichan, Shakshouka\n- Day 2 Breakfast: Vladimir Salad, Mie Goreng\n- Day 2 Lunch: Nasi Goreng\n- Day 2 Dinner: Pecel Ayam, Burger\n- Day 3 Breakfast: Burger with Mashed Potatoes\n\nVegetarian options available! Please mention any allergies in your registration. 🥗`
  },
  {
    keywords: ['register', 'sign up', 'join', 'daftar', 'gabung', 'регистрация', 'how to', 'cara'],
    response: `**How to Register:** 📝\n\n1. Fill out the registration form on our website\n2. Indonesian citizens must upload KBRI proof (Lapor Diri)\n3. Wait for confirmation from the organizers\n\nBoth Indonesian and Russian students are welcome to join!\n\nQuestions? Contact us via Telegram: **@irazkisra** 📱`
  },
  {
    keywords: ['cost', 'price', 'fee', 'biaya', 'harga', 'bayar', 'цена', 'стоимость', 'money', 'budget'],
    response: `**Registration covers:**\n- Transportation (bus from city center)\n- Accommodation (dacha rental)\n- All meals (100% Halal)\n- Activities and games\n- Emergency fund\n\nFor specific pricing, please contact the organizers via Telegram: **@irazkisra** 💰`
  },
  {
    keywords: ['transport', 'bus', 'how to get', 'meeting point', 'kumpul', 'транспорт', 'автобус'],
    response: `**Transportation:** 🚌\n\nBus transportation is provided from Saint Petersburg city center to Pushkin.\n\n- **Meeting Point:** Will be announced closer to the event (nearest metro station)\n- **Vehicles:** Mercedes Sprinter VIP (19 seats) or Bus (45 seats)\n- **Arrival Time:** Please be on time! Latecomers will need to arrange their own transport.\n\nVolunteers with PERMIRA flags will greet you at the meeting point! 🇮🇩🇷🇺`
  },
  {
    keywords: ['schedule', 'rundown', 'jadwal', 'acara', 'agenda', 'расписание', 'program', 'activity', 'activities', 'kegiatan'],
    response: `**📅 Event Schedule Highlights:**\n\n**Day 1 (Feb 2):**\n- 14:00 - Meeting at metro station\n- 16:15 - Opening ceremony\n- 16:45 - Talk show & discussion\n- 19:00 - Dinner\n- 20:30 - Team building games\n\n**Day 2 (Feb 3):**\n- 08:00 - Breakfast\n- 10:30 - Museum visit & quest game\n- 15:30 - Lunch\n- 20:00 - Cultural performances\n\n**Day 3:**\n- 09:00 - Outdoor team games\n- 11:30 - Awards & departure\n\nFull schedule on the website! 🎭`
  },
  {
    keywords: ['bring', 'pack', 'bawa', 'что брать', 'prepare', 'packing', 'essentials'],
    response: `**What to Bring:** 🎒\n\n**Essential:**\n- Warm winter clothes (coat, gloves, hat, scarf)\n- Comfortable indoor clothes\n- Personal toiletries\n- Reusable utensils (eco-friendly policy! 🌱)\n- Camera for memories 📸\n- Positive attitude! 😊\n\n**Optional:**\n- Swimsuit (if you want to try banya/sauna)\n- Musical instruments for performances\n- Traditional items for cultural exchange`
  },
  {
    keywords: ['who', 'organizer', 'siapa', 'permira', 'организатор', 'contact', 'telegram', 'hubungi', 'kontak'],
    response: `**Organized by:** PERMIRA Saint Petersburg 🇮🇩🇷🇺\n\n(Persatuan Mahasiswa Indonesia di Rusia - Indonesian Student Association in Russia)\n\n**Contact:**\n- Telegram: **@irazkisra**\n- Chair: Fikria Shaleha\n\nWe're excited to welcome Indonesian and Russian students for this amazing cultural exchange! ❄️`
  },
  {
    keywords: ['volunteer', 'help', 'relawan', 'panitia', 'волонтёр', 'assist'],
    response: `**Volunteer Opportunities:** 🙋\n\nWe need help with:\n- Food & menu coordination\n- Event hosting (MC)\n- Social media & posters\n- Documentation & photography\n- Participant coordination\n\nInterested? Indicate it in your registration form! Volunteers get special benefits and recognition. ⭐`
  },
  {
    keywords: ['game', 'play', 'permainan', 'игра', 'fun', 'outdoor', 'indoor', 'snow', 'salju'],
    response: `**Games & Activities:** 🎮\n\n**Indoor Games:**\n- Find Animal Voice\n- Shadow Boxing\n- The Counting Game\n- Interactive quizzes\n\n**Outdoor (weather permitting):**\n- Snowman competition ⛄\n- Gobak Sodor\n- Tug of war\n- Volleyball\n\n**Special:**\n- Museum quest game with prizes!\n- Cultural performances\n- Bonfire gathering 🔥`
  },
  {
    keywords: ['eco', 'environment', 'plastic', 'lingkungan', 'экология', 'green', 'utensils'],
    response: `**🌱 Eco-Friendly Policy:**\n\nWe care about the environment!\n\n- **No plastic utensils provided** - bring your own reusable ones!\n- Strict portion control to reduce food waste\n- Waste sorting (please separate your trash)\n- QR codes instead of paper materials\n- Help keep the dacha and nature clean! 🌍`
  },
  {
    keywords: ['palace', 'museum', 'catherine', 'peterhof', 'hermitage', 'istana', 'музей', 'дворец', 'tourist', 'sight'],
    response: `**Nearby Attractions:** 🏛️\n\n**Must-see places near Pushkin:**\n- **Catherine Palace** - Home of the famous Amber Room! 💛\n- **Alexander Palace**\n- **Peterhof Grand Palace** - "Russian Versailles"\n- **Hermitage Museum** branches\n\nWe'll have an educational quest game at a museum! Perfect for photos and learning Russian history. 📸`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'halo', 'hai', 'привет', 'здравствуйте', 'help', 'start'],
    response: `**Hello!** 👋 Welcome to Winter Camp 2026!\n\nI'm here to help you with information about:\n- 📅 Event dates & schedule\n- 📍 Location & transportation\n- 🍽️ Food (100% Halal!)\n- 📝 Registration\n- 🎮 Activities & games\n- And more!\n\nWhat would you like to know? ❄️🏔️`
  },
  {
    keywords: ['thank', 'thanks', 'terima kasih', 'makasih', 'спасибо', 'great', 'awesome', 'good'],
    response: `You're welcome! 😊\n\nIf you have more questions, feel free to ask anytime!\n\nHope to see you at Winter Camp 2026! ❄️🎉\n\nDon't forget to register and follow us for updates!`
  },
  {
    keywords: ['developer', 'made', 'built', 'created', 'pembuat', 'website', 'who made', 'разработчик'],
    response: `This website was developed by **Muhammad Aris Septanugroho** 👨‍💻\n\nConnect with him on LinkedIn:\nhttps://www.linkedin.com/in/muhammad-aris-septanugroho/\n\nThe chatbot uses a local AI system to answer your questions about Winter Camp 2026! 🤖`
  },
  {
    keywords: ['kbri', 'lapor diri', 'indonesian', 'wni', 'citizen', 'warga negara', 'passport'],
    response: `**For Indonesian Citizens:** 🇮🇩\n\nYou need to provide **KBRI proof (Lapor Diri)** during registration.\n\nThis is a requirement from the Indonesian Embassy for Indonesian citizens living abroad.\n\nIf you haven't registered with KBRI yet, please do so first before registering for Winter Camp.`
  },
  {
    keywords: ['russian', 'россия', 'russia', 'rusia', 'student', 'mahasiswa', 'студент'],
    response: `**Who Can Join?** 🇮🇩🇷🇺\n\n- Indonesian students studying in Russia\n- Russian students interested in cultural exchange\n- Both nationalities welcome!\n\nThis is a great opportunity for Indonesian-Russian friendship and cultural exchange! 🤝`
  },
  {
    keywords: ['perform', 'performance', 'sing', 'dance', 'music', 'tampil', 'penampilan', 'выступление', 'nyanyi', 'tari'],
    response: `**Want to Perform?** 🎭\n\nWe welcome performances at our Cultural Night!\n\n- Singing 🎤\n- Dancing 💃\n- Poetry 📜\n- Music 🎸\n- Traditional performances\n\nIndicate your interest in the registration form. Share your talent and represent your culture! 🌟`
  },
  {
    keywords: ['banya', 'sauna', 'bath', 'mandi', 'баня'],
    response: `**Russian Banya (Sauna):** 🧖\n\nOur dacha has a traditional Russian banya available!\n\nIt's a unique Russian experience - hot steam room with birch branches for a traditional bathing ritual.\n\nBring a swimsuit if you'd like to try it! Towels recommended. 🔥`
  }
];

// Smart response generator
const generateLocalResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Find best matching pattern
  let bestMatch = null;
  let bestScore = 0;
  
  for (const pattern of knowledgePatterns) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (message.includes(keyword.toLowerCase())) {
        score += 1;
        // Bonus for exact word match
        if (new RegExp(`\\b${keyword}\\b`, 'i').test(message)) {
          score += 0.5;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }
  
  // Return best match or default response
  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }
  
  // Default response for unmatched queries
  return `I'm not sure about that specific question, but I'd love to help! 🤔\n\n**Here's what I can tell you about:**\n- 📅 Event dates (February 2-3, 2026)\n- 📍 Location (Pushkin, Saint Petersburg)\n- 🍽️ Food (100% Halal!)\n- 📝 How to register\n- 🎮 Activities and games\n- 🚌 Transportation\n\nOr contact the organizers directly via Telegram: **@irazkisra** 📱`;
};

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

// Use imported knowledge base from auto-generated file
// This is generated by running: python scripts/process_excel_data.py

// AI API request function
const sendAIRequest = async (inputMessage, conversationHistory) => {
  const response = await fetch(CHATBOT_CONFIG.PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHATBOT_CONFIG.AI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT(knowledgeBase) },
        ...conversationHistory,
        { role: 'user', content: inputMessage }
      ],
      stream: false,
      max_tokens: CHATBOT_CONFIG.MAX_TOKENS,
      temperature: CHATBOT_CONFIG.TEMPERATURE
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.choices && data.choices[0]?.message?.content) {
    let content = data.choices[0].message.content;
    // Clean up any thinking tags if present
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    return content;
  } else if (data.error) {
    throw new Error(data.error.message || data.error || 'API error');
  } else {
    throw new Error('Unexpected API response');
  }
};

function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usingAI, setUsingAI] = useState(CHATBOT_CONFIG.USE_AI_API);
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (usingAI && CHATBOT_CONFIG.USE_AI_API) {
        // Try AI API mode
        try {
          const conversationHistory = messages.slice(-6).map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          
          response = await sendAIRequest(currentInput, conversationHistory);
        } catch (apiError) {
          console.error('AI API error:', apiError);
          
          // Fallback to local mode if enabled
          if (CHATBOT_CONFIG.FALLBACK_TO_LOCAL) {
            console.log('Falling back to local mode...');
            setUsingAI(false);
            response = generateLocalResponse(currentInput);
          } else {
            throw apiError;
          }
        }
      } else {
        // Local pattern matching mode
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        response = generateLocalResponse(currentInput);
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I'm having trouble right now. ${CHATBOT_CONFIG.FALLBACK_TO_LOCAL ? 'Switching to offline mode...' : 'Please try again!'} ❄️`
      }]);
      
      // Auto-switch to local mode on error
      if (CHATBOT_CONFIG.FALLBACK_TO_LOCAL) {
        setUsingAI(false);
      }
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
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: 0,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '18px',
                  color: 'white',
                  letterSpacing: '0.05em'
                }}>
                  {t('chatbot') || 'Winter Camp Assistant'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ 
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {usingAI ? '🤖 AI Mode' : '⚡ Offline Mode'}
                  </p>
                  {CHATBOT_CONFIG.SHOW_MODE_INDICATOR && (
                    <button
                      onClick={() => setUsingAI(!usingAI)}
                      style={{
                        background: usingAI ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '2px 8px',
                        fontSize: '9px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title={usingAI ? 'Switch to Offline Mode' : 'Switch to AI Mode'}
                    >
                      {usingAI ? 'AI ON' : 'AI OFF'}
                    </button>
                  )}
                </div>
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
