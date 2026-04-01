import z from "zod";

export const TourItinerarySchema = z.object({
    day: z.number(),
    title: z.string(),
    content: z.string(),
});

export const TourSeoSchema = z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
});

export const TourSchema = z.object({
    id: z.string(),
    locale: z.enum(["vi", "en"]),
    translationGroupId: z.string(),
    originId: z.string().nullable(),

    title: z.string(),
    slug: z.string(),

    destinationId: z.string(),

    images: z.array(z.string()),

    durationDays: z.number(),
    maxPeople: z.number(),

    price: z.number(),
    salePrice: z.number().nullable().optional(),

    currency: z.string(),

    description: z.string(),

    itinerary: z.array(TourItinerarySchema),

    tags: z.array(z.string()),

    status: z.enum(["draft", "published", "archived"]),

    seo: TourSeoSchema,

    createdAt: z.string(),
    updatedAt: z.string(),

    defaultLocale: z.boolean(),
    featured: z.boolean(),
});

export const TourListSchema = z.array(TourSchema);

export type Tour = z.infer<typeof TourSchema>;
export type TourList = z.infer<typeof TourListSchema>;
export type TourItinerary = z.infer<typeof TourItinerarySchema>;
export type TourSeo = z.infer<typeof TourSeoSchema>;