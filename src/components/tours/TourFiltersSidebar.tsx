"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllDestinations } from "@/service/destinations/DestinationService";
import { DestinationListResponse } from "@/service/destinations/type";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type TourFilters = {
    country: string;
    typology: string;
    durationMax: number;
    priceMax: number;
};

type TourFiltersSidebarProps = {
    filters: TourFilters;
    onChange: (next: TourFilters) => void;
};

export default function TourFiltersSidebar({
    filters,
    onChange,
}: TourFiltersSidebarProps) {
    const locale = useLocale();
    const t = useTranslations("ToursPage");
    const [destinations, setDestinations] = useState<DestinationListResponse>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDestinations(
                    locale as string | undefined,
                );
                setDestinations(data);
            } catch (error) {
                console.error("Failed to fetch destinations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, [locale]);

    return (
        <aside className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
            <p className="mb-5 text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                {t("filterTitle")}
            </p>

            <div className="space-y-5">
                <label className="block space-y-2">
                    <span className="text-sm text-neutral-600">
                        {t("destination")}
                    </span>
                    <Select
                        value={filters.country || "all"}
                        onValueChange={(value) =>
                            onChange({
                                ...filters,
                                country: value === "all" ? "" : value,
                            })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-11 w-full rounded-xl border-neutral-300 bg-white px-3 text-sm text-neutral-700">
                            <SelectValue placeholder={t("allCountries")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                            <SelectItem value="all">{t("all")}</SelectItem>
                            {destinations.map((destination) => (
                                <SelectItem
                                    key={destination.id}
                                    value={destination.id}
                                >
                                    {destination.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-neutral-800">
                        {t("typology")}
                    </span>

                    <Select
                        value={filters.typology || "all"}
                        onValueChange={(value) =>
                            onChange({
                                ...filters,
                                typology: value === "all" ? "" : value,
                            })
                        }
                    >
                        <SelectTrigger
                            className="
                                h-12 w-full rounded-2xl border border-neutral-200 
                                bg-white px-4 text-sm text-neutral-900 shadow-sm
                                transition-all duration-200
                                hover:border-emerald-300 hover:shadow-md
                                focus:ring-2 focus:ring-emerald-500/30
                                data-[state=open]:border-emerald-400 data-[state=open]:shadow-md
                            "
                        >
                            <SelectValue placeholder={t("allTypologies")} />
                        </SelectTrigger>

                        <SelectContent
                            className="
                                    rounded-2xl border border-neutral-200 bg-white 
                                    p-1 shadow-[0_24px_50px_rgba(15,23,42,0.18)]
                                "
                        >
                            <SelectItem
                                value="all"
                                className="rounded-xl text-sm font-medium focus:bg-emerald-50 focus:text-emerald-800"
                            >
                                {t("all")}
                            </SelectItem>

                            <SelectItem
                                value="featured"
                                className="rounded-xl text-sm font-medium focus:bg-emerald-50 focus:text-emerald-800"
                            >
                                {t("featured")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </label>

                <label className="block space-y-2">
                    <span className="text-sm text-neutral-600">
                        {t("durationUpTo", { days: filters.durationMax })}
                    </span>
                    <input
                        type="range"
                        min={3}
                        max={10}
                        value={filters.durationMax}
                        onChange={(event) =>
                            onChange({
                                ...filters,
                                durationMax: Number(event.target.value),
                            })
                        }
                        className="w-full accent-emerald-700"
                    />
                </label>
            </div>
        </aside>
    );
}
