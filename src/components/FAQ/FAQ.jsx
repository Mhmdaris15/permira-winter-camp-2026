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
  },
  {
    id: 'who-participate',
    icon: '👥',
    questionKey: 'faq.whoParticipate.q',
    answerKey: 'faq.whoParticipate.a',
  },
  {
    id: 'food-halal',
    icon: '🍽️',
    questionKey: 'faq.foodHalal.q',
    answerKey: 'faq.foodHalal.a',
  },
  {
    id: 'what-bring',
    icon: '🎒',
    questionKey: 'faq.whatBring.q',
    answerKey: 'faq.whatBring.a',
  },
  {
    id: 'how-register',
    icon: '📝',
    questionKey: 'faq.howRegister.q',
    answerKey: 'faq.howRegister.a',
  },
  {
    id: 'cost',
    icon: '💰',
    questionKey: 'faq.cost.q',
    answerKey: 'faq.cost.a',
  },
  {
    id: 'transport',
    icon: '🚌',
    questionKey: 'faq.transport.q',
    answerKey: 'faq.transport.a',
  },
  {
    id: 'perform',
    icon: '🎭',
    questionKey: 'faq.perform.q',
    answerKey: 'faq.perform.a',
  },
  {
    id: 'activities',
    icon: '🎯',
    questionKey: 'faq.activities.q',
    answerKey: 'faq.activities.a',
  },
  {
    id: 'allergies',
    icon: '⚠️',
    questionKey: 'faq.allergies.q',
    answerKey: 'faq.allergies.a',
  },
  {
    id: 'organizer',
    icon: '🏛️',
    questionKey: 'faq.organizer.q',
    answerKey: 'faq.organizer.a',
  },
  {
    id: 'contact',
    icon: '💬',
    questionKey: 'faq.contact.q',
    answerKey: 'faq.contact.a',
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
      className="glass rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: isOpen ? `1px solid ${colors.auroraCyan}` : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isOpen ? `0 0 20px rgba(0, 242, 254, 0.15)` : 'none'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 md:p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-2xl flex-shrink-0">{item.icon}</span>
        <span 
          className="flex-grow font-medium text-base md:text-lg"
          style={{ color: colors.frost }}
        >
          {t(item.questionKey)}
        </span>
        <span 
          className="text-2xl flex-shrink-0 transition-transform duration-300"
          style={{ 
            color: colors.auroraCyan,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
          }}
        >
          +
        </span>
      </button>
      
      <div 
        className="overflow-hidden transition-all duration-300"
        style={{ height: `${height}px` }}
      >
        <div 
          ref={contentRef}
          className="px-4 md:px-5 pb-4 md:pb-5 pt-0"
        >
          <div 
            className="pl-10 text-base leading-relaxed"
            style={{ color: colors.frostDark }}
          >
            {t(item.answerKey)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());
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
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
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
      <div ref={headerRef} className="text-center mb-8">
        <h2 
          className="font-adventure text-3xl md:text-4xl tracking-wider mb-2"
          style={{ color: colors.frost }}
        >
          <span className="mr-3">❓</span>
          {t('faqTitle', 'Frequently Asked Questions')}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraBlue}, ${colors.auroraCyan})` }}></div>
          <span className="text-xl">💡</span>
          <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraCyan}, ${colors.auroraGreen})` }}></div>
        </div>
        <p className="mt-4 text-base" style={{ color: colors.frostDark }}>
          {t('faqSubtitle', 'Find answers to common questions about Winter Camp 2026')}
        </p>
        
        {/* Expand/Collapse buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(79, 172, 254, 0.2)',
              color: colors.auroraBlue,
              border: '1px solid rgba(79, 172, 254, 0.3)'
            }}
          >
            {t('expandAll', 'Expand All')}
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: colors.frostDark,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {t('collapseAll', 'Collapse All')}
          </button>
        </div>
      </div>

      {/* FAQ Items */}
      <div ref={itemsRef} className="space-y-3 max-w-3xl mx-auto">
        {faqData.map((item) => (
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
      <div className="mt-8 text-center glass rounded-2xl p-6 max-w-2xl mx-auto">
        <p className="text-lg mb-4" style={{ color: colors.frost }}>
          {t('faqMoreQuestions', "Still have questions? We're here to help!")}
        </p>
        <a
          href="https://t.me/irazkisra"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${colors.auroraBlue}, ${colors.auroraCyan})`,
            color: '#0a1628',
            fontWeight: '600'
          }}
        >
          <span>💬</span>
          {t('contactTelegram', 'Contact via Telegram')}
          <span>@irazkisra</span>
        </a>
      </div>
    </section>
  );
}

export default FAQ;
