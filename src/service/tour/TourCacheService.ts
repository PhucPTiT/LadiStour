import { getServerToken } from "@/config/cookies";
import { cacheTag } from "next/cache";
import { TOURS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import HttpService from "@/config/http-service ";
import { TourSchemaWithDestination, TourWithDestination } from "./type";
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
