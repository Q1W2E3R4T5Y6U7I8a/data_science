import React from 'react';
import { Geography, Graticule } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import { formatGDP } from '../../countryUtils';
import { calculateCircleRadius, getScaleTypeForView, CIRCLE_CONFIG } from '../../utils/circleScaling';

const GDPMap = ({
  geographies,
  gdpData,
  setSelected,
  getCountryColor,
  colorMode,
  projection,
  gdpView = 'total',
}) => {
  const path = geoPath().projection(projection);

  // Find max values for scaling
  const maxTotal = Math.max(...Object.values(gdpData).map(d => d.total || 0), 1);
  const maxGrowth = Math.max(...Object.values(gdpData).map(d => Math.abs(d.growth || 0)), 1);
  const maxPerCapita = Math.max(...Object.values(gdpData).map(d => d.perCapita || 0), 1);

  const circles = [];

  geographies.forEach(geo => {
    const name = geo.properties.name;
    const gdpEntry = gdpData[name];
    const centroid = path.centroid(geo);

    if (gdpEntry && centroid && centroid.length === 2 && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
      let radius = CIRCLE_CONFIG.MIN_RADIUS;
      let fillColor = getCountryColor(name, colorMode);
      let scaleType = 'linear';

      if (gdpView === 'total') {
        radius = calculateCircleRadius(gdpEntry.total, maxTotal, 'sqrt');
        scaleType = 'sqrt';
      } else if (gdpView === 'growth') {
        const absGrowth = Math.abs(gdpEntry.growth || 0);
        radius = calculateCircleRadius(absGrowth, maxGrowth, 'linear');
        
        if (gdpEntry.growth > 0) {
          fillColor = '#00ff4c';
        } else if (gdpEntry.growth < 0) {
          fillColor = '#ff3333';
        }
      } else if (gdpView === 'perCapita') {
        radius = calculateCircleRadius(gdpEntry.perCapita || 0, maxPerCapita, 'linear');
      }

      circles.push({
        name,
        gdpEntry,
        view: gdpView,
        cx: centroid[0],
        cy: centroid[1],
        r: radius,
        fillColor,
        scaleType
      });
    }
  });

  return (
    <>
      <Graticule stroke="#04ff00" strokeWidth={0.3} />
      
      {geographies.map(geo => (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill={getCountryColor(geo.properties.name, colorMode)}
          fillOpacity={0.1}
          stroke="#0a1a2a"
          strokeWidth={0.5}
          style={{
            default: { outline: 'none' },
            hover: { fill: '#ffd700', fillOpacity: 0.3, outline: 'none', cursor: 'crosshair' }
          }}
        />
      ))}

      {circles.map((c, idx) => (
        <circle
          key={`circle-${idx}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill={c.fillColor}
          fillOpacity={0.6}
          stroke={c.view === 'growth' && c.gdpEntry.growth < 0 ? '#ffffff' : '#0a1a2a'}
          strokeWidth={c.view === 'growth' && c.gdpEntry.growth < 0 ? 2 : 1}
          style={{ cursor: 'crosshair' }}
          onClick={() =>
            setSelected({
              name: c.name,
              value: c.gdpEntry,
              type: 'gdp',
              view: c.view
            })
          }
        >
          <title>
            {`${c.name}
            ═══════════════
            Total GDP: $${formatGDP(c.gdpEntry.total)}T
            Growth: ${c.gdpEntry.growth > 0 ? '+' : ''}${c.gdpEntry.growth}%
            GDP per Capita: $${c.gdpEntry.perCapita?.toLocaleString()}
            ═══════════════
            Click for details`}
          </title>
        </circle>
      ))}
    </>
  );
};

export default GDPMap;