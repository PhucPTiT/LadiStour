"use client";

import { useTranslations } from "next-intl";
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
} from "@/components/ui/map";

interface CompanyLocation {
    id: number;
    name: string;
    lng: number;
    lat: number;
    address?: string;
}

type AboutCompanyMapProps = {
    locations?: CompanyLocation[];
};

export default function AboutCompanyMap({
    locations = [
        {
            id: 1,
            name: "STOUR LUXE - Head Office",
            lng: 105.8495,
            lat: 21.0279,
            address:
                "No 16, Alley 322/158, My Dinh Street, My Dinh 1 Ward, Nam Tu Liem District, Hanoi City, Vietnam",
        },
    ],
}: AboutCompanyMapProps) {
    const t = useTranslations("aboutPage.companyMap");

    const handleOpenGoogleMaps = (lat: number, lng: number) => {
        const googleMapsUrl = `https://www.google.com/maps/search/${lat},${lng}`;
        window.open(googleMapsUrl, "_blank");
    };

    if (locations.length === 0) {
        return null;
    }

    const centerLocation = locations[0];

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-heading text-neutral-900 mb-2">
                    {t("title")}
                </h2>
                <p className="text-neutral-600">{t("subtitle")}</p>
            </div>
            <div className="h-96 w-full rounded-2xl overflow-hidden border border-neutral-200">
                <Map
                    center={[centerLocation.lng, centerLocation.lat]}
                    zoom={15}
                >
                    {locations.map((location) => (
                        <MapMarker
                            key={location.id}
                            longitude={location.lng}
                            latitude={location.lat}
                        >
                            <MarkerContent>
                                <div className="bg-emerald-600 size-4 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer" />
                            </MarkerContent>

                            <MarkerTooltip>{location.name}</MarkerTooltip>

                            <MarkerPopup>
                                <div className="space-y-3 max-w-xs">
                                    <div>
                                        <p className="text-foreground font-medium">
                                            {location.name}
                                        </p>
                                        {location.address && (
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {location.address}
                                            </p>
                                        )}
                                        <p className="text-muted-foreground text-xs mt-1">
                                            {location.lat.toFixed(4)},{" "}
                                            {location.lng.toFixed(4)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleOpenGoogleMaps(
                                                location.lat,
                                                location.lng,
                                            )
                                        }
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                                    >
                                        {t("openGoogleMaps")}
                                    </button>
                                </div>
                            </MarkerPopup>
                        </MapMarker>
                    ))}
                </Map>
            </div>
        </div>
    );
}
