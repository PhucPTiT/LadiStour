import TourCard from "@/components/tours/TourCard";
import { getCachedToursFeatured } from "@/service/tour/TourCacheService";
import { getLocale, getTranslations } from "next-intl/server";

export default async function TrendingTours() {
    const locale = (await getLocale()) as "vi" | "en";
    const tours = await getCachedToursFeatured(locale);
    const t = await getTranslations("TrendingTours");

    return (
        <section
            id="featured-tours"
            className="container px-4 py-24"
            data-home-section
        >
            <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        {t("header")}
                    </p>
                    <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                        {t("description")}
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
