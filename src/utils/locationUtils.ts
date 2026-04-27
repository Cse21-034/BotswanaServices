/**
 * Utility to find the nearest South African city from GPS coordinates
 * Used for the "Use my location" feature in hero search
 */

interface NamibiaCity {
  name: string;
  latitude: number;
  longitude: number;
}

// South Africa approximate boundaries
const NAMIBIA_BOUNDS = {
  minLat: -34.9,
  maxLat: -22.1,
  minLon: 16.4,
  maxLon: 32.9,
};

const NAMIBIA_CITIES: NamibiaCity[] = [
  { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473 },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 },
  { name: "Durban", latitude: -29.8587, longitude: 31.0218 },
  { name: "Pretoria", latitude: -25.7461, longitude: 28.1881 },
  { name: "Gqeberha", latitude: -33.9608, longitude: 25.6022 },
  { name: "Bloemfontein", latitude: -29.0852, longitude: 26.1596 },
  { name: "East London", latitude: -32.9823, longitude: 27.9068 },
  { name: "Polokwane", latitude: -23.9045, longitude: 29.4689 },
  { name: "Nelspruit", latitude: -25.4753, longitude: 30.9694 },
  { name: "Kimberley", latitude: -28.7323, longitude: 24.7710 },
  { name: "Pietermaritzburg", latitude: -29.6006, longitude: 30.3794 },
  { name: "Rustenburg", latitude: -25.6558, longitude: 27.2422 },
  { name: "George", latitude: -33.9646, longitude: 22.4618 },
  { name: "Welkom", latitude: -27.9837, longitude: 26.7365 },
  { name: "Newcastle", latitude: -27.7634, longitude: 29.9316 },
  { name: "Richards Bay", latitude: -28.7833, longitude: 32.0500 },
  { name: "Mahikeng", latitude: -25.8648, longitude: 25.6432 },
  { name: "Upington", latitude: -28.4479, longitude: 21.2561 },
  { name: "Klerksdorp", latitude: -26.8672, longitude: 26.6667 },
  { name: "Stellenbosch", latitude: -33.9321, longitude: 18.8602 },
  { name: "Sandton", latitude: -26.1076, longitude: 28.0567 },
];

/**
 * Check if coordinates are within South Africa
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns true if coordinates are within South Africa bounds
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
 * Find the nearest South African city to given coordinates
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns The name of the nearest city, or null if user is outside South Africa
 */
export function findNearestCity(latitude: number, longitude: number): string | null {
  if (!latitude || !longitude) {
    return "Johannesburg"; // Default fallback
  }

  // Check if user is within South Africa bounds
  if (!isWithinNamibia(latitude, longitude)) {
    console.warn(
      `❌ User location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) is outside South Africa. No service available.`
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
