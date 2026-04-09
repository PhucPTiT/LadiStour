"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { getHeroSections } from "@/service/home-section/HomeSectionService";
import { HeroSliderResponse } from "@/service/home-section/type";

function HeroSliderSkeleton() {
    return (
        <section
            className="relative"
            id="hero-promotions"
            data-home-section
            data-home-static
        >
            <div className="relative h-[72vh] min-h-135 w-full overflow-hidden">
                <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/10" />

                <div className="container relative flex h-full items-end px-4 pb-24">
                    <div className="max-w-3xl text-white">
                        <div className="mb-4 h-7 w-44 rounded-full bg-white/20 animate-pulse" />

                        <div className="h-12 w-[80%] rounded-lg bg-white/20 animate-pulse md:h-16" />
                        <div className="mt-3 h-12 w-[65%] rounded-lg bg-white/20 animate-pulse md:h-16" />

                        <div className="mt-6 space-y-3">
                            <div className="h-4 w-[90%] rounded bg-white/15 animate-pulse" />
                            <div className="h-4 w-[75%] rounded bg-white/15 animate-pulse" />
                        </div>

                        <div className="mt-8 h-11 w-48 rounded-full bg-white/20 animate-pulse" />
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-2.5 w-2.5 rounded-full bg-white/30 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function HeroSlider() {
    const locale = useLocale() as "vi" | "en";

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [data, setData] = useState<HeroSliderResponse | null>(null);

    // fetch data
    useEffect(() => {
        const fetchHeroSections = async () => {
            const response = await getHeroSections();
            setData(response);
        };

        fetchHeroSections();
    }, []);

    // autoplay + indicator
    useEffect(() => {
        if (!api || !data) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        onSelect();
        api.on("select", onSelect);

        let timer: NodeJS.Timeout | null = null;

        if (data.autoPlay) {
            timer = setInterval(() => {
                api.scrollNext();
            }, data.autoPlayDelayMs || 5200);
        }

        return () => {
            api.off("select", onSelect);
            if (timer) clearInterval(timer);
        };
    }, [api, data]);

    if (!data) return <HeroSliderSkeleton />;

    const slides = data.slides
        .filter((s) => s.active)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <section
            className="relative"
            id="hero-promotions"
            data-home-section
            data-home-static
        >
            <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: true }}
                className="hero-swiper"
            >
                <CarouselContent className="ml-0">
                    {slides.map((slide, index) => (
                        <CarouselItem key={slide.href + index} className="pl-0">
                            <div className="relative h-[72vh] min-h-135 w-full">
                                <Image
                                    src={slide.image}
                                    alt={`Luxury destination showcase: ${slide.title[locale]}`}
                                    fill
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 100vw"
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/10" />

                                <div className="container relative flex h-full items-end px-4 pb-24">
                                    <div className="max-w-3xl text-white">
                                        <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur md:text-sm">
                                            {slide.label[locale]}
                                        </p>

                                        <h1 className="font-heading text-4xl leading-tight md:text-6xl">
                                            {slide.title[locale]}
                                        </h1>

                                        <p className="mt-4 max-w-2xl text-sm text-neutral-100 md:text-lg">
                                            {slide.subtitle[locale]}
                                        </p>

                                        <Button
                                            asChild
                                            className="mt-8 rounded-full bg-secondary-happysmile px-7 py-3 text-sm text-white hover:bg-primary-happysmile!"
                                        >
                                            <Link href={slide.href}>
                                                {slide.cta[locale]}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
                {slides.map((slide, index) => (
                    <button
                        key={slide.href + index}
                        type="button"
                        onClick={() => api?.scrollTo(index)}
                        className={`h-2.5 rounded-full transition-all ${
                            current === index
                                ? "w-8 bg-white"
                                : "w-2.5 bg-white/55"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
