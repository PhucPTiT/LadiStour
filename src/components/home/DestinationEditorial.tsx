import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, getTranslations } from "next-intl/server";
import { getCachedDestinationsFeatured } from "@/service/destinations/DestinationCacheService";

export default async function DestinationEditorial() {
    const t = await getTranslations("destinationEditorial");
    const locale = (await getLocale()) as "vi" | "en";

    const destinationHighlights = await getCachedDestinationsFeatured(locale);
    return (
        <section
            className="relative overflow-hidden py-24"
            id="featured-destinations"
            data-home-section
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-fixed bg-center" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0f1720]/90 via-[#0f1720]/80 to-[#0f1720]/60" />
            <div className="absolute -right-28 top-20 h-72 w-72 rounded-full bg-[#be8a39]/25 blur-3xl" />
            <div className="absolute -left-28 bottom-8 h-64 w-64 rounded-full bg-emerald-700/20 blur-3xl" />

            <div className="container relative px-4 text-white">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
                        {t("header")}
                    </p>
                    <h2 className="mt-3 font-heading text-4xl leading-tight md:text-6xl">
                        {t("description")}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-200 md:text-base">
                        {t("text")}
                    </p>
                </div>

                <div className="mt-11 grid gap-6 md:grid-cols-3">
                    {destinationHighlights.map((item) => (
                        <Link
                            href={`/destinations/${item.slug}`}
                            key={item.name}
                            className="hover:scale-105 transition-all"
                        >
                            <Card
                                key={item.name}
                                data-home-card
                                className="lux-shadow-3d overflow-hidden rounded-[22px] border-white/25 bg-white/12 py-0 text-white backdrop-blur"
                            >
                                <div className="relative aspect-4/3">
                                    <Image
                                        src={item.thumbnail}
                                        alt={`${item.name} travel inspiration`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        loading="lazy"
                                    />
                                </div>
                                <CardHeader className="pb-0">
                                    <CardTitle className="text-2xl text-white">
                                        {item.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-5 text-sm leading-relaxed text-neutral-200">
                                    {item.shortDescription}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Button
                    asChild
                    className="mt-8 rounded-full bg-secondary-happysmile px-7 py-3 text-white hover:bg-primary-happysmile"
                >
                    <Link href="/tours">{t("viewAll")}</Link>
                </Button>
            </div>
        </section>
    );
}
