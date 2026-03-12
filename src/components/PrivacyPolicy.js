import React, { useState } from 'react';

const PrivacyPolicy = ({ onAccept, t }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="privacy-overlay">
      <div className="privacy-modal">
        {/* HEADER - Fixe en haut */}
        <div className="privacy-header">
          <span className="privacy-blink">●</span>
          <span className="privacy-blink">●</span>
        </div>
        
        {/* CONTENU SCROLLABLE - Seulement cette partie défile */}
        <div className="privacy-content">
          <div className="privacy-message">
            <p>{t('systemNotice')}</p>
            <p>{t('dataCollection')}</p>
            <div className="privacy-list">
              <div className="privacy-item">• {t('ipLocation')}</div>
              <div className="privacy-item">• {t('deviceInfo')}</div>
              <div className="privacy-item">• {t('screenResolution')}</div>
              <div className="privacy-item">• {t('interactionData')}</div>
            </div>
            <p>{t('dataUsage')}</p>
            <div className="privacy-list">
              <div className="privacy-item">✓ {t('improveExperience')}</div>
              <div className="privacy-item">✓ {t('analytics')}</div>
              <div className="privacy-item">✓ {t('troubleshooting')}</div>
            </div>
            <p>{t('privacyGuarantee')}</p>
          </div>
          
          <div className="privacy-policy-link">
            <a 
              href="https://docs.google.com/document/d/1RFdlGEqMC6ttvscBnjBiU3pQ-BU1Dmtmp3jTH4wkErA/edit?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="privacy-link"
            >
              [ {t('viewFullPrivacy')} ]
            </a>
          </div>
        </div>

        {/* FOOTER - Fixe en bas (déplacé HORS de privacy-content) */}
        <div className="privacy-footer">
          <button className="privacy-button accept" onClick={handleAccept}>
            ▸ {t('acceptProceed')}
          </button>
        </div>
        
        {/* Terminal footer (optionnel - à garder si vous voulez une deuxième ligne) */}
        <div className="privacy-terminal-footer">
          <span>{t('encryptedConnection')}</span>
          <span className="privacy-status">{t('awaitingAuth')}</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;