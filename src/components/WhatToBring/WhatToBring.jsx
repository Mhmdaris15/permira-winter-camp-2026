import { useRef, useEffect } from 'react';
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
};

const bringItems = [
  {
    id: 'clothing',
    icon: '🧥',
    titleKey: 'bringClothing',
    itemsKey: 'bringClothingItems',
    color: colors.auroraBlue,
  },
  {
    id: 'personal',
    icon: '🎒',
    titleKey: 'bringPersonal',
    itemsKey: 'bringPersonalItems',
    color: colors.auroraCyan,
  },
  {
    id: 'eco',
    icon: '♻️',
    titleKey: 'bringEco',
    itemsKey: 'bringEcoItems',
    color: colors.auroraGreen,
  },
  {
    id: 'documents',
    icon: '📄',
    titleKey: 'bringDocuments',
    itemsKey: 'bringDocumentsItems',
    color: '#f59e0b',
  },
];

function WhatToBring() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

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

      // Cards stagger animation
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 md:py-12">
      {/* Section Header */}
      <div ref={headerRef} className="text-center mb-8">
        <h2 
          className="font-adventure text-3xl md:text-4xl tracking-wider mb-2"
          style={{ color: colors.frost }}
        >
          <span className="mr-3">🎒</span>
          {t('whatToBringTitle', 'What to Bring')}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraBlue}, ${colors.auroraCyan})` }}></div>
          <span className="text-xl">❄️</span>
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraCyan}, ${colors.auroraGreen})` }}></div>
        </div>
        <p className="mt-4 text-base" style={{ color: colors.frostDark }}>
          {t('whatToBringSubtitle', 'Essential items for your winter adventure')}
        </p>
      </div>

      {/* Items Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {bringItems.map((item) => (
          <div 
            key={item.id}
            className="glass rounded-xl p-5 transition-all duration-300 hover:scale-[1.03] group"
            style={{
              border: `1px solid ${item.color}30`
            }}
          >
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: `${item.color}20`
              }}
            >
              {item.icon}
            </div>
            <h3 
              className="font-semibold text-lg mb-2"
              style={{ color: item.color }}
            >
              {t(item.titleKey)}
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: colors.frostDark }}
            >
              {t(item.itemsKey)}
            </p>
          </div>
        ))}
      </div>

      {/* Important Note */}
      <div className="mt-8 glass rounded-xl p-5 max-w-3xl mx-auto text-center" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">⚠️</span>
          <span className="font-semibold text-lg" style={{ color: '#ef4444' }}>
            {t('importantNote', 'Important Note')}
          </span>
        </div>
        <p style={{ color: colors.frostDark }}>
          {t('ecoPolicy', 'We follow an eco-friendly policy. No plastic utensils will be provided. Please bring your own reusable cutlery and water bottle!')}
        </p>
      </div>
    </section>
  );
}

export default WhatToBring;
