"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const destinationSchema = z.object({
    _id: z.string().optional(),
    locale: z.enum(["vi", "en"]),
    translationGroupId: z.string().optional(),
    originId: z.string().optional(),
    isDefaultLocale: z.boolean(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    thumbnail: z.string().optional(),
    banner: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    location: z.object({
        country: z.string().min(1, "Country is required"),
        city: z.string().min(1, "City is required"),
    }),
    isFeatured: z.boolean(),
    seo: z.object({
        title: z.string().min(1, "SEO title is required"),
        description: z.string().min(1, "SEO description is required"),
        keywords: z.string().optional(),
    }),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type DestinationValues = z.infer<typeof destinationSchema>;

const defaultValues: DestinationValues = {
    _id: "",
    locale: "vi",
    translationGroupId: "",
    originId: "",
    isDefaultLocale: true,
    name: "",
    slug: "",
    thumbnail: "",
    banner: "",
    shortDescription: "",
    description: "",
    location: {
        country: "",
        city: "",
    },
    isFeatured: true,
    seo: {
        title: "",
        description: "",
        keywords: "",
    },
    createdAt: "",
    updatedAt: "",
};

const splitComma = (value?: string) =>
    value
        ? value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

export default function AdminDestinationsPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<DestinationValues>({
        resolver: zodResolver(destinationSchema),
        defaultValues,
    });

    const onSubmit = (values: DestinationValues) => {
        const payload = {
            ...values,
            seo: {
                ...values.seo,
                keywords: splitComma(values.seo.keywords),
            },
        };

        console.log("DESTINATIONS", payload);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Destinations
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit destinations
                </h2>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Core details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="_id">ID</Label>
                        <Input id="_id" {...register("_id")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name ? (
                            <p className="text-xs text-red-600">
                                {errors.name.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...register("slug")} />
                        {errors.slug ? (
                            <p className="text-xs text-red-600">
                                {errors.slug.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input id="thumbnail" {...register("thumbnail")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="banner">Banner URL</Label>
                        <Input id="banner" {...register("banner")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="shortDescription">
                            Short description
                        </Label>
                        <Textarea
                            id="shortDescription"
                            rows={3}
                            {...register("shortDescription")}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={5}
                            {...register("description")}
                        />
                        {errors.description ? (
                            <p className="text-xs text-red-600">
                                {errors.description.message}
                            </p>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="location-country">Country</Label>
                        <Input
                            id="location-country"
                            {...register("location.country")}
                        />
                        {errors.location?.country ? (
                            <p className="text-xs text-red-600">
                                {errors.location.country.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location-city">City</Label>
                        <Input
                            id="location-city"
                            {...register("location.city")}
                        />
                        {errors.location?.city ? (
                            <p className="text-xs text-red-600">
                                {errors.location.city.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-800">
                                Featured
                            </p>
                            <p className="text-xs text-neutral-500">
                                Highlight this destination.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="isFeatured"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Localization</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Locale</Label>
                        <Controller
                            control={control}
                            name="locale"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select locale" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vi">vi</SelectItem>
                                        <SelectItem value="en">en</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="translationGroupId">
                            Translation group ID
                        </Label>
                        <Input
                            id="translationGroupId"
                            {...register("translationGroupId")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="originId">Origin ID</Label>
                        <Input id="originId" {...register("originId")} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 md:col-span-3">
                        <div>
                            <p className="text-sm font-medium text-neutral-800">
                                Default locale
                            </p>
                            <p className="text-xs text-neutral-500">
                                Mark as the primary translation.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="isDefaultLocale"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="seo-title">SEO title</Label>
                        <Input id="seo-title" {...register("seo.title")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seo-keywords">
                            SEO keywords (comma separated)
                        </Label>
                        <Input
                            id="seo-keywords"
                            {...register("seo.keywords")}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="seo-description">SEO description</Label>
                        <Textarea
                            id="seo-description"
                            rows={3}
                            {...register("seo.description")}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="createdAt">Created at</Label>
                        <Input
                            id="createdAt"
                            type="datetime-local"
                            {...register("createdAt")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="updatedAt">Updated at</Label>
                        <Input
                            id="updatedAt"
                            type="datetime-local"
                            {...register("updatedAt")}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">Save destination</Button>
            </div>
        </form>
    );
}
