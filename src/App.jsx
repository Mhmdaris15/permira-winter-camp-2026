import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Background from './components/Background/Background';
import LanguageSelector from './components/LanguageSelector/LanguageSelectorNew';
import EventDetails from './components/EventDetails/EventDetailsNew';
import RegistrationForm from './components/RegistrationForm/RegistrationFormNew';
import Chatbot from './components/Chatbot/Chatbot';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const { t } = useTranslation();
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroIconsRef = useRef(null);
  const mainContentRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      
      // Initial setup - hide elements
      gsap.set([headerRef.current, heroTitleRef.current, heroSubtitleRef.current], {
        opacity: 0,
        y: -50
      });
      
      gsap.set(heroIconsRef.current?.children, {
        opacity: 0,
        scale: 0,
        rotation: -180
      });

      // Timeline for intro animations
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Header slides down
      introTl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3
      })
      
      // Hero title reveals with split effect
      .to(heroTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.5')
      
      // Subtitle fades in
      .to(heroSubtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.6')
      
      // Icons pop in with stagger
      .to(heroIconsRef.current?.children, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.4');

      // Floating animation for hero icons
      if (heroIconsRef.current) {
        Array.from(heroIconsRef.current.children).forEach((icon, index) => {
          gsap.to(icon, {
            y: -15,
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          });
        });
      }

      // Aurora glow effect on title
      gsap.to(heroTitleRef.current, {
        textShadow: '0 0 30px rgba(79, 172, 254, 0.8), 0 0 60px rgba(0, 242, 254, 0.6), 0 0 90px rgba(67, 233, 123, 0.4)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Scroll-triggered animations for main content
      ScrollTrigger.batch('.glass', {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              y: 60,
              scale: 0.95
            },
            { 
              opacity: 1, 
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out'
            }
          );
        },
        start: 'top 85%',
        once: true
      });

      // Footer animation
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(footerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          );
          
          // Animate footer icons
          gsap.fromTo(footerRef.current?.querySelectorAll('span'),
            { scale: 0, rotation: -180 },
            { 
              scale: 1, 
              rotation: 0, 
              duration: 0.5, 
              stagger: 0.1,
              ease: 'back.out(1.7)',
              delay: 0.3
            }
          );
        },
        once: true
      });

      // Parallax effect on scroll
      gsap.to('.parallax-slow', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

    });

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen">
      <Background />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" style={{ display: 'inline-block' }}>🌌</span>
              <div>
                <h1 
                  className="font-adventure text-2xl md:text-3xl tracking-wider"
                  style={{ 
                    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {t('title')}
                </h1>
                <p className="text-xs text-frost-dark opacity-80">by PERMIRA Saint Petersburg</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 
              ref={heroTitleRef}
              className="font-adventure text-5xl md:text-7xl lg:text-8xl text-frost tracking-wider mb-6"
            >
              <span className="inline-block mr-4">🌌</span>
              {t('title')}
              <span className="inline-block ml-4">❄️</span>
            </h2>
            <p 
              ref={heroSubtitleRef}
              className="text-xl md:text-2xl text-frost-dark max-w-2xl mx-auto leading-relaxed"
            >
              {t('subtitle')}
            </p>
            
            {/* Adventure Icons */}
            <div ref={heroIconsRef} className="flex justify-center gap-6 mt-8">
              {['🌌', '🏕️', '🔥', '📸', '🇮🇩', '❄️'].map((icon, index) => (
                <span 
                  key={index} 
                  className="text-3xl md:text-4xl cursor-default hover:scale-125 transition-transform"
                  style={{ display: 'inline-block' }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main ref={mainContentRef} className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <EventDetails />
          <RegistrationForm />
        </main>

        {/* Footer */}
        <footer ref={footerRef} className="glass border-t border-white/10" style={{ opacity: 0 }}>
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <div className="flex justify-center gap-4 mb-4">
              {['🌌', '🏕️', '🔥', '❄️', '🇮🇩'].map((icon, index) => (
                <span 
                  key={index} 
                  className="text-2xl cursor-default"
                  style={{ display: 'inline-block' }}
                >
                  {icon}
                </span>
              ))}
            </div>
            <p className="text-frost-dark text-sm">
              © 2026 Winter Camp by PERMIRA Saint Petersburg
            </p>
            <p className="text-frost-dark/60 text-xs mt-2">
              Persatuan Mahasiswa Indonesia di Rusia
            </p>
            <p className="text-frost-dark/70 text-xs mt-4">
              Developed by{' '}
              <a 
                href="https://www.linkedin.com/in/muhammad-aris-septanugroho/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-aurora hover:text-aurora-cyan transition-colors"
                style={{ color: '#4facfe' }}
              >
                Muhammad Aris Septanugroho
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
