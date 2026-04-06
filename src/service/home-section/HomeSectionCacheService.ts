import HttpService from "@/config/http-service ";
import { cacheTag } from "next/cache";
import { HOME } from "@/const/endpoint";
import { validateSchema } from "../Service";
import { getServerToken } from "@/config/cookies";
import { SignatureExperiencesResponse, SignatureExperiencesResponseSchema } from "./type";

async function fetchServiceHighlightSections(token: string) {
    "use cache";

    cacheTag("service-highlight-sections");

    const API = HttpService.getInstance(undefined, token);
    const response = await API.get<SignatureExperiencesResponse>(HOME.GET_SERVICES_HIGHLIGHT, null, {
        next: { revalidate: 1200, tags: ["service-highlight-sections"] },
    });

    return validateSchema(response, SignatureExperiencesResponseSchema, "HomeSectionCacheService.GetServiceHighlightSections");
}

export async function getCachedServiceHighlightSections() {
    try {
        const token = await getServerToken();
        return await fetchServiceHighlightSections(token);
    } catch (error) {
        console.error("Failed to get service highlight sections:", error);
        throw error;
    }
}