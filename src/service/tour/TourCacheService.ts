import { getServerToken } from "@/config/cookies";
import { cacheTag } from "next/cache";
import { TOURS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import HttpService from "@/config/http-service ";
import { TourList, TourListSchema, TourSchemaWithDestination, TourWithDestination } from "./type";
import z from "zod";

async function fetchTour(token: string, locale: "vi" | "en") {
    "use cache";

    cacheTag("tours-featured", locale);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<TourWithDestination[]>(TOURS.GET_FEATURED, { locale }, {
        next: { revalidate: 1200, tags: ["tours-featured", locale] }, // cache 20 phút
    });

    return validateSchema(
        response,
        z.array(TourSchemaWithDestination),
        "TourService.GetToursCached"
    );
}

export async function getCachedToursFeatured(locale: "vi" | "en") {
    try {
        const token = await getServerToken();
        return await fetchTour(token, locale);
    } catch (error) {
        console.error("Failed to get tours:", error);
        throw error;
    }
}


async function fetchTourByDestinationId(token: string, locale: "vi" | "en", destinationId: string) {
    "use cache";

    cacheTag("tours-featured", locale, destinationId);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<TourList>(TOURS.GET_BY_DESTINATION + `/${destinationId}`, { locale }, {
        next: { revalidate: 1200, tags: ["tours-featured", locale, destinationId] },
    });


    return validateSchema(
        response,
        TourListSchema,
        "TourService.GetToursByDestinationIdCached"
    );
}

export async function getCachedToursByDestinationId(locale: "vi" | "en", destinationId: string) {
    try {
        const token = await getServerToken();
        return await fetchTourByDestinationId(token, locale, destinationId);
    } catch (error) {
        console.error("Failed to get tours by destination ID:", error);
        throw error;
    }
}

async function fetchAllTours(token: string, locale: "vi" | "en") {
    "use cache";

    const tag = `tours-all-${locale}`;

    cacheTag(tag);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<TourList>(
        `${TOURS.GET_ALL}?locale=${locale}`,
        undefined,
        {
            next: { revalidate: 1200, tags: [tag] },
        }
    );

    return validateSchema(
        response,
        TourListSchema,
        "TourService.GetAllTours"
    );
}

export async function getCachedAllTours(locale: "vi" | "en") {
    try {
        const token = await getServerToken();
        return await fetchAllTours(token, locale);
    } catch (error) {
        console.error("Failed to get all tours:", error);
        throw error;
    }
}

async function fetchTourBySlug(token: string, locale: "vi" | "en", slug: string): Promise<TourWithDestination> {
    "use cache";

    const tag = `tours-${slug}-${locale}`;

    cacheTag(tag);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<TourWithDestination>(
        `${TOURS.GET_BY_SLUG}/${slug}`,
        { locale },
        {
            next: { revalidate: 1200, tags: [tag] },
        }
    );

    return validateSchema(
        response,
        TourSchemaWithDestination,
        "TourService.GetTourBySlug"
    );
}

export async function getCachedTourBySlug(locale: "vi" | "en", slug: string) {
    try {
        const token = await getServerToken();
        return await fetchTourBySlug(token, locale, slug);
    } catch (error) {
        console.error("Failed to get tour by slug:", error);
        throw error;
    }
}
