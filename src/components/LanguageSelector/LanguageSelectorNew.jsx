import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const colors = {
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe',
  midnight: '#0a1628'
};

const languages = [
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'id', name: 'Indonesia', short: 'ID', flag: '🇮🇩' },
  { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' }
];

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
        style={{
          backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: colors.frost
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe Icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: colors.auroraBlue }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>

        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.short}</span>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 py-2 rounded-xl shadow-2xl overflow-hidden z-50"
          style={{
            background: 'linear-gradient(180deg, rgba(15, 15, 40, 0.98) 0%, rgba(10, 10, 30, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            minWidth: '160px',
            animation: 'fadeInDown 0.2s ease-out'
          }}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 hover:bg-white/10"
              style={{
                color: i18n.language === lang.code ? colors.auroraCyan : colors.frost,
                background: i18n.language === lang.code ? 'rgba(79, 172, 254, 0.15)' : 'transparent'
              }}
              role="option"
              aria-selected={i18n.language === lang.code}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {i18n.language === lang.code && (
                <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.auroraCyan }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default LanguageSelector;
