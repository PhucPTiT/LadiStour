"use server";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";


export async function invalidateSettingsCache() {
    updateTag("site-settings");
    // revalidatePath("/", "layout");
    // revalidateTag("settings", "layout");
    return true;
}
