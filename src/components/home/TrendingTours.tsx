"use client";

import TourCard from "@/components/tours/TourCard";
import { Tour } from "@/lib/data/tours";

type TrendingToursProps = {
    tours: Tour[];
};

export default function TrendingTours({ tours }: TrendingToursProps) {
    return (
        <section
            id="trending-tours"
            className="container px-4 py-24"
            data-home-section
        >
            <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        Trending Tours
                    </p>
                    <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                        Journeys Travelers Love
                    </h2>
                </div>
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                    <div key={tour.id} data-home-card>
                        <TourCard tour={tour} />
                    </div>
                ))}
            </div>
        </section>
    );
}
