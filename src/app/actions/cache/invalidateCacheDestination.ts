"use server";
import { updateTag } from "next/cache";


export async function invalidateDestinationCache() {
    updateTag("destinations-featured");
    return true;
}


