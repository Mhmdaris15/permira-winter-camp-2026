import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RegistrationForm.css';

function RegistrationForm() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    citizenship: '',
    fullName: '',
    university: '',
    gender: '',
    age: '',
    dietaryRestrictions: '',
    allergies: '',
    termsAccepted: false,
    willingToParticipate: '',
    reasonForJoining: ''
  });
  const [errors, setErrors] = useState({});

  const countries = [
    'indonesia', 'russia', 'usa', 'uk', 'germany', 'france',
    'japan', 'china', 'india', 'australia', 'canada', 'brazil', 'switzerland', 'other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

    if (!formData.termsAccepted) newErrors.termsAccepted = t('mustAgreeTerms');
    if (!formData.willingToParticipate) newErrors.willingToParticipate = t('required');
    if (!formData.reasonForJoining.trim()) newErrors.reasonForJoining = t('required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({
      citizenship: '',
      fullName: '',
      university: '',
      gender: '',
      age: '',
      dietaryRestrictions: '',
      allergies: '',
      termsAccepted: false,
      willingToParticipate: '',
      reasonForJoining: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="registration-form success-state">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>{t('successTitle')}</h2>
          <p>{t('successMessage')}</p>
          <button type="button" className="btn btn-primary" onClick={handleReset}>
            {t('reset')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="registration-form">
      <h2 className="section-title">
        <span className="snowflake">❄️</span>
        {t('registrationForm')}
        <span className="snowflake">❄️</span>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Citizenship */}
          <div className="form-group">
            <label htmlFor="citizenship">{t('citizenship')} *</label>
            <select
              id="citizenship"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              className={errors.citizenship ? 'error' : ''}
            >
              <option value="">{t('selectCitizenship')}</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {t(`countries.${country}`)}
                </option>
              ))}
            </select>
            {errors.citizenship && <span className="error-text">{errors.citizenship}</span>}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">{t('fullName')} *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('fullNamePlaceholder')}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* University */}
          <div className="form-group">
            <label htmlFor="university">{t('university')} *</label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder={t('universityPlaceholder')}
              className={errors.university ? 'error' : ''}
            />
            {errors.university && <span className="error-text">{errors.university}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender">{t('gender')} *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">{t('selectGender')}</option>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
              <option value="other">{t('other')}</option>
              <option value="prefer-not-to-say">{t('preferNotToSay')}</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">{t('age')} *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder={t('agePlaceholder')}
              min="1"
              max="120"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          {/* Dietary Restrictions */}
          <div className="form-group">
            <label htmlFor="dietaryRestrictions">{t('dietaryRestrictions')}</label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              placeholder={t('dietaryPlaceholder')}
            />
          </div>

          {/* Allergies */}
          <div className="form-group full-width">
            <label htmlFor="allergies">{t('allergies')}</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder={t('allergiesPlaceholder')}
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="form-group checkbox-group">
          <label className={`checkbox-label ${errors.termsAccepted ? 'error' : ''}`}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span className="label-text">{t('termsText')}</span>
          </label>
          {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
        </div>

        {/* Willingness to Participate */}
        <div className="form-group">
          <label>{t('willingnessToParticipate')} *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="willingToParticipate"
                value="yes"
                checked={formData.willingToParticipate === 'yes'}
                onChange={handleChange}
              />
              <span className="radio-mark"></span>
              <span>{t('yes')}</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="willingToParticipate"
                value="no"
                checked={formData.willingToParticipate === 'no'}
                onChange={handleChange}
              />
              <span className="radio-mark"></span>
              <span>{t('no')}</span>
            </label>
          </div>
          {errors.willingToParticipate && <span className="error-text">{errors.willingToParticipate}</span>}
        </div>

        {/* Reason for Joining */}
        <div className="form-group full-width">
          <label htmlFor="reasonForJoining">{t('reasonForJoining')} *</label>
          <textarea
            id="reasonForJoining"
            name="reasonForJoining"
            value={formData.reasonForJoining}
            onChange={handleChange}
            placeholder={t('reasonPlaceholder')}
            rows="4"
            className={errors.reasonForJoining ? 'error' : ''}
          ></textarea>
          {errors.reasonForJoining && <span className="error-text">{errors.reasonForJoining}</span>}
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            <span className="btn-icon">🎿</span>
            {t('submit')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            {t('reset')}
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrationForm;
