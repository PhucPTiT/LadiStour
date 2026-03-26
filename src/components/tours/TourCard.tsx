import { MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tour } from "@/lib/data/tours";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/formatPrice";

type TourCardProps = {
    tour: Tour;
    className?: string;
};

export default function TourCard({ tour, className }: TourCardProps) {
    const displayPrice = tour.salePrice ?? tour.price;

    return (
        <Card
            data-home-card
            className={cn(
                "lux-shadow-3d group overflow-hidden rounded-[22px] border border-neutral-200/80 bg-white py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(15,23,42,0.2)]",
                className,
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={tour.images[0]}
                    alt={`${tour.title} landscape in ${tour.country}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700">
                    {tour.durationDays} days {tour.durationNights} nights
                </span>
                {tour.salePrice ? (
                    <span className="absolute right-4 top-4 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                        Sale
                    </span>
                ) : null}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button
                        asChild
                        className="rounded-full bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-white"
                    >
                        <Link href={`/tours/${tour.slug}`}>View Details</Link>
                    </Button>
                </div>
            </div>

            <CardContent className="space-y-3 px-5 py-5">
                <p className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                    <MapPin size={13} /> {tour.destination}, {tour.country}
                </p>
                <h3 className="font-heading text-xl leading-tight text-neutral-900">
                    {tour.title}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-neutral-500 uppercase">
                        <Tag size={13} /> {tour.typologies[0]}
                    </p>
                    <div className="text-right">
                        {tour.salePrice ? (
                            <p className="text-xs text-neutral-400 line-through">
                                {formatPrice(tour.price)}
                            </p>
                        ) : null}
                        <p className="text-lg font-semibold text-emerald-700">
                            {formatPrice(displayPrice)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
