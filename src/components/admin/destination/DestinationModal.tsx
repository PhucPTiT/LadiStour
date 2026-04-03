"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
    createMultiLanguageDestinations,
    getTranslations,
    updateMultiLanguageDestinations,
} from "@/service/destinations/DestinationService";

const localizedSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc"),
    shortDescription: z.string().min(1, "Mô tả ngắn là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    location: z.object({
        country: z.string().min(1, "Quốc gia là bắt buộc"),
        city: z.string().min(1, "Thành phố là bắt buộc"),
    }),
    seo: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).catch([]),
    }),
});

const destinationFormSchema = z.object({
    vi: localizedSchema,
    en: localizedSchema,
    thumbnail: z.string().min(1, "Ảnh thumbnail là bắt buộc"),
    banner: z.string().min(1, "Ảnh banner là bắt buộc"),
    isFeatured: z.boolean(),
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

const defaultValues: DestinationFormValues = {
    vi: {
        name: "",
        shortDescription: "",
        description: "",
        location: { country: "", city: "" },
        seo: { title: "", description: "", keywords: [] },
    },
    en: {
        name: "",
        shortDescription: "",
        description: "",
        location: { country: "", city: "" },
        seo: { title: "", description: "", keywords: [] },
    },
    thumbnail: "",
    banner: "",
    isFeatured: false,
};

const joinComma = (value?: string[]) => (value ? value.join(", ") : "");

/**
 * Input từ khóa SEO — dùng local state để giữ nguyên raw text khi gõ
 * (kể cả dấu cách), chỉ convert sang string[] khi blur hoặc khi value
 * từ bên ngoài thay đổi.
 */
function KeywordsInput({
    value,
    onChange,
    id,
    placeholder,
}: {
    value: string[];
    onChange: (keywords: string[]) => void;
    id?: string;
    placeholder?: string;
}) {
    const [raw, setRaw] = useState(() => joinComma(value));

    // Đồng bộ khi form reset hoặc load dữ liệu từ API
    useEffect(() => {
        setRaw(joinComma(value));
    }, [value]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRaw(e.target.value);
        },
        [],
    );

    const handleBlur = useCallback(() => {
        const keywords = raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        onChange(keywords);
        // Chuẩn hoá lại hiển thị sau blur
        setRaw(joinComma(keywords));
    }, [raw, onChange]);

    return (
        <Input
            id={id}
            placeholder={placeholder}
            value={raw}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}

type DestinationModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    translationGroupId?: string | null;
    onSuccess?: () => void;
};

export default function DestinationModal({
    open,
    onOpenChange,
    translationGroupId,
    onSuccess,
}: DestinationModalProps) {
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
    } = useForm<DestinationFormValues>({
        resolver: zodResolver(destinationFormSchema),
        defaultValues,
    });

    const thumbnail = watch("thumbnail");
    const banner = watch("banner");
    const [pendingFiles, setPendingFiles] = useState<{
        thumbnail: File | null;
        banner: File | null;
    }>({
        thumbnail: null,
        banner: null,
    });
    const [viTranslationId, setViTranslationId] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const loadTranslations = async () => {
            if (!translationGroupId) {
                reset(defaultValues);
                return;
            }

            try {
                const translations = await getTranslations(translationGroupId);

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
                                  name: viTranslation.name,
                                  shortDescription:
                                      viTranslation.shortDescription,
                                  description: viTranslation.description,
                                  location: viTranslation.location,
                                  seo: {
                                      title: viTranslation.seo?.title ?? "",
                                      description:
                                          viTranslation.seo?.description ?? "",
                                      keywords:
                                          viTranslation.seo?.keywords ?? [],
                                  },
                              }
                            : defaultValues.vi,
                        en: enTranslation
                            ? {
                                  name: enTranslation.name,
                                  shortDescription:
                                      enTranslation.shortDescription,
                                  description: enTranslation.description,
                                  location: enTranslation.location,
                                  seo: {
                                      title: enTranslation.seo?.title ?? "",
                                      description:
                                          enTranslation.seo?.description ?? "",
                                      keywords:
                                          enTranslation.seo?.keywords ?? [],
                                  },
                              }
                            : defaultValues.en,
                        thumbnail: viTranslation?.thumbnail || "",
                        banner: viTranslation?.banner || "",
                        isFeatured: viTranslation?.featured ?? false,
                    });
                }
            } catch (error) {
                console.error("Failed to load translations:", error);
                toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
            }
        };

        loadTranslations();
    }, [open, translationGroupId, reset]);

    const handleImageChange = useCallback(
        (fieldName: "thumbnail" | "banner") =>
            async (data: { existingIds: string[]; newFiles: File[] }) => {
                const [latestFile] = data.newFiles.slice(-1);

                if (latestFile) {
                    setPendingFiles((prev) => ({
                        ...prev,
                        [fieldName]: latestFile,
                    }));
                    clearErrors(fieldName);
                    return;
                }

                setPendingFiles((prev) => ({
                    ...prev,
                    [fieldName]: null,
                }));

                const [existingUrl] = data.existingIds;
                const nextValue = existingUrl ?? "";

                if (nextValue !== watch(fieldName)) {
                    setValue(fieldName, nextValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }

                if (existingUrl) {
                    clearErrors(fieldName);
                }
            },
        [clearErrors, setValue, watch],
    );

    const uploadPendingField = useCallback(
        async (fieldName: "thumbnail" | "banner") => {
            const file = pendingFiles[fieldName];
            if (!file) {
                return true;
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

                setValue(fieldName, imageUrl, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                clearErrors(fieldName);
                setPendingFiles((prev) => ({
                    ...prev,
                    [fieldName]: null,
                }));

                return true;
            } catch (error) {
                console.error("Upload image error:", error);
                setError(fieldName, {
                    type: "manual",
                    message: "Upload ảnh thất bại. Vui lòng thử lại.",
                });
                return false;
            }
        },
        [baseMinioUrl, clearErrors, pendingFiles, setError, setValue],
    );

    const handleThumbnailChange = useMemo(
        () => handleImageChange("thumbnail"),
        [handleImageChange],
    );

    const handleBannerChange = useMemo(
        () => handleImageChange("banner"),
        [handleImageChange],
    );

    const thumbnailInitialUrls = useMemo(
        () => (thumbnail ? [thumbnail] : []),
        [thumbnail],
    );

    const bannerInitialUrls = useMemo(() => (banner ? [banner] : []), [banner]);

    const handleThumbnailError = useCallback(
        (message: string) => {
            setError("thumbnail", { type: "manual", message });
        },
        [setError],
    );

    const handleBannerError = useCallback(
        (message: string) => {
            setError("banner", { type: "manual", message });
        },
        [setError],
    );

    const onSubmit = useCallback(
        async (values: DestinationFormValues) => {
            const payload = {
                ...values,
                vi: {
                    ...values.vi,
                    seo: {
                        ...values.vi.seo,
                        keywords: values.vi.seo.keywords ?? [],
                    },
                },
                en: {
                    ...values.en,
                    seo: {
                        ...values.en.seo,
                        keywords: values.en.seo.keywords ?? [],
                    },
                },
            };

            try {
                if (isEditing && viTranslationId) {
                    await updateMultiLanguageDestinations(
                        viTranslationId,
                        payload,
                    );
                } else {
                    await createMultiLanguageDestinations(payload);
                }

                toast.success(
                    isEditing
                        ? "Điểm đến đã được cập nhật thành công!"
                        : "Điểm đến đã được thêm thành công!",
                );

                onOpenChange(false);
                onSuccess?.();
            } catch (error) {
                console.error("Failed to create/update destination:", error);
                toast.error(
                    isEditing
                        ? "Cập nhật điểm đến thất bại. Vui lòng thử lại."
                        : "Thêm điểm đến thất bại. Vui lòng thử lại.",
                );
            }
        },
        [isEditing, viTranslationId, onOpenChange, onSuccess],
    );

    const handleFormSubmit = useCallback(async () => {
        const thumbnailUploaded = await uploadPendingField("thumbnail");
        if (!thumbnailUploaded) return;

        const bannerUploaded = await uploadPendingField("banner");
        if (!bannerUploaded) return;

        await handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit, uploadPendingField]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[98dvh] max-w-[98dvw]! flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Chỉnh sửa điểm đến" : "Thêm mới điểm đến"}
                    </DialogTitle>
                    <DialogDescription>
                        Nhập nội dung tiếng Việt và tiếng Anh cho điểm đến. Các
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
                        <div className="grid gap-6 lg:grid-cols-2">
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
                                    <Label htmlFor="vi-name">
                                        Tên {requiredMark}
                                    </Label>
                                    <Input
                                        id="vi-name"
                                        {...register("vi.name")}
                                    />
                                    {errors.vi?.name ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.name.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-shortDescription">
                                        Mô tả ngắn {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="vi-shortDescription"
                                        rows={3}
                                        {...register("vi.shortDescription")}
                                    />
                                    {errors.vi?.shortDescription ? (
                                        <p className="text-xs text-destructive">
                                            {errors.vi.shortDescription.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-description">
                                        Mô tả {requiredMark}
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

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-location-country">
                                            Quốc gia {requiredMark}
                                        </Label>
                                        <Input
                                            id="vi-location-country"
                                            {...register("vi.location.country")}
                                        />
                                        {errors.vi?.location?.country ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors.vi.location.country
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vi-location-city">
                                            Thành phố {requiredMark}
                                        </Label>
                                        <Input
                                            id="vi-location-city"
                                            {...register("vi.location.city")}
                                        />
                                        {errors.vi?.location?.city ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors.vi.location.city
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-title">
                                        SEO title
                                    </Label>
                                    <Input
                                        id="vi-seo-title"
                                        {...register("vi.seo.title")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-description">
                                        SEO description
                                    </Label>
                                    <Textarea
                                        id="vi-seo-description"
                                        rows={3}
                                        {...register("vi.seo.description")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vi-seo-keywords">
                                        SEO từ khóa
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="vi.seo.keywords"
                                        render={({ field }) => (
                                            <KeywordsInput
                                                id="vi-seo-keywords"
                                                placeholder="Ví dụ: du lịch, tour du lịch, điểm đến tuyệt đẹp"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Nhập các từ khóa cách nhau bởi dấu phẩy
                                        (,). Mỗi từ khóa có thể chứa dấu cách.
                                    </p>
                                </div>
                            </div>

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
                                    <Label htmlFor="en-name">
                                        Name {requiredMark}
                                    </Label>
                                    <Input
                                        id="en-name"
                                        {...register("en.name")}
                                    />
                                    {errors.en?.name ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.name.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-shortDescription">
                                        Short description {requiredMark}
                                    </Label>
                                    <Textarea
                                        id="en-shortDescription"
                                        rows={3}
                                        {...register("en.shortDescription")}
                                    />
                                    {errors.en?.shortDescription ? (
                                        <p className="text-xs text-destructive">
                                            {errors.en.shortDescription.message}
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

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="en-location-country">
                                            Country {requiredMark}
                                        </Label>
                                        <Input
                                            id="en-location-country"
                                            {...register("en.location.country")}
                                        />
                                        {errors.en?.location?.country ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors.en.location.country
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="en-location-city">
                                            City {requiredMark}
                                        </Label>
                                        <Input
                                            id="en-location-city"
                                            {...register("en.location.city")}
                                        />
                                        {errors.en?.location?.city ? (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors.en.location.city
                                                        .message
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-title">
                                        SEO title
                                    </Label>
                                    <Input
                                        id="en-seo-title"
                                        {...register("en.seo.title")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-description">
                                        SEO description
                                    </Label>
                                    <Textarea
                                        id="en-seo-description"
                                        rows={3}
                                        {...register("en.seo.description")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en-seo-keywords">
                                        SEO keywords
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="en.seo.keywords"
                                        render={({ field }) => (
                                            <KeywordsInput
                                                id="en-seo-keywords"
                                                placeholder="Example: travel, tour packages, beautiful destination"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter keywords separated by commas (,).
                                        Each keyword can contain spaces.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 rounded-xl border border-border/70 p-4 md:grid-cols-2">
                            <div className="flex w-full md:col-span-2">
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="thumbnail">
                                        Thumbnail {requiredMark}
                                    </Label>
                                    <UploadImage
                                        key={`thumbnail-${thumbnail || "empty"}`}
                                        maxImages={1}
                                        initialUrls={thumbnailInitialUrls}
                                        onChange={handleThumbnailChange}
                                        onError={handleThumbnailError}
                                    />
                                    {errors.thumbnail ? (
                                        <p className="text-xs text-destructive">
                                            {errors.thumbnail.message}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="banner">
                                        Banner {requiredMark}
                                    </Label>
                                    <UploadImage
                                        key={`banner-${banner || "empty"}`}
                                        maxImages={1}
                                        initialUrls={bannerInitialUrls}
                                        onChange={handleBannerChange}
                                        onError={handleBannerError}
                                    />
                                    {errors.banner ? (
                                        <p className="text-xs text-destructive">
                                            {errors.banner.message}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 md:col-span-2">
                                <div>
                                    <p className="text-sm font-medium">
                                        Nổi bật
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Đẩy điểm đến lên nhóm đề xuất.
                                    </p>
                                </div>
                                <Controller
                                    control={control}
                                    name="isFeatured"
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
