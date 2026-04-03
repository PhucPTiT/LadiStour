"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UploadImage from "@/components/customs/UploadImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    contentTemplate,
    SimpleEditor,
} from "@/components/tiptap-templates/simple/simple-editor";
import { uploadFileAction } from "@/app/actions/upload-image";
import { createPost, updatePost } from "@/service/post/PostService";
import { Post } from "@/service/post/type";

const postFormSchema = z.object({
    locale: z.enum(["vi", "en"]),
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    thumbnail: z.string().min(1, "Thumbnail là bắt buộc"),
    excerpt: z.string().min(1, "Mô tả ngắn là bắt buộc"),
    contentHtml: z.string().min(1, "Nội dung là bắt buộc"),
    categoryId: z.string().optional().nullable(),
    tags: z.array(z.string()),
    seo: z.object({
        title: z.string().min(1, "SEO Title là bắt buộc"),
        description: z.string().min(1, "SEO Description là bắt buộc"),
        keywords: z.array(z.string()),
    }),
});

type PostFormValues = z.infer<typeof postFormSchema>;

const defaultValues: PostFormValues = {
    locale: "vi",
    title: "",
    thumbnail: "",
    excerpt: "",
    contentHtml: contentTemplate,
    categoryId: "",
    tags: [],
    seo: {
        title: "",
        description: "",
        keywords: [],
    },
};

const splitComma = (value: string) =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const joinComma = (value?: string[]) => (value ? value.join(", ") : "");

interface PostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post?: Post | null;
    categories: Array<{ id: string; name: string }>;
    onSuccess?: () => void;
}

export default function PostModal({
    open,
    onOpenChange,
    post,
    categories,
    onSuccess,
}: PostModalProps) {
    const [pendingFiles, setPendingFiles] = useState<{
        thumbnail: File | null;
    }>({
        thumbnail: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const requiredMark = <span className="text-destructive">*</span>;

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        clearErrors,
        setError,
        watch,
        formState: { errors },
    } = useForm<PostFormValues>({
        resolver: zodResolver(postFormSchema),
        defaultValues,
    });

    const thumbnail = watch("thumbnail");
    const contentHtml = watch("contentHtml");

    const baseMinioUrl =
        process.env.NEXT_PUBLIC_BASE_URL_MINIO?.replace(/\/$/, "") ?? "";

    // Load post data when opening in edit mode
    useEffect(() => {
        if (!open) return;

        setPendingFiles({
            thumbnail: null,
        });

        if (!post) {
            reset(defaultValues);
            return;
        }

        reset({
            locale: post.locale as "vi" | "en",
            title: post.title,
            thumbnail: post.thumbnail,
            excerpt: post.excerpt,
            contentHtml: post.contentHtml,
            categoryId: post.categoryId,
            tags: post.tags || [],
            seo: {
                title: post.seo.title ?? "",
                description: post.seo.description ?? "",
                keywords: post.seo.keywords || [],
            },
        });
    }, [open, post, reset]);

    const handleImageChange = useCallback(
        (data: { existingIds: string[]; newFiles: File[] }) => {
            const [latestFile] = data.newFiles.slice(-1);

            if (latestFile) {
                setPendingFiles((prev) => ({
                    ...prev,
                    thumbnail: latestFile,
                }));
                clearErrors("thumbnail");
                return;
            }

            setPendingFiles((prev) => ({
                ...prev,
                thumbnail: null,
            }));

            const [existingUrl] = data.existingIds;
            const nextValue = existingUrl ?? "";

            if (nextValue !== watch("thumbnail")) {
                setValue("thumbnail", nextValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }

            if (existingUrl) {
                clearErrors("thumbnail");
            }
        },
        [clearErrors, setValue, watch],
    );

    const uploadPendingField = useCallback(async () => {
        const file = pendingFiles.thumbnail;
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

            setValue("thumbnail", imageUrl, {
                shouldDirty: true,
                shouldValidate: true,
            });
            clearErrors("thumbnail");
            setPendingFiles((prev) => ({
                ...prev,
                thumbnail: null,
            }));

            return true;
        } catch (error) {
            console.error("Upload image error:", error);
            setError("thumbnail", {
                type: "manual",
                message: "Upload ảnh thất bại. Vui lòng thử lại.",
            });
            return false;
        }
    }, [baseMinioUrl, clearErrors, pendingFiles, setError, setValue]);

    const onSubmit = useCallback(
        async (values: PostFormValues) => {
            console.log("values");
            try {
                const payload = {
                    locale: values.locale,
                    title: values.title,
                    thumbnail: values.thumbnail,
                    excerpt: values.excerpt,
                    contentHtml: values.contentHtml,
                    categoryId: values.categoryId,
                    tags: values.tags || [],
                    seo: {
                        title: values.seo.title,
                        description: values.seo.description,
                        keywords: values.seo.keywords || [],
                    },
                };

                if (post?.id) {
                    await updatePost(post.id, payload);
                    toast.success("Cập nhật bài viết thành công.");
                } else {
                    await createPost(payload);
                    toast.success("Tạo bài viết thành công.");
                }

                onSuccess?.();
                onOpenChange(false);
            } catch (error) {
                console.error("Failed to save post:", error);
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Lỗi khi lưu bài viết. Vui lòng thử lại.",
                );
            }
        },
        [post, onSuccess, onOpenChange],
    );

    const handleThumbnailError = useCallback(
        (message: string) => {
            setError("thumbnail", {
                type: "manual",
                message,
            });
        },
        [setError],
    );

    const handleEditorChange = useCallback(
        (nextHtml: string) => {
            setValue("contentHtml", nextHtml, {
                shouldDirty: true,
                shouldValidate: true,
            });

            if (nextHtml.trim()) {
                clearErrors("contentHtml");
            }
        },
        [clearErrors, setValue],
    );

    const thumbnailInitialUrls = useMemo(
        () => (thumbnail ? [thumbnail] : []),
        [thumbnail],
    );

    const handleFormSubmit = useCallback(async () => {
        try {
            setIsSubmitting(true);

            // Upload pending images first, before validation
            const uploadSuccess = await uploadPendingField();
            if (!uploadSuccess) return;

            await handleSubmit(onSubmit, () => {
                toast.error(
                    "Vui lòng kiểm tra các trường bắt buộc trước khi lưu.",
                );
            })();
        } finally {
            setIsSubmitting(false);
        }
    }, [handleSubmit, onSubmit, uploadPendingField]);

    const handleClose = () => {
        reset(defaultValues);
        setPendingFiles({
            thumbnail: null,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="max-w-full! h-screen! w-full p-0 gap-0 rounded-none border-0 flex flex-col"
                showCloseButton={false}
            >
                {/* Header with Buttons */}
                <div className="fixed top-0 right-0 z-50 p-4 flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="min-w-30"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="post-form"
                        disabled={isSubmitting}
                        className="min-w-30"
                    >
                        {isSubmitting
                            ? "Đang lưu..."
                            : post
                              ? "Cập Nhật"
                              : "Tạo Mới"}
                    </Button>
                </div>

                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl">
                        {post ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}
                    </DialogTitle>
                </DialogHeader>

                {/* Main Content */}
                <form
                    id="post-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleFormSubmit();
                    }}
                    className="flex-1 overflow-hidden flex gap-0"
                >
                    {/* Left Side - Editor */}
                    <div className="flex-1 border-r overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-hidden">
                            <SimpleEditor
                                value={contentHtml}
                                onChange={handleEditorChange}
                            />
                        </div>
                        {errors.contentHtml && (
                            <span className="px-4 py-2 text-xs text-red-500 border-t">
                                {errors.contentHtml.message}
                            </span>
                        )}
                    </div>

                    {/* Right Side - Sidebar */}
                    <div className="w-80 border-l flex flex-col overflow-auto">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6 pr-4">
                                {/* Locale */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="locale"
                                        className="text-sm font-semibold"
                                    >
                                        Ngôn Ngữ {requiredMark}
                                    </Label>
                                    <Controller
                                        name="locale"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                // open={true}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="locale"
                                                    className="w-full"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vi">
                                                        Tiếng Việt
                                                    </SelectItem>
                                                    <SelectItem value="en">
                                                        English
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.locale && (
                                        <span className="text-xs text-red-500">
                                            {errors.locale.message}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-semibold"
                                    >
                                        Tiêu Đề {requiredMark}
                                    </Label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="title"
                                                placeholder="Nhập tiêu đề bài viết"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.title && (
                                        <span className="text-xs text-red-500">
                                            {errors.title.message}
                                        </span>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        Thumbnail bài viết {requiredMark}
                                    </Label>
                                    <UploadImage
                                        key={`thumbnail-${thumbnail || "empty"}`}
                                        onChange={handleImageChange}
                                        onError={handleThumbnailError}
                                        maxImages={1}
                                        initialUrls={thumbnailInitialUrls}
                                    />
                                    {errors.thumbnail && (
                                        <span className="text-xs text-red-500">
                                            {errors.thumbnail.message}
                                        </span>
                                    )}
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="excerpt"
                                        className="text-sm font-semibold"
                                    >
                                        Mô Tả Ngắn {requiredMark}
                                    </Label>
                                    <Controller
                                        name="excerpt"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="excerpt"
                                                placeholder="Nhập mô tả ngắn về bài viết"
                                                {...field}
                                                className="min-h-24"
                                            />
                                        )}
                                    />
                                    {errors.excerpt && (
                                        <span className="text-xs text-red-500">
                                            {errors.excerpt.message}
                                        </span>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="category"
                                        className="text-sm font-semibold"
                                    >
                                        Danh Mục
                                    </Label>
                                    <Controller
                                        name="categoryId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="category"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem
                                                            key={cat.id}
                                                            value={cat.id}
                                                        >
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.categoryId && (
                                        <span className="text-xs text-red-500">
                                            {errors.categoryId.message}
                                        </span>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="tags"
                                        className="text-sm font-semibold"
                                    >
                                        Tags
                                    </Label>
                                    <Controller
                                        name="tags"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                id="tags"
                                                placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                                                value={joinComma(field.value)}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        splitComma(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="min-h-20"
                                            />
                                        )}
                                    />
                                </div>

                                {/* SEO Configuration */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="text-sm font-bold uppercase tracking-wide">
                                        Cấu Hình SEO
                                    </h3>

                                    {/* SEO Title */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="seo-title"
                                            className="text-sm font-semibold"
                                        >
                                            SEO Title {requiredMark}
                                        </Label>
                                        <Controller
                                            name="seo.title"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Input
                                                        id="seo-title"
                                                        placeholder="Tiêu đề cho SEO"
                                                        {...field}
                                                    />
                                                    <p className="text-xs text-slate-500">
                                                        {field.value.length}/60
                                                        ký tự
                                                    </p>
                                                </>
                                            )}
                                        />
                                        {errors.seo?.title && (
                                            <span className="text-xs text-red-500">
                                                {errors.seo.title.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* SEO Description */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="seo-description"
                                            className="text-sm font-semibold"
                                        >
                                            SEO Description {requiredMark}
                                        </Label>
                                        <Controller
                                            name="seo.description"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Textarea
                                                        id="seo-description"
                                                        placeholder="Mô tả cho SEO (meta description)"
                                                        {...field}
                                                        className="min-h-20"
                                                    />
                                                    <p className="text-xs text-slate-500">
                                                        {field.value.length}
                                                        /160 ký tự
                                                    </p>
                                                </>
                                            )}
                                        />
                                        {errors.seo?.description && (
                                            <span className="text-xs text-red-500">
                                                {errors.seo.description.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* SEO Keywords */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="seo-keywords"
                                            className="text-sm font-semibold"
                                        >
                                            SEO Keywords
                                        </Label>
                                        <Controller
                                            name="seo.keywords"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    id="seo-keywords"
                                                    placeholder="Từ khóa (cách nhau bằng dấu phẩy)"
                                                    value={joinComma(
                                                        field.value,
                                                    )}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            splitComma(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="min-h-20"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
