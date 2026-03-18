import React, { useMemo } from 'react';
import { Geography, Graticule } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import { getFlagColor, getCountryVariations } from '../../countryUtils';
import FUTURE_PAST_DATA from '../../data/futureAndPastData';
import { calculateCircleRadius, getScaleTypeForView, CIRCLE_CONFIG } from '../../utils/circleScaling';

const FuturePastMap = ({ 
  geographies, 
  countryColors, 
  setSelected, 
  getCountryColor, 
  colorMode,
  projection,
  timelineYear = '2000',
  timelineView = 'population',
  t,
  language 
}) => {
  const path = geoPath().projection(projection);

  const getNumericValue = (val) => {
    if (!val) return 0;
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const circles = useMemo(() => {
    if (!geographies) return [];

    let maxValue = 0;
    
    Object.values(FUTURE_PAST_DATA).forEach(countryData => {
      if (typeof countryData === 'object' && !Array.isArray(countryData)) {
        Object.values(countryData).forEach(yearData => {
          const value = timelineView === 'population' ? yearData.population : yearData.gdp;
          const numValue = getNumericValue(value);
          if (numValue > maxValue) {
            maxValue = numValue;
          }
        });
      }
    });

    const results = [];

    geographies.forEach(geo => {
      const name = geo.properties.name;
      
      let countryData = null;
      
      if (FUTURE_PAST_DATA[name] && typeof FUTURE_PAST_DATA[name] === 'object') {
        countryData = FUTURE_PAST_DATA[name];
      }
      
      if (!countryData && typeof FUTURE_PAST_DATA[name] === 'string') {
        const aliasTarget = FUTURE_PAST_DATA[name];
        if (FUTURE_PAST_DATA[aliasTarget] && typeof FUTURE_PAST_DATA[aliasTarget] === 'object') {
          countryData = FUTURE_PAST_DATA[aliasTarget];
        }
      }
      
      if (!countryData) {
        const geoVars = getCountryVariations(name).map(v => v.toLowerCase());
        
        if (name.toLowerCase().includes('russia') || name.toLowerCase().includes('russian')) {
          if (FUTURE_PAST_DATA['Russia'] && typeof FUTURE_PAST_DATA['Russia'] === 'object') {
            countryData = FUTURE_PAST_DATA['Russia'];
          } else if (FUTURE_PAST_DATA['Russian Federation'] && typeof FUTURE_PAST_DATA['Russian Federation'] === 'object') {
            countryData = FUTURE_PAST_DATA['Russian Federation'];
          }
        } else {
          const foundKey = Object.keys(FUTURE_PAST_DATA).find(key => {
            if (typeof FUTURE_PAST_DATA[key] === 'object' && !Array.isArray(FUTURE_PAST_DATA[key])) {
              const keyVars = getCountryVariations(key).map(v => v.toLowerCase());
              return geoVars.some(gv => keyVars.includes(gv));
            }
            return false;
          });
          if (foundKey) {
            countryData = FUTURE_PAST_DATA[foundKey];
          }
        }
      }

      if (countryData && countryData[timelineYear]) {
        const yearData = countryData[timelineYear];
        const value = timelineView === 'population' ? yearData.population : yearData.gdp;
        const numValue = getNumericValue(value);
        
        if (numValue > 0) {
          const centroid = path.centroid(geo);
          if (!centroid || centroid.length !== 2 || isNaN(centroid[0]) || isNaN(centroid[1])) return;

          const scaleType = getScaleTypeForView('timeline', timelineView);
          const radius = calculateCircleRadius(numValue, maxValue, scaleType);
          
          results.push({
            name,
            data: yearData,
            value: numValue,
            year: timelineYear,
            view: timelineView,
            cx: centroid[0],
            cy: centroid[1],
            r: radius,
            fillColor: getCountryColor ? getCountryColor(name, colorMode) : (countryColors[name] || getFlagColor(name))
          });
        }
      }
    });

    return results;
  }, [geographies, timelineYear, timelineView, colorMode, countryColors, getCountryColor, path]);

  const formatValue = (value, view) => {
    if (view === 'population') {
      if (value >= 1000000) {
        const millions = (value / 1000000).toFixed(1);
        return language === 'fr' ? `${millions}M` : `${millions}M`;
      }
      if (value >= 1000) {
        const thousands = (value / 1000).toFixed(1);
        return language === 'fr' ? `${thousands}k` : `${thousands}K`;
      }
      return value.toString();
    } else {
      const trillions = (value / 1000).toFixed(2);
      return `$${trillions}T`;
    }
  };

  const getLabels = () => {
    if (language === 'fr') {
      return {
        year: 'Année',
        population: 'Population',
        gdp: 'PIB',
        density: 'Densité',
        perKm2: '/km²',
        clickForDetails: 'Cliquez pour plus de détails'
      };
    }
    return {
      year: 'Year',
      population: 'Population',
      gdp: 'GDP',
      density: 'Density',
      perKm2: '/km²',
      clickForDetails: 'Click for details'
    };
  };

  const labels = getLabels();

  return (
    <>
      <Graticule stroke="#04ff00" strokeWidth={0.3} />
      
      {geographies.map(geo => {
        const name = geo.properties.name;
        const baseColor = getCountryColor ? getCountryColor(name, colorMode) : (countryColors[name] || getFlagColor(name));
        
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill={baseColor}
            fillOpacity={0.1}
            stroke="#0a1a2a"
            strokeWidth={0.5}
            style={{
              default: { outline: 'none' },
              hover: { fill: '#ffd700', fillOpacity: 0.3, outline: 'none', cursor: 'crosshair' }
            }}
          />
        );
      })}
      
      {circles.map((circle, idx) => (
        <circle
          key={`timeline-${idx}`}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.fillColor}
          fillOpacity={0.6}
          stroke="#0a1a2a"
          strokeWidth={1}
          style={{ cursor: 'crosshair' }}
          onClick={() => setSelected({ 
            name: circle.name, 
            value: circle.data,
            type: 'timeline',
            year: circle.year,
            view: circle.view,
            displayValue: circle.value
          })}
        >
          <title>
            {`${circle.name}
            ═══════════════
            ${labels.year}: ${circle.year}
            ${circle.view === 'population' ? labels.population : labels.gdp}: ${formatValue(circle.value, circle.view)}
            ${circle.view === 'population' && circle.data.density ? `\n${labels.density}: ${circle.data.density}${labels.perKm2}` : ''}
            ═══════════════
            ${labels.clickForDetails}`}
          </title>
        </circle>
      ))}
    </>
  );
};

export default FuturePastMap;