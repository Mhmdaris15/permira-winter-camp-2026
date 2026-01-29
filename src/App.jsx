import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Background from './components/Background/Background';
import LanguageSelector from './components/LanguageSelector/LanguageSelectorNew';
import EventDetails from './components/EventDetails/EventDetailsNew';
import RegistrationForm from './components/RegistrationForm/RegistrationFormNew';
import Gallery from './components/Gallery/Gallery';
import Rundown from './components/Rundown/Rundown';
import FAQ from './components/FAQ/FAQ';
import WhatToBring from './components/WhatToBring/WhatToBring';
import Chatbot from './components/Chatbot/Chatbot';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Base URL for assets (handles GitHub Pages deployment)
const BASE_URL = import.meta.env.BASE_URL || '/';
const getAssetUrl = (path) => `${BASE_URL}${path}`.replace('//', '/');

function AppContent() {
  const { t } = useTranslation();
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroIconsRef = useRef(null);
  const mainContentRef = useRef(null);
  const footerRef = useRef(null);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsNavHidden(true);
      } else {
        // Scrolling up - show navbar
        setIsNavHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const { theme, toggleTheme } = useTheme();
  return (
    <div className={
      `relative min-h-screen ${theme === 'dark' ? 'dark bg-[#0a0a1e]' : 'light bg-white'} transition-colors duration-300`
    }>
      <Background />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header - Redesigned */}
        <header
          ref={headerRef}
          className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isNavHidden ? "-translate-y-full" : "translate-y-0"}`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: theme === 'dark'
              ? 'linear-gradient(180deg, rgba(10, 10, 30, 0.95) 0%, rgba(10, 10, 30, 0.9) 100%)'
              : 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16">

              {/* Left: Brand */}
              <a href="#" className="flex items-center gap-3 group">
                {/* Logo Stack */}
                <div className="flex items-center -space-x-2">
                  <img
                    src={getAssetUrl("KBRI Logo.jpg")}
                    style={{ width: '36px', height: '36px', maxWidth: '36px', maxHeight: '36px' }}
                    alt="KBRI"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 relative z-10"
                  />
                  <img
                    src={getAssetUrl("Logo Permira SPB.png")}
                    style={{ width: '36px', height: '36px', maxWidth: '36px', maxHeight: '36px' }}
                    alt="PERMIRA SPB"
                    className="w-9 h-9 rounded-full object-contain bg-white/10 ring-2 ring-white/20"
                  />
                </div>

                {/* Brand Text */}
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                    Winter Camp
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 -mt-0.5">
                    PERMIRA SPB 2026
                  </p>
                </div>
              </a>

              {/* Center: Navigation */}
              <nav className="hidden md:flex items-center">
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  {[
                    { name: "Event", icon: "📅" },
                    { name: "Schedule", icon: "⏰" },
                    { name: "FAQ", icon: "❓" },
                    { name: "Register", icon: "📝", highlight: true }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={`#${item.name.toLowerCase()}`}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${item.highlight
                          ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 hover:from-purple-500/30 hover:to-purple-600/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.name}
                      {item.highlight && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      )}
                    </a>
                  ))}
                </div>
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <LanguageSelector />

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: theme === 'dark' ? '#fbbf24' : '#a855f7'
                  }}
                >
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                    </svg>
                  )}
                </button>

                {/* CTA Button - Desktop */}
                <a
                  href="#register"
                  className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
                  }}
                >
                  Register Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  onClick={() => {
                    const mobileNav = document.getElementById('mobile-nav');
                    if (mobileNav) {
                      mobileNav.classList.toggle('hidden');
                    }
                  }}
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div
              id="mobile-nav"
              className="hidden md:hidden pb-4"
            >
              <div className="flex flex-col gap-1">
                {["Event", "Schedule", "FAQ", "Register"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => {
                      const mobileNav = document.getElementById('mobile-nav');
                      if (mobileNav) mobileNav.classList.add('hidden');
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className="h-16"></div>

        {/* Hero Section */}
        <section className="pt-16 pb-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Decorative elements */}
            <div className="flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: '#a855f7'
                }}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                February 12-14, 2026
              </span>
            </div>

            <h2
              ref={heroTitleRef}
              className="font-bold text-4xl md:text-6xl lg:text-7xl text-white tracking-tight mb-6 leading-tight"
            >
              {t('title')}
            </h2>
            <p
              ref={heroSubtitleRef}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">

              <a
                href="#register"
                className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)'
                }}
              >
                Register Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#event"
                className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white'
                }}
              >
                Learn More
              </a>
            </div>

            {/* Supported By - Clean & Subtle */}
            <div ref={heroIconsRef} className="flex flex-col items-center gap-3 mt-16 px-4">
              <span className="text-xs uppercase tracking-widest text-gray-500">Supported by</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                  <img src={getAssetUrl('KBRI Logo.jpg')} alt="KBRI" className="w-8 h-8 max-w-8 max-h-8 rounded-full object-cover grayscale hover:grayscale-0 transition-all" style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px' }} />
                  <span className="text-xs text-gray-400 hidden sm:inline">KBRI Moscow</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                  <img src={getAssetUrl('Logo Permira SPB.png')} alt="PERMIRA SPB" className="w-8 h-8 max-w-8 max-h-8 object-contain grayscale hover:grayscale-0 transition-all" style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px' }} />
                  <span className="text-xs text-gray-400 hidden sm:inline">PERMIRA SPB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main ref={mainContentRef} className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div id="event">
            <EventDetails />
          </div>
          <div id="schedule">
            <Rundown />
          </div>
          <WhatToBring />
          <Gallery />
          <div id="faq">
            <FAQ />
          </div>
          <div id="register">
            <RegistrationForm />
          </div>
        </main>

        {/* Footer */}
        <footer
          ref={footerRef}
          className="border-t border-white/10"
          style={{
            opacity: 0,
            background: 'linear-gradient(180deg, rgba(10, 10, 30, 0.95) 0%, rgba(5, 5, 20, 0.98) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            {/* Partner Logos */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <img src={getAssetUrl('KBRI Logo.jpg')} alt="KBRI" className="h-10 w-10 max-h-10 max-w-10 rounded-full object-cover ring-2 ring-white/10" />
              <img src={getAssetUrl('Logo Permira SPB.png')} alt="PERMIRA SPB" className="h-10 max-h-10 max-w-[80px] object-contain" />
              <img src={getAssetUrl('permira-kepanitiaan-logo.png')} alt="Panitia" className="h-10 max-h-10 max-w-[80px] object-contain" />
            </div>

            {/* Contact Info */}
            <div className="mb-6 space-y-2">
              <p className="text-frost text-sm font-semibold">Contact Us:</p>
              <div className="flex flex-wrap justify-center gap-4 text-frost-dark text-xs">
                <span>Fikriya: +79111495385</span>
                <span>Aris: +79810409453</span>
                <span>Abil: +6285121080413</span>
              </div>
              <a
                href="https://t.me/permiraspb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-aurora hover:text-aurora-cyan transition-colors text-sm mt-2"
              >
                📱 @permiraspb
              </a>
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
