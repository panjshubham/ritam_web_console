/**
 * Four major Indian observation coordinates for Panchanga sun timings.
 * Issue FRE-109 / Module 09 requirements.
 */
export const CITIES = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi NCR',
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
  },
];

export const DEFAULT_CITY = CITIES[0];

