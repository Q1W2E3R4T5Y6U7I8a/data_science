// Unified circle scaling constants
export const CIRCLE_CONFIG = {
  MAX_RADIUS: 40,        // Maximum circle radius in pixels
  MIN_RADIUS: 2,         // Minimum circle radius in pixels (increased from 0.01 for visibility)
  BASE_RADIUS: 40,       // Base radius for sqrt scaling
  BASE_RADIUS_LINEAR: 30 // Base radius for linear scaling
};

/**
 * Unified circle radius calculator
 * @param {number} value - The actual value to scale
 * @param {number} maxValue - The maximum value in the dataset
 * @param {string} scaleType - 'sqrt' or 'linear'
 * @returns {number} - Radius in pixels
 */
export const calculateCircleRadius = (value, maxValue, scaleType = 'sqrt') => {
  if (!value || value <= 0 || !maxValue || maxValue <= 0) {
    return CIRCLE_CONFIG.MIN_RADIUS;
  }
  
  const normalizedValue = Math.min(value / maxValue, 1);
  
  if (scaleType === 'linear') {
    return Math.max(
      CIRCLE_CONFIG.MIN_RADIUS, 
      Math.min(CIRCLE_CONFIG.MAX_RADIUS, CIRCLE_CONFIG.BASE_RADIUS_LINEAR * normalizedValue)
    );
  } else { // sqrt scaling
    return Math.max(
      CIRCLE_CONFIG.MIN_RADIUS, 
      Math.min(CIRCLE_CONFIG.MAX_RADIUS, CIRCLE_CONFIG.BASE_RADIUS * Math.sqrt(normalizedValue))
    );
  }
};

/**
 * Get the appropriate scale type for a given view
 * @param {string} mapType - 'gdp', 'timeline', 'population'
 * @param {string} view - The specific view within the map
 * @returns {string} - 'sqrt' or 'linear'
 */
export const getScaleTypeForView = (mapType, view) => {
  // GDP map
  if (mapType === 'gdp') {
    if (view === 'total') return 'sqrt';
    if (view === 'growth') return 'linear';
    if (view === 'perCapita') return 'linear';
  }
  
  // Timeline/FuturePast map
  if (mapType === 'timeline') {
    if (view === 'population') return 'sqrt';
    if (view === 'gdp') return 'sqrt';
  }
  
  // Population map (if you have one)
  if (mapType === 'population') {
    if (view === 'total') return 'sqrt';
    if (view === 'density') return 'linear';
    if (view === 'growth') return 'linear';
  }
  
  return 'linear'; // default
};