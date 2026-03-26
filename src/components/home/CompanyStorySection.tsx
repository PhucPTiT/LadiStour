import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyStorySection() {
    return (
        <section
            className="relative overflow-hidden bg-[#f6f4ef] py-24"
            data-home-section
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(190,138,57,0.15),transparent_42%)]" />
            <div className="container grid items-center gap-10 px-4 lg:grid-cols-[1.2fr_1fr]">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        Our Company
                    </p>
                    <h2 className="mt-3 font-heading text-4xl text-neutral-900 md:text-6xl">
                        A Southeast Asia Team With On-Ground Precision
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-neutral-700 md:text-base">
                        STOUR LUXE was built by travel designers and operations
                        specialists who have spent years working directly with
                        hotels, guides, and private transport partners across
                        Vietnam, Laos, Cambodia, and Thailand. Our process
                        combines strategic route planning with concierge-level
                        detail so every journey feels fluid from the first
                        inquiry to the final airport transfer.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
                        We prioritize authentic local partnerships, sustainable
                        pacing, and experiences that match your preferred
                        energy: wellness-focused retreat, design-forward city
                        break, multi-generational family itinerary, or an
                        elevated honeymoon route. The result is a travel
                        narrative that is stylish, grounded, and deeply
                        personal.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    12+
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Years regional experience
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    24/7
                                </p>
                                <p className="text-sm text-neutral-600">
                                    On-trip support
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    4
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Core destination countries
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lux-shadow-3d relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/60">
                    <Image
                        src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80"
                        alt="Company team planning premium travel routes"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    <p className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 px-4 py-3 text-sm text-neutral-700 backdrop-blur">
                        Every itinerary is reviewed by both our travel design
                        lead and operations concierge to ensure beauty and
                        reliability in equal measure.
                    </p>
                </div>
            </div>
        </section>
    );
}
