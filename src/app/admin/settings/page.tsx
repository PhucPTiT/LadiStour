"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const settingsSchema = z.object({
    _id: z.string().optional(),
    email: z.string().email("Valid email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    intro: z.object({
        vi: z.string().min(1, "Vietnamese intro is required"),
        en: z.string().min(1, "English intro is required"),
    }),
    social: z.array(
        z.object({
            platform: z.string().min(1, "Platform is required"),
            url: z.string().min(1, "URL is required"),
        }),
    ),
    contentHTMLPageAbout: z.object({
        vi: z.string().min(1, "Vietnamese content is required"),
        en: z.string().min(1, "English content is required"),
    }),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsValues = {
    _id: "",
    email: "",
    phoneNumber: "",
    address: "",
    intro: {
        vi: "",
        en: "",
    },
    social: [{ platform: "", url: "" }],
    contentHTMLPageAbout: {
        vi: "",
        en: "",
    },
    createdAt: "",
    updatedAt: "",
};

export default function AdminSettingsPage() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SettingsValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "social",
    });

    const onSubmit = (values: SettingsValues) => {
        console.log("SETTINGS", values);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Settings
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">
                    Global settings
                </h2>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="_id">ID</Label>
                        <Input id="_id" {...register("_id")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email ? (
                            <p className="text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone number</Label>
                        <Input id="phoneNumber" {...register("phoneNumber")} />
                        {errors.phoneNumber ? (
                            <p className="text-xs text-red-600">
                                {errors.phoneNumber.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            rows={3}
                            {...register("address")}
                        />
                        {errors.address ? (
                            <p className="text-xs text-red-600">
                                {errors.address.message}
                            </p>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Intro</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="intro-vi">Intro (vi)</Label>
                        <Textarea
                            id="intro-vi"
                            rows={4}
                            {...register("intro.vi")}
                        />
                        {errors.intro?.vi ? (
                            <p className="text-xs text-red-600">
                                {errors.intro.vi.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intro-en">Intro (en)</Label>
                        <Textarea
                            id="intro-en"
                            rows={4}
                            {...register("intro.en")}
                        />
                        {errors.intro?.en ? (
                            <p className="text-xs text-red-600">
                                {errors.intro.en.message}
                            </p>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Social links</CardTitle>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ platform: "", url: "" })}
                    >
                        Add link
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
                                    Link {index + 1}
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
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <Input
                                        {...register(
                                            `social.${index}.platform`,
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                        {...register(`social.${index}.url`)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>About page HTML</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="about-vi">About HTML (vi)</Label>
                        <Textarea
                            id="about-vi"
                            rows={5}
                            {...register("contentHTMLPageAbout.vi")}
                        />
                        {errors.contentHTMLPageAbout?.vi ? (
                            <p className="text-xs text-red-600">
                                {errors.contentHTMLPageAbout.vi.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="about-en">About HTML (en)</Label>
                        <Textarea
                            id="about-en"
                            rows={5}
                            {...register("contentHTMLPageAbout.en")}
                        />
                        {errors.contentHTMLPageAbout?.en ? (
                            <p className="text-xs text-red-600">
                                {errors.contentHTMLPageAbout.en.message}
                            </p>
                        ) : null}
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
                <Button type="submit">Save settings</Button>
            </div>
        </form>
    );
}
