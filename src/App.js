// App.js (modified with user info collection)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, ZoomableGroup } from 'react-simple-maps';
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
import Achievements, { AchievementToast } from './components/Achievements';
import { useAchievements } from './hooks/useAchievements';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [isMobile, setIsMobile] = useState(false);
  const [detectionDone, setDetectionDone] = useState(false);
  const [forceMobile, setForceMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [toastAchievement, setToastAchievement] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, zoom: 1 });
  
  // User info collection state
  const [userInfoCollected, setUserInfoCollected] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ip_address: '',
    country: '',
    city: '',
    region: '',
    isp: '',
    timezone: '',
    os: '',
    browser: '',
    browser_version: '',
    device_type: '',
    screen_resolution: '',
    language: '',
    user_agent: '',
    connection_type: ''
  });

  const audioRef = useRef(null);
  const audioInitialized = useRef(false);

  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
  const publicUrl = process.env.PUBLIC_URL || '';
  const projection = geoEqualEarth().scale(150).center([-50, 5]);

  // Use the achievements hook
  const { 
    lastUnlocked,
    unlockedIds,
    resetStats,
    triggerFirstClick,
    triggerTimelineView,
    triggerModeView,
    triggerGDPView,
    triggerSocialButterfly
  } = useAchievements(user);

  // Function to collect user system info
  const collectSystemInfo = () => {
    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf('Windows') > -1) return 'Windows';
      if (ua.indexOf('Mac OS') > -1) return 'macOS';
      if (ua.indexOf('Linux') > -1) return 'Linux';
      if (ua.indexOf('Android') > -1) return 'Android';
      if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
      return 'Unknown OS';
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome';
      if (ua.indexOf('Firefox') > -1) return 'Firefox';
      if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
      if (ua.indexOf('Edg') > -1) return 'Edge';
      if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
      return 'Unknown Browser';
    };

    const getBrowserVersion = () => {
      const ua = navigator.userAgent;
      let version = 'Unknown';
      
      if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
        const match = ua.match(/Chrome\/(\d+\.\d+)/);
        if (match) version = match[1];
      } else if (ua.indexOf('Firefox') > -1) {
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        if (match) version = match[1];
      } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        const match = ua.match(/Version\/(\d+\.\d+)/);
        if (match) version = match[1];
      } else if (ua.indexOf('Edg') > -1) {
        const match = ua.match(/Edg\/(\d+\.\d+)/);
        if (match) version = match[1];
      }
      
      return version;
    };

    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet';
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile';
      }
      return 'Desktop';
    };

    const getScreenResolution = () => {
      return `${window.screen.width}x${window.screen.height}`;
    };

    const getLanguage = () => {
      return navigator.language || navigator.userLanguage || 'Unknown';
    };

    const getConnectionType = () => {
      if (navigator.connection) {
        return navigator.connection.effectiveType || navigator.connection.type || 'Unknown';
      }
      return 'Unknown';
    };

    return {
      os: getOS(),
      browser: getBrowser(),
      browser_version: getBrowserVersion(),
      device_type: getDeviceType(),
      screen_resolution: getScreenResolution(),
      language: getLanguage(),
      user_agent: navigator.userAgent,
      connection_type: getConnectionType()
    };
  };

  // Function to save user info to Supabase
  const saveUserInfoToDatabase = async (userId, isGuest = false) => {
    try {
      // Get system info
      const systemInfo = collectSystemInfo();
      
      // Get location/IP info from ipapi
      let locationData = {};
      try {
        const response = await fetch('https://api.allorigins.win/raw?url=https://ipapi.co/json/');
        const data = await response.json();
        locationData = {
          ip_address: data.ip,
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          isp: data.org || data.isp || 'Unknown',
          timezone: data.timezone || 'Unknown'
        };
      } catch (error) {
        console.error('Error fetching IP data:', error);
        locationData = {
          ip_address: '127.0.0.1',
          country: 'LOCALHOST',
          city: 'LOCAL',
          region: 'LOCAL',
          isp: 'LOCAL NETWORK',
          timezone: 'UTC'
        };
      }

      // Combine all data
      const userInfoData = {
        ...locationData,
        ...systemInfo,
        username: isGuest ? 'Guest' : (user?.user_metadata?.username || user?.email?.split('@')[0] || 'Unknown'),
        email: isGuest ? null : (user?.email || null)
      };

      // Check if user already exists in user_info table
      let query = supabase.from('user_info').select('id, visit_count, last_seen');
      
      if (isGuest) {
        // For guests, we can't use user_id, so we'll use IP address as identifier
        query = query.eq('ip_address', locationData.ip_address).is('user_id', null);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data: existingUser, error: selectError } = await query.single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing user:', selectError);
      }

      if (existingUser) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_info')
          .update({
            ...userInfoData,
            last_seen: new Date().toISOString(),
            visit_count: (existingUser.visit_count || 0) + 1
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error updating user info:', updateError);
        } else {
          console.log('✅ User info updated successfully');
        }
      } else {
        // Insert new record
        const insertData = {
          ...userInfoData,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          visit_count: 1,
          created_at: new Date().toISOString()
        };

        if (!isGuest && userId) {
          insertData.user_id = userId;
        }

        const { error: insertError } = await supabase
          .from('user_info')
          .insert([insertData]);

        if (insertError) {
          console.error('Error inserting user info:', insertError);
        } else {
          console.log('✅ User info saved successfully');
        }
      }

      setUserInfoCollected(true);
    } catch (error) {
      console.error('Error in saveUserInfoToDatabase:', error);
    }
  };

  // Trigger user info collection when user is set
  useEffect(() => {
    if (user && !userInfoCollected) {
      const userId = user.guest ? null : user.id;
      const isGuest = !!user.guest;
      saveUserInfoToDatabase(userId, isGuest);
    }
  }, [user, userInfoCollected]);

  useEffect(() => {
    if (user && user.id) {
      window.testSupabase = supabase;
      window.testUser = user;
      console.log('✅ TEST OBJECTS READY - User ID:', user.id);
    }
  }, [user]);

  // Show toast when achievement is unlocked
  useEffect(() => {
    if (lastUnlocked) {
      setToastAchievement(lastUnlocked);
    }
  }, [lastUnlocked]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomPosition(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.5, 8)
    }));
  };

  const handleZoomOut = () => {
    setZoomPosition(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.5, 0.5)
    }));
  };

  const handleResetZoom = () => {
    setZoomPosition({ x: 0, y: 0, zoom: 1 });
  };

  // Movement handlers - move by 5% of screen
  const handleMoveUp = () => {
    setZoomPosition(prev => ({
      ...prev,
      y: prev.y + 50
    }));
  };

  const handleMoveDown = () => {
    setZoomPosition(prev => ({
      ...prev,
      y: prev.y - 50
    }));
  };

  const handleMoveLeft = () => {
    setZoomPosition(prev => ({
      ...prev,
      x: prev.x - 50
    }));
  };

  const handleMoveRight = () => {
    setZoomPosition(prev => ({
      ...prev,
      x: prev.x + 50
    }));
  };

  // Keyboard shortcuts for zoom and movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleMoveUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleMoveDown();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMoveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMoveRight();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Achievement event listener
  useEffect(() => {
    const handleAchievementEvent = (event) => {
      const { type, data } = event.detail;
      
      switch (type) {
        case 'FIRST_CLICK':
          triggerFirstClick();
          break;
        case 'TIMELINE_VIEW':
          triggerTimelineView();
          break;
        case 'MODE_VIEW':
          triggerModeView(data?.mode);
          break;
        case 'GDP_VIEW':
          triggerGDPView();
          break;
        case 'SOCIAL_BUTTERFLY':
          triggerSocialButterfly();
          break;
        default:
          break;
      }
    };

    window.addEventListener('triggerAchievement', handleAchievementEvent);
    return () => window.removeEventListener('triggerAchievement', handleAchievementEvent);
  }, [triggerFirstClick, triggerTimelineView, triggerModeView, triggerGDPView, triggerSocialButterfly]);

  useEffect(() => {
    const handleOpenSignIn = () => {
      setShowChat(false);
    };
    
    window.addEventListener('openSignIn', handleOpenSignIn);
    return () => window.removeEventListener('openSignIn', handleOpenSignIn);
  }, []);

  // Auth
  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    return () => authListener?.subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const handleAuthSuccess = (user) => {
    setUser(user);
    resetStats();
    // User info will be collected by the useEffect that watches user
  };
  
  const handleGuestVisit = () => {
    setUser({ guest: true });
    resetStats();
    // User info will be collected by the useEffect that watches user
  };
  
  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setUser(null);
    resetStats();
    setUserInfoCollected(false);
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      try {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|Tablet|Kindle|Silk/i;
        const isMobileDevice = mobileRegex.test(userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 1024;
        setIsMobile(forceMobile || isMobileDevice || (hasTouch && isSmallScreen));
        setDetectionDone(true);
      } catch (error) {
        setIsMobile(false);
        setDetectionDone(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [forceMobile]);

  // Quiz on first load
  useEffect(() => {
    if (detectionDone && !isMobile && !forceMobile) {
      if (!localStorage.getItem('quizSeen')) {
        setShowDataQuiz(true);
        localStorage.setItem('quizSeen', 'true');
      }
    }
  }, [isMobile, detectionDone, forceMobile]);

  // Audio
  const initAudio = useCallback(() => {
    if (audioInitialized.current) return;
    
    try {
      const audio = new Audio();
      audio.src = publicUrl + '/music_menu.mp3';
      audio.loop = true;
      audio.volume = musicVolume / 100;
      audio.preload = 'none';
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio loaded successfully');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
      
      audioRef.current = audio;
      audioInitialized.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }, [publicUrl, musicVolume]);

  const toggleMusic = async () => {
    if (!audioInitialized.current) {
      initAudio();
    }
    
    if (!audioRef.current) return;
    
    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        const audio = new Audio(publicUrl + '/music_menu.mp3');
        audio.loop = true;
        audio.volume = musicVolume / 100;
        
        audioRef.current = audio;
        
        await audio.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsMusicPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setMusicVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  // Achievement dispatch function
  const dispatchAchievement = (type, data = {}) => {
    window.dispatchEvent(new CustomEvent('triggerAchievement', { 
      detail: { type, data } 
    }));
  };

  const getCountryColor = (countryName, mode = colorMode) => {
    if (mode === 'flag') return flagColors[countryName] || flagColors['Default'] || '#808080';
    if (mode === 'continent') {
      const continent = continentMap[countryName];
      if (continent && continentColors[continent]) return continentColors[continent];
      return flagColors[countryName] || flagColors['Default'] || '#808080';
    }
    return '#808080';
  };

  const usaGdp = GDP_DATA['United States'] || GDP_DATA['United States of America'] || GDP_DATA['USA'];

  const handleMapModeChange = (mode) => {
    setMapMode(mode);
    
    if (mode === 'timeline') {
      dispatchAchievement('TIMELINE_VIEW');
    }
    dispatchAchievement('MODE_VIEW', { mode });
  };

  const handleCountrySelect = (country) => {
    setSelected(country);
    dispatchAchievement('FIRST_CLICK');
    
    if (mapMode === 'gdp') {
      dispatchAchievement('GDP_VIEW');
    }
  };

  const commonProps = {
    geographies,
    setSelected: handleCountrySelect,
    getCountryColor,
    colorMode, 
    t, 
    language, 
    projection
  };

  const renderMapContent = () => {
    if (!geographies.length) return null;
    
    switch (mapMode) {
      case 'gdp': return <GDPMap {...commonProps} gdpData={GDP_DATA} usaGdp={usaGdp} gdpView={gdpView} />;
      case 'area': return <AreaMap {...commonProps} />;
      case 'population': return <PopulationMap {...commonProps} populationView={populationView} populationData={POPULATION_DATA} />;
      case 'casualty': return <WW2Map {...commonProps} field={casualtyField} />;
      case 'coldwar': return <ColdWarMap {...commonProps} field={casualtyField} selectedWar={coldWarTab} />;
      case 'timeline': return <FuturePastMap {...commonProps} timelineYear={timelineYear} timelineView={timelineView} />;
      default: return <DefaultMap {...commonProps} gdpData={GDP_DATA} />;
    }
  };

  if (!detectionDone) return <div className="loading"><div>Loading...</div></div>;
  if (!user) return <SignInPage onAuthSuccess={handleAuthSuccess} onGuestVisit={handleGuestVisit} />;
  if (isMobile || forceMobile) return <PhoneHover t={t} />;

  return (
    <>
      <div className="app">
        <Header
          mapMode={mapMode} 
          setMapMode={handleMapModeChange}
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

          <div className="controls-wrapper">
            {/* Movement Controls */}

            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button className="zoom-btn zoom-in" onClick={handleZoomIn} title="Zoom In (Ctrl + / Cmd +)">
                +
              </button>
              <button className="zoom-btn zoom-out" onClick={handleZoomOut} title="Zoom Out (Ctrl - / Cmd -)">
                −
              </button>
              <button className="zoom-btn zoom-reset" onClick={handleResetZoom} title="Reset View">
                ⊞
              </button>
              <div className="zoom-level">
                {Math.round(zoomPosition.zoom * 100)}%
              </div>
            </div>
            <div className="movement-controls">
              <button className="move-btn move-up" onClick={handleMoveUp} title="Move Up (Arrow Up)">
                ▲
              </button>
              <div className="move-middle-row">
                <button className="move-btn move-left" onClick={handleMoveLeft} title="Move Left (Arrow Left)">
                  ◀
                </button>
                <button className="move-btn move-down" onClick={handleMoveDown} title="Move Down (Arrow Down)">
                  ▼
                </button>
                <button className="move-btn move-right" onClick={handleMoveRight} title="Move Right (Arrow Right)">
                  ▶
                </button>
              </div>
            </div>
          </div>

          <ComposableMap 
            projection={projection} 
            width={1200} 
            height={600}
            style={{ cursor: 'default' }}
          >
            <ZoomableGroup
              center={[zoomPosition.x, zoomPosition.y]}
              zoom={zoomPosition.zoom}
              pan={false}
              zoomEnabled={false}
              style={{ cursor: 'default' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies: geoData }) => {
                  if (geoData && geoData.length > 0 && geographies.length === 0) {
                    setTimeout(() => setGeographies(geoData), 0);
                  }
                  return renderMapContent();
                }}
              </Geographies>
            </ZoomableGroup>
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
          setSelected={handleCountrySelect} 
          setMapMode={handleMapModeChange}
          mapMode={mapMode} 
          setCasualtyField={setCasualtyField}
          casualtyField={casualtyField} 
          countryRankMap={{}} 
          t={t} 
          language={language}
        />

        <PremiumPopup
          isOpen={showPremiumPopup}
          onClose={() => { setShowPremiumPopup(false); setMapMode(mapMode); }}
          feature={premiumFeature} 
          t={t}
        />

        {/* Floating Buttons */}
        <button 
          className="achievements-floating-btn" 
          onClick={() => setShowAchievements(true)}
          style={{ 
            position:'fixed', 
            bottom:'260px', 
            right:'20px', 
            zIndex:1000, 
            background:'#04ff00',
            color:'#0a1420', 
            border:'none', 
            borderRadius:'50%', 
            width:'60px', 
            height:'60px',
            fontSize:'28px', 
            cursor:'pointer', 
            boxShadow:'0 0 20px rgba(4,255,0,0.5)',
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center' 
          }}
        >
          🏆
          {unlockedIds.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unlockedIds.length}
            </span>
          )}
        </button>

        <button 
          className="chat-floating-btn" 
          onClick={() => setShowChat(!showChat)}
          style={{ 
            position:'fixed', 
            bottom:'180px', 
            right:'20px', 
            zIndex:1000, 
            background:'#4a90e2',
            color:'white', 
            border:'none', 
            borderRadius:'50%', 
            width:'60px', 
            height:'60px',
            fontSize:'28px', 
            cursor:'pointer', 
            boxShadow:'0 0 20px rgba(74,144,226,0.5)',
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center', 
            transition:'all 0.3s ease' 
          }}
        >
          💭
        </button>

        {showChat && (
          <div className="chat-wrapper">
            <Chat user={user} onClose={() => setShowChat(false)} />
          </div>
        )}

        <button 
          className="quiz-floating-btn" 
          onClick={() => setShowDataQuiz(true)}
          style={{ 
            position:'fixed', 
            bottom:'100px', 
            right:'20px', 
            zIndex:1000, 
            background:'#ffd700',
            color:'#0a1420', 
            border:'none', 
            borderRadius:'50%', 
            width:'60px', 
            height:'60px',
            fontSize:'24px', 
            cursor:'pointer', 
            boxShadow:'0 0 20px rgba(255,215,0,0.5)',
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center' 
          }}
        >
          💡
        </button>

        {showDataQuiz && (
          <DataQuiz onClose={() => setShowDataQuiz(false)} t={t} language={language} />
        )}

        {/* User Info Footer */}
        {user && !user.guest && (
          <div className="user-info-footer">
            <span className="user-email-footer">
              {user.user_metadata?.username || user.email?.split('@')[0] || 'User'}
            </span>
            <button onClick={handleLogout} className="logout-footer-btn">LOGOUT</button>
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

        {/* Achievement Toast */}
        {toastAchievement && (
          <AchievementToast 
            achievementId={toastAchievement} 
            onDone={() => setToastAchievement(null)} 
          />
        )}

        {/* Achievements Modal */}
        {showAchievements && (
          <Achievements 
            user={user} 
            onClose={() => setShowAchievements(false)} 
            unlockedIds={unlockedIds}
          />
        )}
      </div>
    </>
  );
}

export default App;