import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Style constants
const colors = {
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe',
  auroraGreen: '#43e97b',
  aurroraPurple: '#a855f7',
};

// Schedule data extracted from Excel
const scheduleData = {
  day1: {
    dateKey: 'rundown.day1.date',
    titleKey: 'rundown.day1.title',
    events: [
      { time: '14:00-14:15', titleKey: 'rundown.day1.gathering', icon: '📍', highlight: true },
      { time: '14:15-16:15', titleKey: 'rundown.day1.arrival', icon: '🚌' },
      { time: '16:15-16:45', titleKey: 'rundown.day1.opening', icon: '🎤' },
      { time: '16:45-18:15', titleKey: 'rundown.day1.talkshow', icon: '💬' },
      { time: '18:15-18:45', titleKey: 'rundown.day1.sharing', icon: '🗣️' },
      { time: '18:45-19:00', titleKey: 'rundown.day1.photo', icon: '📸' },
      { time: '19:00-20:30', titleKey: 'rundown.day1.dinner', icon: '🍽️', meal: 'Plov' },
      { time: '20:30-22:00', titleKey: 'rundown.day1.teambuilding', icon: '🤝' },
      { time: '22:00-23:00', titleKey: 'rundown.day1.freetime', icon: '🌙' },
      { time: '23:00', titleKey: 'rundown.day1.rest', icon: '😴' },
    ]
  },
  day2: {
    dateKey: 'rundown.day2.date',
    titleKey: 'rundown.day2.title',
    events: [
      { time: '08:00-09:00', titleKey: 'rundown.day2.breakfast', icon: '🍳', meal: 'Mie Goreng' },
      { time: '09:30-10:30', titleKey: 'rundown.day2.tomuseum', icon: '🚌' },
      { time: '10:30-11:10', titleKey: 'rundown.day2.ceremony', icon: '🎖️', highlight: true },
      { time: '11:15-14:00', titleKey: 'rundown.day2.museumquest', icon: '🏛️', highlight: true },
      { time: '14:00-14:30', titleKey: 'rundown.day2.winners', icon: '🏆' },
      { time: '14:30-15:30', titleKey: 'rundown.day2.returncamp', icon: '🚌' },
      { time: '15:30-17:00', titleKey: 'rundown.day2.lunch', icon: '🍽️', meal: 'Nasi Goreng' },
      { time: '17:00-18:30', titleKey: 'rundown.day2.preparation', icon: '🎭' },
      { time: '18:30-20:00', titleKey: 'rundown.day2.dinner', icon: '🍽️', meal: 'Pecel Ayam' },
      { time: '20:00-21:00', titleKey: 'rundown.day2.cultural', icon: '🎭', highlight: true },
      { time: '21:00-22:00', titleKey: 'rundown.day2.reflection', icon: '🕯️' },
      { time: '22:00-23:00', titleKey: 'rundown.day2.freetime', icon: '🌙' },
      { time: '23:00', titleKey: 'rundown.day2.rest', icon: '😴' },
    ]
  },
  day3: {
    dateKey: 'rundown.day3.date',
    titleKey: 'rundown.day3.title',
    events: [
      { time: '07:00-09:00', titleKey: 'rundown.day3.breakfast', icon: '🍳', meal: 'Burger & Mashed Potatoes' },
      { time: '09:00-10:30', titleKey: 'rundown.day3.outdoor', icon: '⛷️', highlight: true },
      { time: '10:30-11:30', titleKey: 'rundown.day3.awards', icon: '🏆', highlight: true },
      { time: '11:30-12:00', titleKey: 'rundown.day3.departure', icon: '👋' },
    ]
  }
};

function Rundown() {
  const { t, i18n } = useTranslation();
  const [activeDay, setActiveDay] = useState('day1');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate timeline when day changes
  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.children;
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }
  }, [activeDay]);

  const currentLang = i18n.language;
  const dayData = scheduleData[activeDay];

  return (
    <section ref={sectionRef} className="py-8 md:py-12">
      {/* Section Header */}
      <div ref={headerRef} className="text-center mb-8">
        <h2 
          className="font-adventure text-3xl md:text-4xl tracking-wider mb-2"
          style={{ color: colors.frost }}
        >
          <span className="mr-3">📋</span>
          {t('rundownTitle', 'Event Schedule')}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraBlue}, ${colors.auroraCyan})` }}></div>
          <span className="text-xl">⏰</span>
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraCyan}, ${colors.auroraGreen})` }}></div>
        </div>
        <p className="mt-4 text-base" style={{ color: colors.frostDark }}>
          {t('rundownSubtitle', 'February 2-3, 2026 • Pushkin, Saint Petersburg')}
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap px-4">
        {Object.entries(scheduleData).map(([key, day]) => (
          <button
            key={key}
            onClick={() => setActiveDay(key)}
            className={`px-4 md:px-6 py-3 rounded-xl transition-all duration-300 ${
              activeDay === key ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              background: activeDay === key 
                ? `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`
                : 'rgba(255, 255, 255, 0.1)',
              color: activeDay === key ? '#0a1628' : colors.frost,
              fontWeight: activeDay === key ? '600' : '400',
              border: activeDay === key ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="text-sm opacity-80">{t(day.dateKey)}</div>
            <div className="text-base md:text-lg">{t(day.titleKey)}</div>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="glass rounded-2xl p-4 md:p-8 max-w-4xl mx-auto">
        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5"
            style={{ 
              background: `linear-gradient(to bottom, ${colors.auroraBlue}, ${colors.auroraCyan}, ${colors.auroraGreen})`
            }}
          />

          {/* Events */}
          {dayData.events.map((event, index) => (
            <div 
              key={index}
              className="relative flex items-start gap-4 md:gap-6 mb-4 last:mb-0"
            >
              {/* Timeline dot */}
              <div 
                className="relative z-10 flex-shrink-0 w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl"
                style={{
                  background: event.highlight 
                    ? `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`
                    : 'rgba(255, 255, 255, 0.1)',
                  border: event.highlight ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: event.highlight ? `0 0 20px rgba(79, 172, 254, 0.4)` : 'none'
                }}
              >
                {event.icon}
              </div>

              {/* Event content */}
              <div 
                className={`flex-grow p-3 md:p-4 rounded-xl transition-all ${
                  event.highlight ? 'hover:scale-[1.02]' : ''
                }`}
                style={{
                  backgroundColor: event.highlight 
                    ? 'rgba(79, 172, 254, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: event.highlight 
                    ? `1px solid ${colors.auroraBlue}40`
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span 
                    className="text-sm md:text-base font-mono px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: colors.auroraCyan
                    }}
                  >
                    {event.time}
                  </span>
                  {event.meal && (
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(67, 233, 123, 0.2)',
                        color: colors.auroraGreen
                      }}
                    >
                      🍽️ {event.meal}
                    </span>
                  )}
                </div>
                <p 
                  className="text-sm md:text-base"
                  style={{ color: event.highlight ? colors.frost : colors.frostDark }}
                >
                  {t(event.titleKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
        <div className="glass rounded-xl p-4 text-center">
          <span className="text-3xl">🍽️</span>
          <h4 className="font-semibold mt-2" style={{ color: colors.frost }}>
            {t('rundownAllHalal', 'All Food 100% Halal')}
          </h4>
          <p className="text-sm mt-1" style={{ color: colors.frostDark }}>
            {t('rundownHalalDesc', 'Indonesian & Russian dishes')}
          </p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <span className="text-3xl">🏛️</span>
          <h4 className="font-semibold mt-2" style={{ color: colors.frost }}>
            {t('rundownMuseum', 'Museum Quest')}
          </h4>
          <p className="text-sm mt-1" style={{ color: colors.frostDark }}>
            {t('rundownMuseumDesc', 'Educational game at palace')}
          </p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <span className="text-3xl">🎭</span>
          <h4 className="font-semibold mt-2" style={{ color: colors.frost }}>
            {t('rundownCultural', 'Cultural Night')}
          </h4>
          <p className="text-sm mt-1" style={{ color: colors.frostDark }}>
            {t('rundownCulturalDesc', 'Performances & exchange')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Rundown;
