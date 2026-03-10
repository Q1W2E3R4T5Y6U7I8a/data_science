
import React from 'react';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { getFlagColor } from '../../countryUtils';

// HARDCODED CASUALTY DATA
const CASUALTY_DATA = {
  "Albania": { total: 30, percent: 2.80, civilianMilitary: "-", civilianFamine: "-" },
  "Australia": { total: 40400, percent: 0.58, civilianMilitary: 700, civilianFamine: "-" },
  "Austria": { total: "See Germany", percent: "See Germany", civilianMilitary: "Included with Germany", civilianFamine: "-" },
  "Belgium": { total: 88000, percent: 1.05, civilianMilitary: 76000, civilianFamine: "-" },
  "Brazil": { total: 2000, percent: 0.00, civilianMilitary: 1000, civilianFamine: "-" },
  "Bulgaria": { total: 21500, percent: 0.33, civilianMilitary: 3000, civilianFamine: "-" },
  "Burma": { total: 626300, percent: 3.89, civilianMilitary: 625000, civilianFamine: "-" },
  "Canada": { total: 43600, percent: 0.38, civilianMilitary: 1600, civilianFamine: "-" },
  "China": { total: 17000000, percent: 3.38, civilianMilitary: 7774000, civilianFamine: 7500000 },
  "Cuba": { total: 100, percent: 0.00, civilianMilitary: 100, civilianFamine: "-" },
  "Czechoslovakia": { total: 347500, percent: 2.38, civilianMilitary: 307000, civilianFamine: "-" },
  "Denmark": { total: 6000, percent: 0.16, civilianMilitary: 6000, civilianFamine: "-" },
  "Dutch East Indies": { total: 3500000, percent: 5.03, civilianMilitary: 300000, civilianFamine: 3200000 },
  "Egypt": { total: 1100, percent: 0.00, civilianMilitary: "-", civilianFamine: "-" },
  "Estonia": { total: 83000, percent: 7.30, civilianMilitary: 49000, civilianFamine: "-" },
  "Ethiopia": { total: 100000, percent: 0.56, civilianMilitary: 85, civilianFamine: "-" },
  "Finland": { total: 96800, percent: 2.62, civilianMilitary: 2100, civilianFamine: "-" },
  "France": { total: 600000, percent: 1.44, civilianMilitary: 390000, civilianFamine: "-" },
  "French Indochina": { total: 1600000, percent: 6.08, civilianMilitary: "-", civilianFamine: 1500000 },
  "Germany": { total: 7150000, percent: 10.20, civilianMilitary: 2250000, civilianFamine: "-" },
  "Greece": { total: 657000, percent: 9.10, civilianMilitary: 171800, civilianFamine: 450000 },
  "Guam": { total: 1500, percent: 6.58, civilianMilitary: "-", civilianFamine: "-" },
  "Hungary": { total: 664000, percent: 7.27, civilianMilitary: 464000, civilianFamine: "-" },
  "Iceland": { total: 200, percent: 0.17, civilianMilitary: 200, civilianFamine: "-" },
  "India": { total: 2643500, percent: 0.58, civilianMilitary: "-", civilianFamine: 2550000 },
  "Iraq": { total: 700, percent: 0.01, civilianMilitary: 200, civilianFamine: "-" },
  "Ireland": { total: 5100, percent: 0.17, civilianMilitary: 100, civilianFamine: "-" },
  "Italy": { total: 503200, percent: 1.14, civilianMilitary: 153200, civilianFamine: "-" },
  "Japan": { total: 2800000, percent: 3.92, civilianMilitary: 675000, civilianFamine: "-" },
  "Korea": { total: 508000, percent: 2.09, civilianMilitary: 508000, civilianFamine: "-" },
  "Latvia": { total: 250000, percent: 12.50, civilianMilitary: 220000, civilianFamine: "-" },
  "Lithuania": { total: 370000, percent: 14.36, civilianMilitary: 345000, civilianFamine: "-" },
  "Luxembourg": { total: 7106, percent: 2.45, civilianMilitary: 4201, civilianFamine: "-" },
  "Malaya & Singapore": { total: 100000, percent: 1.95, civilianMilitary: 100000, civilianFamine: "-" },
  "Malta": { total: 1500, percent: 0.55, civilianMilitary: 1500, civilianFamine: "-" },
  "Mexico": { total: 100, percent: 0.00, civilianMilitary: 100, civilianFamine: "-" },
  "Mongolia": { total: 300, percent: 0.04, civilianMilitary: "-", civilianFamine: "-" },
  "Nauru": { total: 500, percent: 14.70, civilianMilitary: 500, civilianFamine: "-" },
  "Nepal": { total: "-", percent: "-", civilianMilitary: "-", civilianFamine: "-" },
  "Netherlands": { total: 250000, percent: 2.86, civilianMilitary: 187300, civilianFamine: 16000 },
  "Newfoundland": { total: 1200, percent: 0.30, civilianMilitary: 100, civilianFamine: "-" },
  "New Zealand": { total: 11700, percent: 0.72, civilianMilitary: "-", civilianFamine: "-" },
  "Norway": { total: 10200, percent: 0.35, civilianMilitary: 8200, civilianFamine: "-" },
  "Papua New Guinea": { total: 15000, percent: 1.16, civilianMilitary: 15000, civilianFamine: "-" },
  "Philippines": { total: 984469, percent: 6.15, civilianMilitary: 582000, civilianFamine: 336000 },
  "Poland": { total: 5950000, percent: 17.08, civilianMilitary: 5720000, civilianFamine: "-" },
  "Portuguese Timor": { total: 55000, percent: 11.46, civilianMilitary: 55000, civilianFamine: "-" },
  "Romania": { total: 500000, percent: 3.13, civilianMilitary: 200000, civilianFamine: "-" },
  "Ruanda-Urundi": { total: 43000, percent: 0.70, civilianMilitary: "-", civilianFamine: 43000 },
  "South Africa": { total: 11900, percent: 0.12, civilianMilitary: "-", civilianFamine: "-" },
  "South Seas Mandate": { total: 10000, percent: 7.87, civilianMilitary: 10000, civilianFamine: "-" },
  "Soviet Union": { total: 23500000, percent: 13.50, civilianMilitary: 7250000, civilianFamine: 8500000 },
  "Spain": { total: "-", percent: "-", civilianMilitary: "Included with France", civilianFamine: "-" },
  "Sweden": { total: 2100, percent: 0.03, civilianMilitary: 2000, civilianFamine: "-" },
  "Switzerland": { total: 100, percent: 0.00, civilianMilitary: 100, civilianFamine: "-" },
  "Thailand": { total: 7600, percent: 0.05, civilianMilitary: 2000, civilianFamine: "-" },
  "Turkey": { total: 200, percent: 0.00, civilianMilitary: "-", civilianFamine: "-" },
  "United Kingdom": { total: 450900, percent: 0.94, civilianMilitary: 67200, civilianFamine: "-" },
  "United States": { total: 419400, percent: 0.32, civilianMilitary: 12100, civilianFamine: "-" },
  "Yugoslavia": { total: 1363500, percent: 8.80, civilianMilitary: 990500, civilianFamine: "-" },
  
  // SOVIET REPUBLICS
  "Armenia": { 
    total: 180000, 
    percent: 13.6, 
    civilianMilitary: 150000, 
    civilianFamine: 30000,
    population: "1,320,000"
  },
  "Azerbaijan": { 
    total: 300000, 
    percent: 9.1, 
    civilianMilitary: 210000, 
    civilianFamine: 90000,
    population: "3,270,000"
  },
  "Belarus": { 
    total: 2290000, 
    percent: 25.3, 
    civilianMilitary: 1360000, 
    civilianFamine: 310000,
    population: "9,050,000"
  },
  "Estonia": { 
    total: 80000, 
    percent: 7.6, 
    civilianMilitary: 50000, 
    civilianFamine: "-",
    population: "1,050,000"
  },
  "Georgia": { 
    total: 300000, 
    percent: 8.3, 
    civilianMilitary: 190000, 
    civilianFamine: 110000,
    population: "3,610,000"
  },
  "Kazakhstan": { 
    total: 660000, 
    percent: 10.7, 
    civilianMilitary: 310000, 
    civilianFamine: 350000,
    population: "6,150,000"
  },
  "Kyrgyzstan": { 
    total: 120000, 
    percent: 7.8, 
    civilianMilitary: 70000, 
    civilianFamine: 50000,
    population: "1,530,000"
  },
  "Latvia": { 
    total: 260000, 
    percent: 13.7, 
    civilianMilitary: 190000, 
    civilianFamine: 40000,
    population: "1,890,000"
  },
  "Lithuania": { 
    total: 375000, 
    percent: 12.7, 
    civilianMilitary: 275000, 
    civilianFamine: 75000,
    population: "2,930,000"
  },
  "Moldova": { 
    total: 170000, 
    percent: 6.9, 
    civilianMilitary: 75000, 
    civilianFamine: 45000,
    population: "2,470,000"
  },
  "Russia": { 
    total: 13950000, 
    percent: 12.7, 
    civilianMilitary: 4100000, 
    civilianFamine: 3100000,
    population: "110,100,000"
  },
  "United States": { 
    total: 420000, 
    percent: 0.3, 
    civilianMilitary: 15000, 
    civilianFamine: "-",
    population: "132,164,000"
  },
  "Tajikistan": { 
    total: 120000, 
    percent: 7.8, 
    civilianMilitary: 50000, 
    civilianFamine: 70000,
    population: "1,530,000"
  },
  "Turkmenistan": { 
    total: 100000, 
    percent: 7.7, 
    civilianMilitary: 70000, 
    civilianFamine: 30000,
    population: "1,300,000"
  },
  "Ukraine": { 
    total: 6850000, 
    percent: 16.3, 
    civilianMilitary: 3700000, 
    civilianFamine: 1500000,
    population: "41,340,000"
  },
  "Uzbekistan": { 
    total: 550000, 
    percent: 8.4, 
    civilianMilitary: 330000, 
    civilianFamine: 220000,
    population: "6,550,000"
  },
  "Unidentified Soviet": { 
    total: 295000, 
    percent: "-", 
    civilianMilitary: 165000, 
    civilianFamine: 130000,
    population: "-"
  }
};

// Format numbers
const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const WW2Map = ({ geographies, countryColors, setSelected, getCountryColor, colorMode, field = 'total' }) => {
  const projection = geoEqualEarth().scale(150).center([-50, 5]);
  const path = geoPath().projection(projection);
  // base values used for scaling each metric (civilian handled specially)
  const baseValues = {
    total: 10000000,
    percent: 20         // percent scale 0–20
    // civilian circles are scaled relative to each country’s own total
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
    const data = CASUALTY_DATA[name];
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
                  type: 'casualty'
                })}
              >
                <title>{`
                  ${c.name}
                  ═══════════════
                  TOTAL DEATHS: ${typeof c.data.total === 'number' ? formatNumber(c.data.total) : c.data.total}
                  % OF 1939 POP: ${c.data.percent}%
                  CIV-MILITARY CASUALTIES: ${c.data.civilianMilitary}
                  CIV-FAMINE CASUALTIES: ${c.data.civilianFamine}
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

export default WW2Map;