import { z } from "zod";

export const SettingSchema = z.object({
    id: z.string().nullable(),

    email: z.union([z.string().email(), z.literal(""), z.null()]),
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),

    intro: z
        .object({
            en: z.union([z.string(), z.literal(""), z.null()]),
            vi: z.union([z.string(), z.literal(""), z.null()]),
        })
        .nullable(),

    social: z
        .array(
            z.object({
                platform: z.union([z.string(), z.literal(""), z.null()]),
                url: z.union([z.string().url(), z.literal(""), z.null()]),
            })
        )
        .nullable(),

    contentHTMLPageAbout: z
        .object({
            en: z.union([z.string(), z.literal(""), z.null()]),
            vi: z.union([z.string(), z.literal(""), z.null()]),
        })
        .nullable(),

    createdAt: z.union([z.string().datetime(), z.literal(""), z.null()]),
    updatedAt: z.union([z.string().datetime(), z.literal(""), z.null()]),
});

export type SettingType = z.infer<typeof SettingSchema>;
