import { useTranslation } from 'react-i18next';
import Background from './components/Background/Background';
import LanguageSelector from './components/LanguageSelector/LanguageSelectorNew';
import EventDetails from './components/EventDetails/EventDetailsNew';
import RegistrationForm from './components/RegistrationForm/RegistrationFormNew';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      <Background />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-[float_3s_ease-in-out_infinite]">�</span>
              <div>
                <h1 
                  className="font-adventure text-2xl md:text-3xl tracking-wider"
                  style={{ 
                    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {t('title')}
                </h1>
                <p className="text-xs text-frost-dark opacity-80">by PERMIRA Saint Petersburg</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-adventure text-5xl md:text-7xl lg:text-8xl text-frost tracking-wider mb-6 animate-[float_4s_ease-in-out_infinite]">
              <span className="inline-block mr-4 animate-pulse">🌌</span>
              {t('title')}
              <span className="inline-block ml-4 animate-pulse" style={{ animationDelay: '0.5s' }}>❄️</span>
            </h2>
            <p className="text-xl md:text-2xl text-frost-dark max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            
            {/* Adventure Icons */}
            <div className="flex justify-center gap-6 mt-8">
              {['🌌', '🏕️', '🔥', '📸', '🇮🇩', '❄️'].map((icon, index) => (
                <span 
                  key={index} 
                  className="text-3xl md:text-4xl opacity-80 hover:opacity-100 hover:scale-125 transition-all cursor-default"
                  style={{ animation: `float ${3 + index * 0.5}s ease-in-out infinite`, animationDelay: `${index * 0.2}s` }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <EventDetails />
          <RegistrationForm />
        </main>

        {/* Footer */}
        <footer className="glass border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <div className="flex justify-center gap-4 mb-4">
              {['�', '🏕️', '🔥', '❄️', '🇮🇩'].map((icon, index) => (
                <span 
                  key={index} 
                  className="text-2xl hover:scale-125 transition-transform cursor-default"
                >
                  {icon}
                </span>
              ))}
            </div>
            <p className="text-frost-dark text-sm">
              © 2026 Winter Camp by PERMIRA Saint Petersburg
            </p>
            <p className="text-frost-dark/60 text-xs mt-2">
              Persatuan Mahasiswa Indonesia di Rusia
            </p>
            <p className="text-frost-dark/70 text-xs mt-4">
              Developed by{' '}
              <a 
                href="https://www.linkedin.com/in/muhammad-aris-septanugroho/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-aurora hover:text-aurora-cyan transition-colors"
                style={{ color: '#4facfe' }}
              >
                Muhammad Aris Septanugroho
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
