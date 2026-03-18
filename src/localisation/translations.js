import en from './en';
import fr from './fr';
import ua from './ua';
import { quizEn } from './quiz/en';
import { quizFr } from './quiz/fr';
import { quizUa } from './quiz/ua';

en.quiz = quizEn;
fr.quiz = quizFr;
ua.quiz = quizUa;

const translations = { en, fr, ua };
export default translations;