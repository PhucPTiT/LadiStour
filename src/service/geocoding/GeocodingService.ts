import { validateSchema } from "../Service";
import { Coordinates, GeocodingResponseSchema } from "./type";

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

/**
 * Get coordinates from a location name using Nominatim API
 * @param locationName - The location name to search for (e.g., "Da Nang", "Ha Long Bay")
 * @returns Coordinates object with latitude, longitude, and displayName
 */
export async function getCoordinatesByLocationName(locationName: string): Promise<Coordinates> {
    if (!locationName.trim()) {
        throw new Error("Location name cannot be empty");
    }

    try {
        const params = new URLSearchParams({
            q: locationName,
            format: "json",
            limit: "1",
        });

        const response = await fetch(`${NOMINATIM_API}?${params.toString()}`, {
            method: "GET",
            headers: {
                "User-Agent": "Landing-Stour-App/1.0", // Nominatim requires a User-Agent
            },
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate the response using Zod schema
        const validatedData = validateSchema(
            data,
            GeocodingResponseSchema,
            "GeocodingService.getCoordinatesByLocationName"
        );

        if (validatedData.length === 0) {
            throw new Error(`No location found for: ${locationName}`);
        }

        const result = validatedData[0];

        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            displayName: result.display_name,
        };
    } catch (error) {
        console.error(`Failed to get coordinates for location "${locationName}":`, error);
        throw error;
    }
}

/**
 * Get multiple coordinates from multiple location names
 * @param locationNames - Array of location names to search for
 * @returns Array of Coordinates objects
 */
export async function getCoordinatesByMultipleLocations(
    locationNames: string[]
): Promise<Coordinates[]> {
    try {
        const results = await Promise.all(
            locationNames.map((name) => getCoordinatesByLocationName(name))
        );
        return results;
    } catch (error) {
        console.error("Failed to get coordinates for multiple locations:", error);
        throw error;
    }
}
