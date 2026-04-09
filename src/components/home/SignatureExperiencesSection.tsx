import { Compass, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedServiceHighlightSections } from "@/service/home-section/HomeSectionCacheService";
import { getLocale } from "next-intl/server";

const ICON_MAP = {
    Compass,
    Gem,
    ShieldCheck,
    Sparkles,
} as const;

type IconKey = keyof typeof ICON_MAP;

export default async function SignatureExperiencesSection() {
    const locale = (await getLocale()) as "vi" | "en";

    const serviceHighlight = await getCachedServiceHighlightSections();

    const items =
        serviceHighlight?.items
            ?.filter((item) => item.active)
            .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

    return (
        <section className="py-24" id="service-highlights" data-home-section>
            <div className="container px-4">
                <div className="lux-shadow-3d rounded-[30px] border border-neutral-200/80 bg-white p-6 md:p-10">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        {serviceHighlight?.eyebrow?.[locale] ||
                            "Dịch vụ cung cấp"}
                    </p>

                    <h2 className="mt-3 max-w-4xl font-heading text-4xl text-neutral-900 md:text-6xl">
                        {serviceHighlight?.title?.[locale] ||
                            "Giải pháp tour trọn gói cho từng nhu cầu"}
                    </h2>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
                        {serviceHighlight?.description?.[locale] ||
                            "Chúng tôi cung cấp giải pháp du lịch trọn gói, giúp bạn dễ dàng đặt tour và an tâm trong mọi hành trình."}
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        {items.map((item) => {
                            const Icon =
                                ICON_MAP[item.icon as IconKey] ?? Compass;

                            return (
                                <Card
                                    key={`${item.icon}-${item.sortOrder}`}
                                    data-home-card
                                    className="lux-shadow rounded-2xl border-neutral-200/80 bg-neutral-50 py-0"
                                >
                                    <CardHeader className="pb-0">
                                        <CardTitle className="flex items-center gap-2 text-2xl text-neutral-900">
                                            <Icon className="size-5 text-primary-happysmile" />
                                            {item.title[locale]}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pb-5 text-sm leading-relaxed text-neutral-600">
                                        {item.text[locale]}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
