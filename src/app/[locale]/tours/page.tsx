import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ToursCatalogClient from "@/components/tours/ToursCatalogClient";
import { getCachedAllTours } from "@/service/tour/TourCacheService";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("ToursPage");
    return {
        title: t("title"),
        description: t("description"),
    };
}

type ToursPageProps = {
    searchParams: Promise<{
        country?: string;
        typology?: string;
        durationMax?: string;
    }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
    const params = await searchParams;
    const locale = (await getLocale()) as "vi" | "en";
    const tours = await getCachedAllTours(locale);

    if (!tours) {
        notFound();
    }

    return (
        <ToursCatalogClient
            tours={tours}
            initialFilters={{
                country: params.country ?? "",
                typology: params.typology ?? "",
                durationMax: params.durationMax
                    ? Number(params.durationMax)
                    : undefined,
            }}
        />
    );
}
