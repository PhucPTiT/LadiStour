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

const categorySchema = z.object({
    _id: z.string().optional(),
    locale: z.enum(["vi", "en"]),
    translationGroupId: z.string().optional(),
    originId: z.string().optional(),
    isDefaultLocale: z.boolean(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type CategoryValues = z.infer<typeof categorySchema>;

const defaultValues: CategoryValues = {
    _id: "",
    locale: "vi",
    translationGroupId: "",
    originId: "",
    isDefaultLocale: true,
    name: "",
    slug: "",
    createdAt: "",
    updatedAt: "",
};

export default function AdminCategoriesPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CategoryValues>({
        resolver: zodResolver(categorySchema),
        defaultValues,
    });

    const onSubmit = (values: CategoryValues) => {
        console.log("CATEGORIES", values);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Categories
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit categories
                </h2>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Category details</CardTitle>
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
                <Button type="submit">Save category</Button>
            </div>
        </form>
    );
}
