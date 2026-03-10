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
  <p>SYSTEM NOTICE</p>
  <p>This website collects basic usage data including:</p>
  <div className="privacy-list">
    <div className="privacy-item">• IP address and location (city/country)</div>
    <div className="privacy-item">• Device type and browser information</div>
    <div className="privacy-item">• Screen resolution and operating system</div>
    <div className="privacy-item">• Basic interaction data for analytics</div>
  </div>
  <p>This data is used solely for:</p>
  <div className="privacy-list">
    <div className="privacy-item">✓ Improving user experience</div>
    <div className="privacy-item">✓ Website analytics and performance</div>
    <div className="privacy-item">✓ Technical troubleshooting</div>
  </div>
  <p>No personal identifying information is sold or shared with third parties.</p>
</div>
          
          <div className="privacy-policy-link">
            <a 
              href="https://docs.google.com/document/d/1RFdlGEqMC6ttvscBnjBiU3pQ-BU1Dmtmp3jTH4wkErA/edit?usp=sharing" 
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