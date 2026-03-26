import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetailContent from "@/components/tours/TourDetailContent";
import { tours } from "@/lib/data/tours";

type TourDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((item) => item.slug === slug);

  if (!tour) {
    return {
      title: "Tour not found",
      description: "The selected tour was not found.",
    };
  }

  return {
    title: `${tour.destination} Luxury Tour`,
    description: tour.description,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const tour = tours.find((item) => item.slug === slug);

  if (!tour) {
    notFound();
  }

  return <TourDetailContent tour={tour} />;
}
