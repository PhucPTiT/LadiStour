"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/tours/TourCard";
import TourFiltersSidebar from "@/components/tours/TourFiltersSidebar";
import { Tour } from "@/lib/data/tours";

type SortKey = "price" | "newest" | "duration";

type ToursCatalogProps = {
    initialTours: Tour[];
    initialFilters?: {
        country?: string;
        typology?: string;
    };
};

export default function ToursCatalog({
    initialTours,
    initialFilters,
}: ToursCatalogProps) {
    const [filters, setFilters] = useState({
        country: initialFilters?.country ?? "",
        typology: initialFilters?.typology ?? "",
        durationMax: 10,
        priceMax: 2200,
    });
    const [sortBy, setSortBy] = useState<SortKey>("newest");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const filteredTours = useMemo(() => {
        const filtered = initialTours.filter((tour) => {
            if (filters.country && tour.country !== filters.country)
                return false;
            if (filters.typology && !tour.typologies.includes(filters.typology))
                return false;
            if (tour.durationDays > filters.durationMax) return false;
            if ((tour.salePrice ?? tour.price) > filters.priceMax) return false;
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
    }, [initialTours, filters, sortBy]);

    return (
        <div className="container px-4 py-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-heading text-4xl text-neutral-900">
                    Explore Our Tours
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-full border border-neutral-200 px-4 py-2 text-sm md:hidden"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                    >
                        {sidebarOpen ? "Hide Filters" : "Show Filters"}
                    </button>
                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(event.target.value as SortKey)
                        }
                        className="h-10 rounded-full border border-neutral-200 px-3 text-sm"
                    >
                        <option value="price">Price low to high</option>
                        <option value="newest">Newest</option>
                        <option value="duration">Duration</option>
                    </select>
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
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                    {!filteredTours.length ? (
                        <p className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600 sm:col-span-2 xl:col-span-3">
                            No tour matches your current filters.
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
