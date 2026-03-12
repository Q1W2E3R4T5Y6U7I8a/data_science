import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ 
  mapMode, 
  setMapMode, 
  populationView, 
  setPopulationView, 
  casualtyField, 
  setCasualtyField, 
  colorMode, 
  setColorMode, 
  isMusicPlaying, 
  toggleMusic, 
  showMusicControls, 
  setShowMusicControls, 
  musicVolume, 
  handleVolumeChange, 
  setPremiumFeature, 
  setShowPremiumPopup, 
  t 
}) => {
  return (
    <div className="header">
      <div className="mode-controls">
        <div className="mode-switch">
          <span
            className={mapMode === 'default' ? 'mode-button active' : 'mode-button'}
            onClick={() => setMapMode('default')}
          >{t('default')}</span>
          <span
            className={mapMode === 'gdp' ? 'mode-button active' : 'mode-button'}
            onClick={() => setMapMode('gdp')}
          >{t('gdp')}</span>
          <span
            className={mapMode === 'area' ? 'mode-button active' : 'mode-button'}
            onClick={() => setMapMode('area')}
          >{t('realSize')}</span>

          {/* Population Dropdown */}
          <div className="dropdown">
            <span className={mapMode === 'population' ? 'mode-button active' : 'mode-button'}>{t('population')}</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('population'); 
                  setPopulationView('total'); 
                }} 
                className={`mode-button ${mapMode === 'population' && populationView === 'total' ? 'active' : ''}`}
              >
                {t('populationTotal')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('population'); 
                  setPopulationView('changePercent'); 
                }} 
                className={`mode-button ${mapMode === 'population' && populationView === 'changePercent' ? 'active' : ''}`}
              >
                {t('populationChangePercent')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('population'); 
                  setPopulationView('changeAbsolute'); 
                }} 
                className={`mode-button ${mapMode === 'population' && populationView === 'changeAbsolute' ? 'active' : ''}`}
              >
                {t('populationChangeAbsolute')}
              </span>
            </div>
          </div>
          
          {/* WW2 Dropdown */}
          <div className="dropdown">
            <span
              className={mapMode === 'casualty' ? 'mode-button active casualty' : 'mode-button casualty'}
            >{t('ww2')}</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('casualty'); 
                  setCasualtyField('total'); 
                }} 
                className={`mode-button ${mapMode === 'casualty' && casualtyField === 'total' ? 'active' : ''}`}
              >
                {t('totalDeaths')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('casualty'); 
                  setCasualtyField('civilian'); 
                }} 
                className={`mode-button ${mapMode === 'casualty' && casualtyField === 'civilian' ? 'active' : ''}`}
              >
                {t('civilian')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('casualty'); 
                  setCasualtyField('percent'); 
                }} 
                className={`mode-button ${mapMode === 'casualty' && casualtyField === 'percent' ? 'active' : ''}`}
              >
                {t('percentOfPopulation')}
              </span>
            </div>
          </div>
          
{/*
          {/* Ukraine-Russia War Dropdown * /}
          <div className="dropdown mode-button">{t('ukraineRussiaWar')}
            <div className="dropdown-content">
              <span 
                onClick={() => {
                  setPremiumFeature('war-total-casualties');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('totalCasualties')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('war-civilians');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('civilians')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('war-percent-population');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('percentOfPopulation')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('war-aid-to-ukraine');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('aidToUkraine')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('war-aid-to-ukraine');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('inPartnershipWithUa')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('war-russia-business');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('inPartnershipWithRu')}
              </span>
            </div>
          </div>
          
          <div className="mode-separator">|||||</div>

          {/* 2050 Dropdown * /}
          <div className="dropdown mode-button">{t('year2050')}
            <div className="dropdown-content">
              <span 
                onClick={() => {
                  setPremiumFeature('2050-population');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('expectedPopulation')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('2050-gdp');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('expectedGdp')}
              </span>
            </div>
          </div>
          
          {/* 2100 Dropdown * /}
          <div className="dropdown mode-button">{t('year2100')}
            <div className="dropdown-content">
              <span 
                onClick={() => {
                  setPremiumFeature('2100-population');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('expectedPopulation')}
              </span>
              <span 
                onClick={() => {
                  setPremiumFeature('2100-gdp');
                  setShowPremiumPopup(true);
                }} 
                className="mode-button"
              >
                {t('expectedGdp')}
              </span>
            </div>
          </div>
*/}

          <div className="mode-separator">|||||</div>
          
          <div className="color-mode-switch">
            <span 
              className={colorMode === 'flag' ? 'mode-button active' : 'mode-button'}
              onClick={() => setColorMode('flag')}
            >{t('flag')}</span>
            <span 
              className={colorMode === 'continent' ? 'mode-button active' : 'mode-button'}
              onClick={() => setColorMode('continent')}
            >{t('continent')}</span>
          </div>
        </div>
      </div>
      
      <div className="right-controls">
        <div className="music-control-container"
             onMouseEnter={() => setShowMusicControls(true)}
             onMouseLeave={() => setShowMusicControls(false)}
        >
          <button 
            className={`music-button ${isMusicPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            onTouchStart={() => setShowMusicControls(!showMusicControls)}
          >
            <span className="music-icon">{isMusicPlaying ? '🔊' : '🔇'}</span>
            <span className="music-text">{isMusicPlaying ? t('musicOn') : t('musicOff')}</span>
          </button>
          
          {showMusicControls && (
            <div className="volume-slider-container"
                 onMouseEnter={() => setShowMusicControls(true)}
                 onMouseLeave={() => setShowMusicControls(false)}>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span className="volume-value">{musicVolume}%</span>
            </div>
          )}
        </div>
        
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Header;