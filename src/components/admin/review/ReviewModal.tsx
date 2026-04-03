import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UploadImage from "@/components/customs/UploadImage";
import { uploadFileAction } from "@/app/actions/upload-image";
import { Review } from "@/service/reviews/type";
import { createReview, updateReview } from "@/service/reviews/ReviewService";

const MAX_AUTHOR_NAME = 100;
const MAX_COMMENT = 500;

const reviewFormSchema = z.object({
    locale: z.enum(["vi", "en"]),
    rating: z.number().min(0).max(5),
    comment: z
        .string()
        .min(1, "Comment is required")
        .max(MAX_COMMENT, `Tối đa ${MAX_COMMENT} ký tự`),
    authorName: z
        .string()
        .min(1, "Author name is required")
        .max(MAX_AUTHOR_NAME, `Tối đa ${MAX_AUTHOR_NAME} ký tự`),
    authorAvatar: z.string(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

type ReviewModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    review?: Review | null;
};

const defaultValues: ReviewFormValues = {
    locale: "vi",
    rating: 5,
    comment: "",
    authorName: "",
    authorAvatar: "",
};

function CharCount({ current, max }: { current: number; max: number }) {
    return (
        <p
            className={`text-xs text-right tabular-nums ${
                current >= max ? "text-destructive" : "text-muted-foreground"
            }`}
        >
            {current}/{max}
        </p>
    );
}

export default function ReviewModal({
    open,
    onOpenChange,
    onSuccess,
    review,
}: ReviewModalProps) {
    const baseMinioUrl =
        process.env.NEXT_PUBLIC_BASE_URL_MINIO?.replace(/\/$/, "") ?? "";
    const isEditing = Boolean(review);
    const requiredMark = <span className="text-destructive">*</span>;

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues,
    });

    const authorAvatar = watch("authorAvatar");
    const commentValue = watch("comment");
    const authorNameValue = watch("authorName");
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    useEffect(() => {
        if (!open) return;

        if (review) {
            reset({
                locale: review.locale,
                rating: review.rating,
                comment: review.comment,
                authorName: review.authorName,
                authorAvatar: review.authorAvatar,
            });
            return;
        }

        reset(defaultValues);
    }, [open, review, reset]);

    const handleAvatarChange = useCallback(
        async (data: { existingIds: string[]; newFiles: File[] }) => {
            const [latestFile] = data.newFiles.slice(-1);

            if (latestFile) {
                setPendingFile(latestFile);
                clearErrors("authorAvatar");
                return;
            }

            setPendingFile(null);

            const [existingUrl] = data.existingIds;
            const nextValue = existingUrl ?? "";

            if (nextValue !== watch("authorAvatar")) {
                setValue("authorAvatar", nextValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }

            if (existingUrl) {
                clearErrors("authorAvatar");
            }
        },
        [clearErrors, setValue, watch],
    );

    const uploadPendingFile = useCallback(async () => {
        if (!pendingFile) {
            return true;
        }

        try {
            const formData = new FormData();
            formData.append("file", pendingFile);

            const result = await uploadFileAction(formData);

            if (!result?.success || !result.fileName) {
                throw new Error("Upload thất bại");
            }

            const imageUrl = baseMinioUrl
                ? `${baseMinioUrl}/${result.fileName}`
                : result.fileName;

            setValue("authorAvatar", imageUrl, {
                shouldDirty: true,
                shouldValidate: true,
            });
            clearErrors("authorAvatar");
            setPendingFile(null);

            return true;
        } catch (error) {
            console.error("Upload image error:", error);
            setError("authorAvatar", {
                type: "manual",
                message: "Upload ảnh thất bại. Vui lòng thử lại.",
            });
            return false;
        }
    }, [baseMinioUrl, clearErrors, pendingFile, setError, setValue]);

    const handleAvatarError = useCallback(
        (message: string) => {
            setError("authorAvatar", {
                type: "manual",
                message,
            });
        },
        [setError],
    );

    const avatarInitialUrls = useMemo(
        () => (authorAvatar ? [authorAvatar] : []),
        [authorAvatar],
    );

    const handleFormSubmit = useCallback(async () => {
        const avatarUploaded = await uploadPendingFile();
        if (!avatarUploaded) {
            return;
        }

        const onSubmit = async (values: ReviewFormValues) => {
            try {
                if (review) {
                    await updateReview(review.id, values);
                } else {
                    await createReview(values);
                }

                toast.success(
                    review
                        ? "Review đã được cập nhật thành công!"
                        : "Review đã được thêm thành công!",
                );

                onOpenChange(false);
                onSuccess?.();
            } catch (error) {
                console.error("Failed to save review:", error);
                toast.error(
                    review
                        ? "Cập nhật review thất bại. Vui lòng thử lại."
                        : "Thêm review thất bại. Vui lòng thử lại.",
                );
            }
        };

        await handleSubmit(onSubmit)();
    }, [uploadPendingFile, review, onOpenChange, onSuccess, handleSubmit]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-160 flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Chỉnh sửa review" : "Thêm mới review"}
                    </DialogTitle>
                    <DialogDescription>
                        Quản lý nội dung review cho tour theo từng ngôn ngữ.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-4 overflow-y-auto flex-1 pr-1"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleFormSubmit();
                    }}
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Chọn ngôn ngữ {requiredMark}</Label>
                            <Controller
                                control={control}
                                name="locale"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vi">
                                                vi
                                            </SelectItem>
                                            <SelectItem value="en">
                                                en
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">
                                Đánh giá sao {requiredMark}
                            </Label>
                            <Input
                                id="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                {...register("rating", { valueAsNumber: true })}
                            />
                            {errors.rating ? (
                                <p className="text-xs text-destructive">
                                    {errors.rating.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="authorName">
                                Tên tác giả {requiredMark}
                            </Label>
                            <Input
                                id="authorName"
                                maxLength={MAX_AUTHOR_NAME}
                                {...register("authorName")}
                            />
                            <div className="flex items-start justify-between gap-2">
                                {errors.authorName ? (
                                    <p className="text-xs text-destructive">
                                        {errors.authorName.message}
                                    </p>
                                ) : (
                                    <span />
                                )}
                                <CharCount
                                    current={authorNameValue?.length ?? 0}
                                    max={MAX_AUTHOR_NAME}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Ảnh đại diện người dùng {requiredMark}
                            </Label>
                            <UploadImage
                                key={`avatar-${authorAvatar || "empty"}`}
                                maxImages={1}
                                initialUrls={avatarInitialUrls}
                                onChange={handleAvatarChange}
                                onError={handleAvatarError}
                            />
                            {errors.authorAvatar ? (
                                <p className="text-xs text-destructive">
                                    {errors.authorAvatar.message}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">
                            Nội dung review {requiredMark}
                        </Label>
                        <Textarea
                            id="comment"
                            rows={5}
                            maxLength={MAX_COMMENT}
                            className="w-full"
                            {...register("comment")}
                        />
                        <div className="flex items-start justify-between gap-2">
                            {errors.comment ? (
                                <p className="text-xs text-destructive">
                                    {errors.comment.message}
                                </p>
                            ) : (
                                <span />
                            )}
                            <CharCount
                                current={commentValue?.length ?? 0}
                                max={MAX_COMMENT}
                            />
                        </div>
                    </div>
                </form>

                <DialogFooter className="border-t pt-4">
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => void handleFormSubmit()}
                    >
                        {isSubmitting
                            ? "Đang lưu..."
                            : isEditing
                              ? "Cập nhật review"
                              : "Tạo review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
