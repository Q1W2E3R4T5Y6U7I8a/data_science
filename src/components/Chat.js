// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supaBaseClient';

const Chat = ({ user, t, onClose }) => {  // Remove onFirstMessage prop
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadMessages = async () => {
    try {
      console.log('Loading messages...');
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      console.log('Messages loaded:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const messageData = {
        user_id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        message: newMessage.trim()
      };
      
      console.log('Sending message:', messageData);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) throw error;
      
      // Check if this is user's first message
      const { data: userMessages } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('user_id', user.id)
        .limit(2);
        
      if (userMessages?.length === 1) {
        // Dispatch global event for achievement
        window.dispatchEvent(new CustomEvent('triggerAchievement', { detail: 4 }));
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} ${time}`;
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>💭 Global Chat</span>
        <button onClick={onClose} className="chat-close">✕</button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            No messages yet. Be the first to say something!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.user_id === user?.id ? 'own-message' : ''}`}>
              <div className="chat-message-header">
                <span className="chat-username">{msg.username}</span>
                <span className="chat-time">{formatDateTime(msg.created_at)}</span>
              </div>
              <div className="chat-message-text">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={user ? "Type a message..." : "Sign in to chat"}
          disabled={!user || loading}
          className="chat-input"
          maxLength={200}
        />
        <button 
          type="submit" 
          disabled={!user || !newMessage.trim() || loading}
          className="chat-send-btn"
        >
          Send
        </button>
      </form>

      {!user && (
        <div className="chat-login-prompt">
          Please sign in to join the chat
        </div>
      )}
    </div>
  );
};

export default Chat;