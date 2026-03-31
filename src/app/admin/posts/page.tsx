"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const postSchema = z.object({
    _id: z.string().optional(),
    locale: z.enum(["vi", "en"]),
    translationGroupId: z.string().optional(),
    originId: z.string().optional(),
    isDefaultLocale: z.boolean(),
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    thumbnail: z.string().min(1, "Thumbnail URL is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    contentHtml: z.string().min(1, "Content HTML is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    tags: z.string().optional(),
    status: z.enum(["draft", "published", "archived"]),
    seo: z.object({
        title: z.string().min(1, "SEO title is required"),
        description: z.string().min(1, "SEO description is required"),
        keywords: z.string().optional(),
    }),
    publishedAt: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type PostValues = z.infer<typeof postSchema>;

const defaultValues: PostValues = {
    _id: "",
    locale: "vi",
    translationGroupId: "",
    originId: "",
    isDefaultLocale: true,
    title: "",
    slug: "",
    thumbnail: "",
    excerpt: "",
    contentHtml: "",
    categoryId: "",
    tags: "",
    status: "draft",
    seo: {
        title: "",
        description: "",
        keywords: "",
    },
    publishedAt: "",
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

export default function AdminPostsPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PostValues>({
        resolver: zodResolver(postSchema),
        defaultValues,
    });

    const onSubmit = (values: PostValues) => {
        const payload = {
            ...values,
            tags: splitComma(values.tags),
            seo: {
                ...values.seo,
                keywords: splitComma(values.seo.keywords),
            },
        };

        console.log("POSTS", payload);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Posts
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit posts
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
                        <Label htmlFor="categoryId">Category ID</Label>
                        <Input id="categoryId" {...register("categoryId")} />
                        {errors.categoryId ? (
                            <p className="text-xs text-red-600">
                                {errors.categoryId.message}
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
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input id="thumbnail" {...register("thumbnail")} />
                        {errors.thumbnail ? (
                            <p className="text-xs text-red-600">
                                {errors.thumbnail.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" rows={3} {...register("excerpt")} />
                        {errors.excerpt ? (
                            <p className="text-xs text-red-600">
                                {errors.excerpt.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contentHtml">Content HTML</Label>
                        <Textarea
                            id="contentHtml"
                            rows={8}
                            {...register("contentHtml")}
                        />
                        {errors.contentHtml ? (
                            <p className="text-xs text-red-600">
                                {errors.contentHtml.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
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
                        {errors.seo?.title ? (
                            <p className="text-xs text-red-600">
                                {errors.seo.title.message}
                            </p>
                        ) : null}
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
                        {errors.seo?.description ? (
                            <p className="text-xs text-red-600">
                                {errors.seo.description.message}
                            </p>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="publishedAt">Published at</Label>
                        <Input
                            id="publishedAt"
                            type="datetime-local"
                            {...register("publishedAt")}
                        />
                    </div>
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
                <Button type="submit">Save post</Button>
            </div>
        </form>
    );
}
