"use server";
import { updateTag } from "next/cache";


export async function invalidateHomeSectionsCache() {
    updateTag("service-highlight-sections");
    return true;
}

export async function invalidateHeroSectionsCache() {
    updateTag("hero-sections");
    return true;
}
