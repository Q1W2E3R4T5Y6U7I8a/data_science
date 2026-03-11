import React from 'react';
import useLocalization from '../hooks/userLocalisation';

const LanguageSwitcher = () => {
  const { language, changeLanguage, getAvailableLanguages } = useLocalization();
  
  const languages = getAvailableLanguages();

  const handleLanguageChange = (langCode) => {
    console.log('Changing language to:', langCode); // Debug log
    changeLanguage(langCode);
  };

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-circle ${lang.code === language ? 'active' : ''}`}
          onClick={() => handleLanguageChange(lang.code)}
          title={lang.name}
        >
          <img src={lang.flag} alt={lang.name} className="circle-flag" />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;