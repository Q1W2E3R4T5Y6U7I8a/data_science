import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supaBaseClient';

// Single source of truth for all achievements
export const ACHIEVEMENTS = {
  1: { id: 1, name: 'First Click', description: 'Click your first country', icon: '👆' },
  2: { id: 2, name: 'Time Traveler', description: 'Explore the timeline view', icon: '⏰' },
  3: { id: 3, name: 'Data Explorer', description: 'Try 5 different map modes', icon: '🗺️' },
  4: { id: 4, name: 'Social Butterfly', description: 'Send your first chat message', icon: '💬' },
  5: { id: 5, name: 'GDP Master', description: 'View GDP data for 10 countries', icon: '💰' },
};

// Storage keys
const STORAGE_KEYS = {
  ACHIEVEMENTS: 'unlockedAchievements',
  STATS: 'achievement_stats'
};

export function useAchievements(user) {
  console.log('🎮 useAchievements hook initialized with user:', user?.id);
  
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUnlocked, setLastUnlocked] = useState(null);
  const unlockedRef = useRef([]);
  
  // Stats tracking refs with persistence
  const stats = useRef({
    firstClickDone: false,
    viewedModes: new Set(),
    gdpViewCount: 0,
    chatMessageSent: false,
  });

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        stats.current.gdpViewCount = parsed.gdpViewCount || 0;
        stats.current.viewedModes = new Set(parsed.viewedModes || []);
        stats.current.chatMessageSent = parsed.chatMessageSent || false;
        console.log('📊 Loaded stats from localStorage:', {
          gdpViewCount: stats.current.gdpViewCount,
          viewedModes: Array.from(stats.current.viewedModes),
          chatMessageSent: stats.current.chatMessageSent
        });
      }
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback(() => {
    try {
      const statsToSave = {
        gdpViewCount: stats.current.gdpViewCount,
        viewedModes: Array.from(stats.current.viewedModes),
        chatMessageSent: stats.current.chatMessageSent
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(statsToSave));
      console.log('💾 Saved stats to localStorage:', statsToSave);
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  }, []);

  // Load achievements from storage
  useEffect(() => {
    if (user) {
      console.log('📥 Loading achievements for user:', user?.id);
      loadAchievements();
      loadStats();
    }
  }, [user?.id]);

  const loadAchievements = async () => {
    console.log('🔍 loadAchievements started');
    setLoading(true);
    let ids = [];

    if (user && !user.guest) {
      console.log('👤 Loading from Supabase for user:', user.id);
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);

        if (error) throw error;
        
        console.log('✅ Supabase data loaded:', data);
        ids = (data || []).map(row => row.achievement_id);
      } catch (err) {
        console.error('❌ Error loading achievements from Supabase:', err);
        console.log('📦 Falling back to localStorage');
        ids = loadFromLocalStorage();
      }
    } else {
      console.log('👤 Guest user, loading from localStorage');
      ids = loadFromLocalStorage();
    }

    console.log('📊 Loaded achievement IDs:', ids);
    unlockedRef.current = ids;
    setUnlockedIds(ids);
    
    // Set initial stats based on loaded achievements
    stats.current.firstClickDone = ids.includes(1);
    stats.current.chatMessageSent = ids.includes(4);
    
    setLoading(false);
    console.log('✅ loadAchievements completed');
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      const parsed = stored ? JSON.parse(stored) : [];
      return parsed;
    } catch {
      return [];
    }
  };

  const saveToStorage = useCallback(async (newAchievementId) => {
    console.log('💾 saveToStorage called for achievement:', newAchievementId);
    
    if (!newAchievementId) {
      console.log('❌ No achievement ID provided');
      return false;
    }
    
    // Save to localStorage
    const currentIds = unlockedRef.current;
    const updatedIds = [...currentIds, newAchievementId];
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updatedIds));
    console.log('📦 Saved to localStorage:', updatedIds);
    
    // Save to Supabase if logged in
    if (user && !user.guest) {
      console.log('📤 Attempting to save to Supabase for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: newAchievementId,
            unlocked_at: new Date().toISOString()
          })
          .select();

        if (error) {
          // If it's a duplicate error (already exists), that's fine
          if (error.code === '23505') {
            console.log(`⚠️ Achievement ${newAchievementId} already exists in Supabase (duplicate ignored)`);
            return true;
          }
          
          console.error(`❌ Error saving to Supabase:`, error);
          return false;
        }
        
        console.log(`✅ Achievement ${newAchievementId} saved to Supabase!`, data);
        return true;
      } catch (err) {
        console.error(`❌ Exception saving to Supabase:`, err);
        return false;
      }
    } else {
      console.log('👤 Guest user, skipping Supabase save');
      return true;
    }
  }, [user]);

  const unlockAchievement = useCallback(async (id) => {
    console.log('🔓 unlockAchievement called with id:', id);
    
    // Check if already unlocked
    if (unlockedRef.current.includes(id)) {
      console.log('⏭️ Achievement already unlocked, skipping');
      return false;
    }

    console.log(`🏆 Unlocking achievement: ${id} - ${ACHIEVEMENTS[id]?.name}`);

    // Save to storage first (this will handle both localStorage and Supabase)
    const saveResult = await saveToStorage(id);
    
    if (!saveResult) {
      console.error('❌ Failed to save achievement, aborting unlock');
      return false;
    }
    
    // Update ref
    const newUnlocked = [...unlockedRef.current, id];
    unlockedRef.current = newUnlocked;
    
    // Update state
    setUnlockedIds(newUnlocked);
    setLastUnlocked(id);
    
    console.log('📢 setLastUnlocked called with:', id);
    
    // Dispatch event for any other listeners
    window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
      detail: { id, achievement: ACHIEVEMENTS[id] } 
    }));
    
    console.log('✅ unlockAchievement completed successfully');
    return true;
  }, [saveToStorage]);

  // Test function to manually unlock achievements via console
  const testUnlockAchievement = useCallback(async (achievementId) => {
    console.log(`🧪 TEST: Manually unlocking achievement ${achievementId}`);
    
    if (!ACHIEVEMENTS[achievementId]) {
      console.error(`❌ Achievement ${achievementId} does not exist!`);
      return false;
    }
    
    const result = await unlockAchievement(achievementId);
    
    if (result) {
      console.log(`✅ Achievement ${achievementId} unlocked successfully!`);
    } else {
      console.log(`⚠️ Achievement ${achievementId} was already unlocked or failed`);
    }
    
    return result;
  }, [unlockAchievement]);

  // Expose test functions to window for console access
  useEffect(() => {
    if (user && user.id) {
      window.testAchievements = {
        unlock: testUnlockAchievement,
        list: () => {
          console.log('📜 Available achievements:');
          Object.values(ACHIEVEMENTS).forEach(a => {
            console.log(`  ${a.id}: ${a.icon} ${a.name} - ${a.description}`);
          });
        },
        status: () => {
          console.log('📊 Current status:');
          console.log('  Unlocked IDs:', unlockedRef.current);
          console.log('  Stats:', {
            firstClickDone: stats.current.firstClickDone,
            viewedModes: Array.from(stats.current.viewedModes),
            gdpViewCount: stats.current.gdpViewCount,
            chatMessageSent: stats.current.chatMessageSent
          });
        },
        forceToast: (achievementId) => {
          console.log(`🔔 Force showing toast for achievement ${achievementId}`);
          setLastUnlocked(achievementId);
          setTimeout(() => setLastUnlocked(null), 5000);
        }
      };
      
      console.log('✅ Test functions available!');
    }
  }, [user, testUnlockAchievement]);

  const triggerFirstClick = useCallback(() => {
    console.log('👆 triggerFirstClick called');
    
    if (!stats.current.firstClickDone && !unlockedRef.current.includes(1)) {
      stats.current.firstClickDone = true;
      return unlockAchievement(1);
    }
    return false;
  }, [unlockAchievement]);

  const triggerTimelineView = useCallback(() => {
    console.log('⏰ triggerTimelineView called');
    
    if (!unlockedRef.current.includes(2)) {
      return unlockAchievement(2);
    }
    return false;
  }, [unlockAchievement]);

  const triggerModeView = useCallback((mode) => {
    console.log('🗺️ triggerModeView called with mode:', mode);
    
    stats.current.viewedModes.add(mode);
    saveStats();
    
    if (stats.current.viewedModes.size >= 5 && !unlockedRef.current.includes(3)) {
      return unlockAchievement(3);
    }
    return false;
  }, [unlockAchievement, saveStats]);

  const triggerGDPView = useCallback(() => {
    console.log('💰 triggerGDPView called');
    
    stats.current.gdpViewCount += 1;
    saveStats();
    
    if (stats.current.gdpViewCount >= 10 && !unlockedRef.current.includes(5)) {
      return unlockAchievement(5);
    }
    return false;
  }, [unlockAchievement, saveStats]);

  const triggerSocialButterfly = useCallback(() => {
    console.log('🦋 triggerSocialButterfly called');
    
    if (!stats.current.chatMessageSent && !unlockedRef.current.includes(4)) {
      stats.current.chatMessageSent = true;
      saveStats();
      return unlockAchievement(4);
    }
    return false;
  }, [unlockAchievement, saveStats]);

  const resetStats = useCallback(() => {
    console.log('🔄 resetStats called');
    stats.current = {
      firstClickDone: unlockedRef.current.includes(1),
      viewedModes: new Set(),
      gdpViewCount: 0,
      chatMessageSent: unlockedRef.current.includes(4),
    };
    saveStats();
  }, [saveStats]);

  return {
    unlockedIds,
    loading,
    lastUnlocked,
    triggerFirstClick,
    triggerTimelineView,
    triggerModeView,
    triggerGDPView,
    triggerSocialButterfly,
    resetStats,
    achievements: ACHIEVEMENTS,
    isUnlocked: (id) => unlockedRef.current.includes(id),
    testUnlock: testUnlockAchievement,
  };
}