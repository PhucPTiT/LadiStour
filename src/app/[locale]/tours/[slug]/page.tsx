import { getLocale } from "next-intl/server";
import { getCachedTourBySlug } from "@/service/tour/TourCacheService";
import TourDetailContent from "@/components/tours/TourDetailContent";
import { notFound } from "next/navigation";

type TourDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function TourDetailPage({ params }: TourDetailPageProps) {
    const { slug } = await params;
    const locale = (await getLocale()) as "vi" | "en";
    const tour = await getCachedTourBySlug(locale, slug);

    if (!tour) {
        notFound();
    }

    return <TourDetailContent tour={tour} />;
}
