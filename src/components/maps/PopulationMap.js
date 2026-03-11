import React, { useMemo } from 'react';
import { Geographies, Geography, Graticule, Marker } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { scaleSqrt, scaleLinear } from 'd3-scale';
import { getFlagColor, getCountryVariations } from '../../countryUtils';

const PopulationMap = ({ 
  geographies, 
  countryColors, 
  setSelected, 
  getCountryColor, 
  colorMode,
  populationView, 
  t,
  populationData 
}) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);

  // FIX: Handles Unicode minus sign (U+2212) which is different from hyphen (-)
  const getNumericValue = (val) => {
    if (!val) return 0;
    const cleanVal = String(val)
      .replace(/−/g, '-') // Replace special dash with standard minus
      .replace(/,/g, '');  // Remove commas
    const num = parseFloat(cleanVal);
    return isNaN(num) ? 0 : num;
  };

  const processedCircles = useMemo(() => {
    if (!populationData || !geographies) return [];

    const maxPop = Math.max(...populationData.map(d => getNumericValue(d.population)), 1);
    const maxAbs = Math.max(...populationData.map(d => Math.abs(getNumericValue(d.absoluteChange))), 1);
    const maxPct = Math.max(...populationData.map(d => Math.abs(getNumericValue(d.percentChange))), 1);

    const radiusScalePop = scaleSqrt().domain([0, maxPop]).range([2, 35]);
    const radiusScaleAbs = scaleLinear().domain([0, maxAbs]).range([1.5, 25]);
    const radiusScalePct = scaleLinear().domain([0, maxPct]).range([1.5, 25]);

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

        let r = 2;
        let fillColor = '#00ff4c';
        let isNegative = false;

        if (populationView === 'total') {
          r = radiusScalePop(pop);
          fillColor = getCountryColor ? getCountryColor(name, colorMode) : (countryColors[name] || getFlagColor(name));
        } else {
          // Logic for change-based views
          const changeVal = populationView === 'changePercent' ? pct : abs;
          r = populationView === 'changePercent' ? radiusScalePct(Math.abs(pct)) : radiusScaleAbs(Math.abs(abs));
          
          if (changeVal < 0) {
            fillColor = '#ff3333'; // Red
            isNegative = true;
          } else {
            fillColor = '#00ff4c'; // Green
            isNegative = false;
          }
        }

        results.push({
          name,
          coords: centroid,
          r: Math.max(r, 1.5),
          fillColor,
          isNegative,
          data: countryMatch
        });
        drawn.add(name);
      }
    });
    return results;
  }, [populationData, geographies, populationView, colorMode, countryColors, getCountryColor]);

  return (
    <>
      <Graticule stroke="#04ff00" strokeWidth={0.2} opacity={0.2} />
      
      <Geographies geography={geographies}>
        {() => (
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#0a1a2a"
              fillOpacity={0.2}
              stroke="#1a2a3a"
              strokeWidth={0.5}
              style={{ default: { outline: 'none' } }}
            />
          ))
        )}
      </Geographies>

      {processedCircles.map((circle, idx) => (
        <Marker key={`pop-marker-${idx}`} coordinates={projection.invert(circle.coords)}>
          <circle
            r={circle.r}
            fill={circle.fillColor}
            fillOpacity={0.8}
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
        </Marker>
      ))}
    </>
  );
};

export default PopulationMap;