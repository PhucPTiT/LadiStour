"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        name: "Pham Minh Anh",
        rating: 5,
        quote: "Gia dinh minh dat tour Ha Noi - Ha Long va rat hai long. Lich trinh vua suc, huong dan vien tan tam va xe dua don dung gio.",
    },
    {
        name: "Tran Quoc Bao",
        rating: 5,
        quote: "Cong ty tu van rat nhanh, bao gia ro rang, khong phat sinh bat ngo. Chuyen di Thai Lan cua team minh rat tron ven.",
    },
    {
        name: "Le Khanh Linh",
        rating: 5,
        quote: "Minh dat tour couple va duoc ho tro toi uu lich bay, resort, lich tham quan. Cam giac duoc cham soc rat ky.",
    },
];

export default function Testimonials() {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) {
            return;
        }

        const timer = setInterval(() => {
            api.scrollNext();
        }, 4200);

        return () => clearInterval(timer);
    }, [api]);

    return (
        <section
            className="bg-[radial-gradient(circle_at_20%_10%,#f3eee4_0%,#f8f7f4_40%,#f5f5f4_100%)] py-24"
            id="testimonials"
            data-home-section
        >
            <div className="container px-4">
                <div className="mb-10 text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        Danh Gia Tour & Cong Ty
                    </p>
                    <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                        Khach hang noi gi ve STOUR TRAVEL
                    </h2>
                </div>

                <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                        {testimonials.map((item) => (
                            <CarouselItem
                                key={item.name}
                                className="md:basis-1/2"
                            >
                                <Card
                                    data-home-card
                                    className="lux-shadow-3d h-full rounded-[22px] border-neutral-200/80 bg-white py-0"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-3 flex items-center gap-1 text-[#be8a39]">
                                            {Array.from({
                                                length: item.rating,
                                            }).map((_, idx) => (
                                                <Star
                                                    key={idx}
                                                    size={16}
                                                    fill="currentColor"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed text-neutral-600">
                                            &quot;{item.quote}&quot;
                                        </p>
                                        <p className="mt-4 font-semibold text-neutral-900">
                                            {item.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 top-[45%]" />
                    <CarouselNext className="right-2 top-[45%]" />
                </Carousel>
            </div>
        </section>
    );
}
