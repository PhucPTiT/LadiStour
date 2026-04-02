import { z } from "zod";

export const seoSchema = z.object({
    description: z.string(),
    keywords: z.array(z.string()),
    title: z.string(),
});

export const postSchema = z.object({
    id: z.string(),
    locale: z.string(),
    translationGroupId: z.string(),
    originId: z.string().nullable(),

    title: z.string(),
    slug: z.string(),
    thumbnail: z.string().url(),
    excerpt: z.string(),
    contentHtml: z.string(),

    categoryId: z.string(),
    tags: z.array(z.string()),

    status: z.enum(["draft", "published", "archived"]),
    seo: seoSchema,

    publishedAt: z.string().nullable(),
    defaultLocale: z.boolean(),
});

export const postsResponseSchema = z.array(postSchema);

// Types
export type Seo = z.infer<typeof seoSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
