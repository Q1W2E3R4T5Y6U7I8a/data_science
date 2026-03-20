import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supaBaseClient';
import useLocalization from '../hooks/userLocalisation';

function Chat({ user, onClose }) {
  const { t, language } = useLocalization();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const messagesEndRef = useRef(null);
  const hasSentMessage = useRef(false);
  const inputRef = useRef(null);
  const heartbeatInterval = useRef(null);

  // Check if user is guest
  const isGuest = user?.guest === true;
  const isAuthenticated = user && !isGuest && user.id;

  // Focus input on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isAuthenticated]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages for everyone (guests and authenticated users)
  useEffect(() => {
    loadMessages();
    
    // Subscribe to new messages in real-time for everyone
    const messagesSubscription = supabase
      .channel('chat_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('📨 New message received:', payload.new);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, []);

  // Only authenticated users get online features
  useEffect(() => {
    if (!isAuthenticated) return;

    // Subscribe to online users changes
    const onlineSubscription = supabase
      .channel('online_users_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    // Mark user as online and set up heartbeat
    markUserOnline();
    heartbeatInterval.current = setInterval(() => {
      updateHeartbeat();
    }, 30000);

    // Cleanup on unmount
    return () => {
      onlineSubscription.unsubscribe();
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      markUserOffline();
    };
  }, [isAuthenticated]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markUserOnline = async () => {
    if (!isAuthenticated) return;
    
    try {
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous';
      
      const { error } = await supabase
        .from('online_users')
        .upsert({
          user_id: user.id,
          username: username,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      console.log('✅ User marked as online');
      
      await fetchOnlineUsers();
    } catch (error) {
      console.error('Error marking user online:', error);
    }
  };

  const updateHeartbeat = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('online_users')
        .update({ last_seen: new Date().toISOString() })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating heartbeat:', error);
    }
  };

  const markUserOffline = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('online_users')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      console.log('✅ User marked as offline');
    } catch (error) {
      console.error('Error marking user offline:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    if (!isAuthenticated) return;
    
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('online_users')
        .select('user_id, username, last_seen')
        .gte('last_seen', twoMinutesAgo)
        .order('username');
      
      if (error) throw error;
      
      setOnlineUsers(data || []);
      setOnlineCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const handleSendMessage = () => {
    if (isGuest) {
      setShowLoginPopup(true);
      return;
    }
    sendMessage();
  };

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || sending) return;

    setSending(true);
    try {
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous';
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          username: username,
          message: trimmedMessage,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');
      
      // Trigger Social Butterfly achievement on first message
      if (!hasSentMessage.current) {
        hasSentMessage.current = true;
        window.dispatchEvent(new CustomEvent('triggerAchievement', { 
          detail: { type: 'SOCIAL_BUTTERFLY' } 
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isGuest) {
        setShowLoginPopup(true);
      } else {
        sendMessage();
      }
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    window.dispatchEvent(new CustomEvent('openSignIn'));
    onClose();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('chat.justNow') || 'just now';
    if (diffMins < 60) return `${diffMins} ${t('chat.minutesAgo') || 'm ago'}`;
    if (diffHours < 24) return `${diffHours} ${t('chat.hoursAgo') || 'h ago'}`;
    if (diffDays === 1) return t('chat.yesterday') || 'yesterday';
    return date.toLocaleDateString();
  };

  const getAvatarColor = (username) => {
    const colors = ['#4a90e2', '#e24a4a', '#4ae24a', '#e2e24a', '#e24ae2', '#4ae2e2', '#e2a34a', '#a34ae2'];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getLoginMessage = () => {
    const messages = {
      en: {
        title: 'Login Required',
        message: 'You need to log in to send messages in the chat.',
        button: 'Sign In / Register'
      },
      fr: {
        title: 'Connexion Requise',
        message: 'Vous devez vous connecter pour envoyer des messages dans le chat.',
        button: 'Se Connecter / S\'inscrire'
      },
      ua: {
        title: 'Потрібен Вхід',
        message: 'Вам потрібно увійти, щоб надсилати повідомлення в чаті.',
        button: 'Увійти / Зареєструватися'
      }
    };
    return messages[language] || messages.en;
  };

  const loginMessage = getLoginMessage();

  return (
    <>
      <div className="chat-wrapper">
        <div className="chat-popup">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-icon">💬</span>
              <span className="chat-title">{t('chat.title') || 'Global Chat'}</span>
              {isAuthenticated && (
                <div className="chat-online-badge" title={`${onlineCount} users online`}>
                  <span className="online-dot"></span>
                  {onlineCount}
                </div>
              )}
              {isGuest && (
                <div className="chat-guest-badge">
                  👤 {t('chat.guestMode') || 'Guest'}
                </div>
              )}
            </div>
            <button onClick={onClose} className="chat-close-btn" aria-label="Close chat">
              ✕
            </button>
          </div>

          {/* Online Users List - Only for authenticated */}
          {isAuthenticated && onlineUsers.length > 0 && (
            <div className="chat-online-users">
              <div className="online-users-header">
                <span>👥 {t('chat.onlineNow') || 'Online now'}</span>
              </div>
              <div className="online-users-list">
                {onlineUsers.slice(0, 5).map(userOnline => (
                  <div key={userOnline.user_id} className="online-user">
                    <span className="online-user-dot"></span>
                    <span className="online-user-name">{userOnline.username}</span>
                  </div>
                ))}
                {onlineUsers.length > 5 && (
                  <div className="online-user-more">+{onlineUsers.length - 5} {t('chat.more') || 'more'}</div>
                )}
              </div>
            </div>
          )}

          {/* Guest Mode Banner */}
          {isGuest && (
            <div className="chat-guest-banner">
              <span>👀 {t('chat.guestViewMessage') || 'You are viewing messages as a guest. Sign in to join the conversation!'}</span>
            </div>
          )}

          {/* Messages Area - Visible to everyone */}
          <div className="chat-messages-area">
            {loading ? (
              <div className="chat-loading">
                <div className="chat-loading-spinner"></div>
                <span>{t('chat.loading') || 'Loading messages...'}</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="chat-empty-icon">💭</div>
                <div className="chat-empty-text">{t('chat.empty') || 'No messages yet. Be the first to chat!'}</div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => {
                  const isOwn = msg.user_id === user?.id;
                  const avatarColor = getAvatarColor(msg.username);
                  const timeAgo = formatTime(msg.created_at);
                  
                  return (
                    <div key={msg.id || idx} className={`chat-message ${isOwn ? 'own-message' : 'other-message'}`}>
                      {!isOwn && (
                        <div className="chat-message-avatar" style={{ backgroundColor: avatarColor }}>
                          {msg.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="chat-message-content">
                        <div className="chat-message-header">
                          <span className="chat-username">{msg.username}</span>
                          <span className="chat-time">{timeAgo}</span>
                        </div>
                        <div className="chat-message-text">{msg.message}</div>
                      </div>
                      {isOwn && (
                        <div className="chat-message-avatar own-avatar" style={{ backgroundColor: avatarColor }}>
                          {msg.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area - Different for guests vs authenticated */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isGuest 
                  ? (t('chat.loginToChat') || 'Login to send messages...') 
                  : (t('chat.placeholder') || "Type your message...")
              }
              disabled={sending || isGuest}
              rows={1}
              className={`chat-input ${isGuest ? 'chat-input-disabled' : ''}`}
              readOnly={isGuest}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={sending || (!newMessage.trim() && !isGuest) || isGuest}
              className={`chat-send-btn ${isGuest ? 'chat-send-disabled' : ''}`}
              title={isGuest ? (t('chat.loginToSend') || 'Login to send messages') : ''}
            >
              {isGuest ? '🔒' : (sending ? '⏳' : '📨')}
            </button>
          </div>

          {/* Footer */}
          <div className="chat-footer">
            <span>✨ {t('chat.footer') || 'Be respectful!'}</span>
          </div>
        </div>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="chat-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="chat-login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="chat-popup-icon">🔐</div>
            <h3>{loginMessage.title}</h3>
            <p>{loginMessage.message}</p>
            <div className="chat-popup-buttons">
              <button 
                className="chat-popup-cancel" 
                onClick={() => setShowLoginPopup(false)}
              >
                {t('chat.cancel') || 'Cancel'}
              </button>
              <button 
                className="chat-popup-login" 
                onClick={handleLoginRedirect}
              >
                {loginMessage.button}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;