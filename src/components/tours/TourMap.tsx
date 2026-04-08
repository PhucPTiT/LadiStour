"use client";

import { useEffect, useState } from "react";
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
} from "@/components/ui/map";
import { getCoordinatesByLocationName } from "@/service/geocoding/GeocodingService";
import { Coordinates } from "@/service/geocoding/type";

type TourMapProps = {
    locationName: string;
};

export default function TourMap({ locationName }: TourMapProps) {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                setLoading(true);
                setError(null);
                const coords = await getCoordinatesByLocationName(locationName);
                setCoordinates(coords);
            } catch (err) {
                console.error("Failed to fetch coordinates:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load map coordinates",
                );
                setCoordinates(null);
            } finally {
                setLoading(false);
            }
        };

        if (locationName) {
            fetchCoordinates();
        }
    }, [locationName]);

    const handleOpenGoogleMaps = (lat: number, lng: number) => {
        const googleMapsUrl = `https://www.google.com/maps/search/${lat},${lng}`;
        window.open(googleMapsUrl, "_blank");
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-neutral-100 rounded-2xl">
                <p className="text-neutral-600">Loading map...</p>
            </div>
        );
    }

    if (error || !coordinates) {
        return (
            <div className="flex h-96 items-center justify-center bg-red-50 border border-red-200 rounded-2xl">
                <div className="text-center">
                    <p className="text-red-600 font-medium">
                        Unable to load map
                    </p>
                    <p className="text-red-500 text-sm mt-1">
                        {error || "Location not found"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-96 w-full rounded-2xl overflow-hidden">
            <Map
                center={[coordinates.longitude, coordinates.latitude]}
                zoom={12}
            >
                <MapMarker
                    longitude={coordinates.longitude}
                    latitude={coordinates.latitude}
                >
                    <MarkerContent>
                        <div className="bg-emerald-600 size-4 rounded-full border-2 border-white shadow-lg" />
                    </MarkerContent>

                    <MarkerTooltip>{locationName}</MarkerTooltip>

                    <MarkerPopup>
                        <div className="space-y-3">
                            <div>
                                <p className="text-foreground font-medium">
                                    {locationName}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {coordinates.latitude.toFixed(4)},{" "}
                                    {coordinates.longitude.toFixed(4)}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {coordinates.displayName}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    handleOpenGoogleMaps(
                                        coordinates.latitude,
                                        coordinates.longitude,
                                    )
                                }
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                            >
                                Google Maps
                            </button>
                        </div>
                    </MarkerPopup>
                </MapMarker>
            </Map>
        </div>
    );
}
