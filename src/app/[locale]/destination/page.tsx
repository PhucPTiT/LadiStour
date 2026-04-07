import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCachedDestinations } from "@/service/destinations/DestinationCacheService";
import { getLocale, getTranslations } from "next-intl/server";

export default async function DestinationPage() {
    const locale = (await getLocale()) as "vi" | "en";
    const destinations = await getCachedDestinations(locale);
    const t = await getTranslations("DestinationPage");

    return (
        <section className="container px-4 py-12">
            <h1 className="font-heading text-5xl text-neutral-900">
                {t("header")}
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-600">
                {t("description")}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {destinations.map((destination) => (
                    <article
                        key={destination.id}
                        className="group overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_10px_25px_rgba(17,24,39,0.08)]"
                    >
                        <div className="relative aspect-16/11 overflow-hidden">
                            <Image
                                src={destination.thumbnail}
                                alt={`Cover image for ${destination.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>

                        <div className="p-5">
                            <h2 className="font-heading text-2xl text-neutral-900">
                                {destination.name}
                            </h2>

                            <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                                {destination.shortDescription}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="mt-4 inline-flex items-center gap-2 text-xs text-neutral-500">
                                    <MapPin size={13} />
                                    <span>
                                        {destination.location.city},{" "}
                                        {destination.location.country}
                                    </span>
                                </div>

                                <Link
                                    href={`/${locale}/destination/${destination.slug}`}
                                    className="mt-4 inline-flex text-sm font-semibold text-emerald-700! text-right!"
                                >
                                    {t("viewDetails")}
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
