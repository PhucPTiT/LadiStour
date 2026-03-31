"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const tourSchema = z.object({
    _id: z.string().optional(),
    locale: z.enum(["vi", "en"]),
    translationGroupId: z.string().optional(),
    originId: z.string().optional(),
    isDefaultLocale: z.boolean(),
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    destinationId: z.string().min(1, "Destination ID is required"),
    images: z.string().optional(),
    durationDays: z.number().min(1),
    maxPeople: z.number().min(1),
    price: z.number().min(0),
    salePrice: z.number().min(0),
    currency: z.enum(["VND", "USD", "EUR"]),
    description: z.string().min(1, "Description is required"),
    itinerary: z.array(
        z.object({
            day: z.number().min(1),
            title: z.string().min(1, "Day title is required"),
            content: z.string().min(1, "Day content is required"),
        })
    ),
    tags: z.string().optional(),
    isFeatured: z.boolean(),
    status: z.enum(["draft", "published", "archived"]),
    seo: z.object({
        title: z.string().min(1, "SEO title is required"),
        description: z.string().min(1, "SEO description is required"),
        keywords: z.string().optional(),
    }),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type TourValues = z.infer<typeof tourSchema>;

const defaultValues: TourValues = {
    _id: "",
    locale: "vi",
    translationGroupId: "",
    originId: "",
    isDefaultLocale: true,
    title: "",
    slug: "",
    destinationId: "",
    images: "",
    durationDays: 3,
    maxPeople: 10,
    price: 0,
    salePrice: 0,
    currency: "VND",
    description: "",
    itinerary: [{ day: 1, title: "", content: "" }],
    tags: "",
    isFeatured: true,
    status: "draft",
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

export default function AdminToursPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TourValues>({
        resolver: zodResolver(tourSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "itinerary",
    });

    const onSubmit = (values: TourValues) => {
        const payload = {
            ...values,
            images: splitComma(values.images),
            tags: splitComma(values.tags),
            seo: {
                ...values.seo,
                keywords: splitComma(values.seo.keywords),
            },
        };

        console.log("TOURS", payload);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Tours
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit tours
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
                        <Label htmlFor="destinationId">Destination ID</Label>
                        <Input id="destinationId" {...register("destinationId")} />
                        {errors.destinationId ? (
                            <p className="text-xs text-red-600">
                                {errors.destinationId.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title ? (
                            <p className="text-xs text-red-600">
                                {errors.title.message}
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
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="images">Images (comma separated)</Label>
                        <Input id="images" {...register("images")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="durationDays">Duration (days)</Label>
                        <Input
                            id="durationDays"
                            type="number"
                            min={1}
                            {...register("durationDays", { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPeople">Max people</Label>
                        <Input
                            id="maxPeople"
                            type="number"
                            min={1}
                            {...register("maxPeople", { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            min={0}
                            {...register("price", { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salePrice">Sale price</Label>
                        <Input
                            id="salePrice"
                            type="number"
                            min={0}
                            {...register("salePrice", { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Currency</Label>
                        <Controller
                            control={control}
                            name="currency"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VND">VND</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" rows={5} {...register("description")} />
                        {errors.description ? (
                            <p className="text-xs text-red-600">
                                {errors.description.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" {...register("tags")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archived
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-800">
                                Featured
                            </p>
                            <p className="text-xs text-neutral-500">
                                Highlight this tour on the homepage.
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Itinerary</CardTitle>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({ day: fields.length + 1, title: "", content: "" })
                        }
                    >
                        Add day
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="rounded-lg border border-neutral-200 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-neutral-800">
                                    Day {index + 1}
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Day number</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        {...register(`itinerary.${index}.day`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Title</Label>
                                    <Input
                                        {...register(`itinerary.${index}.title`)}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-3">
                                    <Label>Content</Label>
                                    <Textarea
                                        rows={3}
                                        {...register(`itinerary.${index}.content`)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
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
                <Button type="submit">Save tour</Button>
            </div>
        </form>
    );
}
