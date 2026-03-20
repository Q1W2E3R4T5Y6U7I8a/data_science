// Achievement translations for all supported languages
export const achievementTranslations = {
  en: {
    achievements: 'Achievements',
    achievement_unlocked: 'Achievement Unlocked!',
    achievement_1_name: 'First Click',
    achievement_1_description: 'Click your first country',
    achievement_2_name: 'Time Traveler',
    achievement_2_description: 'Explore the timeline view',
    achievement_3_name: 'Data Explorer',
    achievement_3_description: 'Try 5 different map modes',
    achievement_4_name: 'Social Butterfly',
    achievement_4_description: 'Send your first chat message',
    achievement_5_name: 'GDP Master',
    achievement_5_description: 'View GDP data for 10 countries',
    achievement_modal_title: 'Your Achievements',
    achievement_locked: 'Locked',
    achievement_unlocked_badge: '✓',
    achievement_progress: 'Progress',
    achievement_completed: 'Completed',
    achievement_remaining: 'Remaining',
  },
  fr: {
    achievements: 'Réalisations',
    achievement_unlocked: 'Réalisation débloquée !',
    achievement_1_name: 'Premier Clic',
    achievement_1_description: 'Cliquez sur votre premier pays',
    achievement_2_name: 'Voyageur Temporel',
    achievement_2_description: 'Explorez la vue chronologique',
    achievement_3_name: 'Explorateur de Données',
    achievement_3_description: 'Essayez 5 modes de carte différents',
    achievement_4_name: 'Papillon Social',
    achievement_4_description: 'Envoyez votre premier message de chat',
    achievement_5_name: 'Maître du PIB',
    achievement_5_description: 'Consultez les données du PIB pour 10 pays',
    achievement_modal_title: 'Vos Réalisations',
    achievement_locked: 'Verrouillé',
    achievement_unlocked_badge: '✓',
    achievement_progress: 'Progrès',
    achievement_completed: 'Terminé',
    achievement_remaining: 'Restant',
  },
  ua: {
    achievements: 'Досягнення',
    achievement_unlocked: 'Досягнення розблоковано!',
    achievement_1_name: 'Перший Клік',
    achievement_1_description: 'Клацніть на першу країну',
    achievement_2_name: 'Мандрівник у Часі',
    achievement_2_description: 'Дослідіть перегляд часової шкали',
    achievement_3_name: 'Дослідник Даних',
    achievement_3_description: 'Спробуйте 5 різних режимів карти',
    achievement_4_name: 'Соціальний Метелик',
    achievement_4_description: 'Надішліть своє перше повідомлення в чаті',
    achievement_5_name: 'Майстер ВВП',
    achievement_5_description: 'Перегляньте дані ВВП для 10 країн',
    achievement_modal_title: 'Ваші Досягнення',
    achievement_locked: 'Заблоковано',
    achievement_unlocked_badge: '✓',
    achievement_progress: 'Прогрес',
    achievement_completed: 'Завершено',
    achievement_remaining: 'Залишилось',
  }
};

// Helper function to get achievement name with localization
export const getAchievementName = (id, language = 'en') => {
  const key = `achievement_${id}_name`;
  return achievementTranslations[language]?.[key] || ACHIEVEMENT_NAMES[id]?.en || `Achievement ${id}`;
};

// Helper function to get achievement description with localization
export const getAchievementDescription = (id, language = 'en') => {
  const key = `achievement_${id}_description`;
  return achievementTranslations[language]?.[key] || ACHIEVEMENT_DESCRIPTIONS[id]?.en || '';
};

// Default names for fallback
export const ACHIEVEMENT_NAMES = {
  1: { en: 'First Click', fr: 'Premier Clic', ua: 'Перший Клік' },
  2: { en: 'Time Traveler', fr: 'Voyageur Temporel', ua: 'Мандрівник у Часі' },
  3: { en: 'Data Explorer', fr: 'Explorateur de Données', ua: 'Дослідник Даних' },
  4: { en: 'Social Butterfly', fr: 'Papillon Social', ua: 'Соціальний Метелик' },
  5: { en: 'GDP Master', fr: 'Maître du PIB', ua: 'Майстер ВВП' },
};

export const ACHIEVEMENT_DESCRIPTIONS = {
  1: { en: 'Click your first country', fr: 'Cliquez sur votre premier pays', ua: 'Клацніть на першу країну' },
  2: { en: 'Explore the timeline view', fr: 'Explorez la vue chronologique', ua: 'Дослідіть перегляд часової шкали' },
  3: { en: 'Try 5 different map modes', fr: 'Essayez 5 modes de carte différents', ua: 'Спробуйте 5 різних режимів карти' },
  4: { en: 'Send your first chat message', fr: 'Envoyez votre premier message de chat', ua: 'Надішліть своє перше повідомлення в чаті' },
  5: { en: 'View GDP data for 10 countries', fr: 'Consultez les données du PIB pour 10 pays', ua: 'Перегляньте дані ВВП для 10 країн' },
};