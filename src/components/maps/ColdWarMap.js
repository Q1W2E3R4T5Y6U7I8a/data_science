import React from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor } from '../../countryUtils';
import { coldWarData } from '../../data/coldWarData';

// Format numbers
const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const ColdWarMap = ({ geographies, countryColors, setSelected, getCountryColor, colorMode, field = 'total', selectedWar = 'total' }) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);
  
  // Get data for the selected war
  const warData = coldWarData[selectedWar] || coldWarData.total;

  // base values used for scaling each metric
  const baseValues = {
    total: 10000000,  // 10M baseline for total deaths
    percent: 20,       // percent scale 0–20
  };

  const getColor = (countryName) => {
    if (getCountryColor) {
      return getCountryColor(countryName, colorMode);
    }
    if (countryColors[countryName]) return countryColors[countryName];
    return getFlagColor(countryName);
  };

  const circles = [];

  geographies.forEach(geo => {
    const name = geo.properties.name;
    const data = warData[name];
    const centroid = path.centroid(geo);
    
    if (data && centroid && centroid.length === 2 && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
      let value;
      if (field === 'civilian') {
        const parseNum = txt => {
          if (typeof txt === 'number') return txt;
          if (typeof txt === 'string') {
            const n = parseFloat(txt.replace(/[^0-9.]/g, ''));
            return isNaN(n) ? 0 : n;
          }
          return 0;
        };
        value = parseNum(data.civilianMilitary) + parseNum(data.civilianFamine);
      } else {
        value = data[field];
      }
      // if string value still, coerce to number
      if (typeof value === 'string') {
        value = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
      }

      const num = typeof value === 'number' ? value : 0;
      let radius;

      if (field === 'civilian') {
        // scale civilian deaths proportionally to the country's total deaths
        let totalNum = 0;
        if (typeof data.total === 'number') {
          totalNum = data.total;
        } else if (typeof data.total === 'string') {
          const n = parseFloat(data.total.replace(/[^0-9.]/g, ''));
          totalNum = isNaN(n) ? 0 : n;
        }
        const totalRadius = Math.max(2, 20 * Math.sqrt(totalNum / baseValues.total));
        const ratio = totalNum > 0 ? num / totalNum : 0;
        radius = Math.max(2, totalRadius * ratio);
      } else {
        const base = baseValues[field] || baseValues.total;
        radius = Math.max(2, 20 * Math.sqrt(num / base));
      }
      
      circles.push({
        name,
        data,
        cx: centroid[0],
        cy: centroid[1],
        r: radius
      });
    }
  });

  return (
    <>
      <Graticule stroke="#04ff00" strokeWidth={0.3} />
      <Geographies geography={geographies}>
        {() => (
          <>
            {/* Faint base geography */}
            {geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getColor(geo.properties.name)}
                fillOpacity={0.1}
                stroke="#0a1a2a"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#ffd700', fillOpacity: 0.3, outline: 'none', cursor: 'crosshair' }
                }}
              />
            ))}
            
            {/* Casualty circles (single circle scaled by selected field) */}
            {circles.map((c, idx) => (
              <circle
                key={`casualty-${idx}`}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={getColor(c.name)}
                fillOpacity={0.4}
                stroke="#ffd700"
                strokeWidth={1.5}
                style={{ cursor: 'crosshair' }}
                onClick={() => setSelected({ 
                  name: c.name, 
                  value: c.data,
                  type: 'casualty',
                  war: selectedWar
                })}
              >
                <title>{`
                  ${c.name}
                  ═══════════════
                  TOTAL DEATHS: ${typeof c.data.total === 'number' ? formatNumber(c.data.total) : c.data.total}
                  % OF POP: ${c.data.percent}%
                  CIV-MILITARY: ${c.data.civilianMilitary}
                  CIV-FAMINE: ${c.data.civilianFamine}
                  ═══════════════
                  Click for details
                `}</title>
              </circle>
            ))}
          </>
        )}
      </Geographies>
    </>
  );
};

export default ColdWarMap;