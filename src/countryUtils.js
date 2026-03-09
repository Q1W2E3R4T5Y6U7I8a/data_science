// countryUtils.js
import flagColors from './data/flagColors';
import countryAreas from './data/countryAreas';

// Get dominant color from flag with fallback
export const getFlagColor = (countryName) => {
  // Try exact match
  if (flagColors[countryName]) {
    return flagColors[countryName];
  }
  
  // Try common variations
  const variations = [
    countryName.replace(' of America', ''),
    countryName.replace('United States', 'USA'),
    countryName.replace('Russian Federation', 'Russia'),
    countryName.replace('UK', 'United Kingdom'),
    countryName.replace('Czechia', 'Czech Republic'),
    countryName.split('(')[0].trim(),
    countryName.split(',')[0].trim()
  ];
  
  for (let variation of variations) {
    if (flagColors[variation]) {
      return flagColors[variation];
    }
  }
  
  return flagColors['Default'] || '#808080';
};

// Get area for a country with fallback
export const getArea = (countryName) => {
  // Try exact match
  if (countryAreas[countryName]) return countryAreas[countryName];
  
  // Try variations
  const variations = [
    countryName.replace(' of America', ''),
    countryName.replace('United States', 'USA'),
    countryName.replace('Russian Federation', 'Russia'),
    countryName.replace('UK', 'United Kingdom'),
    countryName.replace('Czechia', 'Czech Republic'),
    countryName.split('(')[0].trim(),
    countryName.split(',')[0].trim()
  ];
  
  for (let variation of variations) {
    if (countryAreas[variation]) return countryAreas[variation];
  }
  
  return countryAreas['Default'] || 1.0;
};

// Format area for display
export const formatArea = (area) => {
  if (area >= 1) {
    return `${area.toFixed(3)}M km²`;
  } else if (area >= 0.001) {
    return `${(area * 1000).toFixed(1)}K km²`;
  } else {
    return `${(area * 1000000).toFixed(0)} km²`;
  }
};

// Format GDP for display
export const formatGDP = (gdp) => {
  if (gdp >= 1e12) {
    return `$${(gdp / 1e12).toFixed(2)}T`;
  } else if (gdp >= 1e9) {
    return `$${(gdp / 1e9).toFixed(2)}B`;
  } else if (gdp >= 1e6) {
    return `$${(gdp / 1e6).toFixed(2)}M`;
  } else {
    return `$${gdp.toFixed(2)}`;
  }
};

// Get country name variations for matching
export const getCountryVariations = (countryName) => {
  return [
    countryName,
    countryName.replace(' of America', ''),
    countryName.replace('United States', 'USA'),
    countryName.replace('Russian Federation', 'Russia'),
    countryName.replace('UK', 'United Kingdom'),
    countryName.replace('Czechia', 'Czech Republic'),
    countryName.split('(')[0].trim(),
    countryName.split(',')[0].trim()
  ];
};

// Add this function to countryUtils.js
export const hasAreaData = (countryName) => {
  // Try exact match
  if (countryAreas[countryName]) return true;
  
  // Try variations
  const variations = [
    countryName.replace(' of America', ''),
    countryName.replace('United States', 'USA'),
    countryName.replace('Russian Federation', 'Russia'),
    countryName.replace('UK', 'United Kingdom'),
    countryName.replace('Czechia', 'Czech Republic'),
    countryName.split('(')[0].trim(),
    countryName.split(',')[0].trim()
  ];
  
  for (let variation of variations) {
    if (countryAreas[variation]) return true;
  }
  
  return false;
};