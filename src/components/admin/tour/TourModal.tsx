"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    day: z.number().min(1, "Ngày phải lớn hơn hoặc bằng 1"),
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    content: z.string().min(1, "Nội dung là bắt buộc"),
});

const localizedTourSchema = z.object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    salePrice: z.number().optional().nullable(),
    currency: z.string().min(1, "Tiền tệ là bắt buộc"),
    tags: z.array(z.string()),
    itinerary: z.array(TourItinerarySchema),
    seo: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).catch([]),
    }),
});

const tourFormSchema = z.object({
    vi: localizedTourSchema,
    en: localizedTourSchema,
    destinationId: z.string().optional(),
    images: z.array(z.string()).min(1, "Cần ít nhất một hình ảnh"),
    durationDays: z.number().min(1, "Số ngày phải lớn hơn hoặc bằng 1"),
    durationNights: z.number().min(0, "Số đêm phải lớn hơn hoặc bằng 0"),
    maxPeople: z.number().min(1, "Số người tối đa phải lớn hơn hoặc bằng 1"),
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
    durationNights: 2,
    maxPeople: 20,
    status: "draft",
    featured: false,
};

const joinComma = (value?: string[]) => (value ? value.join(", ") : "");

const MAX_SEO_TITLE = 60;
const MAX_SEO_DESCRIPTION = 160;

/**
 * Input tags/keywords — giữ raw text khi gõ, chỉ convert sang string[]
 * khi blur để tránh bị trim dấu cách giữa chừng.
 */
function CommaInput({
    value,
    onChange,
    id,
    placeholder,
}: {
    value: string[];
    onChange: (v: string[]) => void;
    id?: string;
    placeholder?: string;
}) {
    const [raw, setRaw] = useState(() => joinComma(value));

    useEffect(() => {
        setRaw(joinComma(value));
    }, [value]);

    return (
        <Input
            id={id}
            placeholder={placeholder}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => {
                const keywords = raw
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                onChange(keywords);
                setRaw(joinComma(keywords));
            }}
        />
    );
}

function SeoCharCount({ current, max }: { current: number; max: number }) {
    return (
        <p className={`text-xs text-right tabular-nums ${current > max ? "text-destructive" : "text-muted-foreground"}`}>
            {current}/{max}
        </p>
    );
}

const generateSlug = (title: string): string =>
    title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

const convertTourPayload = (values: TourFormValues) => ({
    vi: {
        title: values.vi.title,
        slug: generateSlug(values.vi.title),
        description: values.vi.description,
        durationDays: values.durationDays,
        durationNights: values.durationNights,
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
        durationNights: values.durationNights,
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
});

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
    const durationDays = watch("durationDays");

    const {
        fields: viItineraryFields,
        append: appendViItinerary,
        remove: removeViItinerary,
    } = useFieldArray({ control, name: "vi.itinerary" });

    const {
        fields: enItineraryFields,
        append: appendEnItinerary,
        remove: removeEnItinerary,
    } = useFieldArray({ control, name: "en.itinerary" });

    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [viTranslationId, setViTranslationId] = useState<string | null>(null);

    // Flag ngăn effect sync itinerary chạy trong lúc đang load/reset data
    const isSyncingRef = useRef(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load data khi mở modal
    useEffect(() => {
        if (!open) return;

        const loadTranslations = async () => {
            // Tắt sync trong khi load để tránh append/remove không mong muốn
            isSyncingRef.current = true;

            if (!translationGroupId) {
                reset(defaultValues);
                setPendingFiles([]);
                isSyncingRef.current = false;
                return;
            }

            try {
                const translations = await getTourTranslations(translationGroupId);

                const viTranslation = translations.find((t) => t.locale === "vi");
                const enTranslation = translations.find((t) => t.locale === "en");

                if (viTranslation || enTranslation) {
                    if (viTranslation) setViTranslationId(viTranslation.id);

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
                                  seo: {
                                      title: viTranslation.seo?.title ?? "",
                                      description: viTranslation.seo?.description ?? "",
                                      keywords: viTranslation.seo?.keywords ?? [],
                                  },
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
                                  seo: {
                                      title: enTranslation.seo?.title ?? "",
                                      description: enTranslation.seo?.description ?? "",
                                      keywords: enTranslation.seo?.keywords ?? [],
                                  },
                              }
                            : defaultValues.en,
                        destinationId: viTranslation?.destinationId || "",
                        images: viTranslation?.images || [],
                        durationDays: viTranslation?.durationDays || 3,
                        durationNights: viTranslation?.durationNights || 2,
                        maxPeople: viTranslation?.maxPeople || 20,
                        status: viTranslation?.status || "draft",
                        featured: viTranslation?.featured ?? false,
                    });
                    setPendingFiles([]);
                }
            } catch (error) {
                console.error("Failed to load translations:", error);
                toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
            } finally {
                // Bật lại sync sau khi reset xong (dùng timeout để chờ
                // React flush hết state từ reset() trước)
                setTimeout(() => {
                    isSyncingRef.current = false;
                }, 0);
            }
        };

        loadTranslations();
    }, [open, translationGroupId, reset]);

    /**
     * Chỉ sync itinerary theo durationDays khi người dùng tự tay thay đổi
     * input số ngày (không chạy khi đang load data).
     * KHÔNG có effect ngược (itinerary.length → durationDays) để tránh vòng lặp.
     */
    useEffect(() => {
        if (!open || isSyncingRef.current) return;

        const target = durationDays;
        if (!target || target < 1) return;

        const viLen = viItinerary.length;
        const enLen = enItinerary.length;

        // Lưu scroll trước khi append để tránh tự cuộn xuống
        const savedScroll = scrollRef.current?.scrollTop ?? 0;

        if (viLen < target) {
            for (let i = viLen; i < target; i++) {
                appendViItinerary({ day: i + 1, title: "", content: "" });
            }
        } else if (viLen > target) {
            for (let i = viLen - 1; i >= target; i--) {
                removeViItinerary(i);
            }
        }

        if (enLen < target) {
            for (let i = enLen; i < target; i++) {
                appendEnItinerary({ day: i + 1, title: "", content: "" });
            }
        } else if (enLen > target) {
            for (let i = enLen - 1; i >= target; i--) {
                removeEnItinerary(i);
            }
        }

        // Restore scroll sau khi React flush DOM
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = savedScroll;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [durationDays, open]);

    const handleImageChange = useCallback(
        (data: { existingIds: string[]; newFiles: File[] }) => {
            setPendingFiles(data.newFiles);

            if (data.newFiles.length === 0) {
                setValue("images", data.existingIds, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                if (data.existingIds.length > 0) clearErrors("images");
            } else {
                clearErrors("images");
            }
        },
        [setValue, clearErrors],
    );

    const uploadPendingImages = useCallback(async () => {
        if (pendingFiles.length === 0) return true;

        try {
            const uploadedUrls: string[] = [];

            for (const file of pendingFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadFileAction(formData);

                if (!result?.success || !result.fileName) {
                    throw new Error("Upload thất bại");
                }

                uploadedUrls.push(
                    baseMinioUrl
                        ? `${baseMinioUrl}/${result.fileName}`
                        : result.fileName,
                );
            }

            const allImages = [...watch("images"), ...uploadedUrls];
            setValue("images", allImages, { shouldDirty: true, shouldValidate: true });
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
        if (!imagesUploaded) return;
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
                    <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 mb-1 [overflow-anchor:none]">
                        {/* General Information */}
                        <div className="space-y-4 rounded-xl border border-border/70 p-4 mb-4">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="destinationId">
                                        Chọn địa điểm cho tour
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="destinationId"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
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

                                <div className="space-y-2">
                                    <Label htmlFor="durationDays">
                                        Số ngày (Days) {requiredMark}
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
                                    <Label htmlFor="durationNights">
                                        Số đêm (Nights) {requiredMark}
                                    </Label>
                                    <Input
                                        id="durationNights"
                                        type="number"
                                        min="0"
                                        {...register("durationNights", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.durationNights ? (
                                        <p className="text-xs text-destructive">
                                            {errors.durationNights.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxPeople">
                                        Số người tối đa {requiredMark}
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
                                        Trạng thái {requiredMark}
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">
                                                        Nháp
                                                    </SelectItem>
                                                    <SelectItem value="published">
                                                        Đang bán
                                                    </SelectItem>
                                                    <SelectItem value="archived">
                                                        Đã ngừng bán
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
                                    Hình ảnh {requiredMark}
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
                                    <p className="text-sm font-medium">Nổi bật</p>
                                    <p className="text-xs text-muted-foreground">
                                        Bật nếu tour này là tour nổi bật.
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
                                    <p className="text-sm font-semibold">Tiếng Việt</p>
                                    <p className="text-xs text-muted-foreground">
                                        Nội dung hiển thị mặc định.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-title">Tiêu đề {requiredMark}</Label>
                                    <Input id="vi-title" {...register("vi.title")} />
                                    {errors.vi?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-description">Mô tả {requiredMark}</Label>
                                    <Textarea id="vi-description" rows={5} {...register("vi.description")} />
                                    {errors.vi?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-currency">Tiền tệ {requiredMark}</Label>
                                        <Input id="vi-currency" {...register("vi.currency")} />
                                        {errors.vi?.currency ? (
                                            <p className="text-xs text-destructive">
                                                {errors.vi.currency.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-price">Giá {requiredMark}</Label>
                                        <Input id="vi-price" type="number" min="0" step="0.01"
                                            {...register("vi.price", { valueAsNumber: true })} />
                                        {errors.vi?.price ? (
                                            <p className="text-xs text-destructive">
                                                {errors.vi.price.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-salePrice">Giá Khuyến Mãi (Tùy chọn)</Label>
                                        <Input id="vi-salePrice" type="number" min="0" step="0.01"
                                            {...register("vi.salePrice", { valueAsNumber: true })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-tags">Tags (comma separated)</Label>
                                    <Controller
                                        control={control}
                                        name="vi.tags"
                                        render={({ field }) => (
                                            <CommaInput
                                                id="vi-tags"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Lịch trình {requiredMark}</p>
                                    <div className="space-y-3">
                                        {viItineraryFields.map((field, index) => (
                                            <div key={field.id} className="space-y-2 p-3 border rounded">
                                                <div className="grid gap-2 grid-cols-3">
                                                    <div>
                                                        <Label>Ngày</Label>
                                                        <Input type="number" min="1" readOnly
                                                            {...register(`vi.itinerary.${index}.day`, { valueAsNumber: true })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Tiêu đề</Label>
                                                        <Input {...register(`vi.itinerary.${index}.title`)} />
                                                        {errors.vi?.itinerary?.[index]?.title ? (
                                                            <p className="text-xs text-destructive">
                                                                {errors.vi.itinerary[index].title.message}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Nội dung</Label>
                                                    <Textarea rows={2} {...register(`vi.itinerary.${index}.content`)} />
                                                    {errors.vi?.itinerary?.[index]?.content ? (
                                                        <p className="text-xs text-destructive">
                                                            {errors.vi.itinerary[index].content.message}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                {viItineraryFields.length > 1 && (
                                                    <Button type="button" size="sm" variant="destructive"
                                                        onClick={() => {
                                                            removeViItinerary(index);
                                                            removeEnItinerary(index);
                                                            setValue("durationDays", viItineraryFields.length - 1, {
                                                                shouldDirty: true,
                                                                shouldValidate: true,
                                                            });
                                                        }}>
                                                        Xóa
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button type="button" size="sm" variant="outline"
                                            onClick={() => {
                                                const newDay = Math.max(...viItinerary.map((i) => i.day)) + 1;
                                                const savedScroll = scrollRef.current?.scrollTop ?? 0;
                                                appendViItinerary({ day: newDay, title: "", content: "" });
                                                appendEnItinerary({ day: newDay, title: "", content: "" });
                                                setValue("durationDays", viItinerary.length + 1, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                                requestAnimationFrame(() => {
                                                    if (scrollRef.current) {
                                                        scrollRef.current.scrollTop = savedScroll;
                                                    }
                                                });
                                            }}>
                                            Thêm ngày
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-title">SEO Title</Label>
                                    <Input
                                        id="vi-seo-title"
                                        maxLength={MAX_SEO_TITLE}
                                        placeholder="Tiêu đề hiển thị trên Google (tối đa 60 ký tự)"
                                        {...register("vi.seo.title")}
                                    />
                                    <SeoCharCount
                                        current={watch("vi.seo.title")?.length ?? 0}
                                        max={MAX_SEO_TITLE}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-description">SEO Description</Label>
                                    <Textarea
                                        id="vi-seo-description"
                                        rows={3}
                                        maxLength={MAX_SEO_DESCRIPTION}
                                        placeholder="Mô tả hiển thị trên Google (tối đa 160 ký tự)"
                                        {...register("vi.seo.description")}
                                    />
                                    <SeoCharCount
                                        current={watch("vi.seo.description")?.length ?? 0}
                                        max={MAX_SEO_DESCRIPTION}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-keywords">SEO Keywords</Label>
                                    <Controller
                                        control={control}
                                        name="vi.seo.keywords"
                                        render={({ field }) => (
                                            <CommaInput
                                                id="vi-seo-keywords"
                                                placeholder="Ví dụ: du lịch Hà Nội, tour miền Bắc, khám phá Việt Nam"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Nhập các từ khóa cách nhau bởi dấu phẩy (,)
                                    </p>
                                </div>
                            </div>

                            {/* English */}
                            <div className="space-y-4 rounded-xl border border-border/70 p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">English</p>
                                    <p className="text-xs text-muted-foreground">
                                        Bản dịch cho khách quốc tế.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-title">Title {requiredMark}</Label>
                                    <Input id="en-title" {...register("en.title")} />
                                    {errors.en?.title ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.title.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-description">Description {requiredMark}</Label>
                                    <Textarea id="en-description" rows={5} {...register("en.description")} />
                                    {errors.en?.description ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.description.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="en-currency">Currency {requiredMark}</Label>
                                        <Input id="en-currency" {...register("en.currency")} />
                                        {errors.en?.currency ? (
                                            <p className="text-xs text-destructive">
                                                {errors.en.currency.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="en-price">Price {requiredMark}</Label>
                                        <Input id="en-price" type="number" min="0" step="0.01"
                                            {...register("en.price", { valueAsNumber: true })} />
                                        {errors.en?.price ? (
                                            <p className="text-xs text-destructive">
                                                {errors.en.price.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="en-salePrice">Sale Price (Optional)</Label>
                                        <Input id="en-salePrice" type="number" min="0" step="0.01"
                                            {...register("en.salePrice", { valueAsNumber: true })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-tags">Tags (comma separated)</Label>
                                    <Controller
                                        control={control}
                                        name="en.tags"
                                        render={({ field }) => (
                                            <CommaInput
                                                id="en-tags"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Itinerary {requiredMark}</p>
                                    <div className="space-y-3">
                                        {enItineraryFields.map((field, index) => (
                                            <div key={field.id} className="space-y-2 p-3 border rounded">
                                                <div className="grid gap-2 grid-cols-3">
                                                    <div>
                                                        <Label>Day</Label>
                                                        <Input type="number" min="1" readOnly
                                                            {...register(`en.itinerary.${index}.day`, { valueAsNumber: true })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Title</Label>
                                                        <Input {...register(`en.itinerary.${index}.title`)} />
                                                        {errors.en?.itinerary?.[index]?.title ? (
                                                            <p className="text-xs text-destructive">
                                                                {errors.en.itinerary[index].title.message}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Content</Label>
                                                    <Textarea rows={2} {...register(`en.itinerary.${index}.content`)} />
                                                    {errors.en?.itinerary?.[index]?.content ? (
                                                        <p className="text-xs text-destructive">
                                                            {errors.en.itinerary[index].content.message}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                {enItineraryFields.length > 1 && (
                                                    <Button type="button" size="sm" variant="destructive"
                                                        onClick={() => {
                                                            removeEnItinerary(index);
                                                            removeViItinerary(index);
                                                            setValue("durationDays", enItineraryFields.length - 1, {
                                                                shouldDirty: true,
                                                                shouldValidate: true,
                                                            });
                                                        }}>
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button type="button" size="sm" variant="outline"
                                            onClick={() => {
                                                const newDay = Math.max(...enItinerary.map((i) => i.day)) + 1;
                                                const savedScroll = scrollRef.current?.scrollTop ?? 0;
                                                appendEnItinerary({ day: newDay, title: "", content: "" });
                                                appendViItinerary({ day: newDay, title: "", content: "" });
                                                setValue("durationDays", enItinerary.length + 1, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                                requestAnimationFrame(() => {
                                                    if (scrollRef.current) {
                                                        scrollRef.current.scrollTop = savedScroll;
                                                    }
                                                });
                                            }}>
                                            Add Day
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-title">SEO Title</Label>
                                    <Input
                                        id="en-seo-title"
                                        maxLength={MAX_SEO_TITLE}
                                        placeholder="Title shown on Google (max 60 characters)"
                                        {...register("en.seo.title")}
                                    />
                                    <SeoCharCount
                                        current={watch("en.seo.title")?.length ?? 0}
                                        max={MAX_SEO_TITLE}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-description">SEO Description</Label>
                                    <Textarea
                                        id="en-seo-description"
                                        rows={3}
                                        maxLength={MAX_SEO_DESCRIPTION}
                                        placeholder="Description shown on Google (max 160 characters)"
                                        {...register("en.seo.description")}
                                    />
                                    <SeoCharCount
                                        current={watch("en.seo.description")?.length ?? 0}
                                        max={MAX_SEO_DESCRIPTION}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-keywords">SEO Keywords</Label>
                                    <Controller
                                        control={control}
                                        name="en.seo.keywords"
                                        render={({ field }) => (
                                            <CommaInput
                                                id="en-seo-keywords"
                                                placeholder="Example: Hanoi travel, North Vietnam tour, explore Vietnam"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter keywords separated by commas (,)
                                    </p>
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