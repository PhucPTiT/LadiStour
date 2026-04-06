import HttpService from "@/config/http-service ";
import { HOME } from "@/const/endpoint";
import { HeroSliderPayload, HeroSliderResponse, HeroSliderResponseSchema, SignatureExperiences, SignatureExperiencesResponse, SignatureExperiencesResponseSchema } from "./type";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function updateHeroSections(data: HeroSliderPayload): Promise<void> {
    try {
        await API.put(HOME.UPDATE_HERO, data);
    } catch (error) {
        console.error("Failed to update hero sections:", error);
        throw error;
    }
}

export async function getHeroSections(): Promise<HeroSliderResponse> {
    try {
        const response = await API.get<HeroSliderResponse>(HOME.GET_HERO);
        const validateData = validateSchema(
            response,
            HeroSliderResponseSchema,
            "HomeSectionService.GetHeroSections"
        )
        return validateData;
    } catch (error) {
        console.error("Failed to get hero sections:", error);
        throw error;
    }
}


export async function getServiceHighlightSections(): Promise<SignatureExperiencesResponse> {
    try {
        const response = await API.get<SignatureExperiencesResponse>(HOME.GET_SERVICES_HIGHLIGHT);
        const validateData = validateSchema(
            response,
            SignatureExperiencesResponseSchema,
            "HomeSectionService.GetServiceHighlightSections"
        )
        return validateData;
    }
    catch (error) {
        console.error("Failed to get service highlight sections:", error);
        throw error;
    }
}

export async function updateServiceHighlightSections(data: SignatureExperiences): Promise<void> {
    try {
        await API.put(HOME.UPDATE_SERVICES_HIGHLIGHT, data);
    } catch (error) {
        console.error("Failed to update service highlight sections:", error);
        throw error;
    }
}




