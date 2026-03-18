import React, { useState, useEffect } from 'react';
import { supabase } from '../supaBaseClient';

// Define your achievements
const ACHIEVEMENTS = {
  1: { id: 1, name: 'First Click', description: 'Click your first country', icon: '👆' },
  2: { id: 2, name: 'Time Traveler', description: 'Explore the timeline view', icon: '⏰' },
  3: { id: 3, name: 'GDP Master', description: 'View GDP data for 10 countries', icon: '💰' },
  4: { id: 4, name: 'Population Expert', description: 'View population data for 10 countries', icon: '👥' },
  5: { id: 5, name: 'Data Explorer', description: 'Try 5 different map modes', icon: '🗺️' },
  // Add more achievements as needed
};

function Achievements({ user, t, onClose, triggerAchievement }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(null);

  // Load unlocked achievements from database/localStorage
  useEffect(() => {
    loadAchievements();
  }, [user]);

  // Listen for triggerAchievement prop changes
  useEffect(() => {
    if (triggerAchievement) {
      unlockAchievement(triggerAchievement);
    }
  }, [triggerAchievement]);

  const loadAchievements = async () => {
    if (user && !user.guest) {
      // Load from Supabase
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);
        
        if (data) {
          setUnlockedAchievements(data.map(item => item.achievement_id));
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      // Guest mode - use localStorage
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }
  };

  const unlockAchievement = async (achievementId) => {
    // Check if already unlocked
    if (unlockedAchievements.includes(achievementId)) {
      return;
    }

    // Show animation
    setShowUnlockAnimation(achievementId);
    
    // Add to unlocked list
    const newUnlocked = [...unlockedAchievements, achievementId];
    setUnlockedAchievements(newUnlocked);

    // Save to database or localStorage
    if (user && !user.guest) {
      try {
        await supabase
          .from('user_achievements')
          .insert([
            { user_id: user.id, achievement_id: achievementId, unlocked_at: new Date() }
          ]);
      } catch (error) {
        console.error('Error saving achievement:', error);
        localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
      }
    } else {
      localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
    }

    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowUnlockAnimation(null);
    }, 3000);
  };

  return (
    <div className="achievements-modal">
      <div className="achievements-header">
        <h2>{t('achievements') || 'Achievements'}</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="achievements-grid">
        {Object.values(ACHIEVEMENTS).map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${unlockedAchievements.includes(achievement.id) ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-name">{achievement.name}</div>
            <div className="achievement-description">{achievement.description}</div>
            {unlockedAchievements.includes(achievement.id) && (
              <div className="achievement-unlocked-badge">✓</div>
            )}
          </div>
        ))}
      </div>

      {/* Unlock animation popup */}
      {showUnlockAnimation && (
        <div className="achievement-unlock-popup">
          <div className="unlock-icon">{ACHIEVEMENTS[showUnlockAnimation].icon}</div>
          <div className="unlock-text">
            <div className="unlock-title">Achievement Unlocked!</div>
            <div className="unlock-name">{ACHIEVEMENTS[showUnlockAnimation].name}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;