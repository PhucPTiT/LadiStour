import HttpService from "@/config/http-service ";
import { cacheTag } from "next/cache";
import { DestinationResponse, DestinationResponseSchema } from "./type";
import { DESTINATIONS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import z from "zod";
import { getServerToken } from "@/config/cookies";

async function fetchDestinationsFeatured(token: string, locale: "vi" | "en") {
    "use cache";

    const tag = `destinations-featured-${locale}`;

    cacheTag(tag);

    const API = HttpService.getInstance(undefined, token);



    const response = await API.get<DestinationResponse[]>(
        `${DESTINATIONS.GET_FEATURED}?locale=${locale}`,
        undefined,
        {
            next: { revalidate: 1200, tags: [tag] }, // cache 20 phút theo locale
        }
    );

    return validateSchema(
        response,
        z.array(DestinationResponseSchema),
        "DestinationService.GetDestinationsFeatured"
    );
}

export async function getCachedDestinationsFeatured(locale: "vi" | "en") {
    try {
        const token = await getServerToken();
        return await fetchDestinationsFeatured(token, locale);
    } catch (error) {
        console.error("Failed to get destinations:", error);
        throw error;
    }
}



async function fetchDestinations(token: string, locale: "vi" | "en") {
    "use cache";

    const tag = `destinations-featured-${locale}`;

    cacheTag(tag);

    const API = HttpService.getInstance(undefined, token);



    const response = await API.get<DestinationResponse[]>(
        `${DESTINATIONS.GET_ALL}?locale=${locale}`,
        undefined,
        {
            next: { revalidate: 1200, tags: [tag] },
        }
    );

    return validateSchema(
        response,
        z.array(DestinationResponseSchema),
        "DestinationService.GetDestinations"
    );
}

export async function getCachedDestinations(locale: "vi" | "en") {
    try {
        const token = await getServerToken();
        return await fetchDestinations(token, locale);
    } catch (error) {
        console.error("Failed to get destinations:", error);
        throw error;
    }
}


async function fetchDestinationsBySlug(token: string, locale: "vi" | "en", slug: string) {
    "use cache";

    const tag = `destinations-${slug}-${locale}`;

    cacheTag(tag);

    const API = HttpService.getInstance(undefined, token);



    const response = await API.get<DestinationResponse>(
        `${DESTINATIONS.GET_BY_SLUG}/${slug}`,
        { locale },
        {
            next: { revalidate: 1200, tags: [tag] },
        }
    );

    return validateSchema(
        response,
        DestinationResponseSchema,
        "DestinationService.GetDestinationsBySlug"
    );
}

export async function getCachedDestinationsBySlug(locale: "vi" | "en", slug: string) {
    try {
        const token = await getServerToken();
        return await fetchDestinationsBySlug(token, locale, slug);
    } catch (error) {
        console.error("Failed to get destination by slug:", error);
        throw error;
    }
}


