"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
    {
        title: "He Mua He 2026 - Giam Den 25% Tour Dong Nam A",
        subtitle:
            "Dat som de giu gia tot, lich dep va uu dai xe dua don san bay mien phi cho nhom tu 4 khach.",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
        href: "/tours?country=Vietnam",
        label: "Khuyen mai hot",
        cta: "Xem tour Viet Nam",
    },
    {
        title: "Combo Bien Dao & Nghi Duong - Dat 3 Tra 2",
        subtitle:
            "Phu hop cap doi va gia dinh: resort 4-5 sao, lich trinh nhe nhang, da bao gom bua toi ngoai bien.",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80",
        href: "/tours?typology=Honeymoon",
        label: "Uu dai theo mua",
        cta: "Nhan uu dai ngay",
    },
    {
        title: "Tour Rieng Theo Nhom - Tu Van Lo Trinh Trong 24h",
        subtitle:
            "De xuat nhanh hanh trinh theo ngan sach va muc tieu chuyen di cua ban: nghi duong, gia dinh, team building.",
        image: "https://images.unsplash.com/photo-1596534766419-6f8fe5f782c1?auto=format&fit=crop&w=1920&q=80",
        href: "/#booking-cta",
        label: "Dich vu thiet ke tour",
        cta: "Dat lich tu van",
    },
];

export default function HeroSlider() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        onSelect();
        api.on("select", onSelect);

        const timer = setInterval(() => {
            api.scrollNext();
        }, 5200);

        return () => {
            api.off("select", onSelect);
            clearInterval(timer);
        };
    }, [api]);

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
                        <CarouselItem key={slide.title} className="pl-0">
                            <div className="relative h-[72vh] min-h-135 w-full">
                                <Image
                                    src={slide.image}
                                    alt={`Luxury destination showcase: ${slide.title}`}
                                    fill
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 100vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/10" />
                                <div className="container relative flex h-full items-end px-4 pb-24">
                                    <div className="max-w-3xl text-white">
                                        <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur md:text-sm">
                                            {slide.label}
                                        </p>
                                        <h1 className="font-heading text-4xl leading-tight md:text-6xl">
                                            {slide.title}
                                        </h1>
                                        <p className="mt-4 max-w-2xl text-sm text-neutral-100 md:text-lg">
                                            {slide.subtitle}
                                        </p>
                                        <Button
                                            asChild
                                            className="mt-8 rounded-full bg-[#be8a39] px-7 py-3 text-sm text-white hover:bg-[#a87932]"
                                        >
                                            <Link href={slide.href}>
                                                {slide.cta}
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
                        key={slide.title}
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
