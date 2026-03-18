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
import ColdWarMap from './components/maps/ColdWarMap';
import PremiumPopup from './components/PremiumPopup';
import CASUALTY_DATA from './components/maps/WW2Map';
import POPULATION_DATA from '../src/data/populationData';
import GDP_DATA from '../src/data/gdpData';
import FuturePastMap from './components/maps/FuturePastMap';
import DataQuiz from './components/DataQuiz';
import PhoneHover from './components/PhoneHover';
import flagColors from './data/flagColors';
import continentMap from './data/continentMap';
import continentColors from './data/continentColors';
import { supabase } from './supaBaseClient';
import SignInPage from './components/SignInPage'; 
import Chat from './components/Chat';
import Achievements from './components/Achievements';

import './App.css';

function App() {
  const [user, setUser] = useState(null);  // ✅ Add this
const [loading, setLoading] = useState(true);  // ✅ Add this
  const { t, language } = useLocalization();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState(null);
  const [showDataQuiz, setShowDataQuiz] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mapMode, setMapMode] = useState('default');
  const [populationView, setPopulationView] = useState('total');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [colorMode, setColorMode] = useState('flag');
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [casualtyField, setCasualtyField] = useState('total');
  const [geographies, setGeographies] = useState([]);
  const [coldWarTab, setColdWarTab] = useState('total');
  const [gdpView, setGdpView] = useState('total');
  const [timelineYear, setTimelineYear] = useState('2025');
  const [timelineView, setTimelineView] = useState('population');
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [hasSeenQuiz, setHasSeenQuiz] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [detectionDone, setDetectionDone] = useState(false);
  const [forceMobile, setForceMobile] = useState(false); 
  const [showChat, setShowChat] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
const [achievementTrigger, setAchievementTrigger] = useState(null);

  const audioRef = useRef(null);
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
  const publicUrl = process.env.PUBLIC_URL || '';

  // Create projection once
  const projection = geoEqualEarth().scale(150).center([-50, 5]);

  //REGISTRATION
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

useEffect(() => {
  const handleAchievementTrigger = (event) => {
    triggerAchievement(event.detail);
  };
  
  window.addEventListener('triggerAchievement', handleAchievementTrigger);
  
  return () => {
    window.removeEventListener('triggerAchievement', handleAchievementTrigger);
  };
}, []);

  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  const handleGuestVisit = () => {
    setUser({ guest: true }); // Guest user
  };

  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // SIMPLE MOBILE DETECTION
  useEffect(() => {
    const checkMobile = () => {
      try {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // More comprehensive mobile detection
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|Tablet|Kindle|Silk/i;
        const isMobileDevice = mobileRegex.test(userAgent);
        
        // Check for touch capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Screen size check
        const isSmallScreen = window.innerWidth <= 1024;
        
        // Detailed logging
        console.log('==== MOBILE DETECTION DEBUG ====');
        console.log('User Agent:', userAgent);
        console.log('Is Mobile Device:', isMobileDevice);
        console.log('Has Touch:', hasTouch);
        console.log('Screen Width:', window.innerWidth);
        console.log('Is Small Screen:', isSmallScreen);
        console.log('===============================');
        
        // Determine if mobile
        const mobileDetected = isMobileDevice || (hasTouch && isSmallScreen);
        
        // FOR TESTING: Use forceMobile state if true
        const finalIsMobile = forceMobile || mobileDetected;
        
        console.log('Final Mobile Detection:', finalIsMobile);
        
        setIsMobile(finalIsMobile);
        setDetectionDone(true);
      } catch (error) {
        console.error('Error detecting mobile:', error);
        setIsMobile(false);
        setDetectionDone(true);
      }
    };

    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [forceMobile]);

  // Show quiz by default on first load (only for desktop)
  useEffect(() => {
    if (detectionDone && !isMobile && !forceMobile) {
      const quizSeen = localStorage.getItem('quizSeen');
      if (!quizSeen) {
        setShowDataQuiz(true);
        localStorage.setItem('quizSeen', 'true');
      }
    }
  }, [isMobile, detectionDone, forceMobile]);

  // Replace your existing audio useEffect with this:
useEffect(() => {
  try {
    // Clean up any existing audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Create new audio instance
    audioRef.current = new Audio(publicUrl + '/music_menu.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = musicVolume / 100;
    
    // Add error handling for audio loading
    audioRef.current.addEventListener('error', (e) => {
      console.log('Audio loading error:', e);
    });
    
  } catch (error) {
    console.log('Audio initialization failed:', error);
  }
  
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear source
      audioRef.current.load(); // Force reload to stop any pending requests
      audioRef.current = null;
    }
  };
}, [publicUrl]); // Add publicUrl as dependency

// Update toggleMusic function:
const toggleMusic = () => {
  if (audioRef.current) {
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      // Create a new promise to handle play()
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsMusicPlaying(true))
          .catch(error => {
            console.log('Audio playback failed:', error);
            // If play fails, try to recreate audio
            if (error.name === 'AbortError' || error.message.includes('Lock broken')) {
              audioRef.current = new Audio(publicUrl + '/music_menu.mp3');
              audioRef.current.loop = true;
              audioRef.current.volume = musicVolume / 100;
              audioRef.current.play()
                .then(() => setIsMusicPlaying(true))
                .catch(e => console.log('Retry failed:', e));
            }
          });
      }
    }
  }
};

  const handleVolumeChange = (e) => {
    setMusicVolume(e.target.value);
  };

  // Color function
  const getCountryColor = (countryName, mode = colorMode) => {
    if (mode === 'flag') {
      return flagColors[countryName] || flagColors['Default'] || '#808080';
    } else if (mode === 'continent') {
      const continent = continentMap[countryName];
      if (continent && continentColors[continent]) {
        return continentColors[continent];
      }
      return flagColors[countryName] || flagColors['Default'] || '#808080';
    }
    return '#808080';
  };

  const usaGdp = GDP_DATA['United States'] || GDP_DATA['United States of America'] || GDP_DATA['USA'];

  const triggerAchievement = (id) => {
  setAchievementTrigger(id);
  setTimeout(() => setAchievementTrigger(null), 100);
};

// Add to existing handlers:
const handleMapModeChange = (mode) => {
  setMapMode(mode);
  // Trigger Time Traveler achievement when switching to timeline
  if (mode === 'timeline') {
    triggerAchievement(2); // Time Traveler
  }
  // Count map modes for Data Explorer
  if (!window.viewedModes) window.viewedModes = new Set();
  window.viewedModes.add(mode);
  if (window.viewedModes.size >= 5) {
    triggerAchievement(5); // Data Explorer
  }
};

  const renderMap = () => {
    if (!geographies.length) return null;

    const commonProps = {
      geographies,
      setSelected,
      getCountryColor,
      colorMode,
      t,
      language,
      projection
    };

    switch (mapMode) {
      case 'gdp':
        return (
          <GDPMap
            {...commonProps}
            gdpData={GDP_DATA}
            usaGdp={usaGdp}
            gdpView={gdpView}
          />
        );
      case 'area':
        return <AreaMap {...commonProps} />;
      case 'population':
        return (
          <PopulationMap
            {...commonProps}
            populationView={populationView}
            populationData={POPULATION_DATA}
          />
        );
      case 'casualty':
        return (
          <WW2Map
            {...commonProps}
            field={casualtyField}
          />
        );
      case 'coldwar':
        return (
          <ColdWarMap
            {...commonProps}
            field={casualtyField}
            selectedWar={coldWarTab}
          />
        );
      case 'timeline':
        return (
          <FuturePastMap
            {...commonProps}
            timelineYear={timelineYear}
            timelineView={timelineView}
          />
        );
      default:
        return (
          <DefaultMap
            {...commonProps}
            gdpData={GDP_DATA}
          />
        );
    }
  };

  // Show loading while detecting
  if (!detectionDone) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <SignInPage 
        onAuthSuccess={handleAuthSuccess}
        onGuestVisit={handleGuestVisit}
      />
    );
  }

  // If mobile OR force mobile, show PhoneHover component
  if (isMobile || forceMobile) {
    console.log('Showing mobile view (isMobile:', isMobile, 'forceMobile:', forceMobile, ')');
    return <PhoneHover t={t} />;
  }

  // Desktop version
  console.log('Showing desktop view');
  return (
    <>
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
          coldWarTab={coldWarTab}
          setColdWarTab={setColdWarTab}
          gdpView={gdpView}
          setGdpView={setGdpView}
          timelineYear={timelineYear}
          setTimelineYear={setTimelineYear}
          timelineView={timelineView}
          setTimelineView={setTimelineView}
          user={user}
          onLogout={handleLogout}
        />

        <div className="map-container">
          <ComposableMap projection={projection} width={1200} height={600}>
            <Geographies geography={geoUrl}>
              {({ geographies: geoData }) => {
                if (geoData && geoData.length > 0 && geographies.length === 0) {
                  setTimeout(() => setGeographies(geoData), 0);
                }
                return renderMap();
              }}
            </Geographies>
          </ComposableMap>
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
                <div>{t('totalDeaths')}: {typeof selected.value.total === 'number' ? formatNumber(selected.value.total, language) : selected.value.total}</div>
                <div>{t('percentOf1939Pop')}: {selected.value.percent}%</div>
                <div>{t('civMil')}: {selected.value.civilianMilitary}</div>
                <div>{t('civFam')}: {selected.value.civilianFamine}</div>
              </>
            ) : selected.type === 'gdp' ? (
              <>
                <div>Total GDP: ${formatGDP(selected.value.total)}T</div>
                <div>Growth: {selected.value.growth > 0 ? '+' : ''}{selected.value.growth}%</div>
                <div>GDP per Capita: ${selected.value.perCapita?.toLocaleString()}</div>
              </>
            ) : selected.type === 'population' ? (
              <>
                <div>{t('populationTotal')}: {selected.value.total}</div>
                <div>{t('populationChangePercent')}: {selected.value.percentChange}</div>
                <div>{t('populationChangeAbsolute')}: {selected.value.absoluteChange}</div>
              </>
            ) : selected.type === 'timeline' ? (
              <>
                <div>Year: {selected.year}</div>
                <div>Population: {selected.value.population?.toLocaleString()}</div>
                <div>GDP: ${selected.value.gdp}B</div>
                <div>Density: {selected.value.density}/km²</div>
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
          gdpData={GDP_DATA}
          casualtyData={CASUALTY_DATA}
          setSelected={setSelected}
          setMapMode={setMapMode}
          mapMode={mapMode}
          setCasualtyField={setCasualtyField}
          casualtyField={casualtyField}
          countryRankMap={{}}
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

        <button
          className="achievements-floating-btn"
          onClick={() => setShowAchievements(true)}
          style={{
            position: 'fixed',
            bottom: '260px',
            right: '20px',
            zIndex: 1000,
            background: '#04ff00',
            color: '#0a1420',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(4, 255, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🏆
        </button>

        {showAchievements && (
          <Achievements
            user={user}
            t={t}
            onClose={() => setShowAchievements(false)}
            triggerAchievement={achievementTrigger}
          />
        )}

        <button
            className="chat-floating-btn"
            onClick={() => setShowChat(!showChat)}
            style={{
              position: 'fixed',
              bottom: '180px',
              right: '20px',
              zIndex: 1000,
              background: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '28px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            💭
          </button>

          {showChat && (
            <div className="chat-wrapper">
              <Chat 
                user={user} 
                t={t} 
                onClose={() => setShowChat(false)} 
              />
            </div>
          )}

        <button
          className="quiz-floating-btn"
          onClick={() => setShowDataQuiz(true)}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            zIndex: 1000,
            background: '#ffd700',
            color: '#0a1420',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          💡
        </button>

        {showDataQuiz && (
          <DataQuiz
            onClose={() => setShowDataQuiz(false)}
            t={t}
            language={language}
          />
        )}

        {user && !user.guest && (
        <div className="user-info-footer">
              <span className="user-email-footer">
                {user.user_metadata?.username || user.email?.split('@')[0] || 'User'}
              </span>
              <button onClick={handleLogout} className="logout-footer-btn">
                LOGOUT
              </button>
            </div>
          )}
          {user?.guest && (
            <div className="guest-info-footer">
              <span className="guest-text-footer">Guest Mode</span>
            </div>
          )}

       <div className="privacy-footer">
        <button onClick={() => setShowPrivacyPopup(true)} className="privacy-link-button">
          [ PRIVACY POLICY ]
        </button>
      </div>


        {showPrivacyPopup && (
          <PrivacyPolicy onAccept={() => setShowPrivacyPopup(false)} t={t} />
        )}
      </div>
    </>
  );
}

export default App;