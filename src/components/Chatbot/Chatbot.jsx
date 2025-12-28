import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WINTER_CAMP_CONTEXT = `You are a helpful assistant for Winter Camp 2025, an exciting winter adventure event. Here's what you know:

EVENT DETAILS:
- Event: Winter Camp 2025
- Dates: January 15-20, 2025
- Location: Alpine Mountain Resort, Switzerland
- Duration: 6 days

ACTIVITIES INCLUDED:
1. Professional skiing and snowboarding lessons
2. Guided mountain hiking expeditions
3. Evening bonfire gatherings with hot cocoa
4. Winter survival workshops
5. Snow photography sessions
6. Team building activities and snow games

IMPORTANT INFO:
- Registration is open and free
- Participants should register through the form on this website
- Dietary restrictions and allergies can be specified during registration
- The event welcomes international participants

Answer questions helpfully, enthusiastically, and concisely. If you don't know something specific, suggest they contact the organizers or check the registration form.`;

function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
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
        content: t('chatbotWelcome')
      }]);
    }
  }, [isOpen, t]);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${WINTER_CAMP_CONTEXT}\n\nUser question: ${inputMessage}\n\nPlease respond helpfully:`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const assistantMessage = {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.error.message || 'Failed to get response'}`
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.'
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
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl 
                   flex items-center justify-center transition-all duration-300"
        style={{
          background: isOpen 
            ? '#dc2626' 
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          animation: isOpen ? 'none' : 'pulse-glow 2s infinite'
        }}
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-3xl">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] 
                      glass rounded-2xl shadow-2xl overflow-hidden"
          style={{ animation: 'float 0.3s ease-out' }}
        >
          {/* Header */}
          <div 
            className="p-4"
            style={{ background: 'linear-gradient(90deg, #4facfe, #00f2fe)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <span className="text-xl">🏔️</span>
              </div>
              <div>
                <h3 className="font-adventure text-lg text-white tracking-wide">{t('chatbot')}</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Powered by Gemini AI</p>
              </div>
            </div>
          </div>

          {/* API Key Input or Chat */}
          {!isApiKeySet ? (
            <div className="p-6 space-y-4">
              <div className="text-center">
                <span className="text-4xl">🔑</span>
                <p style={{ color: '#e8f4fc' }} className="mt-2 text-sm">{t('apiKeyInfo')}</p>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('apiKeyPlaceholder')}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e8f4fc'
                }}
              />
              <button
                onClick={handleSetApiKey}
                disabled={!apiKey.trim()}
                className="w-full btn-adventure py-3 rounded-xl font-semibold text-white
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chatting
              </button>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm hover:underline"
                style={{ color: '#00f2fe' }}
              >
                Get API Key from Google AI Studio →
              </a>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={
                        message.role === 'user'
                          ? {
                              background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                              color: 'white',
                              borderBottomRightRadius: '0.375rem'
                            }
                          : {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#e8f4fc',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderBottomLeftRadius: '0.375rem'
                            }
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div 
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderBottomLeftRadius: '0.375rem'
                      }}
                    >
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#00f2fe', animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#00f2fe', animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#00f2fe', animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#e8f4fc'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-3 rounded-xl text-white font-medium 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:shadow-lg transition-all"
                    style={{ 
                      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                      boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;
