"use client";

import { Calendar, MapPin, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getAllDestinations } from "@/service/destinations/DestinationService";
import { DestinationListResponse } from "@/service/destinations/type";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/navigation";

export default function QuickSearch() {
    const locale = useLocale();
    const [destination, setDestination] = useState("");
    const [typology, setTypology] = useState("");
    const [duration, setDuration] = useState("10");
    const [destinations, setDestinations] = useState<DestinationListResponse>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations("quickSearch");
    const tTours = useTranslations("ToursPage");

    useEffect(() => {
        const fetchDestinations = async () => {
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

        void fetchDestinations();
    }, [locale]);

    const query = useMemo(() => {
        const params = new URLSearchParams();
        if (destination) {
            params.set("country", destination);
        }

        if (typology) {
            params.set("typology", typology);
        }

        if (duration) {
            params.set("durationMax", duration);
        }

        return params.toString();
    }, [destination, typology, duration]);

    const selectFieldClass =
        "h-12 w-full rounded-xl border-neutral-300 bg-white px-4 text-sm text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0";

    const selectContentClass =
        "rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]";

    return (
        <section
            className="container relative z-10 px-4 my-16!"
            id="quick-search"
            data-home-section
        >
            <Card className="lux-shadow-3d border-neutral-200/80 bg-linear-to-br from-white to-neutral-50">
                <CardHeader className="pb-4">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-[0.12em]">
                        <Sparkles size={14} />
                        {t("badge")}
                    </span>
                    <CardTitle className="mt-4 font-heading text-3xl text-neutral-900 md:text-4xl lg:text-5xl">
                        {t("title")}
                    </CardTitle>
                    <CardDescription className="mt-3 text-base text-neutral-600 md:text-lg">
                        {t("description")}
                    </CardDescription>
                </CardHeader>

                <div className="space-y-4 px-4 pb-6 md:px-6 md:pb-8">
                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <MapPin
                                    size={14}
                                    className="text-emerald-600"
                                />
                                {tTours("destination")}
                            </Label>
                            <Select
                                value={destination || "all"}
                                onValueChange={(value) =>
                                    setDestination(value === "all" ? "" : value)
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue
                                        placeholder={tTours("allCountries")}
                                    />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="all">
                                        {tTours("all")}
                                    </SelectItem>
                                    {destinations.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <Sparkles
                                    size={14}
                                    className="text-emerald-600"
                                />
                                {tTours("typology")}
                            </Label>
                            <Select
                                value={typology || "all"}
                                onValueChange={(value) =>
                                    setTypology(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue
                                        placeholder={tTours("allTypologies")}
                                    />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="all">
                                        {tTours("all")}
                                    </SelectItem>
                                    <SelectItem value="featured">
                                        {tTours("featured")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <Calendar
                                    size={14}
                                    className="text-emerald-600"
                                />
                                {t("duration")}
                            </Label>
                            <Select
                                value={duration}
                                onValueChange={setDuration}
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="5">
                                        {t("duration5")}
                                    </SelectItem>
                                    <SelectItem value="7">
                                        {t("duration7")}
                                    </SelectItem>
                                    <SelectItem value="10">
                                        {t("duration10")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                asChild
                                className="w-full rounded-xl bg-linear-to-r from-[#139444] to-[#ed1925] px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,122,92,0.35)] transition-all duration-300 hover:from-[#0f7a37] hover:to-[#c41620]"
                            >
                                <Link
                                    href={`/tours${query ? `?${query}` : ""}`}
                                    className="inline-flex items-center justify-center gap-2"
                                >
                                    <Search size={16} />
                                    {t("searchNow")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
}
