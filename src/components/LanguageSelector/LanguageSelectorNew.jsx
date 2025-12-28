import { useTranslation } from 'react-i18next';

const colors = {
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe'
};

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

function LanguageSelector() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span 
        className="text-sm font-medium hidden sm:block"
        style={{ color: colors.frostDark }}
      >
        {t('language')}:
      </span>
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            style={
              i18n.language === lang.code 
                ? { 
                    background: `linear-gradient(90deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
                    color: 'white',
                    boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)'
                  } 
                : { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: colors.frost,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }
            }
            aria-label={`Switch to ${lang.name}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="hidden md:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;
