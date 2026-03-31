"use client";

import { MapPin, Calendar, Sparkles, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { destinations, typologies } from "@/lib/data/tours";

export default function QuickSearch() {
    const [destination, setDestination] = useState("");
    const [typology, setTypology] = useState("");
    const [duration, setDuration] = useState("");
    const t = useTranslations("quickSearch");
    const query = new URLSearchParams();

    if (destination) {
        query.set("country", destination);
    }

    if (typology) {
        query.set("typology", typology);
    }

    if (duration) {
        query.set("duration", duration);
    }

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
                        <Sparkles size={14} /> Tim kiem tour
                    </span>
                    <CardTitle className="mt-4 font-heading text-3xl text-neutral-900 md:text-4xl lg:text-5xl">
                        Tim tour du lich phu hop
                    </CardTitle>
                    <CardDescription className="mt-3 text-base text-neutral-600 md:text-lg">
                        Chon diem den, loai hinh va thoi luong de he thong de
                        xuat nhung tour toi uu nhat cho ban.
                    </CardDescription>
                </CardHeader>

                <div className="space-y-4 px-4 pb-6 md:px-6 md:pb-8">
                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {/* Destination Field */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <MapPin
                                    size={14}
                                    className="text-emerald-600"
                                />
                                Diem den
                            </Label>
                            <Select
                                value={destination || "all"}
                                onValueChange={(value) =>
                                    setDestination(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue placeholder="Chon diem den" />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="all">
                                        Tat ca diem den
                                    </SelectItem>
                                    {destinations.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Typology Field */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <Sparkles
                                    size={14}
                                    className="text-emerald-600"
                                />
                                Loai hinh
                            </Label>
                            <Select
                                value={typology || "all"}
                                onValueChange={(value) =>
                                    setTypology(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue placeholder="Loai hinh tour" />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="all">
                                        Tat ca loai hinh
                                    </SelectItem>
                                    {typologies.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration Field */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 uppercase tracking-[0.12em]">
                                <Calendar
                                    size={14}
                                    className="text-emerald-600"
                                />
                                Thoi luong
                            </Label>
                            <Select
                                value={duration || "all"}
                                onValueChange={(value) =>
                                    setDuration(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className={selectFieldClass}>
                                    <SelectValue placeholder="Thoi luong" />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="all">
                                        Tat ca thoi luong
                                    </SelectItem>
                                    <SelectItem value="3-4">
                                        3-4 ngay
                                    </SelectItem>
                                    <SelectItem value="5-6">
                                        5-6 ngay
                                    </SelectItem>
                                    <SelectItem value="7+">
                                        Tu 7 ngay
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <Button
                                asChild
                                className="w-full rounded-xl bg-linear-to-r from-[#139444] to-[#ed1925] px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,122,92,0.35)] hover:from-[#0f7a37] hover:to-[#c41620] transition-all duration-300"
                            >
                                <Link
                                    href={`/tours${query.toString() ? `?${query.toString()}` : ""}`}
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
