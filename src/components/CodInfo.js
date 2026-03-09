// CodInfo.js
import React, { useState, useEffect, useRef } from 'react';

const CodInfo = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [isp, setIsp] = useState('');
  const [timezone, setTimezone] = useState('');
  const [os, setOs] = useState('');
  const [browser, setBrowser] = useState('');
  const [browserVersion, setBrowserVersion] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [screenResolution, setScreenResolution] = useState('');
  const [language, setLanguage] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [displayLines, setDisplayLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState([]);
  
  const inputRef = useRef(null);
  const audioContextRef = useRef(null);

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Initialize/resume the Web Audio context on first user interaction.
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    audioContextRef.current.resume().catch(() => {
      /* ignore if already running */
    });
  };

  // Generate a short burst of filtered noise for the given character.
  const playTypingSound = (char) => {
    if (!audioContextRef.current) return;
    if (!char || char === ' ') return;

    const ctx = audioContextRef.current;

    // SHORT NOISE BURST
    const bufferSize = ctx.sampleRate * 0.04; // ~40ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-6 * i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900 + ((char.charCodeAt(0) % 50) * 25);
    filter.Q.value = 1;
    noise.connect(filter);

    // BRIEF HIGH-TONE CLICK
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200 + ((char.charCodeAt(0) % 20) * 30);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);

    // mix and output
    const merger = ctx.createGain();
    filter.connect(merger);
    gain.connect(merger);
    merger.connect(ctx.destination);

    const now = ctx.currentTime;
    noise.start(now);
    noise.stop(now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  // Handle command input
  const handleCommandChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    // Play sound for command submission
    for (let char of currentCommand) {
      playTypingSound(char);
    }

    // Process command
    const cmd = currentCommand.toLowerCase().trim();
    let output = '';

    switch(cmd) {
      case 'help':
        output = 'Available commands: help, clear, status, time, system, echo [text], hide, show';
        break;
      case 'status':
        output = `System status: ONLINE | Uptime: ${currentTime} | Connection: SECURE`;
        break;
      case 'time':
        output = `Current ZULU time: ${currentTime}`;
        break;
      case 'system':
        output = `OS: ${os} | Browser: ${browser} v${browserVersion} | Device: ${deviceType}`;
        break;
      case 'hide':
        toggleVisibility();
        output = 'Terminal minimized...';
        break;
      case 'show':
        if (!isVisible) toggleVisibility();
        output = 'Terminal restored';
        break;
      case 'clear':
        setCommandOutput([]);
        setCurrentCommand('');
        return;
      default:
        if (cmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else {
          output = `Unknown command: "${cmd}". Type "help" for available commands.`;
        }
    }

    setCommandHistory([...commandHistory, currentCommand]);
    setCommandOutput([...commandOutput, `> ${currentCommand}`, output]);
    setCurrentCommand('');

    // Focus input after submission
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  // unlock audio on first click anywhere (some browsers require it)
  useEffect(() => {
    const handleClick = () => {
      initAudio();
      document.body.removeEventListener('click', handleClick);
    };
    document.body.addEventListener('click', handleClick);
    return () => document.body.removeEventListener('click', handleClick);
  }, []);

  // Fetch IP and location data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIpAddress(data.ip);
        setCountry(data.country_name || 'Unknown');
        setCity(data.city || 'Unknown');
        setRegion(data.region || 'Unknown');
        setIsp(data.org || data.isp || 'Unknown');
        setTimezone(data.timezone || 'Unknown');
      } catch (error) {
        console.error('Error fetching IP data:', error);
        setIpAddress('127.0.0.1');
        setCountry('LOCALHOST');
        setCity('LOCAL');
        setRegion('LOCAL');
        setIsp('LOCAL NETWORK');
        setTimezone('UTC');
      }
    };
    
    fetchData();
  }, []);

  // Get browser and system information
  useEffect(() => {
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
      if (ua.indexOf('Chrome') > -1) return 'Chrome';
      if (ua.indexOf('Firefox') > -1) return 'Firefox';
      if (ua.indexOf('Safari') > -1) return 'Safari';
      if (ua.indexOf('Edge') > -1) return 'Edge';
      if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
      return 'Unknown Browser';
    };

    const getBrowserVersion = () => {
      const ua = navigator.userAgent;
      let version = 'Unknown';
      
      if (ua.indexOf('Chrome') > -1) {
        const match = ua.match(/Chrome\/(\d+\.\d+)/);
        if (match) version = match[1];
      } else if (ua.indexOf('Firefox') > -1) {
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        if (match) version = match[1];
      } else if (ua.indexOf('Safari') > -1) {
        const match = ua.match(/Version\/(\d+\.\d+)/);
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

    setOs(getOS());
    setBrowser(getBrowser());
    setBrowserVersion(getBrowserVersion());
    setDeviceType(getDeviceType());
    setScreenResolution(getScreenResolution());
    setLanguage(getLanguage());
    setUserAgent(navigator.userAgent);

    if (navigator.connection) {
      const conn = navigator.connection;
      setConnectionType(conn.effectiveType || conn.type || 'Unknown');
    } else {
      setConnectionType('Unknown');
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Prepare lines for typing animation
  useEffect(() => {
    if (currentTime && ipAddress && country && os && browser) {
      const lines = [
        `> TIME: ${currentTime} ZULU`,
        `> LOCATION: ${city}, ${region}, ${country}`,
        `> IP ADDRESS: ${ipAddress}`,
        `> ISP: ${isp}`,
        `> TIMEZONE: ${timezone}`,
        `> DEVICE: ${deviceType}`,
        `> OS: ${os}`,
        `> BROWSER: ${browser} v${browserVersion}`,
        `> LANGUAGE: ${language}`,
        `> RESOLUTION: ${screenResolution}`,
        `> CONNECTION: ${connectionType}`,
        `> USER AGENT: ${userAgent.substring(0, 40)}...`,
        '> SECURE LINK ESTABLISHED',
        '> Type "help" for available commands'
      ];
      setDisplayLines(lines);
    }
  }, [currentTime, ipAddress, country, city, region, isp, timezone, os, browser, browserVersion, deviceType, screenResolution, language, connectionType, userAgent]);

  // Typing animation effect with sound
  useEffect(() => {
    if (displayLines.length === 0) return;

    if (currentLineIndex < displayLines.length) {
      const currentLine = displayLines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const typingTimer = setTimeout(() => {
          const ch = currentLine[currentCharIndex];
          playTypingSound(ch);
          setCurrentCharIndex(prev => prev + 1);
        }, 40);
        return () => clearTimeout(typingTimer);
      } else {
        const lineDelay = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 200);
        return () => clearTimeout(lineDelay);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, currentCharIndex, displayLines]);

  // If not visible, show only the minimized version
  if (!isVisible) {
    return (
      <div className="cod-info-minimized" onClick={toggleVisibility}>
        <div className="cod-terminal-minimized">
          <span className="cod-blink">●</span>
          TERMINAL [MINIMIZED] 
          <span className="cod-expand">[+]</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cod-info" onClick={initAudio}>
      <div className="cod-terminal">
        <div className="cod-header">
          <span className="cod-blink">●</span>
          SYSTEM DIAGNOSTIC v2.3.7
          <span className="cod-close" onClick={(e) => { e.stopPropagation(); toggleVisibility(); }}>[-]</span>
        </div>
        <div className="cod-content">
          {displayLines.slice(0, currentLineIndex).map((line, index) => (
            <div key={index} className="cod-line typed">
              {line}
            </div>
          ))}
          {currentLineIndex < displayLines.length && (
            <div className="cod-line typing">
              {displayLines[currentLineIndex].substring(0, currentCharIndex)}
              <span className="cod-cursor">_</span>
            </div>
          )}
          
          {/* Command Output History */}
          {commandOutput.map((line, index) => (
            <div key={`output-${index}`} className={`cod-line ${index % 2 === 0 ? 'command' : 'output'}`}>
              {line}
            </div>
          ))}
          
          {/* Command Input */}
          {!isTyping && (
            <form onSubmit={handleCommandSubmit} className="cod-command-line">
              <span className="cod-prompt">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={handleCommandChange}
                className="cod-command-input"
                autoFocus
                spellCheck="false"
              />
            </form>
          )}
        </div>
        <div className="cod-footer">
          <span>ENCRYPTED CHANNEL</span>
          <span className="cod-status">COMMAND MODE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default CodInfo;