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

const reviewSchema = z.object({
    _id: z.string().optional(),
    type: z.enum(["tour", "company"]),
    tourId: z.string().optional(),
    locale: z.string().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1, "Comment is required"),
    authorName: z.string().min(1, "Author name is required"),
    authorAvatar: z.string().optional(),
    isApproved: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type ReviewValues = z.infer<typeof reviewSchema>;

const defaultValues: ReviewValues = {
    _id: "",
    type: "tour",
    tourId: "",
    locale: "",
    rating: 5,
    comment: "",
    authorName: "",
    authorAvatar: "",
    isApproved: false,
    createdAt: "",
    updatedAt: "",
};

export default function AdminReviewsPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ReviewValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues,
    });

    const onSubmit = (values: ReviewValues) => {
        console.log("REVIEWS", values);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Reviews
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Create or edit reviews
                </h2>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Review details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="_id">ID</Label>
                        <Input id="_id" {...register("_id")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tour">Tour</SelectItem>
                                        <SelectItem value="company">
                                            Company
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tourId">Tour ID (if tour)</Label>
                        <Input id="tourId" {...register("tourId")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Locale (optional)</Label>
                        <Controller
                            control={control}
                            name="locale"
                            render={({ field }) => (
                                <Select
                                    value={field.value || ""}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Optional" />
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
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                            id="rating"
                            type="number"
                            min={1}
                            max={5}
                            {...register("rating", { valueAsNumber: true })}
                        />
                        {errors.rating ? (
                            <p className="text-xs text-red-600">
                                {errors.rating.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="authorName">Author name</Label>
                        <Input id="authorName" {...register("authorName")} />
                        {errors.authorName ? (
                            <p className="text-xs text-red-600">
                                {errors.authorName.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="authorAvatar">Author avatar URL</Label>
                        <Input
                            id="authorAvatar"
                            {...register("authorAvatar")}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea id="comment" rows={4} {...register("comment")} />
                        {errors.comment ? (
                            <p className="text-xs text-red-600">
                                {errors.comment.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2">
                        <div>
                            <p className="text-sm font-medium text-neutral-800">
                                Approved
                            </p>
                            <p className="text-xs text-neutral-500">
                                Toggle review visibility.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="isApproved"
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
                <Button type="submit">Save review</Button>
            </div>
        </form>
    );
}
