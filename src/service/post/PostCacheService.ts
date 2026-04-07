import HttpService from "@/config/http-service ";
import { cacheTag } from "next/cache";
import { POSTS } from "@/const/endpoint";
import { validateSchema } from "../Service";
import { getServerToken } from "@/config/cookies";
import { Post, postSchema, PostsResponse, postsResponseSchema } from "./type";


async function fetchPostsFeaturedSections(token: string, locale: "vi" | "en") {
    "use cache";

    cacheTag(`posts-featured-sections-${locale}`);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<PostsResponse>(
        POSTS.GET_PUBLISHED,
        { locale },
        {
            next: {
                revalidate: 1200,
                tags: [`posts-featured-sections-${locale}`],
            },
        },
    );

    return validateSchema(
        response,
        postsResponseSchema,
        "HomeSectionCacheService.GetPostsFeaturedSections",
    );
}

export async function getCachedPostsFeaturedSections(locale?: "vi" | "en") {
    try {
        const token = await getServerToken();
        return await fetchPostsFeaturedSections(token, locale || "vi");
    } catch (error) {
        console.error("Failed to get posts featured sections:", error);
        throw error;
    }
}





async function fetchPostsBySlug(token: string, slug: string) {
    "use cache";

    cacheTag(`posts-by-slug-${slug}`);

    const API = HttpService.getInstance(undefined, token);

    const response = await API.get<Post>(
        `${POSTS.GET_BY_SLUG}/${slug}`,
        undefined,
        {
            next: {
                revalidate: 1200,
                tags: [`posts-by-slug-${slug}`],
            },
        },
    );

    return validateSchema(
        response,
        postSchema,
        "HomeSectionCacheService.GetPostsBySlug",
    );
}


export async function getCachedPostsFeaturedSectionsBySlug(slug: string) {
    try {
        const token = await getServerToken();
        const post = await fetchPostsBySlug(token, slug);
        return post;
    } catch (error) {
        console.error("Failed to get post by slug:", error);
        throw error;
    }
}