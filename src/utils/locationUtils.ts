/**
 * Utility to find the nearest Botswanan city from GPS coordinates
 * Used for the "Use my location" feature in hero search
 */

interface NamibiaCity {
  name: string;
  latitude: number;
  longitude: number;
}

// Botswana approximate boundaries
const NAMIBIA_BOUNDS = {
  minLat: -26.9,
  maxLat: -17.8,
  minLon: 19.9,
  maxLon: 29.4,
};

const NAMIBIA_CITIES: NamibiaCity[] = [
  { name: "Gaborone", latitude: -24.6282, longitude: 25.9231 },
  { name: "Francistown", latitude: -21.1661, longitude: 27.5147 },
  { name: "Molepolole", latitude: -24.4067, longitude: 25.4951 },
  { name: "Selebi-Phikwe", latitude: -21.9803, longitude: 27.8333 },
  { name: "Maun", latitude: -19.9833, longitude: 23.4167 },
  { name: "Serowe", latitude: -22.3833, longitude: 26.7167 },
  { name: "Kanye", latitude: -24.9667, longitude: 25.3500 },
  { name: "Mahalapye", latitude: -23.1000, longitude: 26.8167 },
  { name: "Lobatse", latitude: -25.2167, longitude: 25.6833 },
  { name: "Palapye", latitude: -22.5500, longitude: 27.1333 },
  { name: "Ramotswa", latitude: -24.8667, longitude: 25.8667 },
  { name: "Kasane", latitude: -17.8000, longitude: 25.1500 },
  { name: "Jwaneng", latitude: -24.6028, longitude: 24.7283 },
  { name: "Orapa", latitude: -21.3000, longitude: 25.3833 },
  { name: "Letlhakane", latitude: -21.4167, longitude: 25.5833 },
  { name: "Tlokweng", latitude: -24.6500, longitude: 26.0167 },
  { name: "Mogoditshane", latitude: -24.5500, longitude: 25.8500 },
  { name: "Mochudi", latitude: -24.3833, longitude: 26.1500 },
  { name: "Ghanzi", latitude: -21.6833, longitude: 21.6500 },
  { name: "Shakawe", latitude: -18.3667, longitude: 21.8333 },
  { name: "Tsabong", latitude: -26.0333, longitude: 22.4500 },
];

/**
 * Check if coordinates are within Botswana
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns true if coordinates are within Botswana bounds
 */
export function isWithinNamibia(latitude: number, longitude: number): boolean {
  return (
    latitude >= NAMIBIA_BOUNDS.minLat &&
    latitude <= NAMIBIA_BOUNDS.maxLat &&
    longitude >= NAMIBIA_BOUNDS.minLon &&
    longitude <= NAMIBIA_BOUNDS.maxLon
  );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest Botswanan city to given coordinates
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns The name of the nearest city, or null if user is outside Botswana
 */
export function findNearestCity(latitude: number, longitude: number): string | null {
  if (!latitude || !longitude) {
    return "Gaborone"; // Default fallback
  }

  // Check if user is within Botswana bounds
  if (!isWithinNamibia(latitude, longitude)) {
    console.warn(
      `❌ User location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) is outside Botswana. No service available.`
    );
    return null;
  }

  let nearestCity = NAMIBIA_CITIES[0];
  let minDistance = calculateDistance(
    latitude,
    longitude,
    nearestCity.latitude,
    nearestCity.longitude
  );

  for (let i = 1; i < NAMIBIA_CITIES.length; i++) {
    const city = NAMIBIA_CITIES[i];
    const distance = calculateDistance(
      latitude,
      longitude,
      city.latitude,
      city.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  console.log(
    `📍 User location matched to: ${nearestCity.name} (${minDistance.toFixed(1)} km away)`
  );
  return nearestCity.name;
}
