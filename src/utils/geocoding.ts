/**
 * Geocoding utility for converting addresses to coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

interface GeocodingResult {
    latitude: number;
    longitude: number;
    displayName: string;
}

/**
 * Geocode an address in South Africa to get latitude and longitude
 * @param address Full address string
 * @param city City/town name
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeAddress(
    address: string,
    city: string
): Promise<GeocodingResult | null> {
    try {
        // Build search query with address, city, and country
        const searchQuery = `${address}, ${city}, South Africa`;

        // Use OpenStreetMap Nominatim API (free, no API key needed)
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&format=json` +
            `&limit=1` +
            `&countrycodes=za`; // Restrict to South Africa

        console.log('🌍 Geocoding address:', searchQuery);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MzansiServices/1.0' // Required by Nominatim
            }
        });

        if (!response.ok) {
            console.error('Geocoding API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const coords = {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                displayName: result.display_name
            };

            console.log('✅ Geocoding successful:', coords);
            return coords;
        }

        console.warn('⚠️ No geocoding results found for:', searchQuery);
        return null;

    } catch (error) {
        console.error('❌ Geocoding error:', error);
        return null;
    }
}

/**
 * Get default coordinates for South African cities
 * Fallback if geocoding fails
 */
export function getDefaultCoordinates(city: string): { latitude: number; longitude: number } {
    const coordinates: { [key: string]: { latitude: number; longitude: number } } = {
        'johannesburg': { latitude: -26.2041, longitude: 28.0473 },
        'cape town': { latitude: -33.9249, longitude: 18.4241 },
        'durban': { latitude: -29.8587, longitude: 31.0218 },
        'pretoria': { latitude: -25.7461, longitude: 28.1881 },
        'gqeberha': { latitude: -33.9608, longitude: 25.6022 },
        'port elizabeth': { latitude: -33.9608, longitude: 25.6022 },
        'bloemfontein': { latitude: -29.0852, longitude: 26.1596 },
        'east london': { latitude: -32.9823, longitude: 27.9068 },
        'polokwane': { latitude: -23.9045, longitude: 29.4689 },
        'nelspruit': { latitude: -25.4753, longitude: 30.9694 },
        'kimberley': { latitude: -28.7323, longitude: 24.7710 },
        'pietermaritzburg': { latitude: -29.6006, longitude: 30.3794 },
        'rustenburg': { latitude: -25.6558, longitude: 27.2422 },
        'george': { latitude: -33.9646, longitude: 22.4618 },
        'welkom': { latitude: -27.9837, longitude: 26.7365 },
        'newcastle': { latitude: -27.7634, longitude: 29.9316 },
        'richards bay': { latitude: -28.7833, longitude: 32.0500 },
        'mahikeng': { latitude: -25.8648, longitude: 25.6432 },
        'upington': { latitude: -28.4479, longitude: 21.2561 },
        'klerksdorp': { latitude: -26.8672, longitude: 26.6667 },
        'stellenbosch': { latitude: -33.9321, longitude: 18.8602 },
        'sandton': { latitude: -26.1076, longitude: 28.0567 },
        'midrand': { latitude: -25.9972, longitude: 28.1284 },
        'soweto': { latitude: -26.2677, longitude: 27.8585 },
        'centurion': { latitude: -25.8601, longitude: 28.1881 },
    };

    const cityKey = city.toLowerCase().trim();

    if (coordinates[cityKey]) {
        return coordinates[cityKey];
    }

    // Default to Johannesburg if city not found
    console.warn(`⚠️ No coordinates found for "${city}", defaulting to Johannesburg`);
    return coordinates['johannesburg'];
}

/**
 * Geocode with fallback to default coordinates
 */
export async function geocodeWithFallback(
    address: string,
    city: string
): Promise<{ latitude: number; longitude: number }> {
    // Try geocoding first
    const geocoded = await geocodeAddress(address, city);

    if (geocoded) {
        return {
            latitude: geocoded.latitude,
            longitude: geocoded.longitude
        };
    }

    // Fallback to default city coordinates
    return getDefaultCoordinates(city);
}
