// Unified circle scaling constants
export const CIRCLE_CONFIG = {
  MAX_RADIUS: 40,        // Maximum circle radius in pixels
  MIN_RADIUS: 0.01,         // Minimum circle radius in pixels
  BASE_RADIUS: 44,       // Base radius for sqrt scaling (used for GDP, population total)
  BASE_RADIUS_LINEAR: 30 // Base radius for linear scaling (used for growth rates, changes)
};

/**
 * Unified circle radius calculator
 * @param {number} value - The actual value to scale
 * @param {number} maxValue - The maximum value in the dataset
 * @param {string} scaleType - 'sqrt' or 'linear'
 * @param {number} maxRadius - Maximum radius (defaults to CIRCLE_CONFIG.MAX_RADIUS)
 * @returns {number} - Radius in pixels
 */
export const calculateCircleRadius = (value, maxValue, scaleType = 'sqrt', maxRadius = CIRCLE_CONFIG.MAX_RADIUS) => {
  if (!value || value <= 0 || !maxValue || maxValue <= 0) {
    return CIRCLE_CONFIG.MIN_RADIUS;
  }
  
  const normalizedValue = Math.min(value / maxValue, 1); // Cap at 1 to prevent oversized circles
  
  if (scaleType === 'linear') {
    return Math.max(
      CIRCLE_CONFIG.MIN_RADIUS, 
      Math.min(maxRadius, CIRCLE_CONFIG.BASE_RADIUS_LINEAR * normalizedValue)
    );
  } else { // sqrt scaling
    return Math.max(
      CIRCLE_CONFIG.MIN_RADIUS, 
      Math.min(maxRadius, CIRCLE_CONFIG.BASE_RADIUS * Math.sqrt(normalizedValue))
    );
  }
};

/**
 * Get the appropriate scale type for a given view
 * @param {string} mapType - 'gdp', 'population', 'timeline', etc.
 * @param {string} view - The specific view within the map
 * @returns {string} - 'sqrt' or 'linear'
 */
export const getScaleTypeForView = (mapType, view) => {
  // Use sqrt scaling for absolute magnitudes
  if (mapType === 'gdp' && view === 'total') return 'sqrt';
  if (mapType === 'population' && view === 'total') return 'sqrt';
  if (mapType === 'timeline' && (view === 'population' || view === 'gdp')) return 'sqrt';
  
  // Use linear scaling for changes, growth rates, per capita values
  return 'linear';
};