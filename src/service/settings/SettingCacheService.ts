import { getServerToken } from "@/config/cookies";
import { cacheTag } from "next/cache";
import { SettingSchema, SettingType } from "./type";
import { SETTINGS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import HttpService from "@/config/http-service ";

async function fetchSettings(token: string) {
    "use cache";

    cacheTag("site-settings");

    const API = HttpService.getInstance(undefined, token);
    const response = await API.get<SettingType>(SETTINGS.GET, null, {
        next: { revalidate: 1200, tags: ["site-settings"] }, // cache for 20 minutes
    });

    return validateSchema(response, SettingSchema, "SettingService.GetSettingsCached");
}

export async function getCachedSettings() {
    try {
        const token = await getServerToken();
        return await fetchSettings(token);
    } catch (error) {
        console.error("Failed to get settings:", error);
        throw error;
    }
}