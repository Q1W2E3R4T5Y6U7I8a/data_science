import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor, getArea, hasAreaData, formatArea, formatGDP } from './countryUtils';
import CodInfo from './components/CodInfo';
import PrivacyPolicy from './components/PrivacyPolicy';
import DefaultMap from './components/maps/DefaultMap';
import GDPMap from './components/maps/GDPMap';
import AreaMap from './components/maps/AreaMap';
import WW2Map from './components/maps/WW2Map';
import PremiumPopup from './components/PremiumPopup';
import CASUALTY_DATA from './components/maps/WW2Map';

import './App.css';

function App() {
  const [gdpData, setGdpData] = useState({});
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
const [premiumFeature, setPremiumFeature] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mapMode, setMapMode] = useState('default');
  const [countryColors, setCountryColors] = useState({});
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [colorMode, setColorMode] = useState('flag');
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [casualtyField, setCasualtyField] = useState('total'); // metric for WW2 map: total, percent or civilian deaths
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [geographies, setGeographies] = useState([]);
  const [countryRankMap, setCountryRankMap] = useState({});

  const audioRef = useRef(null);
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

  const publicUrl = process.env.PUBLIC_URL || '';

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(publicUrl + '/music_menu.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = musicVolume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.log('Audio playback failed:', error);
          });
      }
    }
  };

  const handleVolumeChange = (e) => {
    setMusicVolume(e.target.value);
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
  };

  useEffect(() => {
    fetch(publicUrl + '/GDP_data.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const gdpMap = {};
        const rankMap = {};
        
        for (let line of lines) {
          if (!line.trim()) continue;
          const match = line.match(/^(\d+),([^,]+),"?\$([0-9,]+)"?/);
          if (match) {
            const rank = parseInt(match[1], 10);
            let country = match[2].trim();
            country = country.replace(/\s*\([^)]*\)/g, '').replace(/\[|\]/g, '').trim();
            const gdpStr = match[3].replace(/,/g, '');
            const gdp = parseFloat(gdpStr);
            
            gdpMap[country] = gdp;
            rankMap[country] = rank;
          }
        }
        
        const alias = (newName, existingName) => {
          if (gdpMap[existingName] !== undefined && gdpMap[newName] === undefined) {
            gdpMap[newName] = gdpMap[existingName];
            if (rankMap[existingName]) {
              rankMap[newName] = rankMap[existingName];
            }
          }
        };
        alias('United States of America', 'United States');
        alias('USA', 'United States');
        alias('UK', 'United Kingdom');
        alias('Russian Federation', 'Russia');
        alias('Czechia', 'Czech Republic');
        
        setGdpData(gdpMap);
        setCountryRankMap(rankMap);
        
        const initialColors = {};
        Object.keys(gdpMap).forEach(country => {
          initialColors[country] = getFlagColor(country);
        });
        setCountryColors(initialColors);
      });
  }, []);

  const getColor = (countryName) => {
    if (countryColors[countryName]) return countryColors[countryName];
    return getFlagColor(countryName);
  };

  const getCountryColor = (countryName, mode = colorMode) => {
    const rank = countryRankMap[countryName];
    if (!rank) return getFlagColor(countryName);
    
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(`--${mode}-${rank}`).trim();
    return color || getFlagColor(countryName);
  };

  const usaGdp = gdpData['United States'] || gdpData['United States of America'] || gdpData['USA'];

  const renderMap = () => {
    if (!geographies.length) return null;

    switch(mapMode) {
      case 'gdp':
        return (
          <GDPMap 
            geographies={geographies}
            gdpData={gdpData}
            usaGdp={usaGdp}
            countryColors={countryColors}
            setSelected={setSelected}
            getCountryColor={getCountryColor}
            colorMode={colorMode}    
          />
        );
      case 'area':
        return (
          <AreaMap 
            geographies={geographies}
            countryColors={countryColors}
            setSelected={setSelected}
            getCountryColor={getCountryColor}
            colorMode={colorMode}    
          />
        );
      case 'casualty':
        return (
          <WW2Map 
            geographies={geographies}
            countryColors={countryColors}
            setSelected={setSelected}
            getCountryColor={getCountryColor}
            colorMode={colorMode}
            field={casualtyField}
          />
        );
      default:
        return (
          <DefaultMap 
            geographies={geographies}
            gdpData={gdpData}
            countryColors={countryColors}
            setSelected={setSelected}
            getCountryColor={getCountryColor}
            colorMode={colorMode}    
          />
        );
    }
  };

  return (
    <>
      {!privacyAccepted && <PrivacyPolicy onAccept={handlePrivacyAccept} />}
      
      {privacyAccepted && (
        <div className="app">
        <div className="header">
  <div className="mode-controls">
    <div className="mode-switch">
      <span
        className={mapMode === 'default' ? 'mode-button active' : 'mode-button'}
        onClick={() => setMapMode('default')}
      >DEFAULT</span>
      <span
        className={mapMode === 'gdp' ? 'mode-button active' : 'mode-button'}
        onClick={() => setMapMode('gdp')}
      >GDP</span>
      <span
        className={mapMode === 'area' ? 'mode-button active' : 'mode-button'}
        onClick={() => setMapMode('area')}
      >REAL SIZE</span>
      
      {/* WW2 Dropdown */}
      <div className="dropdown">
        <span
          className={mapMode === 'casualty' ? 'mode-button active casualty' : 'mode-button casualty'}
        >WW2</span>
        <div className="dropdown-content">
          <span 
            onClick={() => { 
              setMapMode('casualty'); 
              setCasualtyField('total'); 
            }} 
            className={`mode-button ${mapMode === 'casualty' && casualtyField === 'total' ? 'active' : ''}`}
          >
            TOTAL DEATHS
          </span>
          <span 
            onClick={() => { 
              setMapMode('casualty'); 
              setCasualtyField('civilian'); 
            }} 
            className={`mode-button ${mapMode === 'casualty' && casualtyField === 'civilian' ? 'active' : ''}`}
          >
            CIVILIAN
          </span>
          <span 
            onClick={() => { 
              setMapMode('casualty'); 
              setCasualtyField('percent'); 
            }} 
            className={`mode-button ${mapMode === 'casualty' && casualtyField === 'percent' ? 'active' : ''}`}
          >
            PERCENT OF POPULATION
          </span>
        </div>
      </div>
      
      {/* Ukraine-Russia War Dropdown */}
      <div className="dropdown mode-button">UKRAINE-RUSSIA WAR
        <div className="dropdown-content">
          <span 
            onClick={() => {
              setPremiumFeature('war-total-casualties');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            TOTAL CASUALTIES
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('war-civilians');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            CIVILIANS
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('war-percent-population');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            % OF POPULATION
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('war-aid-to-ukraine');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            $ AID TO UKRAINE
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('war-aid-to-ukraine');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            $ IN PARTNERSHIP WITH UA
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('war-russia-business');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            $ IN PARTNERSHIP WITH ru
          </span>
        </div>
      </div>
      
      <div className="mode-separator">|||||</div>

            {/* 2050 Dropdown */}
      <div className="dropdown mode-button">2050
        <div className="dropdown-content">
          <span 
            onClick={() => {
              setPremiumFeature('2050-population');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            EXPECTED POPULATION
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('2050-gdp');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            EXPECTED GDP
          </span>
        </div>
      </div>
      
      {/* 2100 Dropdown */}
      <div className="dropdown mode-button">2100
        <div className="dropdown-content">
          <span 
            onClick={() => {
              setPremiumFeature('2100-population');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            EXPECTED POPULATION
          </span>
          <span 
            onClick={() => {
              setPremiumFeature('2100-gdp');
              setShowPremiumPopup(true);
            }} 
            className="mode-button"
          >
            EXPECTED GDP
          </span>
        </div>
      </div>

      <div className="mode-separator">|||||</div>
      
      <div className="color-mode-switch">
        <span 
          className={colorMode === 'flag' ? 'mode-button active' : 'mode-button'}
          onClick={() => setColorMode('flag')}
        >FLAG</span>
        <span 
          className={colorMode === 'continent' ? 'mode-button active' : 'mode-button'}
          onClick={() => setColorMode('continent')}
        >CONTINENT</span>
      </div>
    </div>
    
    <div className="music-control-container">
      <button 
        className={`music-button ${isMusicPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
        onMouseEnter={() => setShowMusicControls(true)}
        onMouseLeave={() => setShowMusicControls(false)}
        onTouchStart={() => setShowMusicControls(!showMusicControls)}
      >
        <span className="music-icon">{isMusicPlaying ? '🔊' : '🔇'}</span>
        <span className="music-text">{isMusicPlaying ? 'MUSIC ON' : 'MUSIC OFF'}</span>
      </button>
      
      {showMusicControls && (
        <div className="volume-slider-container">
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
  </div>
</div>

          <div className="map-container">
            <ComposableMap projection="geoEqualEarth" width={1200} height={600}>
              <Geographies geography={geoUrl}>
                {({ geographies: geoData }) => {
                  if (!geographies.length) {
                    setGeographies(geoData);
                  }
                  return renderMap();
                }}
              </Geographies>
            </ComposableMap>
            <div className="compass">N</div>
          </div>

          {selected && (
            <div className="target">
              <div>TARGET: {selected.name}</div>
              {selected.type === 'casualty' ? (
                <>
                  <div>TOTAL DEATHS: {typeof selected.value.total === 'number' ? 
                    new Intl.NumberFormat().format(selected.value.total) : selected.value.total}</div>
                  <div>% OF 1939 POP: {selected.value.percent}%</div>
                  <div>CIV (MIL): {selected.value.civilianMilitary}</div>
                  <div>CIV (FAM): {selected.value.civilianFamine}</div>
                </>
              ) : (
                <div>
                  {mapMode === 'area' ? 'AREA: ' : 'GDP: '}
                  {mapMode === 'area' ? formatArea(selected.value) : formatGDP(selected.value)}
                </div>
              )}
              <div className="close" onClick={() => setSelected(null)}>✕</div>
            </div>
          )}
          
          <CodInfo 
              gdpData={gdpData}
              casualtyData={CASUALTY_DATA} // you need to import this from WW2Map or define it in App
              setSelected={setSelected}
              setMapMode={setMapMode}
              mapMode={mapMode}
              setCasualtyField={setCasualtyField}
              casualtyField={casualtyField}
              countryRankMap={countryRankMap}
            />
          <PremiumPopup 
            isOpen={showPremiumPopup}
            onClose={() => {
              setShowPremiumPopup(false);
              setMapMode(mapMode); // Keep current mode but don't actually switch
            }}
            feature={premiumFeature}
          />
        </div>
      )}
    </>
  );
}

export default App;