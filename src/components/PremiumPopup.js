import React, { useState, useEffect } from 'react';

const PremiumPopup = ({ isOpen, onClose, feature, t }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://savelife.in.ua/en/');
    setCopied(true);
  };

  const getFeatureTitle = () => {
    switch(feature) {
      case '2050-population':
      case '2050-gdp':
        return t('year2050');
      case '2100-population':
      case '2100-gdp':
        return t('year2100');
      case 'war-total-casualties':
      case 'war-civilians':
      case 'war-percent-population':
      case 'war-aid-to-ukraine':
      case 'war-russia-business':
        return t('ukraineRussiaWar');
      default:
        return t('premiumFeature');
    }
  };

  const getFeatureDescription = () => {
    switch(feature) {
      case '2050-population':
        return t('expectedPopulation');
      case '2050-gdp':
        return t('expectedGdp');
      case '2100-population':
        return t('expectedPopulation');
      case '2100-gdp':
        return t('expectedGdp');
      case 'war-total-casualties':
        return t('totalCasualties');
      case 'war-civilians':
        return t('civilians');
      case 'war-percent-population':
        return t('percentOfPopulation');
      case 'war-aid-to-ukraine':
        return t('aidToUkraine');
      case 'war-russia-business':
        return t('inPartnershipWithRu');
      default:
        return '';
    }
  };

  return (
    <div className="premium-popup-overlay" onClick={onClose}>
      <div className="premium-popup" onClick={e => e.stopPropagation()}>
        <button className="premium-popup-close" onClick={onClose}>✕</button>
        
        <div className="premium-popup-header">
          <span className="premium-icon">|||</span>
          <h2>{getFeatureTitle()}</h2>
          <span className="premium-icon">|||</span>
        </div>
        
        <div className="premium-popup-content">
          <p className="premium-message">
            {t('featureAvailable')}: <strong>{getFeatureDescription()}</strong>
          </p>
          
          <div className="premium-options">
            <div className="premium-option">
              <h3>{t('upgradeToPremium')}</h3>
              <p>{t('supportProjectMessage')}</p>
              <div className="premium-links">
                <a href="https://www.patreon.com/cw/dumyUA" target="_blank" rel="noopener noreferrer" className="premium-button patreon">
                  PATREON
                </a>
                <a href="https://www.paypal.com/" target="_blank" rel="noopener noreferrer" className="premium-button paypal">
                  PAYPAL
                </a>
                <a href="#" className="premium-button card" onClick={(e) => { e.preventDefault(); alert(t('cardContact')); }}>
                  CARD
                </a>
              </div>
            </div>
            
            <div className="premium-option">
              <h3>{t('helpUkraine')}</h3>
              <div className="premium-links">
                <a href="https://savelife.in.ua/en/" target="_blank" rel="noopener noreferrer" className="premium-button ukraine">
                  {t('humanitarianAid')}
                </a>
                <a href="https://prytulafoundation.org/" target="_blank" rel="noopener noreferrer" className="premium-button ukraine">
                  {t('militaryAid')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPopup;