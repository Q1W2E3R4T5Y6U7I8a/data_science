import React, { useMemo } from 'react';
import { Geography, Graticule } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import { getFlagColor, getCountryVariations } from '../../countryUtils';
import { calculateCircleRadius, getScaleTypeForView, CIRCLE_CONFIG } from '../../utils/circleScaling';

const PopulationMap = ({ 
  geographies, 
  countryColors, 
  setSelected, 
  getCountryColor, 
  colorMode,
  populationView, 
  t,
  populationData,
  projection
}) => {
  const path = geoPath().projection(projection);

  const getNumericValue = (val) => {
    if (!val) return 0;
    const cleanVal = String(val)
      .replace(/−/g, '-')
      .replace(/,/g, '');
    const num = parseFloat(cleanVal);
    return isNaN(num) ? 0 : num;
  };

  const processedCircles = useMemo(() => {
    if (!populationData || !geographies) return [];

    const maxPop = Math.max(...populationData.map(d => getNumericValue(d.population)), 1);
    const maxAbs = Math.max(...populationData.map(d => Math.abs(getNumericValue(d.absoluteChange))), 1);
    const maxPct = Math.max(...populationData.map(d => Math.abs(getNumericValue(d.percentChange))), 1);

    const results = [];
    const drawn = new Set();

    geographies.forEach(geo => {
      const name = geo.properties.name;
      if (drawn.has(name)) return;

      const geoVars = getCountryVariations(name).map(v => v.toLowerCase());
      const countryMatch = populationData.find(item => {
        const itemVars = getCountryVariations(item.country).map(v => v.toLowerCase());
        return geoVars.some(gv => itemVars.includes(gv));
      });

      if (countryMatch) {
        const centroid = path.centroid(geo);
        if (!centroid || isNaN(centroid[0])) return;

        const pop = getNumericValue(countryMatch.population);
        const abs = getNumericValue(countryMatch.absoluteChange);
        const pct = getNumericValue(countryMatch.percentChange);

        let radius = CIRCLE_CONFIG.MIN_RADIUS;
        let fillColor = '#00ff4c';
        let isNegative = false;

        if (populationView === 'total') {
          radius = calculateCircleRadius(pop, maxPop, 'sqrt');
          fillColor = getCountryColor ? getCountryColor(name, colorMode) : (countryColors[name] || getFlagColor(name));
        } else {
          const changeVal = populationView === 'changePercent' ? pct : abs;
          const maxVal = populationView === 'changePercent' ? maxPct : maxAbs;
          radius = calculateCircleRadius(Math.abs(changeVal), maxVal, 'linear');
          
          if (changeVal < 0) {
            fillColor = '#ff3333';
            isNegative = true;
          } else {
            fillColor = '#00ff4c';
          }
        }

        results.push({
          name,
          coords: centroid,
          r: radius,
          fillColor,
          isNegative,
          data: countryMatch
        });
        drawn.add(name);
      }
    });
    return results;
  }, [populationData, geographies, populationView, colorMode, countryColors, getCountryColor, path]);

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
      
      {processedCircles.map((circle, idx) => (
        <circle
          key={`pop-circle-${idx}`}
          cx={circle.coords[0]}
          cy={circle.coords[1]}
          r={circle.r}
          fill={circle.fillColor}
          fillOpacity={0.6}
          stroke={circle.isNegative ? "#ffffff" : "#0a1a2a"}
          strokeWidth={circle.isNegative ? 2 : 1}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.3s ease',
            filter: circle.isNegative ? 'drop-shadow(0 0 3px rgba(255, 51, 51, 0.6))' : 'none'
          }}
          onClick={() => setSelected({ 
            name: circle.name, 
            type: 'population',
            value: {
              total: circle.data.population,
              percentChange: circle.data.percentChange,
              absoluteChange: circle.data.absoluteChange,
              view: populationView
            }
          })}
        >
          <title>
            {`${circle.name}\n${populationView}: ${
              populationView === 'total' ? circle.data.population : 
              populationView === 'changePercent' ? circle.data.percentChange : circle.data.absoluteChange
            }`}
          </title>
        </circle>
      ))}
    </>
  );
};

export default PopulationMap;