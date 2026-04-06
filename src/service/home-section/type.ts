import { z } from "zod";

export const LocaleTextSchema = z.object({
    vi: z.string().min(1),
    en: z.string().min(1),
});

export const HeroSlideSchema = z.object({
    title: LocaleTextSchema,
    subtitle: LocaleTextSchema,
    label: LocaleTextSchema,
    cta: LocaleTextSchema,

    image: z.string().url(),
    href: z.string().min(1),

    sortOrder: z.number().int().nonnegative(),
    active: z.boolean(),
});

export const HeroSliderPayloadSchema = z.object({
    autoPlay: z.boolean(),
    autoPlayDelayMs: z.number().int().nonnegative(),
    slides: z.array(HeroSlideSchema).min(1),
});

// Typescript type
export type HeroSliderPayload = z.infer<typeof HeroSliderPayloadSchema>;
export type HeroSlide = z.infer<typeof HeroSlideSchema>;



export const HeroSliderResponseSchema = z.object({
    id: z.string(),

    autoPlay: z.boolean(),
    autoPlayDelayMs: z.number().int().nonnegative(),

    slides: z.array(HeroSlideSchema),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// Typescript type
export type HeroSliderResponse = z.infer<typeof HeroSliderResponseSchema>;






export const ExperienceItemSchema = z.object({
    icon: z.string(),
    title: LocaleTextSchema,
    text: LocaleTextSchema,
    sortOrder: z.number().int().nonnegative(),
    active: z.boolean(),
});

export const SignatureExperiencesSchema = z.object({
    eyebrow: LocaleTextSchema,
    title: LocaleTextSchema,
    description: LocaleTextSchema,
    items: z.array(ExperienceItemSchema),
});

// Typescript types
export type SignatureExperiences = z.infer<typeof SignatureExperiencesSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;


export const SignatureExperiencesResponseSchema = z.object({
    id: z.string(),

    eyebrow: LocaleTextSchema,
    title: LocaleTextSchema,
    description: LocaleTextSchema,

    items: z.array(ExperienceItemSchema),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// Typescript types
export type SignatureExperiencesResponse = z.infer<
    typeof SignatureExperiencesResponseSchema
>;