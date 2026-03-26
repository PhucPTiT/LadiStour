"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type TourGalleryProps = {
  title: string;
  images: string[];
};

export default function TourGallery({ title, images }: TourGalleryProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-200">
      <Carousel opts={{ align: "start", loop: true }} className="tour-detail-gallery">
        <CarouselContent className="-ml-0">
        {images.map((image, index) => (
          <CarouselItem key={image} className="pl-0">
            <div className="relative aspect-[16/9]">
              <Image
                src={image}
                alt={`${title} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 border-white/40 bg-black/30 text-white hover:bg-black/50" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 border-white/40 bg-black/30 text-white hover:bg-black/50" />
      </Carousel>
    </div>
  );
}
