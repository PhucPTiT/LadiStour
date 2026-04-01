"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import UploadImage from "@/components/customs/UploadImage";
import { uploadFileAction } from "@/app/actions/upload-image";
import {
    createMultiLanguageTour,
    getTourTranslations,
    updateMultiLanguageTours,
} from "@/service/tour/TourService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TourItinerarySchema = z.object({
    day: z.number().min(1, "Day must be at least 1"),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

const localizedTourSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    salePrice: z.number().optional().nullable(),
    currency: z.string().min(1, "Currency is required"),
    tags: z.array(z.string()),
    itinerary: z.array(TourItinerarySchema),
    seo: z.object({
        title: z.string().min(1, "SEO title is required"),
        description: z.string().min(1, "SEO description is required"),
        keywords: z.array(z.string()).catch([]),
    }),
});

const tourFormSchema = z.object({
    vi: localizedTourSchema,
    en: localizedTourSchema,
    destinationId: z.string().min(1, "Destination is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    durationDays: z.number().min(1, "Duration must be at least 1 day"),
    maxPeople: z.number().min(1, "Max people must be at least 1"),
    status: z.enum(["draft", "published", "archived"]),
    featured: z.boolean(),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

const defaultValues: TourFormValues = {
    vi: {
        title: "",
        description: "",
        price: 0,
        salePrice: null,
        currency: "USD",
        tags: [],
        itinerary: [{ day: 1, title: "", content: "" }],
        seo: { title: "", description: "", keywords: [] },
    },
    en: {
        title: "",
        description: "",
        price: 0,
        salePrice: null,
        currency: "USD",
        tags: [],
        itinerary: [{ day: 1, title: "", content: "" }],
        seo: { title: "", description: "", keywords: [] },
    },
    destinationId: "",
    images: [],
    durationDays: 3,
    maxPeople: 20,
    status: "draft",
    featured: false,
};

const splitComma = (value: string) =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const joinComma = (value?: string[]) => (value ? value.join(", ") : "");

// Hàm tạo slug từ title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

// Hàm convert payload theo định dạng BE yêu cầu
const convertTourPayload = (values: TourFormValues) => {
    return {
        vi: {
            title: values.vi.title,
            slug: generateSlug(values.vi.title),
            description: values.vi.description,
            durationDays: values.durationDays,
            maxPeople: values.maxPeople,
            price: values.vi.price,
            salePrice: values.vi.salePrice || 0,
            currency: values.vi.currency,
            itinerary: values.vi.itinerary,
            tags: values.vi.tags,
            seo: {
                title: values.vi.seo.title,
                description: values.vi.seo.description,
                keywords: values.vi.seo.keywords ?? [],
            },
        },
        en: {
            title: values.en.title,
            slug: generateSlug(values.en.title),
            description: values.en.description,
            durationDays: values.durationDays,
            maxPeople: values.maxPeople,
            price: values.en.price,
            salePrice: values.en.salePrice || 0,
            currency: values.en.currency,
            itinerary: values.en.itinerary,
            tags: values.en.tags,
            seo: {
                title: values.en.seo.title,
                description: values.en.seo.description,
                keywords: values.en.seo.keywords ?? [],
            },
        },
        destinationId: values.destinationId,
        images: values.images,
        featured: values.featured,
    };
};

type TourModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    translationGroupId?: string | null;
    onSuccess?: () => void;
    destinations?: Array<{ id: string; name: string }>;
};

export default function TourModal({
    open,
    onOpenChange,
    translationGroupId,
    onSuccess,
    destinations = [],
}: TourModalProps) {
    const baseMinioUrl =
        process.env.NEXT_PUBLIC_BASE_URL_MINIO?.replace(/\/$/, "") ?? "";
    const isEditing = Boolean(translationGroupId);
    const requiredMark = <span className="text-destructive">*</span>;
    const {
        register,
        handleSubmit,
        control,
        setValue,
        clearErrors,
        setError,
        watch,
        reset,
        formState: { errors },
    } = useForm<TourFormValues>({
        resolver: zodResolver(tourFormSchema),
        defaultValues,
    });

    const images = watch("images");
    const viItinerary = watch("vi.itinerary");
    const enItinerary = watch("en.itinerary");

    const {
        fields: viItineraryFields,
        append: appendViItinerary,
        remove: removeViItinerary,
    } = useFieldArray({
        control,
        name: "vi.itinerary",
    });

    const {
        fields: enItineraryFields,
        append: appendEnItinerary,
        remove: removeEnItinerary,
    } = useFieldArray({
        control,
        name: "en.itinerary",
    });

    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [viTranslationId, setViTranslationId] = useState<string | null>(null);

    // Load translations data when opening in edit mode
    useEffect(() => {
        if (!open) return;

        const loadTranslations = async () => {
            if (!translationGroupId) {
                reset(defaultValues);
                setPendingFiles([]);
                return;
            }

            try {
                const translations =
                    await getTourTranslations(translationGroupId);

                // Map array of translations to form structure
                const viTranslation = translations.find(
                    (t) => t.locale === "vi",
                );
                const enTranslation = translations.find(
                    (t) => t.locale === "en",
                );

                if (viTranslation || enTranslation) {
                    if (viTranslation) {
                        setViTranslationId(viTranslation.id);
                    }

                    reset({
                        vi: viTranslation
                            ? {
                                  title: viTranslation.title,
                                  description: viTranslation.description,
                                  price: viTranslation.price || 0,
                                  salePrice: viTranslation.salePrice ?? null,
                                  currency: viTranslation.currency || "USD",
                                  tags: viTranslation.tags || [],
                                  itinerary: viTranslation.itinerary,
                                  seo: viTranslation.seo,
                              }
                            : defaultValues.vi,
                        en: enTranslation
                            ? {
                                  title: enTranslation.title,
                                  description: enTranslation.description,
                                  price: enTranslation.price || 0,
                                  salePrice: enTranslation.salePrice ?? null,
                                  currency: enTranslation.currency || "USD",
                                  tags: enTranslation.tags || [],
                                  itinerary: enTranslation.itinerary,
                                  seo: enTranslation.seo,
                              }
                            : defaultValues.en,
                        destinationId: viTranslation?.destinationId || "",
                        images: viTranslation?.images || [],
                        durationDays: viTranslation?.durationDays || 3,
                        maxPeople: viTranslation?.maxPeople || 20,
                        status: viTranslation?.status || "draft",
                        featured: viTranslation?.featured ?? false,
                    });
                    setPendingFiles([]);
                }
            } catch (error) {
                console.error("Failed to load translations:", error);
                toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
            }
        };

        loadTranslations();
    }, [open, translationGroupId, reset]);

    const handleImageChange = useCallback(
        (data: { existingIds: string[]; newFiles: File[] }) => {
            setPendingFiles(data.newFiles);

            if (data.newFiles.length === 0) {
                setValue("images", data.existingIds, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                if (data.existingIds.length > 0) {
                    clearErrors("images");
                }
            } else {
                clearErrors("images");
            }
        },
        [setValue, clearErrors],
    );

    const uploadPendingImages = useCallback(async () => {
        if (pendingFiles.length === 0) {
            return true;
        }

        try {
            const uploadedUrls: string[] = [];

            for (const file of pendingFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadFileAction(formData);

                if (!result?.success || !result.fileName) {
                    throw new Error("Upload thất bại");
                }

                const imageUrl = baseMinioUrl
                    ? `${baseMinioUrl}/${result.fileName}`
                    : result.fileName;

                uploadedUrls.push(imageUrl);
            }

            const currentImages = watch("images");
            const allImages = [...currentImages, ...uploadedUrls];

            setValue("images", allImages, {
                shouldDirty: true,
                shouldValidate: true,
            });
            clearErrors("images");
            setPendingFiles([]);

            return true;
        } catch (error) {
            console.error("Upload image error:", error);
            setError("images", {
                type: "manual",
                message: "Upload ảnh thất bại. Vui lòng thử lại.",
            });
            return false;
        }
    }, [baseMinioUrl, clearErrors, pendingFiles, setError, setValue, watch]);

    const onSubmit = useCallback(
        async (values: TourFormValues) => {
            const payload = convertTourPayload(values);

            try {
                if (isEditing && viTranslationId) {
                    await updateMultiLanguageTours(viTranslationId, payload);
                } else {
                    await createMultiLanguageTour(payload);
                }

                toast.success(
                    isEditing
                        ? "Tour đã được cập nhật thành công!"
                        : "Tour đã được thêm thành công!",
                );

                onOpenChange(false);
                onSuccess?.();
            } catch (error) {
                console.error("Failed to create/update tour:", error);
                toast.error(
                    isEditing
                        ? "Cập nhật tour thất bại. Vui lòng thử lại."
                        : "Thêm tour thất bại. Vui lòng thử lại.",
                );
            }
        },
        [isEditing, viTranslationId, onOpenChange, onSuccess],
    );

    const handleFormSubmit = useCallback(async () => {
        const imagesUploaded = await uploadPendingImages();
        if (!imagesUploaded) {
            return;
        }

        await handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit, uploadPendingImages]);

    const imagesInitialUrls = useMemo(() => images || [], [images]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[98dvh] max-w-[98dvw]! flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Chỉnh sửa tour" : "Thêm mới tour"}
                    </DialogTitle>
                    <DialogDescription>
                        Nhập nội dung tiếng Việt và tiếng Anh cho tour. Các
                        trường có dấu * là bắt buộc.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex min-h-0 flex-1 flex-col"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleFormSubmit();
                    }}
                >
                    <div className="flex-1 overflow-y-auto pr-1 mb-1">
                        {/* General Information */}
                        <div className="space-y-4 rounded-xl border border-border/70 p-4 mb-4">
                            <div className="space-y-2">
                                <Label htmlFor="destinationId">
                                    Destination {requiredMark}
                                </Label>
                                <Controller
                                    control={control}
                                    name="destinationId"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a destination" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {destinations.map((dest) => (
                                                    <SelectItem
                                                        key={dest.id}
                                                        value={dest.id}
                                                    >
                                                        {dest.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.destinationId ? (
                                    <p className="text-xs text-destructive">
                                        {errors.destinationId.message}
                                    </p>
                                ) : null}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="durationDays">
                                        Duration (Days) {requiredMark}
                                    </Label>
                                    <Input
                                        id="durationDays"
                                        type="number"
                                        min="1"
                                        {...register("durationDays", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.durationDays ? (
                                        <p className="text-xs text-destructive">
                                            {errors.durationDays.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxPeople">
                                        Max People {requiredMark}
                                    </Label>
                                    <Input
                                        id="maxPeople"
                                        type="number"
                                        min="1"
                                        {...register("maxPeople", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.maxPeople ? (
                                        <p className="text-xs text-destructive">
                                            {errors.maxPeople.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status {requiredMark}
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">
                                                        Draft
                                                    </SelectItem>
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
                                    {errors.status ? (
                                        <p className="text-xs text-destructive">
                                            {errors.status.message}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="images">
                                    Images {requiredMark}
                                </Label>
                                <UploadImage
                                    key={`images-${images?.length || 0}`}
                                    maxImages={10}
                                    initialUrls={imagesInitialUrls}
                                    onChange={handleImageChange}
                                />
                                {errors.images ? (
                                    <p className="text-xs text-destructive">
                                        {errors.images.message}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                                <div>
                                    <p className="text-sm font-medium">
                                        Featured
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Highlight this tour.
                                    </p>
                                </div>
                                <Controller
                                    control={control}
                                    name="featured"
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) =>
                                                field.onChange(Boolean(checked))
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Language Sections */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Vietnamese */}
                            <div className="space-y-4 rounded-xl border border-border/70 p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">
                                        Tiếng Việt
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Nội dung hiển thị mặc định.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-title">
                                        Title {requiredMark}
                                    </Label>
                                    <Input
                                        id="vi-title"
                                        {...register("vi.title")}
                                    />
                                    {errors.vi?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-description">
                                        Description {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="vi-description"
                                        rows={5}
                                        {...register("vi.description")}
                                    />
                                    {errors.vi?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-currency">
                                            Currency {requiredMark}
                                        </Label>
                                        <Input
                                            id="vi-currency"
                                            {...register("vi.currency")}
                                        />
                                        {errors.vi?.currency ? (
                                            <p className="text-xs text-destructive">
                                                {errors.vi.currency.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vi-price">
                                            Price {requiredMark}
                                        </Label>
                                        <Input
                                            id="vi-price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register("vi.price", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.vi?.price ? (
                                            <p className="text-xs text-destructive">
                                                {errors.vi.price.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vi-salePrice">
                                            Sale Price (Optional)
                                        </Label>
                                        <Input
                                            id="vi-salePrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register("vi.salePrice", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.vi?.salePrice ? (
                                            <p className="text-xs text-destructive">
                                                {errors.vi.salePrice.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-tags">
                                        Tags (comma separated)
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="vi.tags"
                                        render={({ field }) => (
                                            <Input
                                                id="vi-tags"
                                                value={joinComma(field.value)}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        splitComma(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Itinerary {requiredMark}
                                    </p>
                                    <div className="space-y-3">
                                        {viItineraryFields.map(
                                            (field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="space-y-2 p-3 border rounded"
                                                >
                                                    <div className="grid gap-2 grid-cols-3">
                                                        <div>
                                                            <Label
                                                                htmlFor={`vi-itinerary-${index}-day`}
                                                            >
                                                                Day
                                                            </Label>
                                                            <Input
                                                                id={`vi-itinerary-${index}-day`}
                                                                type="number"
                                                                min="1"
                                                                {...register(
                                                                    `vi.itinerary.${index}.day`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Label
                                                                htmlFor={`vi-itinerary-${index}-title`}
                                                            >
                                                                Title
                                                            </Label>
                                                            <Input
                                                                id={`vi-itinerary-${index}-title`}
                                                                {...register(
                                                                    `vi.itinerary.${index}.title`,
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label
                                                            htmlFor={`vi-itinerary-${index}-content`}
                                                        >
                                                            Content
                                                        </Label>
                                                        <Textarea
                                                            id={`vi-itinerary-${index}-content`}
                                                            rows={2}
                                                            {...register(
                                                                `vi.itinerary.${index}.content`,
                                                            )}
                                                        />
                                                    </div>
                                                    {viItineraryFields.length >
                                                        1 && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                removeViItinerary(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                appendViItinerary({
                                                    day:
                                                        Math.max(
                                                            ...viItinerary.map(
                                                                (i) => i.day,
                                                            ),
                                                        ) + 1,
                                                    title: "",
                                                    content: "",
                                                })
                                            }
                                        >
                                            Add Day
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-title">
                                        SEO Title {requiredMark}
                                    </Label>
                                    <Input
                                        id="vi-seo-title"
                                        {...register("vi.seo.title")}
                                    />
                                    {errors.vi?.seo?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.seo.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-description">
                                        SEO Description {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="vi-seo-description"
                                        rows={3}
                                        {...register("vi.seo.description")}
                                    />
                                    {errors.vi?.seo?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.seo.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-keywords">
                                        SEO Keywords (comma separated)
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="vi.seo.keywords"
                                        render={({ field }) => (
                                            <Input
                                                id="vi-seo-keywords"
                                                value={joinComma(field.value)}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        splitComma(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* English */}
                            <div className="space-y-4 rounded-xl border border-border/70 p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">
                                        English
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Bản dịch cho khách quốc tế.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-title">
                                        Title {requiredMark}
                                    </Label>
                                    <Input
                                        id="en-title"
                                        {...register("en.title")}
                                    />
                                    {errors.en?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-description">
                                        Description {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="en-description"
                                        rows={5}
                                        {...register("en.description")}
                                    />
                                    {errors.en?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="en-currency">
                                            Currency {requiredMark}
                                        </Label>
                                        <Input
                                            id="en-currency"
                                            {...register("en.currency")}
                                        />
                                        {errors.en?.currency ? (
                                            <p className="text-xs text-destructive">
                                                {errors.en.currency.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="en-price">
                                            Price {requiredMark}
                                        </Label>
                                        <Input
                                            id="en-price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register("en.price", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.en?.price ? (
                                            <p className="text-xs text-destructive">
                                                {errors.en.price.message}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="en-salePrice">
                                            Sale Price (Optional)
                                        </Label>
                                        <Input
                                            id="en-salePrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register("en.salePrice", {
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.en?.salePrice ? (
                                            <p className="text-xs text-destructive">
                                                {errors.en.salePrice.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-tags">
                                        Tags (comma separated)
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="en.tags"
                                        render={({ field }) => (
                                            <Input
                                                id="en-tags"
                                                value={joinComma(field.value)}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        splitComma(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Itinerary {requiredMark}
                                    </p>
                                    <div className="space-y-3">
                                        {enItineraryFields.map(
                                            (field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="space-y-2 p-3 border rounded"
                                                >
                                                    <div className="grid gap-2 grid-cols-3">
                                                        <div>
                                                            <Label
                                                                htmlFor={`en-itinerary-${index}-day`}
                                                            >
                                                                Day
                                                            </Label>
                                                            <Input
                                                                id={`en-itinerary-${index}-day`}
                                                                type="number"
                                                                min="1"
                                                                {...register(
                                                                    `en.itinerary.${index}.day`,
                                                                    {
                                                                        valueAsNumber: true,
                                                                    },
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Label
                                                                htmlFor={`en-itinerary-${index}-title`}
                                                            >
                                                                Title
                                                            </Label>
                                                            <Input
                                                                id={`en-itinerary-${index}-title`}
                                                                {...register(
                                                                    `en.itinerary.${index}.title`,
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label
                                                            htmlFor={`en-itinerary-${index}-content`}
                                                        >
                                                            Content
                                                        </Label>
                                                        <Textarea
                                                            id={`en-itinerary-${index}-content`}
                                                            rows={2}
                                                            {...register(
                                                                `en.itinerary.${index}.content`,
                                                            )}
                                                        />
                                                    </div>
                                                    {enItineraryFields.length >
                                                        1 && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                removeEnItinerary(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                appendEnItinerary({
                                                    day:
                                                        Math.max(
                                                            ...enItinerary.map(
                                                                (i) => i.day,
                                                            ),
                                                        ) + 1,
                                                    title: "",
                                                    content: "",
                                                })
                                            }
                                        >
                                            Add Day
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-title">
                                        SEO Title {requiredMark}
                                    </Label>
                                    <Input
                                        id="en-seo-title"
                                        {...register("en.seo.title")}
                                    />
                                    {errors.en?.seo?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.seo.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-description">
                                        SEO Description {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="en-seo-description"
                                        rows={3}
                                        {...register("en.seo.description")}
                                    />
                                    {errors.en?.seo?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.seo.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-keywords">
                                        SEO Keywords (comma separated)
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="en.seo.keywords"
                                        render={({ field }) => (
                                            <Input
                                                id="en-seo-keywords"
                                                value={joinComma(field.value)}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        splitComma(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-border/70 justify-center!">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="min-w-30"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" className="min-w-30">
                            {isEditing ? "Lưu" : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
