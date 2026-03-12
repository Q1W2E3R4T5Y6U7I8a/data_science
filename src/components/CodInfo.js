// CodInfo.js
import React, { useState, useEffect, useRef } from 'react';

const CodInfo = ({ 
  gdpData, 
  casualtyData, 
  setSelected, 
  setMapMode, 
  mapMode,
  setCasualtyField,
  casualtyField,
  countryRankMap,
  areaData // if available
}) => {
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
  const [isTyping, setIsTyping] = useState(false); // Start with false
  const [isVisible, setIsVisible] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false); // Track if initial typing has started
  
  const inputRef = useRef(null);
  const audioContextRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Find best match for country name (case-insensitive, partial)
  const findCountry = (input) => {
    const lowerInput = input.toLowerCase();
    // Try exact match first
    for (let name of Object.keys(gdpData)) {
      if (name.toLowerCase() === lowerInput) return name;
    }
    for (let name of Object.keys(casualtyData)) {
      if (name.toLowerCase() === lowerInput) return name;
    }
    // Then partial match
    for (let name of Object.keys(gdpData)) {
      if (name.toLowerCase().includes(lowerInput)) return name;
    }
    for (let name of Object.keys(casualtyData)) {
      if (name.toLowerCase().includes(lowerInput)) return name;
    }
    return null;
  };

  // Get country data based on current mode
  const getCountryValue = (countryName) => {
    if (mapMode === 'gdp') {
      return gdpData[countryName];
    } else if (mapMode === 'area') {
      return areaData ? areaData[countryName] : null;
    } else if (mapMode === 'casualty') {
      const data = casualtyData[countryName];
      if (!data) return null;
      if (casualtyField === 'total') return data.total;
      if (casualtyField === 'percent') return data.percent;
      if (casualtyField === 'civilian') {
        // sum civilian military and famine
        const parse = (v) => {
          if (typeof v === 'number') return v;
          if (typeof v === 'string') {
            const num = parseFloat(v.replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 0 : num;
          }
          return 0;
        };
        return parse(data.civilianMilitary) + parse(data.civilianFamine);
      }
    }
    return null;
  };

  // Get rank of a country in current metric
  const getRank = (countryName) => {
    if (mapMode === 'gdp') {
      return countryRankMap[countryName];
    } else if (mapMode === 'area') {
      // need area rank map – you could compute it similarly
      return null;
    } else if (mapMode === 'casualty') {
      // compute rank on the fly from casualtyData
      const entries = Object.entries(casualtyData)
        .map(([name, data]) => {
          let val;
          if (casualtyField === 'total') val = data.total;
          else if (casualtyField === 'percent') val = data.percent;
          else if (casualtyField === 'civilian') {
            const parse = (v) => {
              if (typeof v === 'number') return v;
              if (typeof v === 'string') {
                const num = parseFloat(v.replace(/[^0-9.]/g, ''));
                return isNaN(num) ? 0 : num;
              }
              return 0;
            };
            val = parse(data.civilianMilitary) + parse(data.civilianFamine);
          }
          return { name, val: typeof val === 'number' ? val : 0 };
        })
        .filter(e => e.val > 0)
        .sort((a, b) => b.val - a.val);
      const index = entries.findIndex(e => e.name === countryName);
      return index === -1 ? null : index + 1;
    }
    return null;
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

    const fullCmd = currentCommand.trim();
    const args = fullCmd.split(/\s+/);
    const cmd = args[0].toLowerCase();
    let output = '';

    // Command implementations
    switch (cmd) {
      case 'help':
        output = `
Available commands:
  help                          - Show this help
  clear                         - Clear terminal
  hide / show                   - Minimize/restore terminal
  select <country>              - Select a country on map
  stats <country>               - Show detailed stats and rank for a country
  top <metric> [n=10]           - List top n countries by metric (gdp, area, total, percent, civilian)
  mode <mode>                   - Switch map mode (default, gdp, area, casualty)
  field <field>                 - In casualty mode, set field (total, percent, civilian)
  clear-select                  - Clear selected country
  userinfo                      - Display user system information
  time / system / status        - System info
  echo <text>                   - Echo text
        `;
        break;

      case 'clear':
        setCommandOutput([]);
        setCurrentCommand('');
        return;

      case 'hide':
        toggleVisibility();
        output = 'Terminal minimized. Use "show" to restore.';
        break;

      case 'show':
        if (!isVisible) toggleVisibility();
        output = 'Terminal restored.';
        break;

      case 'userinfo':
        output = `
USER SYSTEM INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TIME: ${currentTime} ZULU
  LOCATION: ${city}, ${region}, ${country}
  IP ADDRESS: ${ipAddress}
  ISP: ${isp}
  TIMEZONE: ${timezone}
  DEVICE: ${deviceType}
  OS: ${os}
  BROWSER: ${browser} v${browserVersion}
  LANGUAGE: ${language}
  RESOLUTION: ${screenResolution}
  CONNECTION: ${connectionType}
  USER AGENT: ${userAgent}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
        break;

      case 'select': {
        if (args.length < 2) {
          output = 'Usage: select <country name>';
          break;
        }
        const countryInput = args.slice(1).join(' ');
        const countryName = findCountry(countryInput);
        if (!countryName) {
          output = `Country "${countryInput}" not found.`;
          break;
        }
        let selectedData;
        if (mapMode === 'casualty') {
          selectedData = casualtyData[countryName];
          setSelected({ name: countryName, value: selectedData, type: 'casualty' });
        } else if (mapMode === 'gdp') {
          selectedData = gdpData[countryName];
          setSelected({ name: countryName, value: selectedData, unit: 'T' });
        } else if (mapMode === 'area') {
          selectedData = areaData ? areaData[countryName] : null;
          setSelected({ name: countryName, value: selectedData, unit: 'M km²' });
        } else {
          // default mode: show GDP if available
          selectedData = gdpData[countryName];
          setSelected({ name: countryName, value: selectedData, unit: 'T' });
        }
        output = `Selected: ${countryName}`;
        break;
      }

      case 'stats': {
        if (args.length < 2) {
          output = 'Usage: stats <country name>';
          break;
        }
        const countryInput = args.slice(1).join(' ');
        const countryName = findCountry(countryInput);
        if (!countryName) {
          output = `Country "${countryInput}" not found.`;
          break;
        }
        const gdp = gdpData[countryName];
        const casualty = casualtyData[countryName];
        const rank = countryRankMap[countryName];
        output = `
${countryName}:
  GDP: ${gdp ? '$' + formatNumber(gdp) + 'B' : 'N/A'} (Rank: ${rank || 'N/A'})
  Area: ${areaData && areaData[countryName] ? areaData[countryName] + 'M km²' : 'N/A'}
  WWII Casualties:
    Total: ${casualty ? casualty.total : 'N/A'}
    % of 1939 pop: ${casualty ? casualty.percent + '%' : 'N/A'}
    Civilian (military): ${casualty ? casualty.civilianMilitary : 'N/A'}
    Civilian (famine): ${casualty ? casualty.civilianFamine : 'N/A'}
        `;
        break;
      }

      case 'rank': {
        if (args.length < 2) {
          output = 'Usage: rank <country name>';
          break;
        }
        const countryInput = args.slice(1).join(' ');
        const countryName = findCountry(countryInput);
        if (!countryName) {
          output = `Country "${countryInput}" not found.`;
          break;
        }
        const rank = getRank(countryName);
        if (rank === null) {
          output = `Rank not available for ${countryName} in current mode.`;
        } else {
          output = `${countryName} is ranked #${rank} in current metric.`;
        }
        break;
      }

      case 'top': {
        let metric = args[1] ? args[1].toLowerCase() : null;
        let n = args[2] ? parseInt(args[2], 10) : 10;
        if (isNaN(n) || n <= 0) n = 10;
        if (n > 50) n = 50;

        let entries = [];
        if (metric === 'gdp') {
          entries = Object.entries(gdpData)
            .filter(([_, val]) => typeof val === 'number')
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
        } else if (metric === 'area' && areaData) {
          entries = Object.entries(areaData)
            .filter(([_, val]) => typeof val === 'number')
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
        } else if (metric === 'total' || metric === 'percent' || metric === 'civilian') {
          // casualty metrics
          entries = Object.entries(casualtyData)
            .map(([name, data]) => {
              let val;
              if (metric === 'total') val = data.total;
              else if (metric === 'percent') val = data.percent;
              else if (metric === 'civilian') {
                const parse = (v) => {
                  if (typeof v === 'number') return v;
                  if (typeof v === 'string') {
                    const num = parseFloat(v.replace(/[^0-9.]/g, ''));
                    return isNaN(num) ? 0 : num;
                  }
                  return 0;
                };
                val = parse(data.civilianMilitary) + parse(data.civilianFamine);
              }
              return { name, val: typeof val === 'number' ? val : 0 };
            })
            .filter(e => e.val > 0)
            .sort((a, b) => b.val - a.val)
            .slice(0, n);
        } else {
          // default to current map mode metric
          if (mapMode === 'gdp') metric = 'gdp';
          else if (mapMode === 'area') metric = 'area';
          else if (mapMode === 'casualty') metric = casualtyField;
          else metric = 'gdp'; // fallback
          // recurse with inferred metric
          return handleCommandSubmit({
            preventDefault: () => {},
            target: { value: `top ${metric} ${n}` }
          });
        }

        if (entries.length === 0) {
          output = `No data for metric "${metric}".`;
        } else {
          output = `Top ${entries.length} by ${metric}:\n` + 
            entries.map((e, i) => `  ${i+1}. ${e.name}: ${typeof e[1] === 'number' ? formatNumber(e[1]) : e.val}`).join('\n');
        }
        break;
      }

      case 'mode': {
        if (args.length < 2) {
          output = 'Usage: mode <default|gdp|area|casualty>';
          break;
        }
        const mode = args[1].toLowerCase();
        if (['default', 'gdp', 'area', 'casualty'].includes(mode)) {
          setMapMode(mode);
          output = `Map mode switched to ${mode}.`;
        } else {
          output = `Invalid mode. Choose from: default, gdp, area, casualty.`;
        }
        break;
      }

      case 'field': {
        if (args.length < 2) {
          output = 'Usage: field <total|percent|civilian>';
          break;
        }
        const field = args[1].toLowerCase();
        if (['total', 'percent', 'civilian'].includes(field)) {
          setCasualtyField(field);
          setMapMode('casualty'); // ensure we're in casualty mode
          output = `Casualty field set to ${field}.`;
        } else {
          output = `Invalid field. Choose from: total, percent, civilian.`;
        }
        break;
      }

      case 'clear-select':
        setSelected(null);
        output = 'Selection cleared.';
        break;

      case 'time':
        output = `Current ZULU time: ${currentTime}`;
        break;

      case 'system':
        output = `OS: ${os} | Browser: ${browser} v${browserVersion} | Device: ${deviceType}`;
        break;

      case 'status':
        output = `System status: ONLINE | Uptime: ${currentTime} | Connection: SECURE | Map mode: ${mapMode}`;
        break;

      case 'echo':
        output = args.slice(1).join(' ') || '';
        break;

      case 'data_info':
        output = `
      DATA REFERENCE INFORMATION:
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Opening data spreadsheet in new tab...
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
        // Ouvrir le lien dans un nouvel onglet
        window.open('https://docs.google.com/spreadsheets/d/1whItSFf_-NObTw-U6iGWs3TEi1IDmnv9RmR4GbvYgCc/edit?usp=sharing', '_blank', 'noopener,noreferrer');
        break;

      default:
        output = `Unknown command: "${cmd}". Type "help" for available commands.`;
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

  // Start typing animation when terminal becomes visible and data is ready
  useEffect(() => {
    if (isVisible && !hasInitialized && displayLines.length === 0) {
      // Minimal welcome message instead of full system info
      const lines = [
        '> MAP COMMAND CONSOLE v1.0',
        '> SECURE LINK ESTABLISHED',
        '> Type "help" for available commands',
        '> Type "userinfo" for system information',
        '> Type "data_info" for details on data reference',
      ];
      setDisplayLines(lines);
      setHasInitialized(true);
      setIsTyping(true);
    }
  }, [isVisible, hasInitialized, displayLines.length]);

  // Typing animation effect with sound - 3x faster (from 40ms to 13ms, from 200ms to 67ms)
  useEffect(() => {
    if (!isTyping || displayLines.length === 0) return;

    if (currentLineIndex < displayLines.length) {
      const currentLine = displayLines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const typingTimer = setTimeout(() => {
          const ch = currentLine[currentCharIndex];
          playTypingSound(ch);
          setCurrentCharIndex(prev => prev + 1);
        }, 13); // 3x faster (was 40ms)
        return () => clearTimeout(typingTimer);
      } else {
        const lineDelay = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 67); // 3x faster (was 200ms)
        return () => clearTimeout(lineDelay);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, currentCharIndex, displayLines, isTyping, playTypingSound]);

  // If on mobile, don't render anything


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
            <div key={`output-${index}`} className={`cod-line ${index % 2 === 0 ? 'command' : 'output'}`} style={{ whiteSpace: 'pre-wrap' }}>
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