import React, { useEffect } from 'react';

function AchievementsManager({ 
  user, 
  triggerFirstClick,
  triggerTimelineView,
  triggerModeView,
  triggerGDPView,
  triggerSocialButterfly,
  resetStats 
}) {
  console.log('📋 AchievementsManager rendered with user:', user);

  useEffect(() => {
    console.log('🎧 AchievementsManager setting up event listener');
    
    const handleAchievementEvent = (event) => {
      console.log('📨 AchievementsManager received event:', event);
      console.log('📦 Event detail:', event.detail);
      
      const { type, data } = event.detail;
      console.log('🎯 Processing achievement type:', type, 'with data:', data);
      
      switch (type) {
        case 'FIRST_CLICK':
          console.log('👉 Calling triggerFirstClick');
          triggerFirstClick();
          break;
        case 'TIMELINE_VIEW':
          console.log('👉 Calling triggerTimelineView');
          triggerTimelineView();
          break;
        case 'MODE_VIEW':
          console.log('👉 Calling triggerModeView with mode:', data?.mode);
          triggerModeView(data?.mode);
          break;
        case 'GDP_VIEW':
          console.log('👉 Calling triggerGDPView');
          triggerGDPView();
          break;
        case 'SOCIAL_BUTTERFLY':
          console.log('👉 Calling triggerSocialButterfly');
          triggerSocialButterfly();
          break;
        default:
          console.log('❓ Unknown achievement type:', type);
          break;
      }
    };

    window.addEventListener('triggerAchievement', handleAchievementEvent);
    console.log('✅ Event listener added');
    
    return () => {
      console.log('🧹 Cleaning up event listener');
      window.removeEventListener('triggerAchievement', handleAchievementEvent);
    };
  }, [triggerFirstClick, triggerTimelineView, triggerModeView, triggerGDPView, triggerSocialButterfly]);

  // Reset stats on user change if resetStats is provided
  useEffect(() => {
    if (resetStats) {
      console.log('🔄 User changed, resetting stats');
      resetStats();
    }
  }, [user, resetStats]);

  return null;
}

export default AchievementsManager;