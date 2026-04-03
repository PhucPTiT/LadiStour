import HttpService from "@/config/http-service ";
import { SETTINGS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import { SettingSchema, SettingType } from "./type";


const API = HttpService.getInstance();


export async function postSettings(data: unknown): Promise<void> {
    try {
        await API.post(SETTINGS.CREATE, data);
    } catch (error) {
        console.error("Failed to create review:", error);
        throw error;
    }
}

export async function updateSettings(data: unknown): Promise<void> {
    try {
        await API.put(SETTINGS.UPDATE, data);
    } catch (error) {
        console.error("Failed to update review:", error);
        throw error;
    }
}

export async function getSettings(): Promise<SettingType> {
    try {
        const response = await API.get<SettingType>(SETTINGS.GET);
        const validatedData = validateSchema(
            response,
            SettingSchema,
            "SettingService.GetSettings"
        );
        return validatedData;
    } catch (error) {
        console.error("Failed to get settings:", error);
        throw error;
    }
}

export async function resetSettings(): Promise<void> {
    try {
        await API.post(SETTINGS.RESET);
    } catch (error) {
        console.error("Failed to reset settings:", error);
        throw error;
    }
}


