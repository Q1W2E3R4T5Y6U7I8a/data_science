export const formatNumber = (number, language = 'en', options = {}) => {
  if (number === undefined || number === null) return 'N/A';
  
  const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    ua: 'uk-UA'
  };
  
  try {
    return new Intl.NumberFormat(locales[language] || 'en-US', options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

export const formatDate = (date, language = 'en', options = {}) => {
  const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    ua: 'uk-UA'
  };
  
  try {
    return new Intl.DateTimeFormat(locales[language] || 'en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
};

export const formatCurrency = (amount, language = 'en', currency = 'USD') => {
  const locales = {
    en: 'en-US',
    fr: 'fr-FR',
    ua: 'uk-UA'
  };
  
  try {
    return new Intl.NumberFormat(locales[language] || 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount}`;
  }
};