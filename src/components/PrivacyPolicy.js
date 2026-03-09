// components/PrivacyPolicy.js
import React, { useState } from 'react';

const PrivacyPolicy = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="privacy-overlay">
      <div className="privacy-modal">
        <div className="privacy-header">
          <span className="privacy-blink">●</span>

          <span className="privacy-blink">●</span>
        </div>
        
        <div className="privacy-content">
          <div className="privacy-message">

            <p>By proceeding, you acknowledge and agree to:</p>
          </div>
          
          <div className="privacy-policy-link">
            <a 
              href="https://docs.google.com/document/d/YOUR_DOCUMENT_ID/edit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="privacy-link"
            >
              [ VIEW FULL PRIVACY PROTOCOL ]
            </a>
          </div>
          
          <div className="privacy-footer">
            <button className="privacy-button accept" onClick={handleAccept}>
              ▸ ACCEPT & PROCEED
            </button>
          </div>
        </div>
        
        <div className="privacy-terminal-footer">
          <span>ENCRYPTED CONNECTION</span>
          <span className="privacy-status">AWAITING AUTHORIZATION</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;