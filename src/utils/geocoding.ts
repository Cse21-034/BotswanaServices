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
 * Geocode an address in Botswana to get latitude and longitude
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
        const searchQuery = `${address}, ${city}, Botswana`;

        // Use OpenStreetMap Nominatim API (free, no API key needed)
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&format=json` +
            `&limit=1` +
            `&countrycodes=bw`; // Restrict to Botswana

        console.log('🌍 Geocoding address:', searchQuery);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'BotswanaServices/1.0' // Required by Nominatim
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
 * Get default coordinates for Botswanan cities
 * Fallback if geocoding fails
 */
export function getDefaultCoordinates(city: string): { latitude: number; longitude: number } {
    const coordinates: { [key: string]: { latitude: number; longitude: number } } = {
        'gaborone': { latitude: -24.6282, longitude: 25.9231 },
        'francistown': { latitude: -21.1661, longitude: 27.5147 },
        'molepolole': { latitude: -24.4067, longitude: 25.4951 },
        'selebi-phikwe': { latitude: -21.9803, longitude: 27.8333 },
        'maun': { latitude: -19.9833, longitude: 23.4167 },
        'serowe': { latitude: -22.3833, longitude: 26.7167 },
        'kanye': { latitude: -24.9667, longitude: 25.3500 },
        'mahalapye': { latitude: -23.1000, longitude: 26.8167 },
        'lobatse': { latitude: -25.2167, longitude: 25.6833 },
        'palapye': { latitude: -22.5500, longitude: 27.1333 },
        'ramotswa': { latitude: -24.8667, longitude: 25.8667 },
        'kasane': { latitude: -17.8000, longitude: 25.1500 },
        'jwaneng': { latitude: -24.6028, longitude: 24.7283 },
        'orapa': { latitude: -21.3000, longitude: 25.3833 },
        'letlhakane': { latitude: -21.4167, longitude: 25.5833 },
        'tlokweng': { latitude: -24.6500, longitude: 26.0167 },
        'mogoditshane': { latitude: -24.5500, longitude: 25.8500 },
        'mochudi': { latitude: -24.3833, longitude: 26.1500 },
        'ghanzi': { latitude: -21.6833, longitude: 21.6500 },
        'shakawe': { latitude: -18.3667, longitude: 21.8333 },
        'tsabong': { latitude: -26.0333, longitude: 22.4500 },
    };

    const cityKey = city.toLowerCase().trim();

    if (coordinates[cityKey]) {
        return coordinates[cityKey];
    }

    // Default to Gaborone if city not found
    console.warn(`⚠️ No coordinates found for "${city}", defaulting to Gaborone`);
    return coordinates['gaborone'];
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
