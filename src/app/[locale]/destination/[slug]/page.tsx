import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { MapPin, Compass } from "lucide-react";
import { getCachedDestinationsBySlug } from "@/service/destinations/DestinationCacheService";
import { getCachedToursByDestinationId } from "@/service/tour/TourCacheService";
import TourCard from "@/components/tours/TourCard";

export default async function DestinationDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = (await getLocale()) as "vi" | "en";
    const t = await getTranslations("DestinationDetailPage");

    const destination = await getCachedDestinationsBySlug(locale, slug);

    if (!destination) {
        notFound();
    }

    const tours = await getCachedToursByDestinationId(locale, destination.id);

    return (
        <div className="w-full">
            {/* ── Hero Banner ── */}
            <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden md:h-[55vh] sm:h-[45vh]">
                <Image
                    src={destination.banner}
                    alt={destination.name}
                    fill
                    className="object-cover scale-105 transition-transform duration-[8000ms] ease-out"
                    priority
                />

                {/* Gradient overlay: trong suốt phía trên, tối dần xuống dưới */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Hero content — căn dưới bên trái */}
                <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 md:px-6 sm:px-4">
                    <div className="container mx-auto max-w-5xl">
                        {/* Location badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                            <MapPin size={14} className="text-white/80" />
                            <span className="text-sm font-medium tracking-wide text-white/90">
                                {destination.location.city},{" "}
                                {destination.location.country}
                            </span>
                        </div>

                        {/* Destination name */}
                        <h1 className="font-heading text-6xl font-bold leading-none text-white drop-shadow-2xl md:text-5xl sm:text-4xl">
                            {destination.name}
                        </h1>

                        {/* Short description */}
                        {destination.shortDescription && (
                            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85 drop-shadow md:text-base sm:text-sm">
                                {destination.shortDescription}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── About Section ── */}
            <section className="container mx-auto max-w-5xl px-8 py-16 md:px-6 md:py-12 sm:px-4">
                <div className="flex items-start gap-12 md:flex-col md:gap-8">
                    {/* Left: decorative label */}
                    <div className="flex-shrink-0 pt-1">
                        <div className="flex items-center gap-2 text-primary">
                            <Compass size={18} />
                            <span className="text-sm font-semibold uppercase tracking-widest">
                                {t("about")}
                            </span>
                        </div>
                        <div className="mt-3 h-px w-16 bg-primary/40" />
                    </div>

                    {/* Right: description */}
                    <p className="flex-1 text-lg leading-relaxed text-neutral-700 md:text-base">
                        {destination.description}
                    </p>
                </div>
            </section>

            {/* ── Tours Section ── */}
            {tours && tours.length > 0 && (
                <section className="border-t border-neutral-200 bg-neutral-50 py-16 md:py-12">
                    <div className="container mx-auto max-w-6xl px-8 md:px-6 sm:px-4">
                        <div className="mb-10">
                            <h2 className="font-heading text-4xl font-bold text-neutral-900 md:text-3xl">
                                {t("tours")}
                            </h2>
                            <p className="mt-2 max-w-2xl text-lg text-neutral-600">
                                {t("toursDescription")}
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {tours.map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
