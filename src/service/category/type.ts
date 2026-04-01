import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string(),

    locale: z.enum(["vi", "en"]),

    name: z.string(),
    slug: z.string(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),

});

export const CategoryListSchema = z.array(CategorySchema);

export type Category = z.infer<typeof CategorySchema>;
export type CategoryList = z.infer<typeof CategoryListSchema>;
