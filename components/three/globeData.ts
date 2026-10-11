// Realistic World Map Vector Landmass Data for 3D Globe Projection
export interface GeoPoint {
  lat: number; // degrees -90 to +90
  lon: number; // degrees -180 to +180
}

export interface Landmass {
  id: string;
  name: string;
  points: GeoPoint[];
  isIndia?: boolean;
}

// India subcontinent boundary coordinates (high precision)
export const INDIA_COORDINATES: GeoPoint[] = [
  { lat: 35.5, lon: 76.8 }, // Karakoram / Ladakh
  { lat: 34.8, lon: 78.5 }, // Aksai Chin border
  { lat: 33.2, lon: 79.2 }, // Ladakh East
  { lat: 31.8, lon: 78.6 }, // Himachal East
  { lat: 30.8, lon: 79.8 }, // Uttarakhand / Garhwal
  { lat: 29.8, lon: 80.5 }, // Pithoragarh border
  { lat: 28.5, lon: 80.2 }, // UP / Nepal border
  { lat: 27.4, lon: 83.2 }, // UP East border
  { lat: 26.8, lon: 85.1 }, // Bihar / Nepal border
  { lat: 27.3, lon: 88.3 }, // Sikkim North
  { lat: 28.0, lon: 92.5 }, // Arunachal West
  { lat: 28.8, lon: 94.8 }, // Arunachal North
  { lat: 28.2, lon: 96.8 }, // Kibithu / Arunachal East
  { lat: 26.9, lon: 95.8 }, // Nagaland / Myanmar border
  { lat: 24.5, lon: 94.2 }, // Manipur border
  { lat: 22.2, lon: 93.1 }, // Mizoram South tip
  { lat: 23.8, lon: 91.3 }, // Tripura border
  { lat: 25.2, lon: 90.0 }, // Meghalaya South border
  { lat: 26.2, lon: 89.8 }, // Assam border
  { lat: 26.6, lon: 88.2 }, // Siliguri / Chicken's neck
  { lat: 24.0, lon: 88.6 }, // West Bengal border
  { lat: 21.6, lon: 87.5 }, // Sundarbans / Bay of Bengal coast
  { lat: 20.0, lon: 86.0 }, // Odisha / Puri coast
  { lat: 18.2, lon: 84.0 }, // Andhra North coast
  { lat: 15.8, lon: 80.8 }, // Krishna delta
  { lat: 13.1, lon: 80.3 }, // Chennai / Coromandel
  { lat: 10.3, lon: 79.8 }, // Point Calimere
  { lat: 8.08, lon: 77.55 }, // Kanyakumari (Southern tip of India)
  { lat: 8.5, lon: 76.9 }, // Kerala / Trivandrum
  { lat: 10.0, lon: 76.2 }, // Kochi / Malabar coast
  { lat: 12.8, lon: 74.8 }, // Mangaluru / Karnataka coast
  { lat: 15.4, lon: 73.8 }, // Goa coast
  { lat: 18.9, lon: 72.8 }, // Mumbai / Konkan coast
  { lat: 21.0, lon: 72.7 }, // Surat / Gulf of Khambhat
  { lat: 20.7, lon: 70.9 }, // Diu / Saurashtra South
  { lat: 22.3, lon: 69.0 }, // Dwarka / Saurashtra West
  { lat: 23.0, lon: 70.2 }, // Gulf of Kutch
  { lat: 23.8, lon: 68.5 }, // Kori Creek / Rann of Kutch West
  { lat: 24.5, lon: 71.0 }, // Rajasthan border South
  { lat: 26.0, lon: 70.3 }, // Barmer / Thar desert
  { lat: 27.5, lon: 70.2 }, // Jaisalmer border
  { lat: 29.8, lon: 72.8 }, // Ganganagar border
  { lat: 31.6, lon: 74.6 }, // Wagah / Punjab border
  { lat: 32.8, lon: 74.4 }, // Jammu border
  { lat: 34.5, lon: 74.2 }, // Kashmir / Line of Control
  { lat: 35.5, lon: 76.8 }, // Return to Ladakh / Siachen
];

export const INDIA_CENTER = {
  lat: 22.5,
  lon: 78.9,
  name: "India",
  fullName: "Republic of India",
  statesCount: 28,
  officialLanguages: 22,
};

// Major World Continents & Landmasses
export const WORLD_LANDMASSES: Landmass[] = [
  // ── AFRICA ──────────────────────────────────────────
  {
    id: "africa",
    name: "Africa",
    points: [
      { lat: 37.3, lon: 9.8 },
      { lat: 35.8, lon: -5.6 },
      { lat: 31.5, lon: -10.0 },
      { lat: 21.0, lon: -17.0 },
      { lat: 14.7, lon: -17.5 },
      { lat: 4.3, lon: -7.5 },
      { lat: 5.0, lon: 1.0 },
      { lat: 4.5, lon: 9.0 },
      { lat: -4.5, lon: 11.5 },
      { lat: -12.0, lon: 13.5 },
      { lat: -22.5, lon: 14.5 },
      { lat: -34.8, lon: 20.0 }, // Cape Agulhas
      { lat: -33.9, lon: 25.6 },
      { lat: -26.0, lon: 33.0 },
      { lat: -15.0, lon: 40.5 },
      { lat: -4.0, lon: 39.5 },
      { lat: 2.0, lon: 45.5 },
      { lat: 11.8, lon: 51.3 }, // Horn of Africa (Ras Hafun)
      { lat: 12.0, lon: 43.5 },
      { lat: 22.0, lon: 37.0 },
      { lat: 31.2, lon: 32.3 }, // Suez
      { lat: 32.0, lon: 24.5 },
      { lat: 31.0, lon: 17.0 },
      { lat: 37.3, lon: 9.8 },
    ],
  },
  // Madagascar
  {
    id: "madagascar",
    name: "Madagascar",
    points: [
      { lat: -12.0, lon: 49.3 },
      { lat: -16.0, lon: 49.8 },
      { lat: -25.5, lon: 47.0 },
      { lat: -25.0, lon: 44.2 },
      { lat: -17.0, lon: 44.0 },
      { lat: -12.0, lon: 49.3 },
    ],
  },

  // ── EURASIA (EUROPE & ASIA) ─────────────────────────
  {
    id: "europe_west",
    name: "Europe",
    points: [
      { lat: 36.0, lon: -5.6 }, // Gibraltar
      { lat: 37.0, lon: -9.0 }, // Portugal
      { lat: 43.8, lon: -9.2 }, // Galicia
      { lat: 43.5, lon: -1.7 }, // Bay of Biscay
      { lat: 48.5, lon: -4.7 }, // Brittany
      { lat: 51.0, lon: 2.0 }, // Calais
      { lat: 54.0, lon: 9.0 }, // Denmark
      { lat: 58.0, lon: 12.0 },
      { lat: 71.0, lon: 26.0 }, // Nordkapp
      { lat: 68.0, lon: 40.0 }, // Kola Peninsula
      { lat: 66.0, lon: 60.0 }, // Ural Mountains
      { lat: 55.0, lon: 55.0 },
      { lat: 46.0, lon: 48.0 }, // Caspian North
      { lat: 42.0, lon: 42.0 }, // Black Sea East
      { lat: 41.0, lon: 29.0 }, // Istanbul
      { lat: 38.0, lon: 24.0 }, // Greece
      { lat: 40.0, lon: 18.0 }, // Italy heel
      { lat: 38.0, lon: 15.0 }, // Sicily
      { lat: 44.0, lon: 8.0 }, // Genoa
      { lat: 43.0, lon: 3.0 }, // Mediterranean France
      { lat: 36.0, lon: -5.6 },
    ],
  },
  // British Isles
  {
    id: "britain",
    name: "Great Britain",
    points: [
      { lat: 50.0, lon: -5.2 },
      { lat: 51.5, lon: 1.4 },
      { lat: 55.0, lon: -1.5 },
      { lat: 58.5, lon: -3.5 },
      { lat: 56.0, lon: -5.5 },
      { lat: 53.0, lon: -4.5 },
      { lat: 50.0, lon: -5.2 },
    ],
  },

  // ── ASIA / RUSSIA / SIBERIA ─────────────────────────
  {
    id: "russia_siberia",
    name: "Siberia & Northern Asia",
    points: [
      { lat: 66.0, lon: 60.0 },
      { lat: 73.0, lon: 73.0 }, // Yamal
      { lat: 76.5, lon: 100.0 }, // Taymyr
      { lat: 72.0, lon: 130.0 }, // Lena delta
      { lat: 70.0, lon: 160.0 },
      { lat: 65.0, lon: 178.0 }, // Chukotka
      { lat: 55.0, lon: 162.0 }, // Kamchatka
      { lat: 52.0, lon: 142.0 }, // Sakhalin
      { lat: 43.0, lon: 132.0 }, // Vladivostok
      { lat: 40.0, lon: 125.0 }, // Korea
      { lat: 35.0, lon: 119.0 }, // Yellow Sea
      { lat: 22.0, lon: 114.0 }, // Hong Kong
      { lat: 21.0, lon: 108.0 }, // Vietnam
      { lat: 10.0, lon: 105.0 }, // Mekong delta
      { lat: 1.3, lon: 103.8 }, // Singapore
      { lat: 14.0, lon: 100.0 }, // Thailand
      { lat: 16.0, lon: 96.0 }, // Myanmar
      { lat: 22.0, lon: 92.0 }, // Bangladesh border
      // Meets India polygon on east
      { lat: 28.0, lon: 85.0 }, // Tibet / Nepal
      { lat: 36.0, lon: 75.0 }, // Karakoram
      { lat: 40.0, lon: 65.0 }, // Central Asia
      { lat: 46.0, lon: 50.0 }, // Caspian
      { lat: 55.0, lon: 55.0 },
      { lat: 66.0, lon: 60.0 },
    ],
  },

  // Japan
  {
    id: "japan",
    name: "Japan",
    points: [
      { lat: 45.4, lon: 141.7 },
      { lat: 43.0, lon: 145.5 },
      { lat: 35.5, lon: 140.0 },
      { lat: 31.0, lon: 130.5 },
      { lat: 34.5, lon: 132.0 },
      { lat: 38.0, lon: 138.5 },
      { lat: 45.4, lon: 141.7 },
    ],
  },

  // ── MIDDLE EAST & ARABIA ────────────────────────────
  {
    id: "middle_east",
    name: "Middle East",
    points: [
      { lat: 31.2, lon: 34.5 },
      { lat: 36.0, lon: 36.0 }, // Levant
      { lat: 37.0, lon: 43.0 },
      { lat: 30.0, lon: 48.0 }, // Persian Gulf
      { lat: 26.0, lon: 56.0 }, // Strait of Hormuz
      { lat: 23.0, lon: 59.0 }, // Oman
      { lat: 16.0, lon: 53.0 },
      { lat: 12.8, lon: 45.0 }, // Aden
      { lat: 13.0, lon: 43.0 }, // Bab el Mandeb
      { lat: 22.0, lon: 39.0 }, // Red Sea
      { lat: 28.0, lon: 34.5 },
      { lat: 31.2, lon: 34.5 },
    ],
  },

  // ── SOUTHEAST ASIA ISLANDS (INDONESIA) ──────────────
  {
    id: "indonesia_sumatra",
    name: "Sumatra",
    points: [
      { lat: 5.5, lon: 95.3 },
      { lat: 2.0, lon: 99.0 },
      { lat: -5.0, lon: 105.0 },
      { lat: -4.0, lon: 103.0 },
      { lat: 0.5, lon: 98.5 },
      { lat: 5.5, lon: 95.3 },
    ],
  },
  {
    id: "indonesia_java",
    name: "Java",
    points: [
      { lat: -6.0, lon: 106.0 },
      { lat: -7.0, lon: 112.5 },
      { lat: -8.5, lon: 114.5 },
      { lat: -8.0, lon: 109.0 },
      { lat: -6.0, lon: 106.0 },
    ],
  },

  // ── AUSTRALIA & NEW ZEALAND ─────────────────────────
  {
    id: "australia",
    name: "Australia",
    points: [
      { lat: -11.0, lon: 142.5 }, // Cape York
      { lat: -17.0, lon: 146.0 },
      { lat: -25.0, lon: 153.0 }, // Fraser Island
      { lat: -34.0, lon: 151.0 }, // Sydney
      { lat: -38.0, lon: 147.0 },
      { lat: -38.5, lon: 141.0 },
      { lat: -35.0, lon: 137.0 }, // Adelaide
      { lat: -32.0, lon: 128.0 }, // Great Australian Bight
      { lat: -34.5, lon: 118.0 },
      { lat: -32.0, lon: 115.5 }, // Perth
      { lat: -22.0, lon: 114.0 }, // Exmouth
      { lat: -16.0, lon: 123.0 }, // Kimberley
      { lat: -12.5, lon: 131.0 }, // Darwin
      { lat: -14.0, lon: 136.0 },
      { lat: -11.0, lon: 142.5 },
    ],
  },
  {
    id: "new_zealand",
    name: "New Zealand",
    points: [
      { lat: -35.0, lon: 173.5 },
      { lat: -38.0, lon: 178.0 },
      { lat: -41.5, lon: 175.0 },
      { lat: -46.5, lon: 168.0 },
      { lat: -43.0, lon: 170.0 },
      { lat: -35.0, lon: 173.5 },
    ],
  },

  // ── NORTH AMERICA ───────────────────────────────────
  {
    id: "north_america",
    name: "North America",
    points: [
      { lat: 71.3, lon: -156.5 }, // Point Barrow Alaska
      { lat: 65.0, lon: -168.0 }, // Bering Strait
      { lat: 55.0, lon: -160.0 }, // Aleutian base
      { lat: 60.0, lon: -145.0 }, // Gulf of Alaska
      { lat: 54.0, lon: -130.0 },
      { lat: 48.0, lon: -124.5 }, // Washington
      { lat: 38.0, lon: -123.0 }, // San Francisco
      { lat: 32.5, lon: -117.0 }, // San Diego
      { lat: 23.0, lon: -110.0 }, // Baja California
      { lat: 20.0, lon: -105.0 },
      { lat: 15.0, lon: -93.0 }, // Mexico South
      { lat: 8.5, lon: -82.0 }, // Panama
      { lat: 10.0, lon: -75.0 },
      { lat: 18.0, lon: -92.0 }, // Yucatan
      { lat: 22.0, lon: -97.0 },
      { lat: 29.0, lon: -95.0 }, // Texas coast
      { lat: 29.5, lon: -85.0 }, // Florida panhandle
      { lat: 25.0, lon: -80.5 }, // Miami
      { lat: 35.0, lon: -75.5 }, // Cape Hatteras
      { lat: 41.0, lon: -72.0 }, // New York
      { lat: 45.0, lon: -67.0 }, // Maine
      { lat: 47.0, lon: -53.0 }, // Newfoundland
      { lat: 58.0, lon: -62.0 }, // Labrador
      { lat: 62.0, lon: -80.0 }, // Hudson Bay
      { lat: 70.0, lon: -95.0 }, // Arctic islands
      { lat: 71.3, lon: -156.5 },
    ],
  },
  // Greenland
  {
    id: "greenland",
    name: "Greenland",
    points: [
      { lat: 60.0, lon: -44.0 }, // Cape Farewell
      { lat: 65.0, lon: -38.0 },
      { lat: 77.0, lon: -18.0 },
      { lat: 83.0, lon: -30.0 },
      { lat: 78.0, lon: -70.0 },
      { lat: 68.0, lon: -54.0 },
      { lat: 60.0, lon: -44.0 },
    ],
  },

  // ── SOUTH AMERICA ───────────────────────────────────
  {
    id: "south_america",
    name: "South America",
    points: [
      { lat: 11.5, lon: -72.0 }, // Guajira
      { lat: 10.5, lon: -62.0 }, // Venezuela
      { lat: 5.0, lon: -52.0 }, // French Guiana
      { lat: -2.0, lon: -44.0 }, // Amazon delta
      { lat: -5.5, lon: -35.0 }, // Ponta do Seixas (Easternmost)
      { lat: -13.0, lon: -38.5 }, // Salvador
      { lat: -23.0, lon: -43.0 }, // Rio de Janeiro
      { lat: -34.0, lon: -53.5 }, // Uruguay
      { lat: -38.0, lon: -57.5 }, // Mar del Plata
      { lat: -54.0, lon: -67.0 }, // Tierra del Fuego
      { lat: -52.0, lon: -75.0 }, // Chile Fjords
      { lat: -33.0, lon: -71.5 }, // Valparaiso
      { lat: -18.5, lon: -70.3 }, // Arica
      { lat: -12.0, lon: -77.0 }, // Lima
      { lat: -4.5, lon: -81.3 }, // Piura (Westernmost)
      { lat: 1.0, lon: -79.0 }, // Ecuador
      { lat: 7.5, lon: -77.5 }, // Colombia
      { lat: 11.5, lon: -72.0 },
    ],
  },

  // ── ANTARCTICA (Coastline strip) ────────────────────
  {
    id: "antarctica",
    name: "Antarctica",
    points: [
      { lat: -65.0, lon: -60.0 }, // Antarctic Peninsula
      { lat: -72.0, lon: -20.0 },
      { lat: -70.0, lon: 30.0 },
      { lat: -67.0, lon: 80.0 },
      { lat: -66.0, lon: 130.0 },
      { lat: -72.0, lon: 170.0 }, // Ross Sea
      { lat: -75.0, lon: -150.0 },
      { lat: -72.0, lon: -100.0 },
      { lat: -65.0, lon: -60.0 },
    ],
  },
];

// Continents centroids for click classification & non-India detection
export const CONTINENT_CENTROIDS = [
  { id: "north_america", name: "North America", lat: 40.0, lon: -100.0, radius: 45 },
  { id: "south_america", name: "South America", lat: -15.0, lon: -60.0, radius: 35 },
  { id: "europe", name: "Europe", lat: 50.0, lon: 15.0, radius: 25 },
  { id: "africa", name: "Africa", lat: 5.0, lon: 20.0, radius: 35 },
  { id: "russia_north_asia", name: "Northern Asia", lat: 60.0, lon: 100.0, radius: 40 },
  { id: "east_asia", name: "East Asia", lat: 35.0, lon: 105.0, radius: 25 },
  { id: "southeast_asia", name: "Southeast Asia", lat: 10.0, lon: 105.0, radius: 20 },
  { id: "middle_east", name: "Middle East", lat: 25.0, lon: 45.0, radius: 20 },
  { id: "australia", name: "Australia & Oceania", lat: -25.0, lon: 135.0, radius: 30 },
  { id: "antarctica", name: "Antarctica", lat: -80.0, lon: 0.0, radius: 30 },
];
