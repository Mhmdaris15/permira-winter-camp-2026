import { useTranslation } from 'react-i18next';
import './EventDetails.css';

function EventDetails() {
  const { t } = useTranslation();

  const activities = [
    { key: 'skiing', icon: '⛷️' },
    { key: 'hiking', icon: '🥾' },
    { key: 'bonfire', icon: '🔥' },
    { key: 'workshops', icon: '🏕️' },
    { key: 'photography', icon: '📸' },
    { key: 'games', icon: '🎿' }
  ];

  return (
    <section className="event-details">
      <h2 className="section-title">
        <span className="snowflake">❄️</span>
        {t('eventDetails')}
        <span className="snowflake">❄️</span>
      </h2>

      <div className="details-grid">
        <div className="detail-card">
          <div className="detail-icon">📅</div>
          <h3>{t('dateTime')}</h3>
          <p>{t('dateTimeValue')}</p>
        </div>

        <div className="detail-card">
          <div className="detail-icon">📍</div>
          <h3>{t('location')}</h3>
          <p>{t('locationValue')}</p>
        </div>
      </div>

      <div className="event-overview">
        <h3>
          <span className="icon">🏔️</span>
          {t('eventOverview')}
        </h3>
        <p className="description">{t('eventDescription')}</p>

        <div className="activities-grid">
          {activities.map((activity) => (
            <div key={activity.key} className="activity-item">
              <span className="activity-icon">{activity.icon}</span>
              <span className="activity-text">{t(`activities.${activity.key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventDetails;
