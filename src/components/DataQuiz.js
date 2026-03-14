import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/DataQuiz.css';

const DataQuiz = ({ onClose, t, language }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [translationsReady, setTranslationsReady] = useState(false);
  
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  // Build questions array when language or t changes
  const buildQuestions = useCallback(() => {
     console.log('Building questions with t function:', t);

      const safeT = (key, defaultValue = '') => {
    const value = t(key);
    return value && typeof value === 'string' ? value : defaultValue;
  };
    return [
      {
        id: 'intro',
        type: 'intro',
        category: t('quiz.categories.intro'),
        question: t('quiz.questions.intro'),
        options: [
          t('quiz.options.letsGo'),
          t('quiz.options.sure'),
          t('quiz.options.asYouSay')
        ],
        correct: t('quiz.options.letsGo'),
        fact: null
      },
      {
        id: 'civilian_deaths',
        type: 'question',
        category: t('quiz.categories.civilian'),
        question: t('quiz.questions.civilian_deaths'),
        options: [
          t('quiz.options.sovietUnion'),
          t('quiz.options.china'),
          t('quiz.options.poland'),
          t('quiz.options.germany')
        ],
        correct: t('quiz.options.china'),
        fact: t('quiz.facts.civilian_deaths')
      },
      {
        id: 'largest_population',
        type: 'question',
        category: t('quiz.categories.population'),
        question: t('quiz.questions.largest_population'),
        options: [
          t('quiz.options.chinaPop'),
          t('quiz.options.india'),
          t('quiz.options.unitedStates'),
          t('quiz.options.indonesia')
        ],
        correct: t('quiz.options.india'),
        fact: t('quiz.facts.largest_population')
      },
      {
        id: 'ww2_percent_country',
        type: 'question',
        category: t('quiz.categories.ww2_percent_country'),
        question: t('quiz.questions.ww2_percent_country'),
        options: [
          t('quiz.options.poland'),
          t('quiz.options.sovietUnion'),
          t('quiz.options.belarus'),
          t('quiz.options.germany')
        ],
        correct: t('quiz.options.belarus'),
        fact: t('quiz.facts.ww2_percent_country')
      },
      {
        id: 'conclusion',
        type: 'conclusion',
        category: t('quiz.categories.conclusion'),
        question: t('quiz.questions.conclusion'),
        options: [
          t('quiz.options.willDo'),
          t('quiz.options.thanks'),
          t('quiz.options.greatWork')
        ],
        correct: t('quiz.options.willDo'),
        fact: null
      }
    ];
  }, [t]);

  // Initialize questions on mount and when language changes
useEffect(() => {
  if (t && typeof t === 'function') {
    // Test if translations are working
    const testTranslation = t('quiz.categories.intro');
    console.log('Testing translation:', testTranslation);
    
    // If the translation returns the key itself, it's not working
    if (testTranslation && testTranslation !== 'quiz.categories.intro') {
      console.log('Translations are ready!');
      setTranslationsReady(true);
    } else {
      console.warn('Translations not working properly - returning keys');
    }
  }
}, [t]);

// Only build questions when translations are ready
useEffect(() => {
  if (translationsReady) {
    console.log('Building questions with working translations');
    const newQuestions = buildQuestions();
    console.log('New questions built:', newQuestions);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setStreak(0);
    setQuestionHistory([]);
  }
}, [buildQuestions, language, translationsReady]);

// Log questions after they're set
useEffect(() => {
  if (questions.length > 0) {
    console.log('Questions state updated:', questions);
    console.log('Current question:', questions[currentQuestionIndex]);
  }
}, [questions, currentQuestionIndex]);

  const currentQ = questions[currentQuestionIndex];
  const isIntroOrConclusion = currentQ?.type === 'intro' || currentQ?.type === 'conclusion';
  const totalRealQuestions = questions.filter(q => q?.type === 'question').length;
  const realQuestionsAnswered = questionHistory.filter(q => q?.type === 'question').length;

  // Handle clicks outside the quiz container
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption || !currentQ) return;
    
    setSelectedOption(option);
    
    // For intro and conclusion, all answers are "correct"
    const isCorrect = isIntroOrConclusion ? true : option === currentQ.correct;
    
    // Update question history
    setQuestionHistory(prev => [...prev, {
      question: currentQ.question,
      selected: option,
      correct: currentQ.correct,
      isCorrect,
      fact: currentQ.fact,
      type: currentQ.type
    }]);
    
    // Update score (only count real questions)
    if (!isIntroOrConclusion && isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else if (!isIntroOrConclusion && !isCorrect) {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setStreak(0);
    setQuestionHistory([]);
  };

  // Loading state
  if (!questions.length || !currentQ) {
    return (
      <div 
        className="data-quiz-overlay" 
        ref={overlayRef}
        onClick={handleOverlayClick}
      >
        <div className="data-quiz-container" onClick={e => e.stopPropagation()}>
          <button className="quiz-close" onClick={onClose}>✕</button>
          <div className="quiz-result">
            <div className="quiz-result-text">{t('quiz.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="data-quiz-overlay" 
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div 
        className="data-quiz-container" 
        onClick={e => e.stopPropagation()}
        ref={containerRef}
      >
        <button className="quiz-close" onClick={onClose}>✕</button>
        
        {/* Terminal Header */}
        <div className="quiz-header">
          <div className="quiz-header-left">
            <div className="quiz-led"></div>
            <div className="quiz-led red"></div>
            <div className="quiz-led yellow"></div>
          </div>
        </div>

        {/* Stats Bar - Only show for real questions */}
        {!isIntroOrConclusion && !showResult && (
          <div className="quiz-stats">
            <div>{t('quiz.score')}: {score}</div>
            <div>{realQuestionsAnswered}/{totalRealQuestions}</div>
          </div>
        )}

        {/* Cards Container */}
        <div className="quiz-cards-container">
          {!showResult && currentQ && (
            <div className={`quiz-card ${isIntroOrConclusion ? 'quiz-card-intro' : ''}`}>
              <div className="quiz-card-category">
                {currentQ.category}
              </div>
              
              <div className="quiz-card-question" style={isIntroOrConclusion ? { whiteSpace: 'pre-line' } : {}}>
                {currentQ.question}
              </div>

              <div className="quiz-card-options">
                {currentQ.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`quiz-option ${
                      selectedOption === option ? 'selected' : ''
                    } ${
                      selectedOption && !isIntroOrConclusion && option === currentQ.correct ? 'correct' : ''
                    } ${
                      selectedOption && 
                      !isIntroOrConclusion && 
                      selectedOption !== currentQ.correct && 
                      selectedOption === option ? 'incorrect' : ''
                    } ${selectedOption ? 'disabled' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>

              {selectedOption && (
                <div className="quiz-card-footer">
                  {currentQ.fact && (
                    <div className="quiz-fact">
                      💡 {currentQ.fact}
                    </div>
                  )}
                  <button className="quiz-next" onClick={handleNext}>
                    {currentQuestionIndex >= questions.length - 1 ? t('quiz.seeResults') : t('quiz.next')} →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Result Screen */}
          {showResult && (
            <div className="quiz-result">
              <div className="quiz-result-icon">🏆</div>
              <div className="quiz-result-score">{score}/{totalRealQuestions}</div>
              <div className="quiz-result-text">
                {score === totalRealQuestions ? t('quiz.result.perfect') :
                 score >= totalRealQuestions-1 ? t('quiz.result.great') :
                 score >= totalRealQuestions-2 ? t('quiz.result.good') :
                 t('quiz.result.tryAgain')}
              </div>
              
              <div className="quiz-result-stats">
                <div className="quiz-stat-item">
                  {t('quiz.stats.correct')} <span>{score}</span>
                </div>

              </div>

              <button className="quiz-play-again" onClick={resetQuiz}>
                ▸ {t('quiz.playAgain')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataQuiz;