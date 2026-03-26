"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { destinations, typologies } from "@/lib/data/tours";

export default function QuickSearch() {
    const [destination, setDestination] = useState("");
    const [typology, setTypology] = useState("");
    const query = new URLSearchParams();

    if (destination) {
        query.set("country", destination);
    }

    if (typology) {
        query.set("typology", typology);
    }

    return (
        <section
            className="container relative z-10 -mt-14 px-4"
            id="quick-search"
            data-home-section
        >
            <div className="lux-shadow-3d rounded-[26px] border border-neutral-200/80 bg-white p-5 md:p-7">
                <p className="mb-4 text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                    Quick Search
                </p>
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Select
                        value={destination || "all"}
                        onValueChange={(value) =>
                            setDestination(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="h-12 w-full rounded-xl border-neutral-300 bg-white px-3 text-sm text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                            <SelectValue placeholder="Destinations" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                            <SelectItem value="all">Destinations</SelectItem>
                            {destinations.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={typology || "all"}
                        onValueChange={(value) =>
                            setTypology(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="h-12 w-full rounded-xl border-neutral-300 bg-white px-3 text-sm text-neutral-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                            <SelectValue placeholder="Typologies" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                            <SelectItem value="all">Typologies</SelectItem>
                            {typologies.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        asChild
                        className="h-12 rounded-xl bg-emerald-700 px-6 text-sm text-white shadow-[0_10px_22px_rgba(15,122,92,0.35)] hover:bg-emerald-800"
                    >
                        <Link
                            href={`/tours${query.toString() ? `?${query.toString()}` : ""}`}
                        >
                            <Search size={16} /> Search
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
