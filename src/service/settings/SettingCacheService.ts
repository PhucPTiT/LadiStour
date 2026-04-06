import { getSettings } from "@/service/settings/SettingService";
import { cacheTag } from "next/cache";

export async function getCachedSettings() {
    "use cache";

    cacheTag("site-settings");

    return getSettings();
}

