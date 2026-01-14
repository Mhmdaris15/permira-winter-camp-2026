import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Cloudflare Worker URLs - Update with your deployed worker URL
const CLOUDFLARE_WORKER_URL = 'https://your-worker.your-subdomain.workers.dev'; // UPDATE THIS
const REGISTER_URL = `${CLOUDFLARE_WORKER_URL}/api/register`;
const UPLOAD_URL = `${CLOUDFLARE_WORKER_URL}/api/upload`;

// Style constants
const colors = {
  midnight: '#0a1628',
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe',
  auroraGreen: '#43e97b',
  evergreen: '#1a5f4a',
  evergreenLight: '#2d8a6e',
  campRed: '#dc2626',
  campOrange: '#f97316'
};

// Shared input styles
const inputBaseStyles = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: colors.frost,
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease'
};

const inputErrorStyles = {
  ...inputBaseStyles,
  borderColor: colors.campRed,
  backgroundColor: 'rgba(220, 38, 38, 0.1)'
};

function RegistrationForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);
  const [formData, setFormData] = useState({
    citizenship: '',
    fullName: '',
    university: '',
    gender: '',
    age: '',
    phoneNumber: '',
    email: '',
    vk: '',
    telegram: '',
    hearAboutUs: [],
    hearAboutUsOther: '',
    allergies: '',
    kbriProof: null,
    kbriProofName: '',
    wantToPerform: '',
    performanceDetails: '',
    termsAccepted: false,
    willingToParticipate: '',
    reasonForJoining: ''
  });
  const [errors, setErrors] = useState({});

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Form sections stagger animation
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.fromTo(section,
            { 
              opacity: 0, 
              x: index % 2 === 0 ? -30 : 30,
              y: 20
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
              }
            }
          );
        }
      });

      // Input focus animations
      const inputs = formRef.current?.querySelectorAll('input, select, textarea');
      inputs?.forEach(input => {
        input.addEventListener('focus', () => {
          gsap.to(input, {
            scale: 1.02,
            boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        input.addEventListener('blur', () => {
          gsap.to(input, {
            scale: 1,
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

    }, formRef);

    return () => ctx.revert();
  }, []);

  // Success animation
  useEffect(() => {
    if (isSubmitted) {
      gsap.fromTo('.success-animation',
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'back.out(1.7)' 
        }
      );
      gsap.fromTo('.success-text',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, stagger: 0.1 }
      );
    }
  }, [isSubmitted]);

  const countries = ['indonesia', 'russia'];

  const hearOptions = ['socialMedia', 'friend', 'university', 'website', 'email', 'poster', 'other'];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, kbriProof: t('fileTooLarge') || 'File size must be less than 2MB' }));
          return;
        }
        setFormData(prev => ({
          ...prev,
          kbriProof: file,
          kbriProofName: file.name
        }));
      }
    } else if (type === 'checkbox' && name === 'hearAboutUs') {
      setFormData(prev => ({
        ...prev,
        hearAboutUs: checked 
          ? [...prev.hearAboutUs, value]
          : prev.hearAboutUs.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\d\s\-+()]{8,}$/.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.citizenship) newErrors.citizenship = t('required');
    if (!formData.fullName.trim()) newErrors.fullName = t('required');
    if (!formData.university.trim()) newErrors.university = t('required');
    if (!formData.gender) newErrors.gender = t('required');
    
    if (!formData.age) {
      newErrors.age = t('required');
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = t('invalidAge');
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('required');
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = t('invalidPhone');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    // KBRI proof required for Indonesian citizens
    if (formData.citizenship === 'indonesia' && !formData.kbriProof) {
      newErrors.kbriProof = t('required');
    }

    // Performance details required if wants to perform
    if (formData.wantToPerform === 'yes' && !formData.performanceDetails.trim()) {
      newErrors.performanceDetails = t('required');
    }

    if (formData.hearAboutUs.includes('other') && !formData.hearAboutUsOther.trim()) {
      newErrors.hearAboutUsOther = t('required');
    }

    if (!formData.termsAccepted) newErrors.termsAccepted = t('mustAgreeTerms');
    if (!formData.willingToParticipate) newErrors.willingToParticipate = t('required');
    if (!formData.reasonForJoining.trim()) newErrors.reasonForJoining = t('required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload file to Google Drive via Cloudflare Worker
  const uploadKbriProof = async (file, registrantName) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('registrantName', registrantName);

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return result.fileUrl;
      } else {
        console.error('Upload failed:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Submit registration to Google Sheets via Cloudflare Worker
  const submitToGoogleSheets = async (data) => {
    try {
      // First upload KBRI proof if exists (Indonesian citizens)
      let kbriProofUrl = '-';
      if (data.citizenship === 'indonesia' && data.kbriProof) {
        kbriProofUrl = await uploadKbriProof(data.kbriProof, data.fullName);
        if (!kbriProofUrl) {
          kbriProofUrl = 'Upload failed';
        }
      }

      const formattedData = {
        timestamp: new Date().toISOString(),
        citizenship: t(`countries.${data.citizenship}`),
        fullName: data.fullName,
        university: data.university,
        gender: t(data.gender),
        age: data.age,
        phoneNumber: data.phoneNumber,
        email: data.email,
        vk: data.vk || '-',
        telegram: data.telegram || '-',
        hearAboutUs: data.hearAboutUs.map(h => h === 'other' ? data.hearAboutUsOther : t(`hearOptions.${h}`)).join(', '),
        allergies: data.allergies || '-',
        kbriProofProvided: data.citizenship === 'indonesia' ? (data.kbriProof ? 'Yes' : 'No') : 'N/A',
        kbriProofUrl: kbriProofUrl,
        wantToPerform: data.wantToPerform === 'yes' ? 'Yes' : 'No',
        performanceDetails: data.performanceDetails || '-',
        willingToParticipate: data.willingToParticipate === 'yes' ? t('yes') : t('no'),
        reasonForJoining: data.reasonForJoining
      };

      // Check if worker URL is configured
      if (CLOUDFLARE_WORKER_URL !== 'https://your-worker.your-subdomain.workers.dev') {
        const response = await fetch(REGISTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData)
        });
        
        const result = await response.json();
        return result.success !== false;
      }
      
      console.log('Form Data (would be sent to Google Sheets):', formattedData);
      return true;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const success = await submitToGoogleSheets(formData);
      setIsSubmitting(false);
      if (success) {
        setIsSubmitted(true);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      citizenship: '',
      fullName: '',
      university: '',
      gender: '',
      age: '',
      phoneNumber: '',
      email: '',
      vk: '',
      telegram: '',
      hearAboutUs: [],
      hearAboutUsOther: '',
      allergies: '',
      kbriProof: null,
      kbriProofName: '',
      wantToPerform: '',
      performanceDetails: '',
      termsAccepted: false,
      willingToParticipate: '',
      reasonForJoining: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="glass rounded-3xl p-8 md:p-12 text-center">
        <div>
          <div className="success-animation text-7xl mb-6">🎉</div>
          <h2 
            className="success-text font-adventure text-4xl md:text-5xl tracking-wider mb-4"
            style={{ color: colors.auroraCyan }}
          >
            {t('successTitle')}
          </h2>
          <p className="success-text" style={{ color: colors.frostDark, fontSize: '1.125rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>
            {t('successMessage')}
          </p>
          <button
            onClick={handleReset}
            className="success-text btn-adventure px-8 py-3 rounded-xl font-semibold text-white"
          >
            {t('reset')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={formRef} className="glass rounded-3xl p-6 md:p-8">
      {/* Section Header */}
      <div ref={headerRef} className="text-center mb-8">
        <h2 
          className="font-adventure text-4xl md:text-5xl tracking-wider mb-2"
          style={{ color: colors.frost }}
        >
          {t('registrationForm')}
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div 
            className="h-px w-16" 
            style={{ background: `linear-gradient(to right, transparent, ${colors.auroraBlue})` }} 
          />
          <span style={{ color: colors.auroraBlue }} className="text-2xl">📝</span>
          <div 
            className="h-px w-16" 
            style={{ background: `linear-gradient(to left, transparent, ${colors.auroraBlue})` }} 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div ref={el => sectionsRef.current[0] = el} className="space-y-6">
          <h3 
            className="flex items-center gap-2 font-adventure text-2xl tracking-wide"
            style={{ color: colors.auroraCyan }}
          >
            <span>👤</span> {t('personalInfo')}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Citizenship */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('citizenship')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <select
                name="citizenship"
                value={formData.citizenship}
                onChange={handleChange}
                style={errors.citizenship ? inputErrorStyles : inputBaseStyles}
              >
                <option value="" style={{ backgroundColor: colors.midnight }}>{t('selectCitizenship')}</option>
                {countries.map(country => (
                  <option key={country} value={country} style={{ backgroundColor: colors.midnight }}>
                    {t(`countries.${country}`)}
                  </option>
                ))}
              </select>
              {errors.citizenship && <p style={{ color: colors.campRed }} className="text-sm">{errors.citizenship}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('fullName')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t('fullNamePlaceholder')}
                style={errors.fullName ? inputErrorStyles : inputBaseStyles}
              />
              {errors.fullName && <p style={{ color: colors.campRed }} className="text-sm">{errors.fullName}</p>}
            </div>

            {/* University */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('university')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder={t('universityPlaceholder')}
                style={errors.university ? inputErrorStyles : inputBaseStyles}
              />
              {errors.university && <p style={{ color: colors.campRed }} className="text-sm">{errors.university}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('gender')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={errors.gender ? inputErrorStyles : inputBaseStyles}
              >
                <option value="" style={{ backgroundColor: colors.midnight }}>{t('selectGender')}</option>
                <option value="male" style={{ backgroundColor: colors.midnight }}>{t('male')}</option>
                <option value="female" style={{ backgroundColor: colors.midnight }}>{t('female')}</option>
              </select>
              {errors.gender && <p style={{ color: colors.campRed }} className="text-sm">{errors.gender}</p>}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('age')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t('agePlaceholder')}
                min="1"
                max="120"
                style={errors.age ? inputErrorStyles : inputBaseStyles}
              />
              {errors.age && <p style={{ color: colors.campRed }} className="text-sm">{errors.age}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div ref={el => sectionsRef.current[1] = el} className="space-y-6">
          <h3 
            className="flex items-center gap-2 font-adventure text-2xl tracking-wide"
            style={{ color: colors.auroraCyan }}
          >
            <span>📞</span> {t('contactInfo')}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('phoneNumber')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t('phonePlaceholder')}
                style={errors.phoneNumber ? inputErrorStyles : inputBaseStyles}
              />
              {errors.phoneNumber && <p style={{ color: colors.campRed }} className="text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('email')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('emailPlaceholder')}
                style={errors.email ? inputErrorStyles : inputBaseStyles}
              />
              {errors.email && <p style={{ color: colors.campRed }} className="text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Social Media - Optional */}
          <div className="space-y-4">
            <label style={{ color: colors.frost }} className="block font-medium">
              {t('socialMedia')}
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {/* VK */}
              <div className="space-y-2">
                <label style={{ color: colors.frostDark }} className="block text-sm">{t('vk')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📘</span>
                  <input
                    type="text"
                    name="vk"
                    value={formData.vk}
                    onChange={handleChange}
                    placeholder={t('vkPlaceholder')}
                    style={{ ...inputBaseStyles, paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <label style={{ color: colors.frostDark }} className="block text-sm">{t('telegramUsername')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">✈️</span>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    placeholder={t('telegramPlaceholder')}
                    style={{ ...inputBaseStyles, paddingLeft: '3rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How did you hear about us */}
        <div className="space-y-4">
          <label style={{ color: colors.frost }} className="block font-medium">{t('hearAboutUs')}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hearOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: formData.hearAboutUs.includes(option) 
                    ? 'rgba(79, 172, 254, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${formData.hearAboutUs.includes(option) ? colors.auroraBlue : 'rgba(255, 255, 255, 0.2)'}`
                }}
              >
                <input
                  type="checkbox"
                  name="hearAboutUs"
                  value={option}
                  checked={formData.hearAboutUs.includes(option)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: colors.auroraBlue }}
                />
                <span style={{ color: colors.frost }} className="text-sm">{t(`hearOptions.${option}`)}</span>
              </label>
            ))}
          </div>
          
          {formData.hearAboutUs.includes('other') && (
            <input
              type="text"
              name="hearAboutUsOther"
              value={formData.hearAboutUsOther}
              onChange={handleChange}
              placeholder={t('pleaseSpecify')}
              style={errors.hearAboutUsOther ? inputErrorStyles : inputBaseStyles}
            />
          )}
          {errors.hearAboutUsOther && <p style={{ color: colors.campRed }} className="text-sm">{errors.hearAboutUsOther}</p>}
        </div>

        {/* Additional Information Section */}
        <div ref={el => sectionsRef.current[2] = el} className="space-y-6">
          <h3 
            className="flex items-center gap-2 font-adventure text-2xl tracking-wide"
            style={{ color: colors.auroraCyan }}
          >
            <span>📋</span> {t('additionalInfo')}
          </h3>
          
          {/* KBRI Proof Upload - Only for Indonesian Citizens */}
          {formData.citizenship === 'indonesia' && (
            <div className="space-y-2">
              <label style={{ color: colors.frost }} className="block font-medium">
                {t('kbriProof')} <span style={{ color: colors.campRed }}>*</span>
              </label>
              <p style={{ color: colors.frostDark }} className="text-sm mb-2">
                {t('kbriProofDescription')}
              </p>
              <div 
                className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
                style={{ 
                  borderColor: errors.kbriProof ? colors.campRed : 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: formData.kbriProof ? 'rgba(79, 172, 254, 0.1)' : 'transparent'
                }}
              >
                <input
                  type="file"
                  name="kbriProof"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {formData.kbriProofName ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">✅</span>
                    <span style={{ color: colors.frost }}>{formData.kbriProofName}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl block mb-2">📎</span>
                    <span style={{ color: colors.frostDark }}>{t('uploadFile')}</span>
                    <p style={{ color: colors.frostDark }} className="text-xs mt-1">{t('maxFileSize')}</p>
                  </div>
                )}
              </div>
              {errors.kbriProof && <p style={{ color: colors.campRed }} className="text-sm">{errors.kbriProof}</p>}
            </div>
          )}

          {/* Allergies */}
          <div className="space-y-2">
            <label style={{ color: colors.frost }} className="block font-medium">{t('allergies')}</label>
            <p style={{ color: colors.frostDark }} className="text-sm mb-2">
              {t('foodIsHalal')}
            </p>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder={t('allergiesPlaceholder')}
              style={inputBaseStyles}
            />
          </div>

          {/* Want to Perform */}
          <div className="space-y-4">
            <label style={{ color: colors.frost }} className="block font-medium">
              {t('wantToPerform')}
            </label>
            <div className="flex flex-wrap gap-4">
              <label
                className="flex-1 min-w-[150px] flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: formData.wantToPerform === 'yes' 
                    ? 'rgba(79, 172, 254, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${formData.wantToPerform === 'yes' ? colors.auroraBlue : 'rgba(255, 255, 255, 0.2)'}`
                }}
              >
                <input
                  type="radio"
                  name="wantToPerform"
                  value="yes"
                  checked={formData.wantToPerform === 'yes'}
                  onChange={handleChange}
                  className="w-5 h-5"
                  style={{ accentColor: colors.auroraBlue }}
                />
                <span style={{ color: colors.frost }}>{t('yesPerform')}</span>
              </label>
              <label
                className="flex-1 min-w-[150px] flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: formData.wantToPerform === 'no' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${formData.wantToPerform === 'no' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`
                }}
              >
                <input
                  type="radio"
                  name="wantToPerform"
                  value="no"
                  checked={formData.wantToPerform === 'no'}
                  onChange={handleChange}
                  className="w-5 h-5"
                  style={{ accentColor: colors.frostDark }}
                />
                <span style={{ color: colors.frost }}>{t('noPerform')}</span>
              </label>
            </div>
            
            {/* Performance Details - shown if yes */}
            {formData.wantToPerform === 'yes' && (
              <div className="space-y-2 mt-4">
                <label style={{ color: colors.frost }} className="block font-medium">
                  {t('performanceDetails')} <span style={{ color: colors.campRed }}>*</span>
                </label>
                <textarea
                  name="performanceDetails"
                  value={formData.performanceDetails}
                  onChange={handleChange}
                  placeholder={t('performanceDetailsPlaceholder')}
                  rows="3"
                  style={{
                    ...(errors.performanceDetails ? inputErrorStyles : inputBaseStyles),
                    resize: 'none'
                  }}
                />
                {errors.performanceDetails && <p style={{ color: colors.campRed }} className="text-sm">{errors.performanceDetails}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Willingness to Participate */}
        <div className="space-y-4">
          <label style={{ color: colors.frost }} className="block font-medium">
            {t('willingnessToParticipate')} <span style={{ color: colors.campRed }}>*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            <label
              className="flex-1 min-w-[200px] flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
              style={{
                backgroundColor: formData.willingToParticipate === 'yes' 
                  ? 'rgba(26, 95, 74, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${formData.willingToParticipate === 'yes' ? colors.evergreenLight : 'rgba(255, 255, 255, 0.2)'}`
              }}
            >
              <input
                type="radio"
                name="willingToParticipate"
                value="yes"
                checked={formData.willingToParticipate === 'yes'}
                onChange={handleChange}
                className="w-5 h-5"
                style={{ accentColor: colors.evergreenLight }}
              />
              <span style={{ color: colors.frost }}>{t('yes')}</span>
            </label>
            <label
              className="flex-1 min-w-[200px] flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
              style={{
                backgroundColor: formData.willingToParticipate === 'no' 
                  ? 'rgba(249, 115, 22, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${formData.willingToParticipate === 'no' ? colors.campOrange : 'rgba(255, 255, 255, 0.2)'}`
              }}
            >
              <input
                type="radio"
                name="willingToParticipate"
                value="no"
                checked={formData.willingToParticipate === 'no'}
                onChange={handleChange}
                className="w-5 h-5"
                style={{ accentColor: colors.campOrange }}
              />
              <span style={{ color: colors.frost }}>{t('no')}</span>
            </label>
          </div>
          {errors.willingToParticipate && <p style={{ color: colors.campRed }} className="text-sm">{errors.willingToParticipate}</p>}
        </div>

        {/* Reason for Joining */}
        <div className="space-y-2">
          <label style={{ color: colors.frost }} className="block font-medium">
            {t('reasonForJoining')} <span style={{ color: colors.campRed }}>*</span>
          </label>
          <textarea
            name="reasonForJoining"
            value={formData.reasonForJoining}
            onChange={handleChange}
            placeholder={t('reasonPlaceholder')}
            rows="4"
            style={{
              ...(errors.reasonForJoining ? inputErrorStyles : inputBaseStyles),
              resize: 'none'
            }}
          />
          {errors.reasonForJoining && <p style={{ color: colors.campRed }} className="text-sm">{errors.reasonForJoining}</p>}
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <label
            className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
            style={{
              backgroundColor: formData.termsAccepted 
                ? 'rgba(79, 172, 254, 0.1)' 
                : errors.termsAccepted 
                  ? 'rgba(220, 38, 38, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${
                formData.termsAccepted 
                  ? colors.auroraBlue 
                  : errors.termsAccepted 
                    ? colors.campRed 
                    : 'rgba(255, 255, 255, 0.2)'
              }`
            }}
          >
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-5 h-5 mt-0.5 rounded"
              style={{ accentColor: colors.auroraBlue }}
            />
            <span style={{ color: colors.frost }}>{t('termsText')}</span>
          </label>
          {errors.termsAccepted && <p style={{ color: colors.campRed }} className="text-sm">{errors.termsAccepted}</p>}
        </div>

        {/* Submit Buttons */}
        <div ref={el => sectionsRef.current[3] = el} className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-adventure px-8 py-4 rounded-xl font-adventure text-xl tracking-wider text-white 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                       hover:scale-105 active:scale-95 transition-transform"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('submitting')}
              </>
            ) : (
              <>
                <span>🎿</span> {t('submit')}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-4 rounded-xl font-adventure text-xl tracking-wider transition-all hover:bg-white/20"
            style={{
              color: colors.frost,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {t('reset')}
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrationForm;
