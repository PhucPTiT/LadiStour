import type { Metadata } from "next";
import ToursCatalog from "@/components/tours/ToursCatalog";
import { tours } from "@/lib/data/tours";

export const metadata: Metadata = {
    title: "Tours",
    description:
        "Browse luxury tours by destination, typology, duration, and budget across Vietnam, Laos, Cambodia, and Thailand.",
};

type ToursPageProps = {
    searchParams: Promise<{
        country?: string;
        typology?: string;
    }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
    const params = await searchParams;

    return (
        <ToursCatalog
            initialTours={tours}
            initialFilters={{
                country: params.country ?? "",
                typology: params.typology ?? "",
            }}
        />
    );
}
