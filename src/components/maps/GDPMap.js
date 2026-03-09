// components/GDPMap.js
import React from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor, formatGDP } from '../../countryUtils';

const GDPMap = ({ geographies, gdpData, usaGdp, countryColors, setSelected, getCountryColor, colorMode }) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);
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
    const gdp = gdpData[name];
    const centroid = path.centroid(geo);
    
    if (gdp && centroid && centroid.length === 2 && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
      const radius = usaGdp ? Math.max(2, baseRadius * Math.sqrt(gdp / usaGdp)) : 2;
      circles.push({
        name,
        gdp,
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
            
            {/* GDP circles */}
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
                  value: c.gdp,
                  unit: 'T'
                })}
              >
                <title>{c.name}: {formatGDP(c.gdp)}</title>
              </circle>
            ))}
          </>
        )}
      </Geographies>
    </>
  );
};

export default GDPMap;