import en from './en';
import fr from './fr';
import ua from './ua';
import { quizEn } from './quiz/en';
import { quizFr } from './quiz/fr';
import { quizUa } from './quiz/ua';
import { achievementTranslations } from './achievementTranslations';

// Add achievement translations to each language
en.achievements = achievementTranslations.en;
fr.achievements = achievementTranslations.fr;
ua.achievements = achievementTranslations.ua;

// Add quiz translations
en.quiz = quizEn;
fr.quiz = quizFr;
ua.quiz = quizUa;

const translations = { en, fr, ua };
export default translations;