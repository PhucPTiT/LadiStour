import { z } from "zod";

// Nominatim API response schema
export const GeocodingResultSchema = z.object({
    place_id: z.number(),
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
    type: z.string().optional(),
    class: z.string().optional(),
});

export const GeocodingResponseSchema = z.array(GeocodingResultSchema);

export type GeocodingResult = z.infer<typeof GeocodingResultSchema>;
export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;

// Simplified coordinate type for map usage
export interface Coordinates {
    latitude: number;
    longitude: number;
    displayName: string;
}
