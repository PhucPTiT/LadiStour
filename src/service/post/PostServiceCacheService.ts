import HttpService from "@/config/http-service ";
import { cacheTag } from "next/cache";
import { POSTS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import { getServerToken } from "@/config/cookies";
import { PostsResponse, postsResponseSchema } from "./type";


async function fetchPostsFeaturedSections(token: string) {
    "use cache";

    cacheTag("posts-featured-sections");

    const API = HttpService.getInstance(undefined, token);
    const response = await API.get<PostsResponse>(POSTS.GET_PUBLISHED, null, {
        next: { revalidate: 1200, tags: ["posts-featured-sections"] },
    });

    return validateSchema(response, postsResponseSchema, "HomeSectionCacheService.GetPostsFeaturedSections");
}

export async function getCachedPostsFeaturedSections() {
    try {
        const token = await getServerToken();
        return await fetchPostsFeaturedSections(token);
    } catch (error) {
        console.error("Failed to get posts featured sections:", error);
        throw error;
    }
}