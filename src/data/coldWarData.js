// Cold War casualties (1947–1991) by conflict
// Each war object contains countries with at least 1,000 deaths
// Format: { total, percent (of population at time), civilianMilitary, civilianFamine }

export const coldWarData = {
  // Total Cold War (all proxy conflicts combined, 1947–1991)
  // Note: This aggregates deaths from all major Cold War conflicts
  total: {
    // Korean War (1950-53)
    "North Korea": { total: 406000, percent: 5.1, civilianMilitary: 215000, civilianFamine: 150000 },
    "South Korea": { total: 783000, percent: 4.5, civilianMilitary: 137000, civilianFamine: 600000 },
    "China": { total: 600000, percent: 0.09, civilianMilitary: 400000, civilianFamine: "-" },
    "United States": { total: 36574, percent: 0.024, civilianMilitary: 36574, civilianFamine: "-" },
    
    // Vietnam War (1955-75)
    "Vietnam (North)": { total: 1062000, percent: 5.3, civilianMilitary: 650000, civilianFamine: 300000 },
    "Vietnam (South)": { total: 741000, percent: 3.7, civilianMilitary: 250000, civilianFamine: 400000 },
    "Cambodia": { total: 275000, percent: 5.8, civilianMilitary: 25000, civilianFamine: 250000 },
    "Laos": { total: 62000, percent: 2.5, civilianMilitary: 30000, civilianFamine: 30000 },
    "United States": { total: 58209, percent: 0.03, civilianMilitary: 58209, civilianFamine: "-" },
    "South Korea": { total: 5096, percent: 0.02, civilianMilitary: 5096, civilianFamine: "-" },
    
    // Soviet-Afghan War (1979-89)
    "Afghanistan": { total: 1000000, percent: 6.7, civilianMilitary: 70000, civilianFamine: 900000 },
    "Soviet Union": { total: 14453, percent: 0.005, civilianMilitary: 14453, civilianFamine: "-" },
    
    // Angolan Civil War (1975-2002)
    "Angola": { total: 500000, percent: 6.0, civilianMilitary: 100000, civilianFamine: 400000 },
    "Cuba": { total: 2077, percent: 0.02, civilianMilitary: 2077, civilianFamine: "-" },
    "South Africa": { total: 2500, percent: 0.007, civilianMilitary: 2500, civilianFamine: "-" },
    
    // Other conflicts
    "Greece": { total: 158000, percent: 2.0, civilianMilitary: 38000, civilianFamine: 100000 }, // Greek Civil War
    "Indonesia": { total: 400000, percent: 0.4, civilianMilitary: 10000, civilianFamine: 390000 }, // 1965-66 killings
    "Bangladesh": { total: 300000, percent: 0.6, civilianMilitary: 50000, civilianFamine: 250000 }, // 1971 war
    "Ethiopia": { total: 300000, percent: 0.9, civilianMilitary: 80000, civilianFamine: 200000 }, // Ogaden, Civil War
    "Mozambique": { total: 150000, percent: 1.8, civilianMilitary: 30000, civilianFamine: 100000 }, // Civil War
    "Nicaragua": { total: 60000, percent: 2.0, civilianMilitary: 15000, civilianFamine: 40000 }, // Contra War
    "El Salvador": { total: 75000, percent: 1.8, civilianMilitary: 10000, civilianFamine: 60000 }, // Civil War
    "Guatemala": { total: 45000, percent: 1.0, civilianMilitary: 5000, civilianFamine: 35000 }, // Civil War
    "Malaysia": { total: 12000, percent: 0.15, civilianMilitary: 3000, civilianFamine: 8000 }, // Emergency
    "Philippines": { total: 30000, percent: 0.1, civilianMilitary: 10000, civilianFamine: 20000 }, // Communist insurgency
    "Rhodesia": { total: 20000, percent: 0.6, civilianMilitary: 10000, civilianFamine: 10000 }, // Bush War
    "Chad": { total: 30000, percent: 1.2, civilianMilitary: 5000, civilianFamine: 20000 }, // Civil War
    "Egypt": { total: 15000, percent: 0.05, civilianMilitary: 10000, civilianFamine: 5000 }, // Yemen War, etc
    "Syria": { total: 8000, percent: 0.15, civilianMilitary: 6000, civilianFamine: 2000 },
    "Israel": { total: 4000, percent: 0.3, civilianMilitary: 4000, civilianFamine: "-" },
    "Iraq": { total: 6000, percent: 0.1, civilianMilitary: 4000, civilianFamine: 2000 },
    "Iran": { total: 5000, percent: 0.02, civilianMilitary: 3000, civilianFamine: 2000 },
    "Pakistan": { total: 8000, percent: 0.02, civilianMilitary: 4000, civilianFamine: 4000 },
    "India": { total: 12000, percent: 0.003, civilianMilitary: 7000, civilianFamine: 5000 },
    "United Kingdom": { total: 4200, percent: 0.008, civilianMilitary: 4200, civilianFamine: "-" }, // Korea, Malaya, etc
    "France": { total: 75000, percent: 0.18, civilianMilitary: 65000, civilianFamine: "-" }, // Indochina, Algeria
    "Canada": { total: 1500, percent: 0.01, civilianMilitary: 1500, civilianFamine: "-" },
    "Australia": { total: 1100, percent: 0.01, civilianMilitary: 1100, civilianFamine: "-" },
    "Turkey": { total: 5000, percent: 0.02, civilianMilitary: 5000, civilianFamine: "-" }, // Korea, Cyprus
    "Netherlands": { total: 120, percent: 0.001, civilianMilitary: 120, civilianFamine: "-" }, // Korea
    "Belgium": { total: 99, percent: 0.001, civilianMilitary: 99, civilianFamine: "-" }, // Korea
    "Colombia": { total: 163, percent: 0.001, civilianMilitary: 163, civilianFamine: "-" }, // Korea
    "Thailand": { total: 480, percent: 0.001, civilianMilitary: 480, civilianFamine: "-" }, // Korea + Vietnam
    "Ethiopia": { total: 121, percent: 0.0005, civilianMilitary: 121, civilianFamine: "-" }, // Korea (Kagnew Battalion)
    "New Zealand": { total: 71, percent: 0.002, civilianMilitary: 71, civilianFamine: "-" }, // Korea + Vietnam
    "Philippines": { total: 101, percent: 0.0003, civilianMilitary: 101, civilianFamine: "-" }, // Korea + Vietnam
    "South Africa": { total: 34, percent: 0.0002, civilianMilitary: 34, civilianFamine: "-" }, // Korea (air force)
  },

  // Korean War (1950–1953)
  korean: {
    "North Korea": { total: 406000, percent: 5.1, civilianMilitary: 215000, civilianFamine: 150000 },
    "South Korea": { total: 783000, percent: 4.5, civilianMilitary: 137000, civilianFamine: 600000 },
    "China": { total: 600000, percent: 0.09, civilianMilitary: 400000, civilianFamine: "-" },
    "United States": { total: 36574, percent: 0.024, civilianMilitary: 36574, civilianFamine: "-" },
    "United Kingdom": { total: 1078, percent: 0.002, civilianMilitary: 1078, civilianFamine: "-" },
    "Turkey": { total: 721, percent: 0.003, civilianMilitary: 721, civilianFamine: "-" },
    "Canada": { total: 516, percent: 0.003, civilianMilitary: 516, civilianFamine: "-" },
    "Australia": { total: 339, percent: 0.003, civilianMilitary: 339, civilianFamine: "-" },
    "France": { total: 262, percent: 0.0005, civilianMilitary: 262, civilianFamine: "-" },
    "Greece": { total: 194, percent: 0.002, civilianMilitary: 194, civilianFamine: "-" },
    "Colombia": { total: 163, percent: 0.001, civilianMilitary: 163, civilianFamine: "-" },
    "Thailand": { total: 129, percent: 0.0004, civilianMilitary: 129, civilianFamine: "-" },
    "Ethiopia": { total: 121, percent: 0.0005, civilianMilitary: 121, civilianFamine: "-" },
    "Netherlands": { total: 120, percent: 0.001, civilianMilitary: 120, civilianFamine: "-" },
    "Belgium": { total: 99, percent: 0.001, civilianMilitary: 99, civilianFamine: "-" },
    "Philippines": { total: 92, percent: 0.0003, civilianMilitary: 92, civilianFamine: "-" },
    "New Zealand": { total: 34, percent: 0.001, civilianMilitary: 34, civilianFamine: "-" },
    "South Africa": { total: 34, percent: 0.0002, civilianMilitary: 34, civilianFamine: "-" },
    "Luxembourg": { total: 2, percent: 0.0007, civilianMilitary: 2, civilianFamine: "-" },
    "Soviet Union": { total: 299, percent: 0.0001, civilianMilitary: 299, civilianFamine: "-" },
  },

  // Vietnam War (1955–1975) – based on R.J. Rummel's mid estimates
  vietnam: {
    "North Vietnam / Viet Cong": { total: 1062000, percent: 5.3, civilianMilitary: 650000, civilianFamine: 300000 },
    "South Vietnam": { total: 741000, percent: 3.7, civilianMilitary: 250000, civilianFamine: 400000 },
    "United States": { total: 58209, percent: 0.03, civilianMilitary: 58209, civilianFamine: "-" },
    "South Korea": { total: 5096, percent: 0.02, civilianMilitary: 5096, civilianFamine: "-" },
    "Australia": { total: 521, percent: 0.004, civilianMilitary: 521, civilianFamine: "-" },
    "Thailand": { total: 351, percent: 0.001, civilianMilitary: 351, civilianFamine: "-" },
    "New Zealand": { total: 37, percent: 0.001, civilianMilitary: 37, civilianFamine: "-" },
    "Philippines": { total: 9, percent: 0.00002, civilianMilitary: 9, civilianFamine: "-" },
    "Laos": { total: 62000, percent: 2.5, civilianMilitary: 30000, civilianFamine: 30000 },
    "Cambodia": { total: 273000, percent: 5.8, civilianMilitary: 12000, civilianFamine: 250000 },
    "China": { total: 32000, percent: 0.005, civilianMilitary: 32000, civilianFamine: "-" },
    "Soviet Union": { total: 3000, percent: 0.001, civilianMilitary: 3000, civilianFamine: "-" },
  },

  // Soviet–Afghan War (1979–1989)
  sovietAfghan: {
    "Soviet Union": { total: 14453, percent: 0.005, civilianMilitary: 14453, civilianFamine: "-" },
    "Afghanistan (Govt forces)": { total: 55000, percent: 0.4, civilianMilitary: 55000, civilianFamine: "-" },
    "Mujahideen": { total: 75000, percent: "-", civilianMilitary: 75000, civilianFamine: "-" },
    "Afghan civilians": { total: 1000000, percent: 6.7, civilianMilitary: 100000, civilianFamine: 900000 },
    "Pakistan": { total: 5000, percent: 0.005, civilianMilitary: 3000, civilianFamine: 2000 },
  },

  // Angolan Civil War (1975–2002) – main phase during Cold War up to 1991
  angolan: {
    "MPLA (Govt)": { total: 50000, percent: "-", civilianMilitary: 50000, civilianFamine: "-" },
    "UNITA": { total: 65000, percent: "-", civilianMilitary: 65000, civilianFamine: "-" },
    "FNLA": { total: 20000, percent: "-", civilianMilitary: 20000, civilianFamine: "-" },
    "Cuba": { total: 2077, percent: 0.02, civilianMilitary: 2077, civilianFamine: "-" },
    "South Africa": { total: 2500, percent: 0.007, civilianMilitary: 2500, civilianFamine: "-" },
    "Angolan civilians": { total: 500000, percent: 6.0, civilianMilitary: 50000, civilianFamine: 450000 },
    "Soviet Union": { total: 100, percent: 0.00004, civilianMilitary: 100, civilianFamine: "-" },
    "Zaire": { total: 1500, percent: 0.005, civilianMilitary: 1500, civilianFamine: "-" },
    "Zambia": { total: 500, percent: 0.008, civilianMilitary: 500, civilianFamine: "-" },
  },
};

// Helper to get country list with at least 1000 deaths for a given war
export const getCountriesWithMinDeaths = (warData, min = 1000) => {
  return Object.fromEntries(
    Object.entries(warData).filter(([_, data]) => {
      const total = typeof data.total === 'number' ? data.total : 0;
      return total >= min;
    })
  );
};