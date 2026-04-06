"use server";
import { updateTag } from "next/cache";


export async function invalidateSettingsCache() {
    updateTag("site-settings");
    return true;
}
