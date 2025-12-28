import { useTranslation } from 'react-i18next';

// Style constants
const colors = {
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe',
  evergreenLight: '#2d8a6e'
};

// Adventure-style icons as SVG components
const IconCalendar = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconOrganizer = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const activities = [
  { key: 'skiing', icon: '🌌' },
  { key: 'hiking', icon: '🏕️' },
  { key: 'bonfire', icon: '🔥' },
  { key: 'workshops', icon: '📸' },
  { key: 'photography', icon: '🇮🇩' },
  { key: 'games', icon: '🗺️' }
];

function EventDetails() {
  const { t } = useTranslation();

  return (
    <section className="relative mb-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 
          className="font-adventure text-4xl md:text-5xl tracking-wider mb-2"
          style={{ color: colors.frost }}
        >
          {t('eventDetails')}
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div 
            className="h-px w-16" 
            style={{ background: `linear-gradient(to right, transparent, ${colors.auroraCyan})` }}
          />
          <span style={{ color: colors.auroraCyan }} className="text-2xl">🌌</span>
          <div 
            className="h-px w-16" 
            style={{ background: `linear-gradient(to left, transparent, ${colors.auroraCyan})` }}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Date & Time Card */}
        <div className="glass rounded-2xl p-6 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform"
              style={{ 
                background: `linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))`,
                color: colors.auroraCyan
              }}
            >
              <IconCalendar />
            </div>
            <div>
              <h3 
                className="font-adventure text-xl tracking-wide mb-1"
                style={{ color: colors.auroraBlue }}
              >
                {t('dateTime')}
              </h3>
              <p style={{ color: colors.frost }} className="text-lg">{t('dateTimeValue')}</p>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="glass rounded-2xl p-6 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform"
              style={{ 
                background: `linear-gradient(135deg, rgba(26, 95, 74, 0.2), rgba(45, 138, 110, 0.2))`,
                color: colors.evergreenLight
              }}
            >
              <IconLocation />
            </div>
            <div>
              <h3 
                className="font-adventure text-xl tracking-wide mb-1"
                style={{ color: colors.evergreenLight }}
              >
                {t('location')}
              </h3>
              <p style={{ color: colors.frost }} className="text-lg">{t('locationValue')}</p>
            </div>
          </div>
        </div>

        {/* Organizer Card */}
        <div className="glass rounded-2xl p-6 group hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform"
              style={{ 
                background: `linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.2))`,
                color: '#ef4444'
              }}
            >
              <IconOrganizer />
            </div>
            <div>
              <h3 
                className="font-adventure text-xl tracking-wide mb-1"
                style={{ color: '#ef4444' }}
              >
                {t('organizer') || 'Organizer'}
              </h3>
              <p style={{ color: colors.frost }} className="text-lg">{t('organizerValue') || 'PERMIRA Saint Petersburg'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Overview */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🗻</span>
          <h3 
            className="font-adventure text-2xl tracking-wide"
            style={{ color: colors.frost }}
          >
            {t('eventOverview')}
          </h3>
        </div>
        
        <p style={{ color: colors.frostDark }} className="text-lg leading-relaxed mb-6">
          {t('eventDescription')}
        </p>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div
              key={activity.key}
              className="activity-item flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                {activity.icon}
              </span>
              <span style={{ color: colors.frostDark }}>
                {t(`activities.${activity.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventDetails;
