import React, { useState, useEffect } from 'react';
/**
 * PhoneHover - Fully independent component with built-in translations
 * Languages: English (EN), Ukrainian (UA), French (FR)
 * No external dependencies, no global state
 */

const PhoneHover = ({ initialLanguage = 'en' }) => {
  // State for current language
  const [language, setLanguage] = useState(initialLanguage);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Translation object - EN, UA, FR
  const translations = {
    en: {
      title: 'Desktop Version Only',
      message: 'This interactive data visualization is optimized for desktop experience. Please visit us on your computer for the full experience or download the app.',
      googlePlay: 'Google Play',
      appStore: 'App Store',
      underDevelopment: 'Under Development',
      or: 'or',
      community: 'Visit Our project',
      footer: 'Check out our other projects and join the community!',
      language: 'Language',
      close: 'Close',
      download: 'Download App',
      comingSoon: 'Coming Soon',
      notice: 'Mobile apps are currently under development. Stay tuned!',
      back: 'Back',
      confirm: 'Confirm',
      cancel: 'Cancel',
      learnMore: 'Learn More',
      share: 'Share',
      copy: 'Copy Link',
      copied: 'Copied!',
      email: 'Email',
      twitter: 'Twitter',
      facebook: 'Facebook',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      discord: 'Discord',
      github: 'GitHub',
      website: 'Website',
      documentation: 'Documentation',
      support: 'Support',
      feedback: 'Feedback',
      report: 'Report Issue',
      version: 'Version 1.0.0',
      copyright: '© 2024 DataQuiz. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      about: 'About',
      features: 'Features',
      updates: 'Updates',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      unsubscribe: 'Unsubscribe',
      success: 'Success!',
      error: 'Error!',
      warning: 'Warning!',
      info: 'Information',
      loading: 'Loading...',
      processing: 'Processing...',
      done: 'Done!',
      tryAgain: 'Try Again',
      later: 'Later',
      now: 'Now',
      soon: 'Soon',
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      all: 'All',
      none: 'None',
      some: 'Some',
      many: 'Many',
      few: 'Few',
      more: 'More',
      less: 'Less',
      new: 'New',
      old: 'Old',
      free: 'Free',
      paid: 'Paid',
      premium: 'Premium',
      basic: 'Basic',
      pro: 'Pro',
      enterprise: 'Enterprise',
      team: 'Team',
      individual: 'Individual',
      organization: 'Organization',
      company: 'Company',
      personal: 'Personal',
      business: 'Business'
    },
    ua: {
      title: 'Тільки десктопна версія',
      message: 'Ця інтерактивна візуалізація даних оптимізована для роботи на комп\'ютері. Будь ласка, відвідайте нас з комп\'ютера для повноцінного досвіду або скачайте додаток на телефон.',
      googlePlay: 'Google Play',
      appStore: 'App Store',
      underDevelopment: 'В розробці',
      or: 'або',
      community: 'Відвідати спільноту',
      footer: 'Перегляньте наші інші проєкти та приєднуйтесь до спільноти!',
      language: 'Мова',
      close: 'Закрити',
      download: 'Завантажити додаток',
      comingSoon: 'Незабаром',
      notice: 'Мобільні додатки зараз у розробці. Слідкуйте за оновленнями!',
      back: 'Назад',
      confirm: 'Підтвердити',
      cancel: 'Скасувати',
      learnMore: 'Дізнатись більше',
      share: 'Поділитись',
      copy: 'Копіювати посилання',
      copied: 'Скопійовано!',
      email: 'Електронна пошта',
      twitter: 'Твіттер',
      facebook: 'Фейсбук',
      telegram: 'Телеграм',
      whatsapp: 'Вотсап',
      discord: 'Дискорд',
      github: 'Гітхаб',
      website: 'Вебсайт',
      documentation: 'Документація',
      support: 'Підтримка',
      feedback: 'Зворотній зв\'язок',
      report: 'Повідомити про проблему',
      version: 'Версія 1.0.0',
      copyright: '© 2024 DataQuiz. Всі права захищені.',
      privacy: 'Політика конфіденційності',
      terms: 'Умови використання',
      contact: 'Контакти',
      about: 'Про нас',
      features: 'Можливості',
      updates: 'Оновлення',
      newsletter: 'Розсилка',
      subscribe: 'Підписатись',
      unsubscribe: 'Відписатись',
      success: 'Успішно!',
      error: 'Помилка!',
      warning: 'Увага!',
      info: 'Інформація',
      loading: 'Завантаження...',
      processing: 'Обробка...',
      done: 'Готово!',
      tryAgain: 'Спробувати ще',
      later: 'Пізніше',
      now: 'Зараз',
      soon: 'Скоро',
      today: 'Сьогодні',
      tomorrow: 'Завтра',
      yesterday: 'Вчора',
      week: 'Тиждень',
      month: 'Місяць',
      year: 'Рік',
      all: 'Все',
      none: 'Нічого',
      some: 'Деякі',
      many: 'Багато',
      few: 'Мало',
      more: 'Більше',
      less: 'Менше',
      new: 'Нове',
      old: 'Старе',
      free: 'Безкоштовно',
      paid: 'Платно',
      premium: 'Преміум',
      basic: 'Базовий',
      pro: 'Про',
      enterprise: 'Для бізнесу',
      team: 'Команда',
      individual: 'Особистий',
      organization: 'Організація',
      company: 'Компанія',
      personal: 'Персональний',
      business: 'Бізнес'
    },
    fr: {
      title: 'Version Desktop Uniquement',
      message: 'Cette visualisation de données interactive est optimisée pour une expérience sur ordinateur. Veuillez nous visiter sur votre ordinateur pour une expérience complète ou télécharger l\'application pour android ou IOS.',
      googlePlay: 'Google Play',
      appStore: 'App Store',
      underDevelopment: 'En développement',
      or: 'ou',
      community: 'Visitez notre projet',
      footer: 'Découvrez nos autres projets et rejoignez la communauté !',
      language: 'Langue',
      close: 'Fermer',
      download: 'Télécharger l\'application',
      comingSoon: 'Bientôt disponible',
      notice: 'Les applications mobiles sont actuellement en développement. Restez à l\'écoute !',
      back: 'Retour',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      learnMore: 'En savoir plus',
      share: 'Partager',
      copy: 'Copier le lien',
      copied: 'Copié !',
      email: 'Email',
      twitter: 'Twitter',
      facebook: 'Facebook',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      discord: 'Discord',
      github: 'GitHub',
      website: 'Site web',
      documentation: 'Documentation',
      support: 'Support',
      feedback: 'Retour',
      report: 'Signaler un problème',
      version: 'Version 1.0.0',
      copyright: '© 2024 DataQuiz. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      contact: 'Contactez-nous',
      about: 'À propos',
      features: 'Fonctionnalités',
      updates: 'Mises à jour',
      newsletter: 'Newsletter',
      subscribe: 'S\'abonner',
      unsubscribe: 'Se désabonner',
      success: 'Succès !',
      error: 'Erreur !',
      warning: 'Attention !',
      info: 'Information',
      loading: 'Chargement...',
      processing: 'Traitement...',
      done: 'Terminé !',
      tryAgain: 'Réessayer',
      later: 'Plus tard',
      now: 'Maintenant',
      soon: 'Bientôt',
      today: 'Aujourd\'hui',
      tomorrow: 'Demain',
      yesterday: 'Hier',
      week: 'Semaine',
      month: 'Mois',
      year: 'Année',
      all: 'Tout',
      none: 'Aucun',
      some: 'Certains',
      many: 'Beaucoup',
      few: 'Peu',
      more: 'Plus',
      less: 'Moins',
      new: 'Nouveau',
      old: 'Ancien',
      free: 'Gratuit',
      paid: 'Payant',
      premium: 'Premium',
      basic: 'Basique',
      pro: 'Pro',
      enterprise: 'Entreprise',
      team: 'Équipe',
      individual: 'Individuel',
      organization: 'Organisation',
      company: 'Société',
      personal: 'Personnel',
      business: 'Affaires'
    }
  };

  // Helper function to get translation
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Links
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.dataquiz.app";
  const appStoreLink = "https://apps.apple.com/app/dataquiz/id123456789";
  const communityLink = "https://q1w2e3r4t5y6u7i8a.github.io/dumy_page/";

  // Handlers
  const handleAppStoreClick = (e) => {
    e.preventDefault();
    setAlertMessage(`📱 ${t('appStore')} - ${t('underDevelopment')}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handlePlayStoreClick = (e) => {
    e.preventDefault();
    setAlertMessage(`📱 ${t('googlePlay')} - ${t('underDevelopment')}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  // Get flag image path
  const getFlagPath = (lang) => {
    return `${process.env.PUBLIC_URL}/flags/${lang}.png`;
  };

  return (
    <div className="phone-hover-overlay">
      <div className="phone-hover-container">
        {/* Main Icon */}
        <div className="phone-hover-icon">📱</div>
        
        {/* Title */}
        <h2 className="phone-hover-title">{t('title')}</h2>
        
        {/* Message */}
        <p className="phone-hover-message">{t('message')}</p>

        {/* Download Buttons */}
        <div className="phone-hover-buttons">
          <button 
            className="phone-hover-button playstore"
            onClick={handlePlayStoreClick}
          >
            <span className="button-icon">📲</span>
            <span className="button-text">
              <span className="button-title">{t('googlePlay')}</span>
              <span className="button-subtitle">{t('underDevelopment')}</span>
            </span>
            <span className="button-badge">{t('comingSoon')}</span>
          </button>

          <button 
            className="phone-hover-button appstore"
            onClick={handleAppStoreClick}
          >
            <span className="button-icon">🍎</span>
            <span className="button-text">
              <span className="button-title">{t('appStore')}</span>
              <span className="button-subtitle">{t('underDevelopment')}</span>
            </span>
            <span className="button-badge">{t('comingSoon')}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="phone-hover-divider">
          <span>{t('or')}</span>
        </div>

        {/* Community Link */}
        <a 
          href={communityLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="phone-hover-community"
        >
          <span className="community-icon">🌐</span>
          <span className="community-text">{t('community')}</span>
        </a>

        {/* Language Switcher - Circular Flags at Bottom */}
        <div className="phone-hover-language-bottom">
          <span className="language-label">{t('language')}:</span>
          <div className="language-circles">
            <button 
              className={`language-circle ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
              title="English"
            >
              <img src={getFlagPath('en')} alt="English" />
            </button>
            <button 
              className={`language-circle ${language === 'ua' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('ua')}
              title="Українська"
            >
              <img src={getFlagPath('ua')} alt="Українська" />
            </button>
            <button 
              className={`language-circle ${language === 'fr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('fr')}
              title="Français"
            >
              <img src={getFlagPath('fr')} alt="Français" />
            </button>
          </div>
        </div>




        {/* Decorative Elements */}
        <div className="phone-hover-decoration decoration-1"></div>
        <div className="phone-hover-decoration decoration-2"></div>
        <div className="phone-hover-decoration decoration-3"></div>
      </div>
    </div>
  );
};

export default PhoneHover;