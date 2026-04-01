import HttpService from "@/config/http-service ";
import { DestinationListResponse, DestinationListResponseSchema, GetTranslationsResponse } from "./type";
import { DESTINATIONS } from "@/const/endpoint";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function getAllDestinations(): Promise<DestinationListResponse> {
    try {
        const response = await API.get<DestinationListResponse>(DESTINATIONS.GET_ALL);

        console.log(response);

        const validatedData = validateSchema(
            response,
            DestinationListResponseSchema,
            "DestinationService.GetAll"
        );

        return validatedData;
    } catch (error) {
        console.error("Failed to fetch destinations:", error);
        throw error;
    }
}

export async function deleteDestination(id: string): Promise<void> {
    try {
        await API.delete(`${DESTINATIONS.DELETE}/${id}`);
    } catch (error) {
        console.error(`Failed to delete destination with id ${id}:`, error);
        throw error;
    }
}

export async function createMultiLanguageDestinations(data: unknown): Promise<void> {
    try {
        await API.post(DESTINATIONS.CREATE_MULTI_LANGUAGE, data);
    } catch (error) {
        console.error("Failed to create multi-language destinations:", error);
        throw error;
    }
}

export async function getTranslations(translationGroupId: string): Promise<GetTranslationsResponse> {
    try {
        const response = await API.get<GetTranslationsResponse>(
            DESTINATIONS.GET_TRANSLATIONS.replace(":translationGroupId", translationGroupId)
        );
        const validatedData = validateSchema(
            response,
            DestinationListResponseSchema,
            "DestinationService.GetTranslations"
        );
        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch translations for group ${translationGroupId}:`, error);
        throw error;
    }
}

export async function updateMultiLanguageDestinations(id: string, data: unknown): Promise<void> {
    try {
        await API.put(`${DESTINATIONS.UPDATE_MULTI_LANGUAGE}/${id}`, data);
    } catch (error) {
        console.error(`Failed to update multi-language destinations with id ${id}:`, error);
        throw error;
    }
}
