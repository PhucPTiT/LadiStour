"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import TourFiltersSidebar from "@/components/tours/TourFiltersSidebar";
import { Tour } from "@/service/tour/type";
import TourCardWrapper from "./TourCardWrapper";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type SortKey = "price" | "newest" | "duration";

type ToursCatalogClientProps = {
    tours: Tour[];
    initialFilters?: {
        country?: string;
        typology?: string;
        durationMax?: number;
    };
};

export default function ToursCatalogClient({
    tours,
    initialFilters,
}: ToursCatalogClientProps) {
    const t = useTranslations("ToursPage");
    const [filters, setFilters] = useState({
        country: initialFilters?.country ?? "",
        typology: initialFilters?.typology ?? "",
        durationMax: initialFilters?.durationMax ?? 10,
        priceMax: 2200,
    });
    const [sortBy, setSortBy] = useState<SortKey>("newest");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const filteredTours = useMemo(() => {
        const filtered = tours.filter((tour) => {
            if (
                filters.country !== "" &&
                tour.destinationId !== filters.country
            ) {
                return false;
            }

            if (filters.typology === "featured" && !tour.featured) {
                return false;
            }

            // Filter by duration
            if (
                filters.durationMax &&
                Number(tour.durationDays) > Number(filters.durationMax)
            )
                return false;

            return true;
        });

        if (sortBy === "price") {
            return [...filtered].sort(
                (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
            );
        }

        if (sortBy === "duration") {
            return [...filtered].sort(
                (a, b) => a.durationDays - b.durationDays,
            );
        }

        return filtered;
    }, [tours, filters, sortBy]);

    return (
        <div className="container px-4 py-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-heading text-4xl text-neutral-900">
                    {t("header")}
                </h1>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full md:hidden"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                    >
                        {sidebarOpen ? t("hideFilters") : t("showFilters")}
                    </Button>

                    <Select
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value as SortKey)}
                    >
                        <SelectTrigger className="h-10 w-45 rounded-full border-neutral-200 text-sm">
                            <SelectValue placeholder={t("sortPlaceholder")} />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="price">
                                {t("priceSort")}
                            </SelectItem>
                            <SelectItem value="newest">
                                {t("newestSort")}
                            </SelectItem>
                            <SelectItem value="duration">
                                {t("durationSort")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
                    <TourFiltersSidebar
                        filters={filters}
                        onChange={setFilters}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTours.map((tour) => (
                        <TourCardWrapper key={tour.id} tour={tour} />
                    ))}

                    {!filteredTours.length && (
                        <p className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600 sm:col-span-2 xl:col-span-3">
                            {t("noResults")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
