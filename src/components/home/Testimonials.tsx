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
import { getAllReviews } from "@/service/reviews/ReviewService";
import { ReviewList } from "@/service/reviews/type";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
    const t = useTranslations("testimonials");

    const [reviews, setReviews] = useState<ReviewList>([]);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;

        const timer = setInterval(() => {
            api.scrollNext();
        }, 4200);

        return () => clearInterval(timer);
    }, [api]);

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await getAllReviews();
            setReviews(response);
        };

        fetchReviews();
    }, []);

    return (
        <section
            className="bg-[radial-gradient(circle_at_20%_10%,#f3eee4_0%,#f8f7f4_40%,#f5f5f4_100%)] py-24"
            id="testimonials"
            data-home-section
        >
            <div className="container px-4">
                <div className="mb-10 text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        {t("header")}
                    </p>
                    <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                        {t("description")}
                    </h2>
                </div>

                <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                        {reviews.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="md:basis-1/2"
                            >
                                <Card
                                    data-home-card
                                    className="lux-shadow-3d h-full rounded-[22px] border-red-200/80 bg-white py-0"
                                >
                                    <CardContent className="p-6 border-red-200/80">
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
                                            &quot;{item.comment}&quot;
                                        </p>

                                        <div className="mt-5 flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-neutral-200">
                                                <AvatarImage
                                                    src={
                                                        item.authorAvatar ?? ""
                                                    }
                                                    alt={item.authorName}
                                                />
                                                <AvatarFallback>
                                                    {item.authorName
                                                        ?.split(" ")
                                                        .slice(0, 2)
                                                        .map((w) => w[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <p className="font-semibold text-neutral-900">
                                                    {item.authorName}
                                                </p>
                                            </div>
                                        </div>
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
