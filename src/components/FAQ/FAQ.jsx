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

      {/* Contact CTA - Redesigned */}
      <div
        className="mt-12 rounded-3xl overflow-hidden max-w-3xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.9) 0%, rgba(15, 25, 45, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={colors.auroraCyan}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="text-xl font-bold" style={{ color: colors.frost }}>
              {t('faqMoreQuestions', 'Still have questions? Contact us!')}
            </h3>
          </div>
          <p className="text-sm" style={{ color: colors.frostDark }}>
            Our team is ready to help you
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="p-6 grid sm:grid-cols-3 gap-4">
          {/* Contact 1 - Lead */}
          <a
            href="https://wa.me/79111495385"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              👩
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: colors.frost }}>Fikriya</p>
            <p className="text-xs mb-2" style={{ color: colors.frostDark }}>Lead Coordinator</p>
            <p
              className="text-xs font-medium px-2 py-1 rounded-full inline-block"
              style={{
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366'
              }}
            >
              +7 911 149 5385
            </p>
          </a>

          {/* Contact 2 */}
          <a
            href="https://wa.me/79810409453"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              👨
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: colors.frost }}>Aris</p>
            <p className="text-xs mb-2" style={{ color: colors.frostDark }}>Tech & Media</p>
            <p
              className="text-xs font-medium px-2 py-1 rounded-full inline-block"
              style={{
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366'
              }}
            >
              +7 981 040 9453
            </p>
          </a>

          {/* Contact 3 */}
          <a
            href="https://wa.me/6285121080413"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              👨
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: colors.frost }}>Abil</p>
            <p className="text-xs mb-2" style={{ color: colors.frostDark }}>Registration</p>
            <p
              className="text-xs font-medium px-2 py-1 rounded-full inline-block"
              style={{
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366'
              }}
            >
              +62 851 2108 0413
            </p>
          </a>
        </div>

        {/* Telegram CTA */}
        <div
          className="px-6 py-5 text-center"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <a
            href="https://t.me/permiraspb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0088cc, #0077b5)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0, 136, 204, 0.4)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Join @permiraspb
            <span className="text-xs opacity-80">Official Channel</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;