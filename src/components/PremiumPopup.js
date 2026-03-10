import React, { useState, useEffect } from 'react';

const PremiumPopup = ({ isOpen, onClose, feature }) => {
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
      case '2050': return '2050 PROJECTIONS';
      case '2100': return '2100 PROJECTIONS';
      case 'ukraine-war': return 'UKRAINE-RUSSIA WAR DATA';
      default: return 'PREMIUM CONTENT';
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
            This is premium content. To access this feature, please choose one of the options below:
          </p>
          
          <div className="premium-options">
            <div className="premium-option">
              <h3>OPTION 1: SUPPORT THE PROJECT</h3>
              <p>The amount doesn't matter, it's kind of voluntering project for the moment</p>
              <div className="premium-links">
                <a href="https://www.patreon.com/" target="_blank" rel="noopener noreferrer" className="premium-button patreon">
                  PATREON
                </a>
                <a href="https://www.paypal.com/" target="_blank" rel="noopener noreferrer" className="premium-button paypal">
                  PAYPAL
                </a>
                <a href="#" className="premium-button card" onClick={(e) => { e.preventDefault(); alert('Contact for card donations: premium@example.com'); }}>
                  CARD
                </a>
              </div>
            </div>
            
            <div className="premium-option">
              <h3>OPTION 2: HELP UKRAINE</h3>
              <div className="premium-links">
                <a href="https://savelife.in.ua/en/" target="_blank" rel="noopener noreferrer" className="premium-button ukraine">
                  HUMANITARIAN AID
                </a>
                <a href="https://savelife.in.ua/en/" target="_blank" rel="noopener noreferrer" className="premium-button ukraine">
                  MILITARY AID
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