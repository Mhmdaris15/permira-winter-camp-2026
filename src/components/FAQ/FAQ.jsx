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
          style={{ color: isOpen ? colors.auroraCyan : colors.frostDark }}
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
        <div className="flex flex-col gap-4 items-center">
          <a
            href="https://wa.me/79111495385"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
              color: '#0a1628',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.29A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.54-1.5l-.39-.23-4.13 1.32 1.32-4.13-.23-.39A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.28 1.23.45 1.65.58.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
            Fikriya: +79111495385
            <span className="text-xs opacity-80">(WhatsApp/Telegram)</span>
          </a>
          <a
            href="https://wa.me/79810409453"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
              color: '#0a1628',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.29A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.54-1.5l-.39-.23-4.13 1.32 1.32-4.13-.23-.39A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.28 1.23.45 1.65.58.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
            Aris: +79810409453
            <span className="text-xs opacity-80">(WhatsApp/Telegram)</span>
          </a>
          <a
            href="https://wa.me/6285121080413"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
              color: '#0a1628',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.29A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.54-1.5l-.39-.23-4.13 1.32 1.32-4.13-.23-.39A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.28 1.23.45 1.65.58.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
            Abil: +6285121080413
            <span className="text-xs opacity-80">(WhatsApp/Telegram)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;