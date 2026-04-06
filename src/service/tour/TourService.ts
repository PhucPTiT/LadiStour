import HttpService from "@/config/http-service ";
import { TOURS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import { TourList, TourListSchema } from "./type";

const API = HttpService.getInstance();

export async function getAllTour(): Promise<TourList> {
    try {
        const response = await API.get<TourList>(TOURS.GET_ALL);

        const validatedData = validateSchema(
            response,
            TourListSchema,
            "TourService.GetAll"
        );

        return validatedData;
    } catch (error) {
        console.error("Failed to fetch tours:", error);
        throw error;
    }
}


export async function deleteTour(id: string): Promise<void> {
    try {
        await API.delete(`${TOURS.DELETE}/${id}`);
    } catch (error) {
        console.error(`Failed to delete tour with id ${id}:`, error);
        throw error;
    }
}

export async function createMultiLanguageTour(data: unknown): Promise<void> {
    try {
        await API.post(TOURS.CREATE_MULTI_LANGUAGE, data);
    } catch (error) {
        console.error("Failed to create multi-language tours:", error);
        throw error;
    }
}


export async function getTourTranslations(translationGroupId: string): Promise<TourList> {
    try {
        const response = await API.get<TourList>(
            TOURS.GET_TRANSLATIONS.replace(":translationGroupId", translationGroupId)
        );
        const validatedData = validateSchema(
            response,
            TourListSchema,
            "TourService.GetTranslations"
        );
        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch translations for group ${translationGroupId}:`, error);
        throw error;
    }
}


export async function updateMultiLanguageTours(id: string, data: unknown): Promise<void> {
    try {
        await API.put(`${TOURS.UPDATE_MULTI_LANGUAGE}/${id}`, data);
    } catch (error) {
        console.error(`Failed to update multi-language tours with id ${id}:`, error);
        throw error;
    }
}



export async function getFeaturedPublishedTours(locale: string): Promise<TourList> {
    try {
        const response = await API.get<TourList>(
            TOURS.GET_FEATURED_PUBLISHED + `?locale=${locale}`
        );
        const validatedData = validateSchema(
            response,
            TourListSchema,
            "TourService.GetFeaturedPublishedTours"
        );
        return validatedData;
    } catch (error) {
        console.error("Failed to fetch featured published tours:", error);
        throw error;
    }
}