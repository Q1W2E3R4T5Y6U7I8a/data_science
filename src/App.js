import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies } from 'react-simple-maps';
import { geoEqualEarth } from 'd3-geo';
import { getFlagColor, formatArea, formatGDP } from './countryUtils';
import useLocalization from './hooks/userLocalisation';
import Header from './components/Header';
import { formatNumber, formatCurrency } from './utils/localeFormatter';
import CodInfo from './components/CodInfo';
import PrivacyPolicy from './components/PrivacyPolicy';
import DefaultMap from './components/maps/DefaultMap';
import GDPMap from './components/maps/GDPMap';
import PopulationMap from './components/maps/PopulationMap';
import AreaMap from './components/maps/AreaMap';
import WW2Map from './components/maps/WW2Map';
import PremiumPopup from './components/PremiumPopup';
import CASUALTY_DATA from './components/maps/WW2Map';
import POPULATION_DATA from '../src/data/populationData';

import './App.css';

function App() {
  const { t, language } = useLocalization();
  const [gdpData, setGdpData] = useState({});
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mapMode, setMapMode] = useState('default');
  const [populationView, setPopulationView] = useState('total');
  const [countryColors, setCountryColors] = useState({});
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [colorMode, setColorMode] = useState('flag');
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [casualtyField, setCasualtyField] = useState('total');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [geographies, setGeographies] = useState([]);
  const [countryRankMap, setCountryRankMap] = useState({});

  const audioRef = useRef(null);
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
  const publicUrl = process.env.PUBLIC_URL || '';

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
            t={t}
            language={language}
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
            t={t}
            language={language}
          />
        );
      case 'population':
        return (
          <PopulationMap 
            geographies={geographies}
            countryColors={countryColors}
            setSelected={setSelected}
            getCountryColor={getCountryColor}
            colorMode={colorMode}
            populationView={populationView}
            t={t}
            populationData={POPULATION_DATA}
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
            t={t}
            language={language}
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
            t={t}
            language={language}
          />
        );
    }
  };

  return (
    <>
      {!privacyAccepted && <PrivacyPolicy onAccept={handlePrivacyAccept} t={t} />}
      
      {privacyAccepted && (
        <div className="app">
          <Header 
            mapMode={mapMode}
            setMapMode={setMapMode}
            populationView={populationView}
            setPopulationView={setPopulationView}
            casualtyField={casualtyField}
            setCasualtyField={setCasualtyField}
            colorMode={colorMode}
            setColorMode={setColorMode}
            isMusicPlaying={isMusicPlaying}
            toggleMusic={toggleMusic}
            showMusicControls={showMusicControls}
            setShowMusicControls={setShowMusicControls}
            musicVolume={musicVolume}
            handleVolumeChange={handleVolumeChange}
            setPremiumFeature={setPremiumFeature}
            setShowPremiumPopup={setShowPremiumPopup}
            t={t}
          />

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
            {/* DataDUM Emblem Link */}
          <div className="map-emblem">
            <a href="https://q1w2e3r4t5y6u7i8a.github.io/dumy_page/" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/dumy_emblem.png`} alt="DataDUM Emblem" />
            </a>
          </div>
          </div>

          {selected && (
            <div className="target">
              <div>{t('target')}: {selected.name}</div>
              {selected.type === 'casualty' ? (
                <>
                  <div>{t('totalDeaths')}: {typeof selected.value.total === 'number' ? 
                    formatNumber(selected.value.total, language) : selected.value.total}</div>
                  <div>{t('percentOf1939Pop')}: {selected.value.percent}%</div>
                  <div>{t('civMil')}: {selected.value.civilianMilitary}</div>
                  <div>{t('civFam')}: {selected.value.civilianFamine}</div>
                </>
              ) : selected.type === 'population' ? (
                <>
                  <div>{t('populationTotal')}: {selected.value.total}</div>
                  <div>{t('populationChangePercent')}: {selected.value.percentChange}</div>
                  <div>{t('populationChangeAbsolute')}: {selected.value.absoluteChange}</div>
                </>
              ) : (
                <div>
                  {mapMode === 'area' ? t('area') : t('gdpLabel')}: 
                  {mapMode === 'area' ? formatArea(selected.value) : formatCurrency(selected.value, language)}
                </div>
              )}
              <div className="close" onClick={() => setSelected(null)}>✕</div>
            </div>
          )}
          
          <CodInfo 
            gdpData={gdpData}
            casualtyData={CASUALTY_DATA}
            setSelected={setSelected}
            setMapMode={setMapMode}
            mapMode={mapMode}
            setCasualtyField={setCasualtyField}
            casualtyField={casualtyField}
            countryRankMap={countryRankMap}
            t={t}
            language={language}
          />
          
          <PremiumPopup 
            isOpen={showPremiumPopup}
            onClose={() => {
              setShowPremiumPopup(false);
              setMapMode(mapMode);
            }}
            feature={premiumFeature}
            t={t}
          />
        </div>
      )}
    </>
  );
}

export default App;