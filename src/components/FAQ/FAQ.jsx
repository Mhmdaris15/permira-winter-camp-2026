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
};

// FAQ Data - extracted from Excel knowledge base
const faqData = [
  {
    id: 'when-where',
    icon: '📅',
    questionKey: 'faq.whenWhere.q',
    answerKey: 'faq.whenWhere.a',
    category: 'general'
  },
  {
    id: 'who-participate',
    icon: '👥',
    questionKey: 'faq.whoParticipate.q',
    answerKey: 'faq.whoParticipate.a',
    category: 'general'
  },
  {
    id: 'food-halal',
    icon: '🍽️',
    questionKey: 'faq.foodHalal.q',
    answerKey: 'faq.foodHalal.a',
    category: 'logistics'
  },
  {
    id: 'what-bring',
    icon: '🎒',
    questionKey: 'faq.whatBring.q',
    answerKey: 'faq.whatBring.a',
    category: 'logistics'
  },
  {
    id: 'how-register',
    icon: '📝',
    questionKey: 'faq.howRegister.q',
    answerKey: 'faq.howRegister.a',
    category: 'registration'
  },
  {
    id: 'cost',
    icon: '💰',
    questionKey: 'faq.cost.q',
    answerKey: 'faq.cost.a',
    category: 'registration'
  },
  {
    id: 'transport',
    icon: '🚌',
    questionKey: 'faq.transport.q',
    answerKey: 'faq.transport.a',
    category: 'logistics'
  },
  {
    id: 'perform',
    icon: '🎭',
    questionKey: 'faq.perform.q',
    answerKey: 'faq.perform.a',
    category: 'activities'
  },
  {
    id: 'activities',
    icon: '🎯',
    questionKey: 'faq.activities.q',
    answerKey: 'faq.activities.a',
    category: 'activities'
  },
  {
    id: 'allergies',
    icon: '⚠️',
    questionKey: 'faq.allergies.q',
    answerKey: 'faq.allergies.a',
    category: 'logistics'
  },
  {
    id: 'organizer',
    icon: '🏛️',
    questionKey: 'faq.organizer.q',
    answerKey: 'faq.organizer.a',
    category: 'general'
  },
  {
    id: 'contact',
    icon: '💬',
    questionKey: 'faq.contact.q',
    answerKey: 'faq.contact.a',
    category: 'general'
  },
];

function FAQItem({ item, isOpen, onToggle, t }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div 
      className="group rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen 
          ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isOpen 
          ? '1px solid rgba(0, 242, 254, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isOpen 
          ? '0 8px 32px rgba(0, 242, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
          : 'none'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left transition-all duration-200 hover:bg-white/5"
      >
        {/* Icon with gradient background */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: isOpen 
              ? `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`
              : 'rgba(255, 255, 255, 0.08)',
            boxShadow: isOpen ? '0 4px 15px rgba(79, 172, 254, 0.3)' : 'none'
          }}
        >
          {item.icon}
        </div>
        
        {/* Question text */}
        <span 
          className="flex-grow font-medium text-base md:text-lg leading-snug"
          style={{ color: isOpen ? colors.frost : colors.frostDark }}
        >
          {t(item.questionKey)}
        </span>
        
        {/* Toggle indicator */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{ 
            background: isOpen ? colors.auroraCyan : 'rgba(255, 255, 255, 0.1)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="none"
            style={{ color: isOpen ? '#0a1628' : colors.frostDark }}
          >
            <path 
              d="M3 5L7 9L11 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      
      {/* Answer content */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: `${height}px` }}
      >
        <div 
          ref={contentRef}
          className="px-5 pb-5"
        >
          <div 
            className="pl-16 text-base leading-relaxed"
            style={{ color: colors.frostDark }}
          >
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'rgba(0, 0, 0, 0.2)',
                borderLeft: `3px solid ${colors.auroraCyan}`
              }}
            >
              {t(item.answerKey)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set(['when-where'])); // First item open by default
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef(null);

  const toggleItem = (id) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setOpenItems(new Set(faqData.map(item => item.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

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

      // FAQ items stagger animation
      const items = itemsRef.current?.children;
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: itemsRef.current,
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
      <div ref={headerRef} className="text-center mb-10">
        <h2 
          className="font-adventure text-3xl md:text-4xl tracking-wider mb-3"
          style={{ color: colors.frost }}
        >
          <span className="mr-3">❓</span>
          {t('faqTitle', 'Frequently Asked Questions')}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-0.5 w-16 rounded" style={{ background: `linear-gradient(90deg, transparent, ${colors.auroraBlue})` }}></div>
          <span className="text-2xl">💡</span>
          <div className="h-0.5 w-16 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraCyan}, transparent)` }}></div>
        </div>
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: colors.frostDark }}>
          {t('faqSubtitle', 'Find answers to common questions about Winter Camp 2026')}
        </p>
        
        {/* Expand/Collapse buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={expandAll}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ 
              background: `linear-gradient(135deg, ${colors.auroraBlue}30, ${colors.auroraCyan}20)`,
              color: colors.auroraBlue,
              border: `1px solid ${colors.auroraBlue}40`
            }}
          >
            ⬇️ {t('expandAll', 'Expand All')}
          </button>
          <button
            onClick={collapseAll}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              color: colors.frostDark,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            ⬆️ {t('collapseAll', 'Collapse All')}
          </button>
        </div>
      </div>

      {/* FAQ Items */}
      <div ref={itemsRef} className="grid gap-3 max-w-4xl mx-auto">
        {faqData.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            t={t}
          />
        ))}
      </div>

      {/* Contact CTA */}
      <div 
        className="mt-10 text-center rounded-2xl p-8 max-w-2xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(67, 233, 123, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="text-4xl mb-4">🤔</div>
        <p className="text-lg mb-5 font-medium" style={{ color: colors.frost }}>
          {t('faqMoreQuestions', "Still have questions? We're here to help!")}
        </p>
        <a
          href="https://t.me/irazkisra"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
            color: '#0a1628',
            fontWeight: '600',
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          {t('contactTelegram', 'Contact via Telegram')}
          <span style={{ opacity: 0.8 }}>@irazkisra</span>
        </a>
      </div>
    </section>
  );
}

export default FAQ;
