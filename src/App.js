import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor, getArea, hasAreaData, formatArea, formatGDP } from './countryUtils';
import CodInfo from './components/CodInfo';
import PrivacyPolicy from './components/PrivacyPolicy';
import DefaultMap from './components/maps/DefaultMap';
import GDPMap from './components/maps/GDPMap';
import AreaMap from './components/maps/AreaMap';
import './App.css';

function App() {
  const [gdpData, setGdpData] = useState({});
  const [selected, setSelected] = useState(null);
  const [mapMode, setMapMode] = useState('default');
  const [countryColors, setCountryColors] = useState({});
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [colorMode, setColorMode] = useState('flag');
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [geographies, setGeographies] = useState([]);
  const [countryRankMap, setCountryRankMap] = useState({});

  const audioRef = useRef(null);
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/music_menu.mp3');
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
    fetch('/GDP_data.csv')
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
            </div>
            
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
            
            <div className="music-control-container">
              <button 
                className={`music-button ${isMusicPlaying ? 'playing' : ''}`}
                onClick={toggleMusic}
                onMouseEnter={() => setShowMusicControls(true)}
                onMouseLeave={() => setShowMusicControls(false)}
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
              <div>
                {mapMode === 'area' ? 'AREA: ' : 'GDP: '}
                {mapMode === 'area' ? formatArea(selected.value) : formatGDP(selected.value)}
              </div>
              <div className="close" onClick={() => setSelected(null)}>✕</div>
            </div>
          )}
          
          <CodInfo />
        </div>
      )}
    </>
  );
}

export default App;