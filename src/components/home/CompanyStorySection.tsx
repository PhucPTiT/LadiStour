import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCachedSettings } from "@/service/settings/SettingCacheService";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CompanyStorySection() {
    const settings = await getCachedSettings();
    const t = await getTranslations("CompanyStorySection");
    const locale = await getLocale();
    const { intro } = settings;

    return (
        <section
            className="relative overflow-hidden bg-[#f6f4ef] py-24"
            id="company-story"
            data-home-section
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(190,138,57,0.15),transparent_42%)]" />
            <div className="container grid items-center gap-10 px-4 lg:grid-cols-[1.2fr_1fr]">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        {t("intro")}
                    </p>
                    <h2 className="mt-3 font-heading text-4xl text-neutral-900 md:text-6xl">
                        {t("header")}
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-neutral-700 md:text-base">
                        {locale === "vi" ? intro?.vi : intro?.en}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-primary-happysmile">
                                    ~20
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {t("year")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-primary-happysmile">
                                    24/7
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {t("support")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-primary-happysmile">
                                    4
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {t("countries")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lux-shadow-3d relative min-h-130 overflow-hidden rounded-[28px] border border-white/60">
                    <Image
                        src="/images/ceo.webp"
                        alt="Company team planning premium travel routes"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                    <p className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 px-4 py-3 text-sm text-neutral-700 backdrop-blur">
                        {t("ceoCaption")}
                    </p>
                </div>
            </div>
        </section>
    );
}
