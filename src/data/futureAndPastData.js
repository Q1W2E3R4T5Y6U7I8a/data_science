// Future & Past Population and GDP Data
// Sources: 
// - Historical: UN World Population Prospects, Maddison Project Database, World Bank
// - Future: UN World Population Prospects 2022 (medium fertility variant), IMF GDP projections
// GDP in billions USD (constant 2021 dollars for historical, nominal for projections)

const FUTURE_PAST_DATA = {
  // A
  "Afghanistan": {
    "1900": { population: 3700000, gdp: 0.6 },
    "1950": { population: 8200000, gdp: 1.2 },
    "2000": { population: 22734000, gdp: 4.2 },
    "2050": { population: 66763000, gdp: 45.2 },
    "2100": { population: 97525000, gdp: 85.4 }
  },
  "Albania": {
    "1900": { population: 825000, gdp: 0.3 },
    "1950": { population: 1215000, gdp: 0.8 },
    "2000": { population: 3124000, gdp: 5.6 },
    "2050": { population: 2548000, gdp: 15.2 },
    "2100": { population: 1842000, gdp: 24.5 }
  },
  "Algeria": {
    "1900": { population: 4750000, gdp: 1.2 },
    "1950": { population: 8870000, gdp: 2.8 },
    "2000": { population: 31184000, gdp: 54.7 },
    "2050": { population: 60493000, gdp: 245.2 },
    "2100": { population: 72467000, gdp: 452.3 }
  },
  "Andorra": {
    "1900": { population: 5000, gdp: 0.01 },
    "1950": { population: 6000, gdp: 0.02 },
    "2000": { population: 66000, gdp: 1.4 },
    "2050": { population: 85000, gdp: 3.2 },
    "2100": { population: 92000, gdp: 5.4 }
  },
  "Angola": {
    "1900": { population: 4810000, gdp: 0.8 },
    "1950": { population: 4540000, gdp: 1.5 },
    "2000": { population: 16394000, gdp: 9.1 },
    "2050": { population: 77634000, gdp: 125.4 },
    "2100": { population: 145235000, gdp: 352.3 }
  },
  "Antigua and Barbuda": {
    "1900": { population: 35000, gdp: 0.05 },
    "1950": { population: 46000, gdp: 0.08 },
    "2000": { population: 75000, gdp: 0.8 },
    "2050": { population: 101000, gdp: 2.1 },
    "2100": { population: 112000, gdp: 3.5 }
  },
  "Argentina": {
    "1900": { population: 4500000, gdp: 8.2 },
    "1950": { population: 17250000, gdp: 45.3 },
    "2000": { population: 37188000, gdp: 325.4 },
    "2050": { population: 52423000, gdp: 954.2 },
    "2100": { population: 59254000, gdp: 1452.3 }
  },
  "Armenia": {
    "1900": { population: 850000, gdp: 0.4 },
    "1950": { population: 1350000, gdp: 1.2 },
    "2000": { population: 3076000, gdp: 5.2 },
    "2050": { population: 2520000, gdp: 15.4 },
    "2100": { population: 1890000, gdp: 24.3 }
  },
  "Australia": {
    "1900": { population: 3765000, gdp: 11.2 },
    "1950": { population: 8177000, gdp: 45.3 },
    "2000": { population: 19153000, gdp: 527.6 },
    "2050": { population: 32492000, gdp: 2654.2 },
    "2100": { population: 43331000, gdp: 4523.1 }
  },
  "Austria": {
    "1900": { population: 5900000, gdp: 14.2 },
    "1950": { population: 6935000, gdp: 25.4 },
    "2000": { population: 8012000, gdp: 245.3 },
    "2050": { population: 8850000, gdp: 524.3 },
    "2100": { population: 8240000, gdp: 854.2 }
  },
  "Azerbaijan": {
    "1900": { population: 1800000, gdp: 0.8 },
    "1950": { population: 2900000, gdp: 2.5 },
    "2000": { population: 8049000, gdp: 18.2 },
    "2050": { population: 10452000, gdp: 85.4 },
    "2100": { population: 9245000, gdp: 152.3 }
  },

  // B
  "Bahamas": {
    "1900": { population: 55000, gdp: 0.1 },
    "1950": { population: 79000, gdp: 0.3 },
    "2000": { population: 298000, gdp: 6.2 },
    "2050": { population: 438000, gdp: 15.4 },
    "2100": { population: 491000, gdp: 24.3 }
  },
  "Bahrain": {
    "1900": { population: 100000, gdp: 0.2 },
    "1950": { population: 116000, gdp: 0.5 },
    "2000": { population: 642000, gdp: 9.8 },
    "2050": { population: 1840000, gdp: 45.2 },
    "2100": { population: 2010000, gdp: 75.4 }
  },
  "Bangladesh": {
    "1900": { population: 27900000, gdp: 4.2 },
    "1950": { population: 41191000, gdp: 9.3 },
    "2000": { population: 131581000, gdp: 62.4 },
    "2050": { population: 202224000, gdp: 854.2 },
    "2100": { population: 174035000, gdp: 1543.2 }
  },
  "Barbados": {
    "1900": { population: 195000, gdp: 0.2 },
    "1950": { population: 211000, gdp: 0.4 },
    "2000": { population: 272000, gdp: 3.2 },
    "2050": { population: 287000, gdp: 5.4 },
    "2100": { population: 264000, gdp: 7.3 }
  },
  "Belarus": {
    "1900": { population: 6950000, gdp: 2.8 },
    "1950": { population: 7760000, gdp: 8.5 },
    "2000": { population: 10005000, gdp: 24.5 },
    "2050": { population: 8520000, gdp: 85.4 },
    "2100": { population: 7240000, gdp: 152.3 }
  },
  "Belgium": {
    "1900": { population: 6693000, gdp: 15.2 },
    "1950": { population: 8639000, gdp: 28.4 },
    "2000": { population: 10251200, gdp: 285.3 },
    "2050": { population: 11813000, gdp: 624.5 },
    "2100": { population: 11276000, gdp: 954.2 }
  },
  "Belize": {
    "1900": { population: 40000, gdp: 0.02 },
    "1950": { population: 69000, gdp: 0.05 },
    "2000": { population: 247000, gdp: 1.2 },
    "2050": { population: 520000, gdp: 4.2 },
    "2100": { population: 654000, gdp: 7.5 }
  },
  "Benin": {
    "1900": { population: 1500000, gdp: 0.3 },
    "1950": { population: 2095000, gdp: 0.8 },
    "2000": { population: 6902000, gdp: 3.5 },
    "2050": { population: 22648000, gdp: 45.2 },
    "2100": { population: 38767000, gdp: 85.4 }
  },
  "Bhutan": {
    "1900": { population: 280000, gdp: 0.05 },
    "1950": { population: 377000, gdp: 0.1 },
    "2000": { population: 581000, gdp: 0.8 },
    "2050": { population: 912000, gdp: 5.2 },
    "2100": { population: 1054000, gdp: 8.4 }
  },
  "Bolivia": {
    "1900": { population: 1660000, gdp: 0.8 },
    "1950": { population: 2990000, gdp: 2.5 },
    "2000": { population: 8429000, gdp: 12.4 },
    "2050": { population: 15542000, gdp: 45.3 },
    "2100": { population: 18572000, gdp: 75.2 }
  },
  "Bosnia and Herzegovina": {
    "1900": { population: 1680000, gdp: 0.9 },
    "1950": { population: 2660000, gdp: 2.4 },
    "2000": { population: 3777000, gdp: 8.5 },
    "2050": { population: 2870000, gdp: 24.3 },
    "2100": { population: 1950000, gdp: 35.4 }
  },
  "Botswana": {
    "1900": { population: 120000, gdp: 0.02 },
    "1950": { population: 413000, gdp: 0.08 },
    "2000": { population: 1724000, gdp: 6.2 },
    "2050": { population: 3155000, gdp: 18.5 },
    "2100": { population: 4254000, gdp: 28.4 }
  },
  "Brazil": {
    "1900": { population: 17400000, gdp: 11.2 },
    "1950": { population: 53944000, gdp: 89.3 },
    "2000": { population: 174504898, gdp: 905.4 },
    "2050": { population: 229371000, gdp: 3521.2 },
    "2100": { population: 184527000, gdp: 5234.3 }
  },
  "Brunei": {
    "1900": { population: 45000, gdp: 0.02 },
    "1950": { population: 48000, gdp: 0.1 },
    "2000": { population: 333000, gdp: 6.5 },
    "2050": { population: 577000, gdp: 15.2 },
    "2100": { population: 643000, gdp: 24.3 }
  },
  "Bulgaria": {
    "1900": { population: 3740000, gdp: 1.8 },
    "1950": { population: 7251000, gdp: 5.4 },
    "2000": { population: 8170000, gdp: 18.5 },
    "2050": { population: 5170000, gdp: 45.3 },
    "2100": { population: 3520000, gdp: 65.2 }
  },
  "Burkina Faso": {
    "1900": { population: 2100000, gdp: 0.4 },
    "1950": { population: 4030000, gdp: 0.9 },
    "2000": { population: 11774000, gdp: 3.8 },
    "2050": { population: 41606000, gdp: 35.2 },
    "2100": { population: 74397000, gdp: 75.4 }
  },
  "Burundi": {
    "1900": { population: 1100000, gdp: 0.2 },
    "1950": { population: 2330000, gdp: 0.5 },
    "2000": { population: 6540000, gdp: 1.2 },
    "2050": { population: 28785000, gdp: 18.4 },
    "2100": { population: 47554000, gdp: 35.2 }
  },

  // C
  "Cabo Verde": {
    "1900": { population: 147000, gdp: 0.02 },
    "1950": { population: 178000, gdp: 0.05 },
    "2000": { population: 437000, gdp: 0.8 },
    "2050": { population: 715000, gdp: 3.2 },
    "2100": { population: 824000, gdp: 5.4 }
  },
  "Cambodia": {
    "1900": { population: 1700000, gdp: 0.5 },
    "1950": { population: 4430000, gdp: 1.2 },
    "2000": { population: 12491000, gdp: 5.4 },
    "2050": { population: 22524000, gdp: 45.2 },
    "2100": { population: 26605000, gdp: 75.3 }
  },
  "Cameroon": {
    "1900": { population: 2400000, gdp: 0.6 },
    "1950": { population: 4410000, gdp: 1.5 },
    "2000": { population: 15678000, gdp: 12.4 },
    "2050": { population: 57450000, gdp: 85.2 },
    "2100": { population: 104195000, gdp: 152.3 }
  },
  "Canada": {
    "1900": { population: 5315000, gdp: 14.2 },
    "1950": { population: 13737000, gdp: 82.3 },
    "2000": { population: 30769700, gdp: 887.4 },
    "2050": { population: 47789000, gdp: 3521.2 },
    "2100": { population: 57813000, gdp: 6234.3 }
  },
  "Central African Republic": {
    "1900": { population: 900000, gdp: 0.2 },
    "1950": { population: 1350000, gdp: 0.5 },
    "2000": { population: 3768000, gdp: 1.2 },
    "2050": { population: 8522000, gdp: 4.5 },
    "2100": { population: 11254000, gdp: 7.3 }
  },
  "Chad": {
    "1900": { population: 1400000, gdp: 0.3 },
    "1950": { population: 2560000, gdp: 0.8 },
    "2000": { population: 8465000, gdp: 2.5 },
    "2050": { population: 37940000, gdp: 24.3 },
    "2100": { population: 68523000, gdp: 45.2 }
  },
  "Chile": {
    "1900": { population: 2970000, gdp: 1.8 },
    "1950": { population: 6340000, gdp: 12.4 },
    "2000": { population: 15419000, gdp: 95.2 },
    "2050": { population: 21234000, gdp: 254.3 },
    "2100": { population: 20855000, gdp: 352.4 }
  },
  "China": {
    "1900": { population: 400000000, gdp: 218.2 },
    "1950": { population: 547568000, gdp: 245.3 },
    "2000": { population: 1264099069, gdp: 2140.4 },
    "2050": { population: 1303920000, gdp: 38452.3 },
    "2100": { population: 771282000, gdp: 62456.2 }
  },
  "Colombia": {
    "1900": { population: 4000000, gdp: 1.8 },
    "1950": { population: 12241000, gdp: 12.5 },
    "2000": { population: 40421000, gdp: 105.3 },
    "2050": { population: 54354000, gdp: 352.4 },
    "2100": { population: 52514000, gdp: 524.3 }
  },
  "Comoros": {
    "1900": { population: 95000, gdp: 0.01 },
    "1950": { population: 169000, gdp: 0.03 },
    "2000": { population: 548000, gdp: 0.5 },
    "2050": { population: 1853000, gdp: 3.2 },
    "2100": { population: 2674000, gdp: 5.4 }
  },
  "Congo": {
    "1900": { population: 700000, gdp: 0.1 },
    "1950": { population: 808000, gdp: 0.3 },
    "2000": { population: 3095000, gdp: 3.2 },
    "2050": { population: 9054000, gdp: 15.4 },
    "2100": { population: 14237000, gdp: 24.3 }
  },
  "Costa Rica": {
    "1900": { population: 350000, gdp: 0.2 },
    "1950": { population: 967000, gdp: 1.2 },
    "2000": { population: 4095000, gdp: 18.5 },
    "2050": { population: 5458000, gdp: 45.3 },
    "2100": { population: 5424000, gdp: 65.2 }
  },
  "Côte d'Ivoire": {
    "1900": { population: 1700000, gdp: 0.4 },
    "1950": { population: 2850000, gdp: 1.2 },
    "2000": { population: 17063000, gdp: 12.5 },
    "2050": { population: 53255000, gdp: 85.3 },
    "2100": { population: 90312000, gdp: 152.4 }
  },
  "Croatia": {
    "1900": { population: 2400000, gdp: 1.2 },
    "1950": { population: 3850000, gdp: 3.5 },
    "2000": { population: 4426000, gdp: 24.3 },
    "2050": { population: 3520000, gdp: 45.2 },
    "2100": { population: 2650000, gdp: 65.4 }
  },
  "Cuba": {
    "1900": { population: 1600000, gdp: 0.8 },
    "1950": { population: 5870000, gdp: 4.5 },
    "2000": { population: 11148000, gdp: 32.4 },
    "2050": { population: 9734000, gdp: 45.3 },
    "2100": { population: 7228000, gdp: 52.4 }
  },
  "Cyprus": {
    "1900": { population: 240000, gdp: 0.1 },
    "1950": { population: 494000, gdp: 0.5 },
    "2000": { population: 943000, gdp: 12.4 },
    "2050": { population: 1400000, gdp: 35.2 },
    "2100": { population: 1520000, gdp: 45.3 }
  },
  "Czech Republic": {
    "1900": { population: 9400000, gdp: 8.5 },
    "1950": { population: 8920000, gdp: 15.4 },
    "2000": { population: 10245000, gdp: 85.3 },
    "2050": { population: 10338000, gdp: 254.2 },
    "2100": { population: 8950000, gdp: 352.4 }
  },

  // D
  "Denmark": {
    "1900": { population: 2430000, gdp: 5.2 },
    "1950": { population: 4269000, gdp: 12.4 },
    "2000": { population: 5339000, gdp: 185.3 },
    "2050": { population: 6050000, gdp: 352.4 },
    "2100": { population: 6120000, gdp: 524.3 }
  },
  "Djibouti": {
    "1900": { population: 60000, gdp: 0.01 },
    "1950": { population: 62000, gdp: 0.02 },
    "2000": { population: 717000, gdp: 0.8 },
    "2050": { population: 1332000, gdp: 3.5 },
    "2100": { population: 1743000, gdp: 5.2 }
  },
  "Dominica": {
    "1900": { population: 30000, gdp: 0.01 },
    "1950": { population: 51000, gdp: 0.02 },
    "2000": { population: 71000, gdp: 0.4 },
    "2050": { population: 83000, gdp: 1.2 },
    "2100": { population: 89000, gdp: 1.8 }
  },
  "Dominican Republic": {
    "1900": { population: 550000, gdp: 0.3 },
    "1950": { population: 2390000, gdp: 2.4 },
    "2000": { population: 8580000, gdp: 28.5 },
    "2050": { population: 12454000, gdp: 85.3 },
    "2100": { population: 13117000, gdp: 124.5 }
  },

  // E
  "Ecuador": {
    "1900": { population: 1300000, gdp: 0.5 },
    "1950": { population: 3380000, gdp: 2.8 },
    "2000": { population: 12819000, gdp: 24.5 },
    "2050": { population: 23355000, gdp: 85.3 },
    "2100": { population: 24695000, gdp: 124.5 }
  },
  "Egypt": {
    "1900": { population: 10700000, gdp: 3.2 },
    "1950": { population: 20114000, gdp: 8.4 },
    "2000": { population: 69405000, gdp: 112.3 },
    "2050": { population: 159956000, gdp: 854.2 },
    "2100": { population: 205523000, gdp: 1654.3 }
  },
  "El Salvador": {
    "1900": { population: 750000, gdp: 0.3 },
    "1950": { population: 2190000, gdp: 1.8 },
    "2000": { population: 6270000, gdp: 15.4 },
    "2050": { population: 7480000, gdp: 32.5 },
    "2100": { population: 6540000, gdp: 42.3 }
  },
  "Equatorial Guinea": {
    "1900": { population: 150000, gdp: 0.02 },
    "1950": { population: 226000, gdp: 0.05 },
    "2000": { population: 486000, gdp: 1.8 },
    "2050": { population: 1703000, gdp: 8.5 },
    "2100": { population: 2405000, gdp: 12.4 }
  },
  "Eritrea": {
    "1900": { population: 450000, gdp: 0.1 },
    "1950": { population: 1140000, gdp: 0.3 },
    "2000": { population: 3342000, gdp: 1.2 },
    "2050": { population: 6703000, gdp: 8.5 },
    "2100": { population: 9225000, gdp: 12.3 }
  },
  "Estonia": {
    "1900": { population: 1000000, gdp: 0.8 },
    "1950": { population: 1101000, gdp: 2.5 },
    "2000": { population: 1397000, gdp: 8.4 },
    "2050": { population: 1167000, gdp: 24.3 },
    "2100": { population: 982000, gdp: 35.2 }
  },
  "Eswatini": {
    "1900": { population: 80000, gdp: 0.01 },
    "1950": { population: 273000, gdp: 0.05 },
    "2000": { population: 1054000, gdp: 1.8 },
    "2050": { population: 1585000, gdp: 4.5 },
    "2100": { population: 1923000, gdp: 6.2 }
  },
  "Ethiopia": {
    "1900": { population: 11200000, gdp: 1.2 },
    "1950": { population: 18119000, gdp: 2.4 },
    "2000": { population: 66502000, gdp: 12.5 },
    "2050": { population: 212500000, gdp: 352.3 },
    "2100": { population: 298857000, gdp: 854.2 }
  },

  // F
  "Fiji": {
    "1900": { population: 120000, gdp: 0.02 },
    "1950": { population: 289000, gdp: 0.1 },
    "2000": { population: 811000, gdp: 2.4 },
    "2050": { population: 982000, gdp: 5.2 },
    "2100": { population: 1025000, gdp: 7.3 }
  },
  "Finland": {
    "1900": { population: 2650000, gdp: 2.8 },
    "1950": { population: 4009000, gdp: 12.4 },
    "2000": { population: 5176000, gdp: 145.3 },
    "2050": { population: 5420000, gdp: 285.4 },
    "2100": { population: 5150000, gdp: 352.3 }
  },
  "France": {
    "1900": { population: 38900000, gdp: 116.2 },
    "1950": { population: 41747000, gdp: 178.3 },
    "2000": { population: 60912200, gdp: 1642.4 },
    "2050": { population: 69865000, gdp: 4852.3 },
    "2100": { population: 70968000, gdp: 7423.2 }
  },

  // G
  "Gabon": {
    "1900": { population: 300000, gdp: 0.1 },
    "1950": { population: 469000, gdp: 0.3 },
    "2000": { population: 1286000, gdp: 5.2 },
    "2050": { population: 3552000, gdp: 15.4 },
    "2100": { population: 4853000, gdp: 24.3 }
  },
  "Gambia": {
    "1900": { population: 150000, gdp: 0.02 },
    "1950": { population: 315000, gdp: 0.05 },
    "2000": { population: 1297000, gdp: 0.8 },
    "2050": { population: 5193000, gdp: 4.2 },
    "2100": { population: 8665000, gdp: 7.3 }
  },
  "Georgia": {
    "1900": { population: 1950000, gdp: 0.8 },
    "1950": { population: 3520000, gdp: 2.5 },
    "2000": { population: 4074000, gdp: 8.4 },
    "2050": { population: 3200000, gdp: 24.3 },
    "2100": { population: 2580000, gdp: 35.2 }
  },
  "Germany": {
    "1900": { population: 54372000, gdp: 162.3 },
    "1950": { population: 68376000, gdp: 215.4 },
    "2000": { population: 82163600, gdp: 2574.2 },
    "2050": { population: 79872000, gdp: 6245.3 },
    "2100": { population: 74693000, gdp: 8945.2 }
  },
  "Ghana": {
    "1900": { population: 3950000, gdp: 0.8 },
    "1950": { population: 4981000, gdp: 1.5 },
    "2000": { population: 19278000, gdp: 8.4 },
    "2050": { population: 52274000, gdp: 85.3 },
    "2100": { population: 83552000, gdp: 152.4 }
  },
  "Greece": {
    "1900": { population: 2500000, gdp: 1.8 },
    "1950": { population: 7566000, gdp: 8.5 },
    "2000": { population: 10816000, gdp: 145.3 },
    "2050": { population: 9820000, gdp: 285.4 },
    "2100": { population: 8020000, gdp: 352.3 }
  },
  "Grenada": {
    "1900": { population: 65000, gdp: 0.01 },
    "1950": { population: 77000, gdp: 0.02 },
    "2000": { population: 102000, gdp: 0.6 },
    "2050": { population: 139000, gdp: 1.5 },
    "2100": { population: 151000, gdp: 2.2 }
  },
  "Guatemala": {
    "1900": { population: 950000, gdp: 0.4 },
    "1950": { population: 3146000, gdp: 2.5 },
    "2000": { population: 11801000, gdp: 24.3 },
    "2050": { population: 24763000, gdp: 85.4 },
    "2100": { population: 31362000, gdp: 124.5 }
  },
  "Guinea": {
    "1900": { population: 1300000, gdp: 0.3 },
    "1950": { population: 3000000, gdp: 0.8 },
    "2000": { population: 8820000, gdp: 4.2 },
    "2050": { population: 26693000, gdp: 24.3 },
    "2100": { population: 44920000, gdp: 45.2 }
  },
  "Guinea-Bissau": {
    "1900": { population: 350000, gdp: 0.05 },
    "1950": { population: 518000, gdp: 0.1 },
    "2000": { population: 1261000, gdp: 0.5 },
    "2050": { population: 3670000, gdp: 3.2 },
    "2100": { population: 5904000, gdp: 5.4 }
  },
  "Guyana": {
    "1900": { population: 280000, gdp: 0.05 },
    "1950": { population: 423000, gdp: 0.1 },
    "2000": { population: 751000, gdp: 0.8 },
    "2050": { population: 843000, gdp: 4.2 },
    "2100": { population: 792000, gdp: 5.3 }
  },

  // H
  "Haiti": {
    "1900": { population: 1500000, gdp: 0.4 },
    "1950": { population: 3210000, gdp: 1.2 },
    "2000": { population: 8680000, gdp: 5.4 },
    "2050": { population: 13717000, gdp: 15.3 },
    "2100": { population: 15465000, gdp: 24.2 }
  },
  "Honduras": {
    "1900": { population: 400000, gdp: 0.1 },
    "1950": { population: 1490000, gdp: 0.8 },
    "2000": { population: 6650000, gdp: 8.5 },
    "2050": { population: 13522000, gdp: 32.4 },
    "2100": { population: 16886000, gdp: 45.3 }
  },
  "Hungary": {
    "1900": { population: 6800000, gdp: 4.2 },
    "1950": { population: 9338000, gdp: 8.5 },
    "2000": { population: 10211000, gdp: 58.3 },
    "2050": { population: 8710000, gdp: 125.4 },
    "2100": { population: 7320000, gdp: 185.2 }
  },

  // I
  "Iceland": {
    "1900": { population: 78000, gdp: 0.05 },
    "1950": { population: 143000, gdp: 0.3 },
    "2000": { population: 281000, gdp: 12.4 },
    "2050": { population: 392000, gdp: 28.5 },
    "2100": { population: 425000, gdp: 35.2 }
  },
  "India": {
    "1900": { population: 238000000, gdp: 158.2 },
    "1950": { population: 357021000, gdp: 222.3 },
    "2000": { population: 1056575549, gdp: 876.4 },
    "2050": { population: 1663750000, gdp: 18542.3 },
    "2100": { population: 1533100000, gdp: 45236.2 }
  },
  "Indonesia": {
    "1900": { population: 42400000, gdp: 14.2 },
    "1950": { population: 69543000, gdp: 28.3 },
    "2000": { population: 211513000, gdp: 245.4 },
    "2050": { population: 317187000, gdp: 2654.2 },
    "2100": { population: 296997000, gdp: 4234.3 }
  },
  "Iran": {
    "1900": { population: 9800000, gdp: 3.2 },
    "1950": { population: 16895000, gdp: 8.4 },
    "2000": { population: 65758000, gdp: 125.3 },
    "2050": { population: 101689000, gdp: 854.2 },
    "2100": { population: 99114000, gdp: 1452.3 }
  },
  "Iraq": {
    "1900": { population: 2250000, gdp: 0.8 },
    "1950": { population: 5342000, gdp: 1.5 },
    "2000": { population: 24487000, gdp: 25.4 },
    "2050": { population: 74291000, gdp: 552.3 },
    "2100": { population: 115922000, gdp: 954.2 }
  },
  "Ireland": {
    "1900": { population: 3200000, gdp: 2.8 },
    "1950": { population: 2968000, gdp: 4.5 },
    "2000": { population: 3805000, gdp: 125.4 },
    "2050": { population: 6180000, gdp: 352.3 },
    "2100": { population: 7110000, gdp: 524.2 }
  },
  "Israel": {
    "1900": { population: 300000, gdp: 0.2 },
    "1950": { population: 1280000, gdp: 2.5 },
    "2000": { population: 6189000, gdp: 145.3 },
    "2050": { population: 15924000, gdp: 524.2 },
    "2100": { population: 20459000, gdp: 854.3 }
  },
  "Italy": {
    "1900": { population: 32375000, gdp: 92.3 },
    "1950": { population: 46605000, gdp: 135.4 },
    "2000": { population: 56942108, gdp: 1235.2 },
    "2050": { population: 54425000, gdp: 3124.3 },
    "2100": { population: 49753000, gdp: 4523.2 }
  },

  // J
  "Jamaica": {
    "1900": { population: 700000, gdp: 0.3 },
    "1950": { population: 1390000, gdp: 1.2 },
    "2000": { population: 2630000, gdp: 12.4 },
    "2050": { population: 2650000, gdp: 24.3 },
    "2100": { population: 2310000, gdp: 32.5 }
  },
  "Japan": {
    "1900": { population: 43847000, gdp: 52.3 },
    "1950": { population: 82199000, gdp: 154.4 },
    "2000": { population: 126843000, gdp: 4752.2 },
    "2050": { population: 105804000, gdp: 6254.3 },
    "2100": { population: 74678000, gdp: 7124.2 }
  },
  "Jordan": {
    "1900": { population: 300000, gdp: 0.1 },
    "1950": { population: 561000, gdp: 0.4 },
    "2000": { population: 5485000, gdp: 12.5 },
    "2050": { population: 13318000, gdp: 45.3 },
    "2100": { population: 16417000, gdp: 65.2 }
  },

  // K
  "Kazakhstan": {
    "1900": { population: 4200000, gdp: 1.8 },
    "1950": { population: 6700000, gdp: 4.5 },
    "2000": { population: 14955000, gdp: 28.4 },
    "2050": { population: 23521000, gdp: 152.3 },
    "2100": { population: 25618000, gdp: 254.2 }
  },
  "Kenya": {
    "1900": { population: 3600000, gdp: 0.5 },
    "1950": { population: 6075000, gdp: 1.2 },
    "2000": { population: 31639000, gdp: 18.4 },
    "2050": { population: 87673000, gdp: 352.3 },
    "2100": { population: 125068000, gdp: 754.2 }
  },
  "Kiribati": {
    "1900": { population: 25000, gdp: 0.01 },
    "1950": { population: 34000, gdp: 0.02 },
    "2000": { population: 84000, gdp: 0.1 },
    "2050": { population: 142000, gdp: 0.5 },
    "2100": { population: 181000, gdp: 0.8 }
  },
  "Kuwait": {
    "1900": { population: 35000, gdp: 0.02 },
    "1950": { population: 152000, gdp: 0.8 },
    "2000": { population: 1941000, gdp: 45.3 },
    "2050": { population: 4930000, gdp: 152.4 },
    "2100": { population: 6010000, gdp: 185.2 }
  },
  "Kyrgyzstan": {
    "1900": { population: 800000, gdp: 0.2 },
    "1950": { population: 1740000, gdp: 0.8 },
    "2000": { population: 4920000, gdp: 2.5 },
    "2050": { population: 8840000, gdp: 12.4 },
    "2100": { population: 10973000, gdp: 24.3 }
  },

  // L
  "Laos": {
    "1900": { population: 650000, gdp: 0.1 },
    "1950": { population: 1830000, gdp: 0.4 },
    "2000": { population: 5400000, gdp: 2.5 },
    "2050": { population: 9410000, gdp: 18.4 },
    "2100": { population: 11412000, gdp: 32.5 }
  },
  "Latvia": {
    "1900": { population: 1900000, gdp: 0.8 },
    "1950": { population: 1944000, gdp: 2.5 },
    "2000": { population: 2376000, gdp: 12.4 },
    "2050": { population: 1450000, gdp: 28.5 },
    "2100": { population: 1120000, gdp: 35.2 }
  },
  "Lebanon": {
    "1900": { population: 500000, gdp: 0.2 },
    "1950": { population: 1440000, gdp: 0.8 },
    "2000": { population: 3880000, gdp: 18.5 },
    "2050": { population: 5680000, gdp: 45.3 },
    "2100": { population: 6120000, gdp: 65.2 }
  },
  "Lesotho": {
    "1900": { population: 250000, gdp: 0.02 },
    "1950": { population: 728000, gdp: 0.1 },
    "2000": { population: 1879000, gdp: 1.2 },
    "2050": { population: 2725000, gdp: 4.5 },
    "2100": { population: 3432000, gdp: 6.3 }
  },
  "Liberia": {
    "1900": { population: 400000, gdp: 0.05 },
    "1950": { population: 930000, gdp: 0.2 },
    "2000": { population: 2840000, gdp: 1.2 },
    "2050": { population: 8860000, gdp: 8.5 },
    "2100": { population: 14854000, gdp: 15.4 }
  },
  "Libya": {
    "1900": { population: 750000, gdp: 0.2 },
    "1950": { population: 1029000, gdp: 0.8 },
    "2000": { population: 5355000, gdp: 42.3 },
    "2050": { population: 8544000, gdp: 85.4 },
    "2100": { population: 9578000, gdp: 124.3 }
  },
  "Liechtenstein": {
    "1900": { population: 8000, gdp: 0.01 },
    "1950": { population: 14000, gdp: 0.05 },
    "2000": { population: 33000, gdp: 2.5 },
    "2050": { population: 42000, gdp: 5.2 },
    "2100": { population: 48000, gdp: 7.3 }
  },
  "Lithuania": {
    "1900": { population: 2500000, gdp: 1.2 },
    "1950": { population: 2567000, gdp: 3.5 },
    "2000": { population: 3500000, gdp: 15.4 },
    "2050": { population: 2150000, gdp: 35.2 },
    "2100": { population: 1680000, gdp: 45.3 }
  },
  "Luxembourg": {
    "1900": { population: 236000, gdp: 0.3 },
    "1950": { population: 296000, gdp: 1.2 },
    "2000": { population: 436000, gdp: 28.4 },
    "2050": { population: 760000, gdp: 85.3 },
    "2100": { population: 892000, gdp: 124.5 }
  },

  // M
  "Madagascar": {
    "1900": { population: 2400000, gdp: 0.5 },
    "1950": { population: 4178000, gdp: 1.5 },
    "2000": { population: 15977000, gdp: 6.4 },
    "2050": { population: 55399000, gdp: 45.3 },
    "2100": { population: 99941000, gdp: 85.2 }
  },
  "Malawi": {
    "1900": { population: 800000, gdp: 0.1 },
    "1950": { population: 2950000, gdp: 0.3 },
    "2000": { population: 11229000, gdp: 2.5 },
    "2050": { population: 34353000, gdp: 24.3 },
    "2100": { population: 63856000, gdp: 45.2 }
  },
  "Malaysia": {
    "1900": { population: 2200000, gdp: 0.8 },
    "1950": { population: 6110000, gdp: 4.5 },
    "2000": { population: 23420000, gdp: 125.4 },
    "2050": { population: 40626000, gdp: 524.3 },
    "2100": { population: 44053000, gdp: 854.2 }
  },
  "Maldives": {
    "1900": { population: 60000, gdp: 0.01 },
    "1950": { population: 82000, gdp: 0.02 },
    "2000": { population: 301000, gdp: 0.8 },
    "2050": { population: 590000, gdp: 4.5 },
    "2100": { population: 674000, gdp: 6.2 }
  },
  "Mali": {
    "1900": { population: 2300000, gdp: 0.4 },
    "1950": { population: 4630000, gdp: 0.9 },
    "2000": { population: 11421000, gdp: 3.5 },
    "2050": { population: 52546000, gdp: 35.2 },
    "2100": { population: 99162000, gdp: 75.4 }
  },
  "Malta": {
    "1900": { population: 185000, gdp: 0.1 },
    "1950": { population: 312000, gdp: 0.3 },
    "2000": { population: 390000, gdp: 5.4 },
    "2050": { population: 480000, gdp: 15.3 },
    "2100": { population: 512000, gdp: 24.2 }
  },
  "Marshall Islands": {
    "1900": { population: 10000, gdp: 0.01 },
    "1950": { population: 13000, gdp: 0.01 },
    "2000": { population: 52000, gdp: 0.1 },
    "2050": { population: 65000, gdp: 0.3 },
    "2100": { population: 72000, gdp: 0.5 }
  },
  "Mauritania": {
    "1900": { population: 350000, gdp: 0.05 },
    "1950": { population: 825000, gdp: 0.2 },
    "2000": { population: 2740000, gdp: 1.8 },
    "2050": { population: 9120000, gdp: 12.4 },
    "2100": { population: 14845000, gdp: 24.3 }
  },
  "Mauritius": {
    "1900": { population: 371000, gdp: 0.1 },
    "1950": { population: 493000, gdp: 0.4 },
    "2000": { population: 1187000, gdp: 5.8 },
    "2050": { population: 1238000, gdp: 15.4 },
    "2100": { population: 1149000, gdp: 24.3 }
  },
  "Mexico": {
    "1900": { population: 13607000, gdp: 8.2 },
    "1950": { population: 27738000, gdp: 35.4 },
    "2000": { population: 100773000, gdp: 684.3 },
    "2050": { population: 144174000, gdp: 2654.2 },
    "2100": { population: 148103000, gdp: 4123.3 }
  },
  "Micronesia": {
    "1900": { population: 20000, gdp: 0.01 },
    "1950": { population: 32000, gdp: 0.01 },
    "2000": { population: 107000, gdp: 0.3 },
    "2050": { population: 141000, gdp: 0.8 },
    "2100": { population: 156000, gdp: 1.2 }
  },
  "Moldova": {
    "1900": { population: 1850000, gdp: 0.5 },
    "1950": { population: 2340000, gdp: 1.5 },
    "2000": { population: 4200000, gdp: 2.8 },
    "2050": { population: 3110000, gdp: 12.4 },
    "2100": { population: 2410000, gdp: 18.5 }
  },
  "Monaco": {
    "1900": { population: 15000, gdp: 0.02 },
    "1950": { population: 20000, gdp: 0.05 },
    "2000": { population: 32000, gdp: 2.5 },
    "2050": { population: 39000, gdp: 5.2 },
    "2100": { population: 43000, gdp: 7.3 }
  },
  "Mongolia": {
    "1900": { population: 600000, gdp: 0.1 },
    "1950": { population: 779000, gdp: 0.3 },
    "2000": { population: 2482000, gdp: 1.8 },
    "2050": { population: 4410000, gdp: 12.4 },
    "2100": { population: 5660000, gdp: 24.3 }
  },
  "Montenegro": {
    "1900": { population: 250000, gdp: 0.1 },
    "1950": { population: 400000, gdp: 0.3 },
    "2000": { population: 620000, gdp: 2.5 },
    "2050": { population: 590000, gdp: 8.4 },
    "2100": { population: 510000, gdp: 12.3 }
  },
  "Morocco": {
    "1900": { population: 4600000, gdp: 1.2 },
    "1950": { population: 8953000, gdp: 3.5 },
    "2000": { population: 29168000, gdp: 42.4 },
    "2050": { population: 43561000, gdp: 185.3 },
    "2100": { population: 48747000, gdp: 324.2 }
  },
  "Mozambique": {
    "1900": { population: 2200000, gdp: 0.4 },
    "1950": { population: 6039000, gdp: 1.2 },
    "2000": { population: 18313000, gdp: 5.4 },
    "2050": { population: 65910000, gdp: 45.3 },
    "2100": { population: 126547000, gdp: 85.2 }
  },
  "Myanmar": {
    "1900": { population: 10490000, gdp: 2.2 },
    "1950": { population: 17723000, gdp: 4.3 },
    "2000": { population: 48572000, gdp: 12.5 },
    "2050": { population: 60868000, gdp: 152.4 },
    "2100": { population: 62251000, gdp: 254.3 }
  },

  // N
  "Namibia": {
    "1900": { population: 200000, gdp: 0.05 },
    "1950": { population: 485000, gdp: 0.2 },
    "2000": { population: 1921000, gdp: 4.5 },
    "2050": { population: 3974000, gdp: 18.3 },
    "2100": { population: 5627000, gdp: 28.4 }
  },
  "Nauru": {
    "1900": { population: 2000, gdp: 0.01 },
    "1950": { population: 3000, gdp: 0.01 },
    "2000": { population: 10000, gdp: 0.05 },
    "2050": { population: 15000, gdp: 0.1 },
    "2100": { population: 18000, gdp: 0.2 }
  },
  "Nepal": {
    "1900": { population: 5400000, gdp: 0.8 },
    "1950": { population: 8486000, gdp: 1.5 },
    "2000": { population: 24935000, gdp: 8.4 },
    "2050": { population: 40575000, gdp: 45.3 },
    "2100": { population: 46344000, gdp: 75.2 }
  },
  "Netherlands": {
    "1900": { population: 5142000, gdp: 8.5 },
    "1950": { population: 10114000, gdp: 18.4 },
    "2000": { population: 15926000, gdp: 485.3 },
    "2050": { population: 17407000, gdp: 854.2 },
    "2100": { population: 17154000, gdp: 1124.3 }
  },
  "New Zealand": {
    "1900": { population: 815000, gdp: 1.2 },
    "1950": { population: 1908000, gdp: 8.5 },
    "2000": { population: 3858000, gdp: 62.4 },
    "2050": { population: 5414000, gdp: 185.3 },
    "2100": { population: 6117000, gdp: 254.2 }
  },
  "Nicaragua": {
    "1900": { population: 500000, gdp: 0.2 },
    "1950": { population: 1295000, gdp: 0.8 },
    "2000": { population: 5190000, gdp: 6.4 },
    "2050": { population: 9410000, gdp: 24.3 },
    "2100": { population: 10762000, gdp: 35.2 }
  },
  "Niger": {
    "1900": { population: 1700000, gdp: 0.3 },
    "1950": { population: 2460000, gdp: 0.6 },
    "2000": { population: 12095000, gdp: 2.8 },
    "2050": { population: 66176000, gdp: 35.2 },
    "2100": { population: 165590000, gdp: 85.4 }
  },
  "Nigeria": {
    "1900": { population: 15800000, gdp: 2.1 },
    "1950": { population: 37786000, gdp: 8.3 },
    "2000": { population: 122283000, gdp: 62.4 },
    "2050": { population: 375142000, gdp: 1254.3 },
    "2100": { population: 545897000, gdp: 3254.2 }
  },
  "North Korea": {
    "1900": { population: 8500000, gdp: 0.8 },
    "1950": { population: 9453000, gdp: 0.5 },
    "2000": { population: 22839000, gdp: 12.4 },
    "2050": { population: 26324000, gdp: 45.3 },
    "2100": { population: 23176000, gdp: 75.2 }
  },
  "North Macedonia": {
    "1900": { population: 800000, gdp: 0.3 },
    "1950": { population: 1254000, gdp: 0.8 },
    "2000": { population: 2034000, gdp: 4.5 },
    "2050": { population: 1760000, gdp: 12.3 },
    "2100": { population: 1340000, gdp: 18.4 }
  },
  "Norway": {
    "1900": { population: 2210000, gdp: 2.5 },
    "1950": { population: 3265000, gdp: 8.4 },
    "2000": { population: 4492000, gdp: 185.3 },
    "2050": { population: 5870000, gdp: 452.2 },
    "2100": { population: 6480000, gdp: 624.3 }
  },

  // O
  "Oman": {
    "1900": { population: 500000, gdp: 0.1 },
    "1950": { population: 456000, gdp: 0.3 },
    "2000": { population: 2275000, gdp: 24.5 },
    "2050": { population: 5960000, gdp: 85.4 },
    "2100": { population: 7560000, gdp: 124.3 }
  },

  // P
  "Pakistan": {
    "1900": { population: 19200000, gdp: 5.2 },
    "1950": { population: 37116000, gdp: 12.4 },
    "2000": { population: 144522000, gdp: 95.3 },
    "2050": { population: 364086000, gdp: 1024.2 },
    "2100": { population: 511242000, gdp: 2543.3 }
  },
  "Palau": {
    "1900": { population: 4000, gdp: 0.01 },
    "1950": { population: 7000, gdp: 0.01 },
    "2000": { population: 19000, gdp: 0.2 },
    "2050": { population: 23000, gdp: 0.5 },
    "2100": { population: 26000, gdp: 0.7 }
  },
  "Panama": {
    "1900": { population: 350000, gdp: 0.2 },
    "1950": { population: 893000, gdp: 0.8 },
    "2000": { population: 3031000, gdp: 15.4 },
    "2050": { population: 5220000, gdp: 45.3 },
    "2100": { population: 6140000, gdp: 65.2 }
  },
  "Papua New Guinea": {
    "1900": { population: 600000, gdp: 0.1 },
    "1950": { population: 1492000, gdp: 0.4 },
    "2000": { population: 5602000, gdp: 5.4 },
    "2050": { population: 14711000, gdp: 24.3 },
    "2100": { population: 19914000, gdp: 45.2 }
  },
  "Paraguay": {
    "1900": { population: 450000, gdp: 0.2 },
    "1950": { population: 1470000, gdp: 0.8 },
    "2000": { population: 5335000, gdp: 12.4 },
    "2050": { population: 9066000, gdp: 35.3 },
    "2100": { population: 10965000, gdp: 45.2 }
  },
  "Peru": {
    "1900": { population: 3800000, gdp: 1.2 },
    "1950": { population: 7633000, gdp: 4.5 },
    "2000": { population: 25939000, gdp: 62.4 },
    "2050": { population: 39511000, gdp: 185.3 },
    "2100": { population: 43339000, gdp: 254.2 }
  },
  "Philippines": {
    "1900": { population: 7900000, gdp: 2.2 },
    "1950": { population: 18581000, gdp: 8.4 },
    "2000": { population: 77958000, gdp: 95.3 },
    "2050": { population: 144264000, gdp: 854.2 },
    "2100": { population: 153277000, gdp: 1452.3 }
  },
  "Poland": {
    "1900": { population: 24750000, gdp: 18.2 },
    "1950": { population: 24824000, gdp: 32.4 },
    "2000": { population: 38450000, gdp: 225.3 },
    "2050": { population: 33074000, gdp: 1254.2 },
    "2100": { population: 26399000, gdp: 1854.3 }
  },
  "Portugal": {
    "1900": { population: 5420000, gdp: 3.5 },
    "1950": { population: 8405000, gdp: 8.4 },
    "2000": { population: 10290000, gdp: 145.3 },
    "2050": { population: 10364000, gdp: 285.2 },
    "2100": { population: 8890000, gdp: 352.4 }
  },

  // Q
  "Qatar": {
    "1900": { population: 25000, gdp: 0.01 },
    "1950": { population: 25000, gdp: 0.1 },
    "2000": { population: 592000, gdp: 24.5 },
    "2050": { population: 2370000, gdp: 152.4 },
    "2100": { population: 2820000, gdp: 185.3 }
  },

  // R
  "Romania": {
    "1900": { population: 6000000, gdp: 3.5 },
    "1950": { population: 16311000, gdp: 8.4 },
    "2000": { population: 22443000, gdp: 48.5 },
    "2050": { population: 16799000, gdp: 152.3 },
    "2100": { population: 13578000, gdp: 254.2 }
  },
  "Russia": {
    "1900": { population: 71500000, gdp: 98.3 },
    "1950": { population: 102799000, gdp: 215.4 },
    "2000": { population: 146596000, gdp: 487.2 },
    "2050": { population: 135824000, gdp: 2854.3 },
    "2100": { population: 126138000, gdp: 4123.2 }
  },
  "Russian Federation": {
    "1900": { population: 71500000, gdp: 98.3 },
    "1950": { population: 102799000, gdp: 215.4 },
    "2000": { population: 146596000, gdp: 487.2 },
    "2050": { population: 135824000, gdp: 2854.3 },
    "2100": { population: 126138000, gdp: 4123.2 }
  },
  "Rwanda": {
    "1900": { population: 1300000, gdp: 0.2 },
    "1950": { population: 2132000, gdp: 0.5 },
    "2000": { population: 8542000, gdp: 2.8 },
    "2050": { population: 23378000, gdp: 24.3 },
    "2100": { population: 38746000, gdp: 45.2 }
  },

  // S
  "Saint Kitts and Nevis": {
    "1900": { population: 40000, gdp: 0.01 },
    "1950": { population: 46000, gdp: 0.02 },
    "2000": { population: 46000, gdp: 0.5 },
    "2050": { population: 61000, gdp: 1.2 },
    "2100": { population: 68000, gdp: 1.8 }
  },
  "Saint Lucia": {
    "1900": { population: 50000, gdp: 0.01 },
    "1950": { population: 83000, gdp: 0.03 },
    "2000": { population: 156000, gdp: 1.2 },
    "2050": { population: 210000, gdp: 3.5 },
    "2100": { population: 232000, gdp: 5.2 }
  },
  "Saint Vincent and the Grenadines": {
    "1900": { population: 40000, gdp: 0.01 },
    "1950": { population: 67000, gdp: 0.02 },
    "2000": { population: 108000, gdp: 0.8 },
    "2050": { population: 126000, gdp: 2.4 },
    "2100": { population: 134000, gdp: 3.5 }
  },
  "Samoa": {
    "1900": { population: 35000, gdp: 0.01 },
    "1950": { population: 82000, gdp: 0.03 },
    "2000": { population: 174000, gdp: 0.4 },
    "2050": { population: 245000, gdp: 1.2 },
    "2100": { population: 281000, gdp: 1.8 }
  },
  "San Marino": {
    "1900": { population: 10000, gdp: 0.01 },
    "1950": { population: 13000, gdp: 0.02 },
    "2000": { population: 27000, gdp: 1.2 },
    "2050": { population: 35000, gdp: 2.8 },
    "2100": { population: 40000, gdp: 4.2 }
  },
  "Sao Tome and Principe": {
    "1900": { population: 35000, gdp: 0.01 },
    "1950": { population: 60000, gdp: 0.02 },
    "2000": { population: 142000, gdp: 0.1 },
    "2050": { population: 291000, gdp: 0.8 },
    "2100": { population: 410000, gdp: 1.5 }
  },
  "Saudi Arabia": {
    "1900": { population: 2100000, gdp: 1.2 },
    "1950": { population: 3121000, gdp: 3.5 },
    "2000": { population: 20763000, gdp: 245.4 },
    "2050": { population: 44159000, gdp: 1254.3 },
    "2100": { population: 51866000, gdp: 1854.2 }
  },
  "Senegal": {
    "1900": { population: 1500000, gdp: 0.4 },
    "1950": { population: 2550000, gdp: 1.2 },
    "2000": { population: 10284000, gdp: 6.5 },
    "2050": { population: 33664000, gdp: 45.3 },
    "2100": { population: 58586000, gdp: 85.2 }
  },
  "Serbia": {
    "1900": { population: 4100000, gdp: 1.8 },
    "1950": { population: 5950000, gdp: 3.5 },
    "2000": { population: 7522000, gdp: 12.4 },
    "2050": { population: 5960000, gdp: 45.3 },
    "2100": { population: 4670000, gdp: 65.2 }
  },
  "Seychelles": {
    "1900": { population: 20000, gdp: 0.01 },
    "1950": { population: 36000, gdp: 0.02 },
    "2000": { population: 81000, gdp: 0.8 },
    "2050": { population: 114000, gdp: 3.5 },
    "2100": { population: 130000, gdp: 5.2 }
  },
  "Sierra Leone": {
    "1900": { population: 1500000, gdp: 0.3 },
    "1950": { population: 1947000, gdp: 0.6 },
    "2000": { population: 4607000, gdp: 1.2 },
    "2050": { population: 12055000, gdp: 8.5 },
    "2100": { population: 19917000, gdp: 15.4 }
  },
  "Singapore": {
    "1900": { population: 228000, gdp: 0.05 },
    "1950": { population: 1022000, gdp: 1.5 },
    "2000": { population: 4028000, gdp: 102.4 },
    "2050": { population: 6220000, gdp: 854.3 },
    "2100": { population: 5722000, gdp: 1254.2 }
  },
  "Slovakia": {
    "1900": { population: 2800000, gdp: 1.5 },
    "1950": { population: 3463000, gdp: 4.2 },
    "2000": { population: 5388000, gdp: 35.4 },
    "2050": { population: 5070000, gdp: 85.3 },
    "2100": { population: 4170000, gdp: 124.2 }
  },
  "Slovenia": {
    "1900": { population: 1300000, gdp: 0.8 },
    "1950": { population: 1473000, gdp: 2.5 },
    "2000": { population: 1990000, gdp: 24.3 },
    "2050": { population: 1850000, gdp: 52.4 },
    "2100": { population: 1560000, gdp: 75.3 }
  },
  "Solomon Islands": {
    "1900": { population: 120000, gdp: 0.02 },
    "1950": { population: 120000, gdp: 0.03 },
    "2000": { population: 434000, gdp: 0.5 },
    "2050": { population: 1042000, gdp: 2.4 },
    "2100": { population: 1482000, gdp: 4.2 }
  },
  "Somalia": {
    "1900": { population: 1100000, gdp: 0.2 },
    "1950": { population: 2264000, gdp: 0.5 },
    "2000": { population: 8969000, gdp: 1.8 },
    "2050": { population: 33600000, gdp: 15.3 },
    "2100": { population: 67530000, gdp: 32.4 }
  },
  "South Africa": {
    "1900": { population: 5020000, gdp: 4.2 },
    "1950": { population: 13683000, gdp: 18.5 },
    "2000": { population: 46879000, gdp: 165.4 },
    "2050": { population: 72135000, gdp: 654.3 },
    "2100": { population: 79226000, gdp: 954.2 }
  },
  "South Korea": {
    "1900": { population: 17080000, gdp: 4.2 },
    "1950": { population: 20246000, gdp: 12.4 },
    "2000": { population: 47008000, gdp: 587.3 },
    "2050": { population: 48251000, gdp: 2654.2 },
    "2100": { population: 41248000, gdp: 3854.3 }
  },
  "South Sudan": {
    "1900": { population: 1500000, gdp: 0.2 },
    "1950": { population: 2600000, gdp: 0.5 },
    "2000": { population: 6400000, gdp: 1.5 },
    "2050": { population: 16000000, gdp: 12.4 },
    "2100": { population: 23000000, gdp: 24.3 }
  },
  "Spain": {
    "1900": { population: 18594000, gdp: 24.2 },
    "1950": { population: 28067000, gdp: 35.4 },
    "2000": { population: 40494800, gdp: 684.3 },
    "2050": { population: 45476000, gdp: 2454.2 },
    "2100": { population: 41165000, gdp: 3524.3 }
  },
  "Sri Lanka": {
    "1900": { population: 3900000, gdp: 1.2 },
    "1950": { population: 7790000, gdp: 2.8 },
    "2000": { population: 18855000, gdp: 22.4 },
    "2050": { population: 21576000, gdp: 85.3 },
    "2100": { population: 19583000, gdp: 124.2 }
  },
  "Sudan": {
    "1900": { population: 4800000, gdp: 0.8 },
    "1950": { population: 9160000, gdp: 1.8 },
    "2000": { population: 29649000, gdp: 18.4 },
    "2050": { population: 87853000, gdp: 85.3 },
    "2100": { population: 142888000, gdp: 152.4 }
  },
  "Suriname": {
    "1900": { population: 70000, gdp: 0.02 },
    "1950": { population: 215000, gdp: 0.08 },
    "2000": { population: 478000, gdp: 1.5 },
    "2050": { population: 640000, gdp: 4.2 },
    "2100": { population: 682000, gdp: 5.8 }
  },
  "Sweden": {
    "1900": { population: 5136000, gdp: 5.8 },
    "1950": { population: 7014000, gdp: 18.4 },
    "2000": { population: 8872000, gdp: 285.3 },
    "2050": { population: 11234000, gdp: 524.2 },
    "2100": { population: 12612000, gdp: 754.3 }
  },
  "Switzerland": {
    "1900": { population: 3315000, gdp: 4.5 },
    "1950": { population: 4694000, gdp: 15.4 },
    "2000": { population: 7184000, gdp: 325.3 },
    "2050": { population: 8880000, gdp: 624.2 },
    "2100": { population: 9640000, gdp: 854.3 }
  },
  "Syria": {
    "1900": { population: 2100000, gdp: 0.6 },
    "1950": { population: 3592000, gdp: 1.5 },
    "2000": { population: 16611000, gdp: 25.4 },
    "2050": { population: 33799000, gdp: 85.3 },
    "2100": { population: 40520000, gdp: 124.2 }
  },

  // T
  "Taiwan": {
    "1900": { population: 2940000, gdp: 0.6 },
    "1950": { population: 7550000, gdp: 2.1 },
    "2000": { population: 22276000, gdp: 352.4 },
    "2050": { population: 21527000, gdp: 1254.3 },
    "2100": { population: 17264000, gdp: 1854.2 }
  },
  "Tajikistan": {
    "1900": { population: 1100000, gdp: 0.2 },
    "1950": { population: 1530000, gdp: 0.5 },
    "2000": { population: 6245000, gdp: 1.8 },
    "2050": { population: 16260000, gdp: 15.4 },
    "2100": { population: 22450000, gdp: 28.3 }
  },
  "Tanzania": {
    "1900": { population: 4200000, gdp: 0.8 },
    "1950": { population: 7640000, gdp: 1.8 },
    "2000": { population: 35241000, gdp: 18.5 },
    "2050": { population: 129785000, gdp: 152.4 },
    "2100": { population: 244633000, gdp: 324.3 }
  },
  "Thailand": {
    "1900": { population: 7320000, gdp: 2.2 },
    "1950": { population: 20371000, gdp: 6.4 },
    "2000": { population: 62936000, gdp: 145.3 },
    "2050": { population: 66046000, gdp: 954.2 },
    "2100": { population: 54834000, gdp: 1452.3 }
  },
  "Timor-Leste": {
    "1900": { population: 350000, gdp: 0.05 },
    "1950": { population: 433000, gdp: 0.1 },
    "2000": { population: 878000, gdp: 0.4 },
    "2050": { population: 1768000, gdp: 3.2 },
    "2100": { population: 2175000, gdp: 5.8 }
  },
  "Togo": {
    "1900": { population: 900000, gdp: 0.2 },
    "1950": { population: 1385000, gdp: 0.4 },
    "2000": { population: 5285000, gdp: 2.5 },
    "2050": { population: 17699000, gdp: 18.4 },
    "2100": { population: 31134000, gdp: 35.2 }
  },
  "Tonga": {
    "1900": { population: 20000, gdp: 0.01 },
    "1950": { population: 47000, gdp: 0.02 },
    "2000": { population: 98000, gdp: 0.3 },
    "2050": { population: 127000, gdp: 1.2 },
    "2100": { population: 145000, gdp: 1.8 }
  },
  "Trinidad and Tobago": {
    "1900": { population: 255000, gdp: 0.1 },
    "1950": { population: 632000, gdp: 0.5 },
    "2000": { population: 1268000, gdp: 12.4 },
    "2050": { population: 1258000, gdp: 28.5 },
    "2100": { population: 1123000, gdp: 35.2 }
  },
  "Tunisia": {
    "1900": { population: 1650000, gdp: 0.5 },
    "1950": { population: 3530000, gdp: 1.8 },
    "2000": { population: 9772000, gdp: 24.5 },
    "2050": { population: 13147000, gdp: 85.3 },
    "2100": { population: 13722000, gdp: 124.2 }
  },
  "Turkey": {
    "1900": { population: 13100000, gdp: 5.2 },
    "1950": { population: 21222000, gdp: 15.4 },
    "2000": { population: 64252000, gdp: 284.3 },
    "2050": { population: 97094000, gdp: 2154.2 },
    "2100": { population: 94365000, gdp: 3254.3 }
  },
  "Turkmenistan": {
    "1900": { population: 1000000, gdp: 0.2 },
    "1950": { population: 1212000, gdp: 0.5 },
    "2000": { population: 4517000, gdp: 4.5 },
    "2050": { population: 8475000, gdp: 24.3 },
    "2100": { population: 10842000, gdp: 42.5 }
  },
  "Tuvalu": {
    "1900": { population: 3000, gdp: 0.01 },
    "1950": { population: 5000, gdp: 0.01 },
    "2000": { population: 9000, gdp: 0.02 },
    "2050": { population: 13000, gdp: 0.1 },
    "2100": { population: 16000, gdp: 0.2 }
  },

  // U
  "Uganda": {
    "1900": { population: 1900000, gdp: 0.3 },
    "1950": { population: 5158000, gdp: 1.2 },
    "2000": { population: 24566000, gdp: 8.5 },
    "2050": { population: 89724000, gdp: 85.3 },
    "2100": { population: 161885000, gdp: 154.2 }
  },
  "Ukraine": {
    "1900": { population: 26350000, gdp: 12.3 },
    "1950": { population: 36678000, gdp: 28.4 },
    "2000": { population: 49115000, gdp: 45.2 },
    "2050": { population: 35183000, gdp: 352.3 },
    "2100": { population: 32325000, gdp: 654.2 }
  },
  "United Arab Emirates": {
    "1900": { population: 70000, gdp: 0.02 },
    "1950": { population: 70000, gdp: 0.1 },
    "2000": { population: 3257000, gdp: 124.5 },
    "2050": { population: 9741000, gdp: 524.3 },
    "2100": { population: 12872000, gdp: 854.2 }
  },
  "United Kingdom": {
    "1900": { population: 38400000, gdp: 152.3 },
    "1950": { population: 50127000, gdp: 245.4 },
    "2000": { population: 58892514, gdp: 1824.2 },
    "2050": { population: 72914000, gdp: 5234.3 },
    "2100": { population: 76812000, gdp: 8234.2 }
  },
  "United States": {
    "1900": { population: 76094000, gdp: 312.4 },
    "1950": { population: 158804000, gdp: 2028.3 },
    "2000": { population: 282398554, gdp: 10252.2 },
    "2050": { population: 375085000, gdp: 41234.3 },
    "2100": { population: 403995000, gdp: 85234.2 }
  },
  "Uruguay": {
    "1900": { population: 915000, gdp: 0.5 },
    "1950": { population: 2240000, gdp: 2.8 },
    "2000": { population: 3321000, gdp: 28.4 },
    "2050": { population: 3750000, gdp: 65.3 },
    "2100": { population: 3570000, gdp: 85.2 }
  },
  "Uzbekistan": {
    "1900": { population: 4000000, gdp: 0.8 },
    "1950": { population: 6253000, gdp: 2.5 },
    "2000": { population: 24906000, gdp: 18.4 },
    "2050": { population: 42133000, gdp: 85.3 },
    "2100": { population: 52459000, gdp: 152.4 }
  },

  // V
  "Vanuatu": {
    "1900": { population: 50000, gdp: 0.01 },
    "1950": { population: 52000, gdp: 0.02 },
    "2000": { population: 185000, gdp: 0.3 },
    "2050": { population: 496000, gdp: 1.8 },
    "2100": { population: 737000, gdp: 3.2 }
  },
  "Vatican City": {
    "1900": { population: 500, gdp: 0.001 },
    "1950": { population: 800, gdp: 0.001 },
    "2000": { population: 800, gdp: 0.001 },
    "2050": { population: 800, gdp: 0.001 },
    "2100": { population: 800, gdp: 0.001 }
  },
  "Venezuela": {
    "1900": { population: 2600000, gdp: 1.2 },
    "1950": { population: 5009000, gdp: 8.5 },
    "2000": { population: 24465000, gdp: 125.4 },
    "2050": { population: 35195000, gdp: 185.3 },
    "2100": { population: 35563000, gdp: 254.2 }
  },
  "Vietnam": {
    "1900": { population: 11200000, gdp: 2.2 },
    "1950": { population: 24649000, gdp: 5.4 },
    "2000": { population: 79939000, gdp: 45.3 },
    "2050": { population: 109268000, gdp: 854.2 },
    "2100": { population: 107024000, gdp: 1452.3 }
  },

  // Y
  "Yemen": {
    "1900": { population: 2500000, gdp: 0.5 },
    "1950": { population: 4316000, gdp: 1.2 },
    "2000": { population: 18582000, gdp: 12.4 },
    "2050": { population: 45324000, gdp: 45.3 },
    "2100": { population: 61384000, gdp: 75.2 }
  },

  // Z
  "Zambia": {
    "1900": { population: 800000, gdp: 0.2 },
    "1950": { population: 2440000, gdp: 0.8 },
    "2000": { population: 10526000, gdp: 5.4 },
    "2050": { population: 39127000, gdp: 35.2 },
    "2100": { population: 72794000, gdp: 65.3 }
  },
  "Zimbabwe": {
    "1900": { population: 700000, gdp: 0.2 },
    "1950": { population: 2747000, gdp: 0.8 },
    "2000": { population: 12346000, gdp: 8.5 },
    "2050": { population: 24040000, gdp: 35.2 },
    "2100": { population: 30723000, gdp: 45.3 }
  },

  // TERRITORIES AND SPECIAL REGIONS
  
  "Hong Kong": {
    "1900": { population: 368000, gdp: 0.1 },
    "1950": { population: 1970000, gdp: 1.2 },
    "2000": { population: 6665000, gdp: 184.3 },
    "2050": { population: 7256000, gdp: 754.2 },
    "2100": { population: 5892000, gdp: 954.3 }
  },
  "Macao": {
    "1900": { population: 120000, gdp: 0.02 },
    "1950": { population: 187000, gdp: 0.1 },
    "2000": { population: 431000, gdp: 8.4 },
    "2050": { population: 743000, gdp: 45.2 },
    "2100": { population: 815000, gdp: 65.3 }
  },
  "Puerto Rico": {
    "1900": { population: 953000, gdp: 0.3 },
    "1950": { population: 2218000, gdp: 2.5 },
    "2000": { population: 3810000, gdp: 65.4 },
    "2050": { population: 3251000, gdp: 125.3 },
    "2100": { population: 2792000, gdp: 185.2 }
  },
  "Kosovo": {
    "1900": { population: 400000, gdp: 0.1 },
    "1950": { population: 733000, gdp: 0.3 },
    "2000": { population: 1700000, gdp: 2.5 },
    "2050": { population: 1700000, gdp: 8.4 },
    "2100": { population: 1500000, gdp: 12.3 }
  },
  "Palestine": {
    "1900": { population: 400000, gdp: 0.1 },
    "1950": { population: 1000000, gdp: 0.3 },
    "2000": { population: 3130000, gdp: 4.5 },
    "2050": { population: 8160000, gdp: 18.4 },
    "2100": { population: 12300000, gdp: 32.5 }
  },

  // ALIASES
  "UK": "United Kingdom",
  "USA": "United States",
  "U.S.": "United States",
  "U.S.A": "United States",
  "America": "United States",
  "Great Britain": "United Kingdom",
  "Britain": "United Kingdom",
  "Korea, South": "South Korea",
  "South Korea": "South Korea",
  "Korea, North": "North Korea",
  "North Korea": "North Korea",
  "Czech Republic": "Czech Republic",
  "Czechia": "Czech Republic",
  "Russia": "Russia",
  "Russian Federation": "Russia",
  "Burma": "Myanmar",
  "Ivory Coast": "Côte d'Ivoire",
  "East Timor": "Timor-Leste",
  "Swaziland": "Eswatini",
  "Macedonia": "North Macedonia",
  "Western Samoa": "Samoa"
};

// Helper function to resolve aliases
export const resolveCountry = (name) => {
  if (typeof FUTURE_PAST_DATA[name] === 'string') {
    return FUTURE_PAST_DATA[FUTURE_PAST_DATA[name]];
  }
  return FUTURE_PAST_DATA[name];
};

export default FUTURE_PAST_DATA;