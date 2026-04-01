import { z } from "zod";

export const ReviewSchema = z.object({
    id: z.string(),

    locale: z.enum(["vi", "en"]),

    rating: z.number().min(0).max(5),

    comment: z.string(),
    authorName: z.string(),
    authorAvatar: z.string(),

    isApproved: z.boolean(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const ReviewListSchema = z.array(ReviewSchema);

export type Review = z.infer<typeof ReviewSchema>;
export type ReviewList = z.infer<typeof ReviewListSchema>;
