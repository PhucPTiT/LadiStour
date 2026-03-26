"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const packages = [
    {
        name: "Half Board",
        price: "$1,090",
        desc: "Elegant stays, daily breakfast, and selected dinners for balanced flexibility.",
    },
    {
        name: "All Inclusive",
        price: "$1,690",
        desc: "Premium accommodation, curated dining, and private transfers throughout your trip.",
    },
    {
        name: "Excursions Included",
        price: "$1,390",
        desc: "Best for explorers seeking guided cultural highlights with polished logistics.",
    },
];

export default function PricingPackages() {
    return (
        <section
            id="pricing-packages"
            className="container px-4 py-24"
            data-home-section
        >
            <div className="mb-10 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                    Pricing Packages
                </p>
                <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                    Flexible Luxury Plans
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {packages.map((item) => (
                    <div key={item.name} data-home-card>
                        <Card className="lux-shadow-3d rounded-[24px] border border-neutral-200/80 bg-white py-0 text-center">
                            <CardContent className="p-6">
                                <p className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                                    {item.name}
                                </p>
                                <p className="mt-4 font-heading text-5xl text-emerald-700">
                                    {item.price}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                                    {item.desc}
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6 rounded-full border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:border-emerald-700 hover:text-emerald-700"
                                >
                                    Choose Package
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </section>
    );
}
