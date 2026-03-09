// components/AreaMap.js
import React from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor, getArea, hasAreaData, formatArea } from '../../countryUtils';

const AreaMap = ({ geographies, countryColors, setSelected, getCountryColor, colorMode }) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);
  const baseArea = 10;
  const baseRadius = 50;

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
    const area = getArea(name);
    const centroid = path.centroid(geo);
    
    if (hasAreaData(name) && centroid && centroid.length === 2 && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
      const radius = Math.max(2, baseRadius * Math.sqrt(area / baseArea));
      circles.push({
        name,
        area,
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
            
            {/* Area circles */}
            {circles.map((c, idx) => (
              <circle
                key={`circle-${idx}`}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={getColor(c.name)}
                fillOpacity={0.6}
                stroke="#0a1a2a"
                strokeWidth={1}
                style={{ cursor: 'crosshair' }}
                onClick={() => setSelected({ 
                  name: c.name, 
                  value: c.area,
                  unit: 'M km²'
                })}
              >
                <title>{c.name}: {formatArea(c.area)}</title>
              </circle>
            ))}
          </>
        )}
      </Geographies>
    </>
  );
};

export default AreaMap;