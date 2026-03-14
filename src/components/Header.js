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
  coldWarTab, 
  setColdWarTab,
  gdpView,
  setGdpView,
  timelineYear,
  setTimelineYear,
  timelineView,
  setTimelineView,
  t  // This is the translation function
}) => {  

  return (
    <div className="header">
      <div className="mode-controls">
        <div className="mode-switch">
          <span
            className={mapMode === 'default' ? 'mode-button active' : 'mode-button'}
            onClick={() => setMapMode('default')}
          >{t('default')}</span>
          
          {/* GDP Dropdown */}
          <div className="dropdown">
            <span
              className={mapMode === 'gdp' ? 'mode-button active' : 'mode-button'}
            >{t('gdp')}</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('gdp'); 
                  setGdpView('total'); 
                }} 
                className={`mode-button ${mapMode === 'gdp' && gdpView === 'total' ? 'active' : ''}`}
              >
                {t('totalGdp')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('gdp'); 
                  setGdpView('growth'); 
                }} 
                className={`mode-button ${mapMode === 'gdp' && gdpView === 'growth' ? 'active' : ''}`}
              >
                {t('gdpGrowth')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('gdp'); 
                  setGdpView('perCapita'); 
                }} 
                className={`mode-button ${mapMode === 'gdp' && gdpView === 'perCapita' ? 'active' : ''}`}
              >
                {t('gdpPerCapita')}
              </span>
            </div>
          </div>

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

          <div className="mode-separator">|||||</div>

          {/* 1900 Dropdown (Past) */}
          <div className="dropdown">
            <span
              className={mapMode === 'timeline' && timelineYear === '1900' ? 'mode-button active' : 'mode-button'}
            >1900</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('1900');
                  setTimelineView('population');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '1900' && timelineView === 'population' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('1900');
                  setTimelineView('gdp');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '1900' && timelineView === 'gdp' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

          {/* 1950 Dropdown (Past) */}
          <div className="dropdown">
            <span
              className={mapMode === 'timeline' && timelineYear === '1950' ? 'mode-button active' : 'mode-button'}
            >1950</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('1950');
                  setTimelineView('population');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '1950' && timelineView === 'population' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('1950');
                  setTimelineView('gdp');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '1950' && timelineView === 'gdp' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

          {/* 2000 Dropdown (Past/Future boundary) */}
          <div className="dropdown">
            <span
              className={mapMode === 'timeline' && timelineYear === '2000' ? 'mode-button active' : 'mode-button'}
            >2000</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2000');
                  setTimelineView('population');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2000' && timelineView === 'population' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2000');
                  setTimelineView('gdp');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2000' && timelineView === 'gdp' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

          {/* NOW Dropdown (Current Data) */}
          <div className="dropdown">
            <span
              className={mapMode === 'population' || mapMode === 'gdp' ? 'mode-button active' : 'mode-button'}
            >{t('2025')}</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('population');
                  setPopulationView('total');
                }} 
                className={`mode-button ${mapMode === 'population' && populationView === 'total' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('gdp');
                  setGdpView('total');
                }} 
                className={`mode-button ${mapMode === 'gdp' && gdpView === 'total' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

          {/* 2050 Dropdown (Future) */}
          <div className="dropdown">
            <span
              className={mapMode === 'timeline' && timelineYear === '2050' ? 'mode-button active' : 'mode-button'}
            >2050</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2050');
                  setTimelineView('population');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2050' && timelineView === 'population' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2050');
                  setTimelineView('gdp');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2050' && timelineView === 'gdp' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

          {/* 2100 Dropdown (Future) */}
          <div className="dropdown">
            <span
              className={mapMode === 'timeline' && timelineYear === '2100' ? 'mode-button active' : 'mode-button'}
            >2100</span>
            <div className="dropdown-content">
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2100');
                  setTimelineView('population');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2100' && timelineView === 'population' ? 'active' : ''}`}
              >
                {t('population')}
              </span>
              <span 
                onClick={() => { 
                  setMapMode('timeline'); 
                  setTimelineYear('2100');
                  setTimelineView('gdp');
                }} 
                className={`mode-button ${mapMode === 'timeline' && timelineYear === '2100' && timelineView === 'gdp' ? 'active' : ''}`}
              >
                {t('gdp')}
              </span>
            </div>
          </div>

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