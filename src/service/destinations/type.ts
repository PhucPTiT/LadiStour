import { z } from "zod";

export const DestinationResponseSchema = z.object({
    id: z.string(),
    locale: z.string(),
    translationGroupId: z.string(),
    originId: z.string().nullable(),

    name: z.string(),
    slug: z.string(),
    thumbnail: z.string(),
    banner: z.string(),

    shortDescription: z.string(),
    description: z.string(),

    location: z.object({
        city: z.string(),
        country: z.string(),
    }),

    seo: z.object({
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        keywords: z.array(z.string()),
    }),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),

    defaultLocale: z.boolean(),
    featured: z.boolean(),
});

export const DestinationListResponseSchema = z.array(
    DestinationResponseSchema
);

// types
export type DestinationResponse = z.infer<typeof DestinationResponseSchema>;
export type DestinationListResponse = z.infer<
    typeof DestinationListResponseSchema
>;

// Alias for getTranslations response - returns array of translations for a destination group
export type GetTranslationsResponse = DestinationListResponse;
