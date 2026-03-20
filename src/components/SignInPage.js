import React, { useState, useEffect } from 'react';
import { supabase } from '../supaBaseClient';

const SignInPage = ({ onAuthSuccess, onGuestVisit }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // User info states
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

  // Fetch IP and location data on component mount
  useEffect(() => {
    fetchIpData();
    getBrowserInfo();
  }, []);

  const fetchIpData = async () => {
    try {
      const response = await fetch('https://api.allorigins.win/raw?url=https://ipapi.co/json/');
      const data = await response.json();
      setIpAddress(data.ip || 'Unknown');
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

  const getBrowserInfo = () => {
    // Get OS
    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf('Windows') > -1) return 'Windows';
      if (ua.indexOf('Mac OS') > -1) return 'macOS';
      if (ua.indexOf('Linux') > -1) return 'Linux';
      if (ua.indexOf('Android') > -1) return 'Android';
      if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
      return 'Unknown OS';
    };

    // Get Browser
    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf('Chrome') > -1) return 'Chrome';
      if (ua.indexOf('Firefox') > -1) return 'Firefox';
      if (ua.indexOf('Safari') > -1) return 'Safari';
      if (ua.indexOf('Edge') > -1) return 'Edge';
      if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
      return 'Unknown Browser';
    };

    // Get Browser Version
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

    // Get Device Type
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

    // Set all browser info
    setOs(getOS());
    setBrowser(getBrowser());
    setBrowserVersion(getBrowserVersion());
    setDeviceType(getDeviceType());
    setScreenResolution(`${window.screen.width}x${window.screen.height}`);
    setLanguage(navigator.language || navigator.userLanguage || 'Unknown');
    setUserAgent(navigator.userAgent);

    // Get connection type
    if (navigator.connection) {
      setConnectionType(navigator.connection.effectiveType || navigator.connection.type || 'Unknown');
    } else {
      setConnectionType('Unknown');
    }
  };

  // Save user info to Supabase
  const saveUserInfo = async (user) => {
    try {
      const userInfo = {
        user_id: user.id,
        username: username || user.user_metadata?.username || user.email?.split('@')[0],
        email: user.email,
        ip_address: ipAddress,
        country: country,
        city: city,
        region: region,
        isp: isp,
        timezone: timezone,
        os: os,
        browser: browser,
        browser_version: browserVersion,
        device_type: deviceType,
        screen_resolution: screenResolution,
        language: language,
        user_agent: userAgent,
        connection_type: connectionType,
        last_seen: new Date().toISOString()
      };

      // Check if user already exists in our table
      const { data: existingUser } = await supabase
        .from('user_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingUser) {
        // Update existing user
        const { error } = await supabase
          .from('user_info')
          .update({
            ...userInfo,
            visit_count: existingUser.visit_count + 1,
            last_seen: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
        console.log('User info updated');
      } else {
        // Insert new user
        const { error } = await supabase
          .from('user_info')
          .insert([userInfo]);

        if (error) throw error;
        console.log('New user info saved');
      }
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // REGISTER - Sign up with email/password
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Save user info immediately after registration
          await saveUserInfo(data.user);
          
          // Registration successful
          alert('Registration successful! Please check your email to confirm.');
          setIsRegistering(false); // Switch to login
        }
      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) throw error;

        if (data.user) {
          // Save/update user info on login
          await saveUserInfo(data.user);
          
          // Login successful
          onAuthSuccess(data.user);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Data DUM</h1>
        <h2 className="signin-subtitle">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleAuth} className="signin-form">
          {isRegistering && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              minLength={6}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')}
          </button>
        </form>
        
        <div className="switch-mode">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)}>
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)}>
                Register
              </button>
            </p>
          )}
        </div>
        
        <div className="guest-section">
          <button onClick={onGuestVisit} className="guest-button">
            Visit as Guest
          </button>
          <p className="guest-note">
            Guest can view but won't save preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;