import React, { useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../hooks/useAchievements';
import useLocalization from '../hooks/userLocalisation';

// Toast component - NAMED EXPORT
export function AchievementToast({ achievementId, onDone }) {
  const { t, language } = useLocalization();
  const achievement = ACHIEVEMENTS[achievementId];
  const [visible, setVisible] = useState(false);
  
  // Get localized achievement name and description
  const getAchievementName = () => {
    return t(`achievements.achievement_${achievementId}_name`) || achievement?.name || `Achievement ${achievementId}`;
  };

  useEffect(() => {
    if (!achievement) return;
    
    const showTimer = setTimeout(() => setVisible(true), 50);
    const hideTimer = setTimeout(() => setVisible(false), 3200);
    const doneTimer = setTimeout(() => onDone?.(), 3800);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [achievement, onDone]);

  if (!achievement) return null;

  return (
    <div className={`achievement-toast ${visible ? 'toast-visible' : ''}`}>
      <div className="toast-icon">{achievement.icon}</div>
      <div className="toast-body">
        <div className="toast-label">{t('achievements.achievement_unlocked') || 'Achievement Unlocked!'}</div>
        <div className="toast-name">{getAchievementName()}</div>
      </div>
    </div>
  );
}

// Main Achievements component - DEFAULT EXPORT
function Achievements({ user, onClose, unlockedIds = [] }) {
  const { t, language } = useLocalization();
  
  // Get localized achievement data
  const getLocalizedAchievement = (achievement) => {
    return {
      ...achievement,
      name: t(`achievements.achievement_${achievement.id}_name`) || achievement.name,
      description: t(`achievements.achievement_${achievement.id}_description`) || achievement.description,
    };
  };

  return (
    <div className="achievements-modal">
      <div className="achievements-header">
        <h2>{t('achievements.achievements') || 'Achievements'}</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="achievements-stats">
        <div className="stats-badge">
          {unlockedIds.length} / {Object.keys(ACHIEVEMENTS).length} {t('achievements.achievement_completed') || 'Completed'}
        </div>
      </div>

      <div className="achievements-grid">
        {Object.values(ACHIEVEMENTS).map(achievement => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const localizedAchievement = getLocalizedAchievement(achievement);
          
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{localizedAchievement.name}</div>
              <div className="achievement-description">{localizedAchievement.description}</div>
              {isUnlocked && (
                <div className="achievement-unlocked-badge">
                  {t('achievements.achievement_unlocked_badge') || '✓ Unlocked'}
                </div>
              )}
              {!isUnlocked && (
                <div className="achievement-locked-badge">
                  {t('achievements.achievement_locked') || 'Locked'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;