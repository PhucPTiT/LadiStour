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
    name: "Amelia Carter",
    rating: 5,
    quote:
      "Every detail felt deeply personal. The Halong segment and our private guide in Hanoi were exceptional.",
  },
  {
    name: "Daniel Ng",
    rating: 5,
    quote:
      "Our Laos and Thailand itinerary was elegant, balanced, and never rushed. Truly premium execution.",
  },
  {
    name: "Giulia Romano",
    rating: 5,
    quote:
      "Beautiful hotels, seamless transfers, and warm local encounters. It felt effortless from start to finish.",
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
    <section className="bg-[radial-gradient(circle_at_20%_10%,#f3eee4_0%,#f8f7f4_40%,#f5f5f4_100%)] py-24" data-home-section>
      <div className="container px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">Testimonials</p>
          <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">Loved by Global Travelers</h2>
        </div>

        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
          <CarouselContent>
          {testimonials.map((item) => (
            <CarouselItem key={item.name} className="md:basis-1/2">
              <Card data-home-card className="lux-shadow-3d h-full rounded-[22px] border-neutral-200/80 bg-white py-0">
                <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-1 text-[#be8a39]">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">"{item.quote}"</p>
                <p className="mt-4 font-semibold text-neutral-900">{item.name}</p>
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
