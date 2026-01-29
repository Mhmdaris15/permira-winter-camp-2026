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

      {/* Contact CTA - Redesigned & Fixed */}
      <div
        className="mt-16 max-w-4xl mx-auto"
      >
        {/* Section Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3" style={{ color: colors.frost }}>
            <span className="text-3xl">💬</span>
            {t('faqMoreQuestions', 'Still have questions?')}
          </h3>
          <p style={{ color: colors.frostDark }}>
            Feel free to contact us via WhatsApp or Telegram
          </p>
        </div>

        {/* Contact Cards List */}
        <div className="flex flex-col gap-4">
          {[
            {
              name: 'Fikriya',
              role: 'Lead Coordinator',
              phone: '+7 911 149 5385',
              wa: 'https://wa.me/79111495385',
              tg: 'https://t.me/fikriya',
              avatar: '👩‍💼'
            },
            {
              name: 'Aris',
              role: 'Tech & Media',
              phone: '+7 981 040 9453',
              wa: 'https://wa.me/79810409453',
              tg: 'https://t.me/aris',
              avatar: '👨‍💻'
            },
            {
              name: 'Abil',
              role: 'Registration',
              phone: '+62 851 2108 0413',
              wa: 'https://wa.me/6285121080413',
              tg: null,
              avatar: '�'
            }
          ].map((contact, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:translate-x-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {contact.avatar}
                </div>

                {/* Info */}
                <div className="flex-grow text-center sm:text-left">
                  <h4 className="text-xl font-bold mb-1" style={{ color: colors.frost }}>{contact.name}</h4>
                  <p className="text-sm font-medium opacity-80" style={{ color: colors.auroraBlue }}>{contact.role}</p>
                  <p className="text-sm mt-1 opacity-60" style={{ color: colors.frostDark }}>{contact.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* WhatsApp */}
                  <a
                    href={contact.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105 hover:bg-white/5"
                    style={{ border: '1px solid rgba(37, 211, 102, 0.3)' }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}whatsapp-logo.png`.replace('//', '/')}
                      alt="WhatsApp"
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    />
                    <span className="hidden sm:inline text-sm font-medium" style={{ color: '#25D366' }}>Chat</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href="https://t.me/permiraspb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105 hover:bg-white/5"
                    style={{ border: '1px solid rgba(0, 136, 204, 0.3)' }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}telegram-logo.png`.replace('//', '/')}
                      alt="Telegram"
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    />
                    <span className="hidden sm:inline text-sm font-medium" style={{ color: '#0088cc' }}>Channel</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Official Channel Banner */}
        <div className="mt-8 text-center">
          <a
            href="https://t.me/permiraspb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #0088cc 0%, #00a2ff 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0, 136, 204, 0.3)'
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}telegram-logo.png`.replace('//', '/')}
              alt="Telegram"
              style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
            />
            Join Our Official Channel
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;