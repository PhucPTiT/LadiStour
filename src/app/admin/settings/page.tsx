"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
    getSettings,
    postSettings,
    resetSettings,
    updateSettings,
} from "@/service/settings/SettingService";
import { invalidateSettingsCache } from "@/app/actions/invalidateCacheSettings";

const socialSchema = z.object({
    platform: z.string().optional(),
    url: z.string().optional(),
});

const settingsFormSchema = z.object({
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    intro: z
        .object({
            vi: z.string().optional(),
            en: z.string().optional(),
        })
        .optional(),
    contentHTMLPageAbout: z
        .object({
            vi: z.string().optional(),
            en: z.string().optional(),
        })
        .optional(),
    social: z.array(socialSchema).optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

type SettingsPayload = {
    email: string;
    phoneNumber: string;
    address: string;
    intro: {
        vi: string;
        en: string;
    };
    social: Array<{
        platform: string;
        url: string;
    }>;
    contentHTMLPageAbout: {
        vi: string;
        en: string;
    };
};

const defaultValues: SettingsFormValues = {
    email: "",
    phoneNumber: "",
    address: "",
    intro: {
        vi: "",
        en: "",
    },
    contentHTMLPageAbout: {
        vi: "",
        en: "",
    },
    social: [],
};

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasExistingSettings, setHasExistingSettings] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues,
    });

    const aboutViValue = watch("contentHTMLPageAbout.vi");
    const aboutEnValue = watch("contentHTMLPageAbout.en");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "social",
    });

    const loadSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const settings = await getSettings();

            reset({
                email: settings?.email ?? "",
                phoneNumber: settings?.phoneNumber ?? "",
                address: settings?.address ?? "",
                intro: {
                    vi: settings?.intro?.vi ?? "",
                    en: settings?.intro?.en ?? "",
                },
                contentHTMLPageAbout: {
                    vi: settings?.contentHTMLPageAbout?.vi ?? "",
                    en: settings?.contentHTMLPageAbout?.en ?? "",
                },
                social: (settings?.social ?? []).map((item) => ({
                    platform: item.platform ?? undefined,
                    url: item.url ?? undefined,
                })),
            });
            setHasExistingSettings(true);
        } catch (error) {
            console.error("Failed to load settings:", error);
            setHasExistingSettings(false);
            reset(defaultValues);
            toast.error("Không thể tải settings, bạn có thể tạo mới.");
        } finally {
            setIsLoading(false);
        }
    }, [reset]);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    const onSubmit = useCallback(
        async (values: SettingsFormValues) => {
            const payload: SettingsPayload = {
                email: values.email ?? "",
                phoneNumber: values.phoneNumber ?? "",
                address: values.address ?? "",
                intro: {
                    vi: values.intro?.vi ?? "",
                    en: values.intro?.en ?? "",
                },
                social: (values.social ?? []).map((item) => ({
                    platform: item.platform ?? "",
                    url: item.url ?? "",
                })),
                contentHTMLPageAbout: {
                    vi: values.contentHTMLPageAbout?.vi ?? "",
                    en: values.contentHTMLPageAbout?.en ?? "",
                },
            };

            try {
                if (hasExistingSettings) {
                    await updateSettings(payload);
                    await invalidateSettingsCache();
                    toast.success("Cập nhật settings thành công.");
                } else {
                    await postSettings(payload);
                    toast.success("Tạo settings thành công.");
                    setHasExistingSettings(true);
                }
            } catch (error) {
                console.error("Failed to save settings:", error);
                toast.error("Lưu settings thất bại. Vui lòng thử lại.");
            }
        },
        [hasExistingSettings],
    );

    const handleAboutViChange = useCallback(
        (nextHtml: string) => {
            setValue("contentHTMLPageAbout.vi", nextHtml, {
                shouldDirty: true,
                shouldValidate: true,
            });

            if (nextHtml.trim()) {
                clearErrors("contentHTMLPageAbout.vi");
            }
        },
        [clearErrors, setValue],
    );

    const handleAboutEnChange = useCallback(
        (nextHtml: string) => {
            setValue("contentHTMLPageAbout.en", nextHtml, {
                shouldDirty: true,
                shouldValidate: true,
            });

            if (nextHtml.trim()) {
                clearErrors("contentHTMLPageAbout.en");
            }
        },
        [clearErrors, setValue],
    );

    const handleResetSettings = useCallback(async () => {
        try {
            await resetSettings();
            toast.success("Đã reset settings về mặc định.");
            await loadSettings();
        } catch (error) {
            console.error("Failed to reset settings:", error);
            toast.error("Reset settings thất bại. Vui lòng thử lại.");
        }
    }, [loadSettings]);

    const submitLabel = useMemo(() => {
        if (isSubmitting) {
            return "Đang lưu...";
        }

        return hasExistingSettings ? "Cập nhật Settings" : "Tạo Settings";
    }, [hasExistingSettings, isSubmitting]);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Settings
                    </p>
                    <h2 className="text-2xl font-semibold">Cấu hình website</h2>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handleResetSettings}
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset Settings
                    </Button>

                    <Button
                        type="submit"
                        form="settings-form"
                        disabled={isSubmitting}
                        onClick={() => {
                            handleSubmit(onSubmit)();
                        }}
                    >
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...register("email")} />
                            {errors.email ? (
                                <p className="text-xs text-destructive">
                                    {errors.email.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                {...register("phoneNumber")}
                            />
                            {errors.phoneNumber ? (
                                <p className="text-xs text-destructive">
                                    {errors.phoneNumber.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...register("address")} />
                            {errors.address ? (
                                <p className="text-xs text-destructive">
                                    {errors.address.message}
                                </p>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Giới thiệu đa ngôn ngữ</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="intro-vi">Intro (VI)</Label>
                            <Textarea
                                id="intro-vi"
                                rows={4}
                                {...register("intro.vi")}
                            />
                            {errors.intro?.vi ? (
                                <p className="text-xs text-destructive">
                                    {errors.intro.vi.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="intro-en">Intro (EN)</Label>
                            <Textarea
                                id="intro-en"
                                rows={4}
                                {...register("intro.en")}
                            />
                            {errors.intro?.en ? (
                                <p className="text-xs text-destructive">
                                    {errors.intro.en.message}
                                </p>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Nội dung trang About (HTML)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>About HTML (VI)</Label>
                            <SimpleEditor
                                value={aboutViValue}
                                onChange={handleAboutViChange}
                            />
                            {errors.contentHTMLPageAbout?.vi ? (
                                <p className="text-xs text-destructive">
                                    {errors.contentHTMLPageAbout.vi.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label>About HTML (EN)</Label>
                            <SimpleEditor
                                value={aboutEnValue}
                                onChange={handleAboutEnChange}
                            />
                            {errors.contentHTMLPageAbout?.en ? (
                                <p className="text-xs text-destructive">
                                    {errors.contentHTMLPageAbout.en.message}
                                </p>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Social links</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                append({
                                    platform: "",
                                    url: "",
                                })
                            }
                        >
                            <Plus className="h-4 w-4" />
                            Thêm social
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Chưa có social link nào.
                            </p>
                        ) : null}

                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_2fr_auto]"
                            >
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`social-${field.id}-platform`}
                                    >
                                        Platform
                                    </Label>
                                    <Input
                                        id={`social-${field.id}-platform`}
                                        placeholder="facebook"
                                        {...register(
                                            `social.${index}.platform` as const,
                                        )}
                                    />
                                    {errors.social?.[index]?.platform ? (
                                        <p className="text-xs text-destructive">
                                            {
                                                errors.social[index]?.platform
                                                    ?.message
                                            }
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`social-${field.id}-url`}>
                                        URL
                                    </Label>
                                    <Input
                                        id={`social-${field.id}-url`}
                                        placeholder="https://..."
                                        {...register(
                                            `social.${index}.url` as const,
                                        )}
                                    />
                                    {errors.social?.[index]?.url ? (
                                        <p className="text-xs text-destructive">
                                            {errors.social[index]?.url?.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="self-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
