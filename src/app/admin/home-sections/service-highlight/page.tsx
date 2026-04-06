"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import UploadImage from "@/components/customs/UploadImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileAction } from "@/app/actions/upload-image";
import {
    getHeroSections,
    getServiceHighlightSections,
    updateHeroSections,
    updateServiceHighlightSections,
} from "@/service/home-section/HomeSectionService";
import {
    HeroSliderPayload,
    SignatureExperiences,
} from "@/service/home-section/type";
import { invalidateHomeSectionsCache } from "@/app/actions/cache/invalidateCacheHomeSection";

const requiredMark = <span className="text-destructive">*</span>;

const localeSchema = z.object({
    vi: z.string().min(1, "Trường này là bắt buộc"),
    en: z.string().min(1, "Trường này là bắt buộc"),
});

const heroFormSchema = z.object({
    autoPlay: z.boolean(),
    autoPlayDelayMs: z
        .number({ message: "Trường này là bắt buộc" })
        .int("Vui lòng nhập số nguyên")
        .min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
    slides: z
        .array(
            z.object({
                title: localeSchema,
                subtitle: localeSchema,
                label: localeSchema,
                cta: localeSchema,
                image: z.string().min(1, "Ảnh là bắt buộc"),
                href: z.string().min(1, "Liên kết là bắt buộc"),
                active: z.boolean(),
            }),
        )
        .min(1, "Cần ít nhất 1 slide"),
});

const serviceHighlightSchema = z.object({
    eyebrow: localeSchema,
    title: localeSchema,
    description: localeSchema,
    items: z
        .array(
            z.object({
                icon: z.string().min(1, "Icon là bắt buộc"),
                title: localeSchema,
                text: localeSchema,
                active: z.boolean(),
            }),
        )
        .min(1, "Cần ít nhất 1 dịch vụ"),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;
type ServiceHighlightFormValues = z.infer<typeof serviceHighlightSchema>;

const createDefaultHeroSlide = (): HeroFormValues["slides"][number] => ({
    title: { vi: "", en: "" },
    subtitle: { vi: "", en: "" },
    label: { vi: "", en: "" },
    cta: { vi: "", en: "" },
    image: "",
    href: "",
    active: true,
});

const defaultHeroValues: HeroFormValues = {
    autoPlay: true,
    autoPlayDelayMs: 5000,
    slides: [createDefaultHeroSlide()],
};

const createDefaultServiceItem =
    (): ServiceHighlightFormValues["items"][number] => ({
        icon: "Compass",
        title: { vi: "", en: "" },
        text: { vi: "", en: "" },
        active: true,
    });

const defaultServiceValues: ServiceHighlightFormValues = {
    eyebrow: { vi: "", en: "" },
    title: { vi: "", en: "" },
    description: { vi: "", en: "" },
    items: [createDefaultServiceItem()],
};

export default function HomeSectionsConfigPage() {
    const [tab, setTab] = useState("hero");
    const [isLoading, setIsLoading] = useState(true);
    const [pendingHeroFiles, setPendingHeroFiles] = useState<
        Record<string, File | null>
    >({});

    const baseMinioUrl =
        process.env.NEXT_PUBLIC_BASE_URL_MINIO?.replace(/\/$/, "") ?? "";

    const {
        register: registerHero,
        control: heroControl,
        handleSubmit: handleHeroSubmit,
        reset: resetHero,
        setValue: setHeroValue,
        watch: watchHero,
        clearErrors: clearHeroErrors,
        setError: setHeroError,
        formState: { errors: heroErrors, isSubmitting: isHeroSubmitting },
    } = useForm<HeroFormValues>({
        resolver: zodResolver(heroFormSchema),
        defaultValues: defaultHeroValues,
    });

    const {
        register: registerService,
        control: serviceControl,
        handleSubmit: handleServiceSubmit,
        reset: resetService,
        setValue: setServiceValue,
        watch: watchService,
        formState: { errors: serviceErrors, isSubmitting: isServiceSubmitting },
    } = useForm<ServiceHighlightFormValues>({
        resolver: zodResolver(serviceHighlightSchema),
        defaultValues: defaultServiceValues,
    });

    const {
        fields: heroFields,
        append: appendHeroSlide,
        remove: removeHeroSlide,
    } = useFieldArray({
        control: heroControl,
        name: "slides",
    });

    const {
        fields: serviceFields,
        append: appendServiceItem,
        remove: removeServiceItem,
    } = useFieldArray({
        control: serviceControl,
        name: "items",
    });

    const heroSlides = watchHero("slides");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const [heroResponse, serviceResponse] = await Promise.all([
                getHeroSections(),
                getServiceHighlightSections(),
            ]);

            resetHero({
                autoPlay: heroResponse.autoPlay,
                autoPlayDelayMs: heroResponse.autoPlayDelayMs,
                slides:
                    heroResponse.slides.length > 0
                        ? heroResponse.slides.map((slide) => ({
                              title: slide.title,
                              subtitle: slide.subtitle,
                              label: slide.label,
                              cta: slide.cta,
                              image: slide.image,
                              href: slide.href,
                              active: slide.active,
                          }))
                        : [createDefaultHeroSlide()],
            });

            resetService({
                eyebrow: serviceResponse.eyebrow,
                title: serviceResponse.title,
                description: serviceResponse.description,
                items:
                    serviceResponse.items.length > 0
                        ? serviceResponse.items.map((item) => ({
                              icon: item.icon,
                              title: item.title,
                              text: item.text,
                              active: item.active,
                          }))
                        : [createDefaultServiceItem()],
            });
        } catch (error) {
            console.error("Failed to load home sections:", error);
            toast.error("Không thể tải dữ liệu Home sections.");
            resetHero(defaultHeroValues);
            resetService(defaultServiceValues);
        } finally {
            setIsLoading(false);
        }
    }, [resetHero, resetService]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const heroImageHandlers = useMemo(() => {
        const handlers: Record<
            string,
            (data: { existingIds: string[]; newFiles: File[] }) => Promise<void>
        > = {};

        heroFields.forEach((field, slideIndex) => {
            handlers[field.id] = async (data) => {
                const [latestFile] = data.newFiles.slice(-1);

                if (latestFile) {
                    setPendingHeroFiles((prev) => ({
                        ...prev,
                        [field.id]: latestFile,
                    }));
                    clearHeroErrors(`slides.${slideIndex}.image`);
                    return;
                }

                setPendingHeroFiles((prev) => ({
                    ...prev,
                    [field.id]: null,
                }));

                const [existingUrl] = data.existingIds;
                const nextValue = existingUrl ?? "";
                const currentValue =
                    watchHero(`slides.${slideIndex}.image`) ?? "";

                if (nextValue !== currentValue) {
                    setHeroValue(`slides.${slideIndex}.image`, nextValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }

                if (nextValue) {
                    clearHeroErrors(`slides.${slideIndex}.image`);
                }
            };
        });

        return handlers;
    }, [clearHeroErrors, heroFields, setHeroValue, watchHero]);

    const uploadHeroPendingImages = useCallback(async () => {
        for (let index = 0; index < heroFields.length; index++) {
            const field = heroFields[index];
            const file = pendingHeroFiles[field.id];

            if (!file) {
                continue;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadFileAction(formData);

                if (!result?.success || !result.fileName) {
                    throw new Error("Upload thất bại");
                }

                const imageUrl = baseMinioUrl
                    ? `${baseMinioUrl}/${result.fileName}`
                    : result.fileName;

                setHeroValue(`slides.${index}.image`, imageUrl, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                clearHeroErrors(`slides.${index}.image`);
            } catch (error) {
                console.error("Upload hero image error:", error);
                setHeroError(`slides.${index}.image`, {
                    type: "manual",
                    message: "Upload ảnh thất bại. Vui lòng thử lại.",
                });
                return false;
            }
        }

        setPendingHeroFiles({});
        return true;
    }, [
        baseMinioUrl,
        clearHeroErrors,
        heroFields,
        pendingHeroFiles,
        setHeroError,
        setHeroValue,
    ]);

    const onSubmitHero = useCallback(async (values: HeroFormValues) => {
        const payload: HeroSliderPayload = {
            autoPlay: values.autoPlay,
            autoPlayDelayMs: values.autoPlayDelayMs,
            slides: values.slides.map((slide, index) => ({
                ...slide,
                sortOrder: index,
            })),
        };

        try {
            await updateHeroSections(payload);
            toast.success("Đã lưu Hero section thành công.");
        } catch (error) {
            console.error("Failed to update hero section:", error);
            toast.error("Lưu Hero section thất bại. Vui lòng thử lại.");
        }
    }, []);

    const onSubmitService = useCallback(
        async (values: ServiceHighlightFormValues) => {
            const payload: SignatureExperiences = {
                eyebrow: values.eyebrow,
                title: values.title,
                description: values.description,
                items: values.items.map((item, index) => ({
                    ...item,
                    sortOrder: index,
                })),
            };

            try {
                await updateServiceHighlightSections(payload);
                await invalidateHomeSectionsCache();
                toast.success("Đã lưu Dịch vụ nổi bật thành công.");
            } catch (error) {
                console.error(
                    "Failed to update service highlight section:",
                    error,
                );
                toast.error("Lưu Dịch vụ nổi bật thất bại. Vui lòng thử lại.");
            }
        },
        [],
    );

    const submitHeroForm = useCallback(async () => {
        const uploaded = await uploadHeroPendingImages();
        if (!uploaded) {
            return;
        }
        await handleHeroSubmit(onSubmitHero)();
    }, [handleHeroSubmit, onSubmitHero, uploadHeroPendingImages]);

    const submitServiceForm = useCallback(async () => {
        await handleServiceSubmit(onSubmitService)();
    }, [handleServiceSubmit, onSubmitService]);

    const heroSubmitLabel = useMemo(() => {
        return isHeroSubmitting ? "Đang lưu..." : "Lưu Hero section";
    }, [isHeroSubmitting]);

    const serviceSubmitLabel = useMemo(() => {
        return isServiceSubmitting ? "Đang lưu..." : "Lưu Dịch vụ nổi bật";
    }, [isServiceSubmitting]);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Home Sections
                    </p>
                    <h2 className="text-2xl font-semibold">
                        Cấu hình Hero và Dịch vụ nổi bật
                    </h2>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => void loadData()}
                    disabled={isHeroSubmitting || isServiceSubmitting}
                >
                    <RefreshCw className="h-4 w-4" />
                    Tải lại dữ liệu
                </Button>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="hero">Hero section</TabsTrigger>
                    <TabsTrigger value="service-highlight">
                        Dịch vụ nổi bật
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-6 pt-2">
                    <form
                        onSubmit={handleHeroSubmit(onSubmitHero)}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Cài đặt chung Hero</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="hero-autoPlayDelayMs">
                                        Thời gian tự chạy (ms) {requiredMark}
                                    </Label>
                                    <Input
                                        id="hero-autoPlayDelayMs"
                                        type="number"
                                        min="0"
                                        {...registerHero("autoPlayDelayMs", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {heroErrors.autoPlayDelayMs ? (
                                        <p className="text-xs text-destructive">
                                            {heroErrors.autoPlayDelayMs.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hero-autoPlay">
                                        Tự động chuyển slide {requiredMark}
                                    </Label>
                                    <div className="h-10 rounded-md border px-3 flex items-center">
                                        <input
                                            id="hero-autoPlay"
                                            type="checkbox"
                                            className="h-4 w-4"
                                            {...registerHero("autoPlay")}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle>Danh sách slide</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                        appendHeroSlide(
                                            createDefaultHeroSlide(),
                                        )
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm slide
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {heroFields.map((field, index) => {
                                    const imageValue =
                                        heroSlides?.[index]?.image ?? "";
                                    const imageInitialUrls = imageValue
                                        ? [imageValue]
                                        : [];

                                    return (
                                        <div
                                            key={field.id}
                                            className="space-y-4 rounded-lg border p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold">
                                                    Slide {index + 1}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={
                                                        heroFields.length === 1
                                                    }
                                                    onClick={() => {
                                                        setPendingHeroFiles(
                                                            (prev) => ({
                                                                ...prev,
                                                                [field.id]:
                                                                    null,
                                                            }),
                                                        );
                                                        removeHeroSlide(index);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Ảnh slide {requiredMark}
                                                </Label>
                                                <UploadImage
                                                    key={`hero-slide-image-${field.id}-${imageValue || "empty"}`}
                                                    maxImages={1}
                                                    initialUrls={
                                                        imageInitialUrls
                                                    }
                                                    onChange={
                                                        heroImageHandlers[
                                                            field.id
                                                        ]
                                                    }
                                                />
                                                {heroErrors.slides?.[index]
                                                    ?.image ? (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            heroErrors.slides[
                                                                index
                                                            ]?.image?.message
                                                        }
                                                    </p>
                                                ) : null}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`slide-${field.id}-href`}
                                                >
                                                    Link điều hướng{" "}
                                                    {requiredMark}
                                                </Label>
                                                <Input
                                                    id={`slide-${field.id}-href`}
                                                    placeholder="/tours"
                                                    {...registerHero(
                                                        `slides.${index}.href`,
                                                    )}
                                                />
                                                {heroErrors.slides?.[index]
                                                    ?.href ? (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            heroErrors.slides[
                                                                index
                                                            ]?.href?.message
                                                        }
                                                    </p>
                                                ) : null}
                                            </div>

                                            <div className="grid gap-6 lg:grid-cols-2">
                                                <div className="space-y-3 rounded-lg border p-4">
                                                    <p className="text-sm font-semibold">
                                                        Tiếng Việt
                                                    </p>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-title-vi`}
                                                        >
                                                            Tiêu đề{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-title-vi`}
                                                            {...registerHero(
                                                                `slides.${index}.title.vi`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.title?.vi ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.title?.vi
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-subtitle-vi`}
                                                        >
                                                            Mô tả ngắn{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Textarea
                                                            id={`slide-${field.id}-subtitle-vi`}
                                                            rows={4}
                                                            {...registerHero(
                                                                `slides.${index}.subtitle.vi`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.subtitle?.vi ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.subtitle
                                                                        ?.vi
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-label-vi`}
                                                        >
                                                            Nhãn hiển thị{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-label-vi`}
                                                            {...registerHero(
                                                                `slides.${index}.label.vi`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.label?.vi ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.label?.vi
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-cta-vi`}
                                                        >
                                                            Nút CTA{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-cta-vi`}
                                                            {...registerHero(
                                                                `slides.${index}.cta.vi`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.cta?.vi ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.cta?.vi
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 rounded-lg border p-4">
                                                    <p className="text-sm font-semibold">
                                                        Tiếng Anh
                                                    </p>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-title-en`}
                                                        >
                                                            Tiêu đề{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-title-en`}
                                                            {...registerHero(
                                                                `slides.${index}.title.en`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.title?.en ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.title?.en
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-subtitle-en`}
                                                        >
                                                            Mô tả ngắn{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Textarea
                                                            id={`slide-${field.id}-subtitle-en`}
                                                            rows={4}
                                                            {...registerHero(
                                                                `slides.${index}.subtitle.en`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.subtitle?.en ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.subtitle
                                                                        ?.en
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-label-en`}
                                                        >
                                                            Nhãn hiển thị{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-label-en`}
                                                            {...registerHero(
                                                                `slides.${index}.label.en`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.label?.en ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.label?.en
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`slide-${field.id}-cta-en`}
                                                        >
                                                            Nút CTA{" "}
                                                            {requiredMark}
                                                        </Label>
                                                        <Input
                                                            id={`slide-${field.id}-cta-en`}
                                                            {...registerHero(
                                                                `slides.${index}.cta.en`,
                                                            )}
                                                        />
                                                        {heroErrors.slides?.[
                                                            index
                                                        ]?.cta?.en ? (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    heroErrors
                                                                        .slides[
                                                                        index
                                                                    ]?.cta?.en
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between rounded-md border px-3 py-2">
                                                <p className="text-sm font-medium">
                                                    Hiển thị slide{" "}
                                                    {requiredMark}
                                                </p>
                                                <Checkbox
                                                    checked={watchHero(
                                                        `slides.${index}.active`,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        setHeroValue(
                                                            `slides.${index}.active`,
                                                            Boolean(checked),
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <div className="sticky bottom-0 z-20 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => void submitHeroForm()}
                                    disabled={isHeroSubmitting}
                                >
                                    {heroSubmitLabel}
                                </Button>
                            </div>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent
                    value="service-highlight"
                    className="space-y-6 pt-2"
                >
                    <form
                        onSubmit={handleServiceSubmit(onSubmitService)}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Nội dung section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="service-eyebrow-vi">
                                            Eyebrow (VI) {requiredMark}
                                        </Label>
                                        <Input
                                            id="service-eyebrow-vi"
                                            {...registerService("eyebrow.vi")}
                                        />
                                        {serviceErrors.eyebrow?.vi ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    serviceErrors.eyebrow.vi
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-eyebrow-en">
                                            Eyebrow (EN) {requiredMark}
                                        </Label>
                                        <Input
                                            id="service-eyebrow-en"
                                            {...registerService("eyebrow.en")}
                                        />
                                        {serviceErrors.eyebrow?.en ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    serviceErrors.eyebrow.en
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="service-title-vi">
                                            Tiêu đề section (VI) {requiredMark}
                                        </Label>
                                        <Input
                                            id="service-title-vi"
                                            {...registerService("title.vi")}
                                        />
                                        {serviceErrors.title?.vi ? (
                                            <p className="text-xs text-destructive">
                                                {serviceErrors.title.vi.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-title-en">
                                            Tiêu đề section (EN) {requiredMark}
                                        </Label>
                                        <Input
                                            id="service-title-en"
                                            {...registerService("title.en")}
                                        />
                                        {serviceErrors.title?.en ? (
                                            <p className="text-xs text-destructive">
                                                {serviceErrors.title.en.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="service-description-vi">
                                            Nội dung section (VI) {requiredMark}
                                        </Label>
                                        <Textarea
                                            id="service-description-vi"
                                            rows={5}
                                            {...registerService(
                                                "description.vi",
                                            )}
                                        />
                                        {serviceErrors.description?.vi ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    serviceErrors.description.vi
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-description-en">
                                            Nội dung section (EN) {requiredMark}
                                        </Label>
                                        <Textarea
                                            id="service-description-en"
                                            rows={5}
                                            {...registerService(
                                                "description.en",
                                            )}
                                        />
                                        {serviceErrors.description?.en ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    serviceErrors.description.en
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle>Danh sách dịch vụ nổi bật</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                        appendServiceItem(
                                            createDefaultServiceItem(),
                                        )
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm dịch vụ
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {serviceFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="space-y-4 rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">
                                                Dịch vụ {index + 1}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                disabled={
                                                    serviceFields.length === 1
                                                }
                                                onClick={() =>
                                                    removeServiceItem(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`service-item-${field.id}-icon`}
                                            >
                                                Icon (tên icon) {requiredMark}
                                            </Label>
                                            <Input
                                                id={`service-item-${field.id}-icon`}
                                                placeholder="Compass"
                                                {...registerService(
                                                    `items.${index}.icon`,
                                                )}
                                            />
                                            {serviceErrors.items?.[index]
                                                ?.icon ? (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        serviceErrors.items[
                                                            index
                                                        ]?.icon?.message
                                                    }
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="grid gap-6 lg:grid-cols-2">
                                            <div className="space-y-3 rounded-lg border p-4">
                                                <p className="text-sm font-semibold">
                                                    Tiếng Việt
                                                </p>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`service-item-${field.id}-title-vi`}
                                                    >
                                                        Tiêu đề {requiredMark}
                                                    </Label>
                                                    <Input
                                                        id={`service-item-${field.id}-title-vi`}
                                                        {...registerService(
                                                            `items.${index}.title.vi`,
                                                        )}
                                                    />
                                                    {serviceErrors.items?.[
                                                        index
                                                    ]?.title?.vi ? (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                serviceErrors
                                                                    .items[
                                                                    index
                                                                ]?.title?.vi
                                                                    ?.message
                                                            }
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`service-item-${field.id}-text-vi`}
                                                    >
                                                        Nội dung {requiredMark}
                                                    </Label>
                                                    <Textarea
                                                        id={`service-item-${field.id}-text-vi`}
                                                        rows={4}
                                                        {...registerService(
                                                            `items.${index}.text.vi`,
                                                        )}
                                                    />
                                                    {serviceErrors.items?.[
                                                        index
                                                    ]?.text?.vi ? (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                serviceErrors
                                                                    .items[
                                                                    index
                                                                ]?.text?.vi
                                                                    ?.message
                                                            }
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="space-y-3 rounded-lg border p-4">
                                                <p className="text-sm font-semibold">
                                                    Tiếng Anh
                                                </p>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`service-item-${field.id}-title-en`}
                                                    >
                                                        Tiêu đề {requiredMark}
                                                    </Label>
                                                    <Input
                                                        id={`service-item-${field.id}-title-en`}
                                                        {...registerService(
                                                            `items.${index}.title.en`,
                                                        )}
                                                    />
                                                    {serviceErrors.items?.[
                                                        index
                                                    ]?.title?.en ? (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                serviceErrors
                                                                    .items[
                                                                    index
                                                                ]?.title?.en
                                                                    ?.message
                                                            }
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`service-item-${field.id}-text-en`}
                                                    >
                                                        Nội dung {requiredMark}
                                                    </Label>
                                                    <Textarea
                                                        id={`service-item-${field.id}-text-en`}
                                                        rows={4}
                                                        {...registerService(
                                                            `items.${index}.text.en`,
                                                        )}
                                                    />
                                                    {serviceErrors.items?.[
                                                        index
                                                    ]?.text?.en ? (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                serviceErrors
                                                                    .items[
                                                                    index
                                                                ]?.text?.en
                                                                    ?.message
                                                            }
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between rounded-md border px-3 py-2">
                                            <p className="text-sm font-medium">
                                                Hiển thị dịch vụ {requiredMark}
                                            </p>
                                            <Checkbox
                                                checked={watchService(
                                                    `items.${index}.active`,
                                                )}
                                                onCheckedChange={(checked) => {
                                                    setServiceValue(
                                                        `items.${index}.active`,
                                                        Boolean(checked),
                                                        { shouldDirty: true },
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="sticky bottom-0 z-20 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => void submitServiceForm()}
                                    disabled={isServiceSubmitting}
                                >
                                    {serviceSubmitLabel}
                                </Button>
                            </div>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
