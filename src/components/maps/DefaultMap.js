// components/DefaultMap.js
import React from 'react';
import { Geographies, Geography, Graticule } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';

const DefaultMap = ({ geographies, gdpData, setSelected, getCountryColor, colorMode }) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);

  const getColor = (countryName) => {
    return getCountryColor(countryName, colorMode);
  };

  return (
    <>
      <Graticule stroke="#04ff00" strokeWidth={0.3} />
      <Geographies geography={geographies}>
        {() => (
          <>
            {geographies.map(geo => {
              const name = geo.properties.name;
              const gdp = gdpData[name];
              const baseColor = getColor(name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={baseColor}
                  fillOpacity={0.5}
                  stroke="#0a1a2a"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#ffd700', fillOpacity: 0.8, outline: 'none', cursor: 'crosshair' }
                  }}
                  onClick={() => {
                    if (gdp) {
                      setSelected({ 
                        name, 
                        value: gdp,
                        unit: 'T'
                      });
                    }
                  }}
                >
                  {gdp && (
                    <title>{name}: GDP data available</title>
                  )}
                </Geography>
              );
            })}
          </>
        )}
      </Geographies>
    </>
  );
};

export default DefaultMap;