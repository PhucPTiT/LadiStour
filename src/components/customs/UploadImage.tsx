"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Eye, Plus, Trash2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface UploadImageProps {
    initialUrls?: string[];
    onChange?: (data: { existingIds: string[]; newFiles: File[] }) => void;
    className?: string;

    minImages?: number;
    maxImages?: number;
    onError?: (message: string) => void;
}

type NewImageItem = {
    file: File;
    previewUrl: string;
};

export default function UploadImage({
    initialUrls = [],
    onChange,
    className,
    minImages = 0,
    maxImages,
    onError,
}: UploadImageProps) {
    const [existingImages, setExistingImages] = useState<string[]>(initialUrls);
    const [newImages, setNewImages] = useState<NewImageItem[]>([]);
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync existing images when initialUrls changes (edit record case)
    useEffect(() => {
        const next = JSON.stringify(initialUrls);
        const current = JSON.stringify(existingImages);

        if (next !== current) {
            setExistingImages(initialUrls);
        }
    }, [existingImages, initialUrls]);

    // Emit change
    useEffect(() => {
        onChange?.({
            existingIds: existingImages,
            newFiles: newImages.map((x) => x.file),
        });
    }, [existingImages, newImages, onChange]);

    // Cleanup objectURLs when unmount
    useEffect(() => {
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const allImagesCount = useMemo(() => {
        return existingImages.length + newImages.length;
    }, [existingImages.length, newImages.length]);

    const canAddMore = useMemo(() => {
        if (maxImages === undefined) return true;
        return allImagesCount < maxImages;
    }, [allImagesCount, maxImages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const filesArray = Array.from(files);

        const remainingSlots =
            maxImages === undefined
                ? filesArray.length
                : Math.max(maxImages - allImagesCount, 0);

        if (remainingSlots <= 0) {
            onError?.(`Bạn chỉ được chọn tối đa ${maxImages} ảnh.`);
            e.target.value = "";
            return;
        }

        const acceptedFiles = filesArray.slice(0, remainingSlots);

        if (acceptedFiles.length < filesArray.length) {
            onError?.(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
        }

        const mapped: NewImageItem[] = acceptedFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setNewImages((prev) => [...prev, ...mapped]);

        // reset để chọn lại cùng file vẫn trigger
        e.target.value = "";
    };

    const removeImage = (index: number, isNew: boolean) => {
        if (isNew) {
            setNewImages((prev) => {
                const removed = prev[index];
                if (removed?.previewUrl)
                    URL.revokeObjectURL(removed.previewUrl);

                return prev.filter((_, i) => i !== index);
            });
        } else {
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const isBelowMin = allImagesCount < minImages;

    return (
        <TooltipProvider>
            <div className={cn("space-y-4 w-full", className)}>
                <div className="flex flex-wrap gap-4 items-start">
                    {/* Existing images */}
                    {existingImages.map((url, index) => (
                        <ImageItem
                            key={`old-${url}-${index}`}
                            src={url}
                            onRemove={() => removeImage(index, false)}
                            onView={() => setViewingImage(url)}
                        />
                    ))}

                    {/* New images */}
                    {newImages.map((img, index) => (
                        <ImageItem
                            key={`new-${img.previewUrl}-${index}`}
                            src={img.previewUrl}
                            isNew
                            onRemove={() => removeImage(index, true)}
                            onView={() => setViewingImage(img.previewUrl)}
                        />
                    ))}

                    {/* Add button */}
                    <Button
                        variant="outline"
                        type="button"
                        disabled={!canAddMore}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 border-dashed flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                            Tải ảnh lên
                        </span>
                    </Button>
                </div>

                {/* File input */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Dialog preview */}
                <Dialog
                    open={!!viewingImage}
                    onOpenChange={() => setViewingImage(null)}
                >
                    <DialogContent className="max-w-5xl border-none bg-transparent shadow-none p-0">
                        <DialogHeader className="hidden">
                            <DialogTitle>Preview</DialogTitle>
                        </DialogHeader>

                        <div className="relative w-full h-[80vh] rounded-xl overflow-hidden bg-black/90 flex items-center justify-center">
                            {viewingImage && (
                                <Image
                                    src={viewingImage}
                                    alt="Preview full"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 85vw, 80vw"
                                    priority
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Info */}
                {(maxImages !== undefined || minImages > 0) && (
                    <p className="text-xs text-muted-foreground">
                        Đã chọn {allImagesCount} ảnh
                        {maxImages !== undefined
                            ? ` / tối đa ${maxImages}`
                            : ""}
                        {minImages > 0 ? ` (tối thiểu ${minImages})` : ""}
                    </p>
                )}

                {isBelowMin && (
                    <p className="text-xs text-destructive">
                        Bạn phải chọn tối thiểu {minImages} ảnh.
                    </p>
                )}
            </div>
        </TooltipProvider>
    );
}

interface ImageItemProps {
    src: string;
    onRemove: () => void;
    onView: () => void;
    isNew?: boolean;
}

function ImageItem({ src, onRemove, onView, isNew }: ImageItemProps) {
    return (
        <div className="relative group w-32 h-32 rounded-xl border bg-muted overflow-hidden shadow-sm transition-all hover:ring-2 hover:ring-primary/20">
            <Image
                src={src}
                alt="Preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="128px"
            />

            {isNew && (
                <Badge className="absolute top-2 left-2 pointer-events-none bg-blue-600/90 hover:bg-blue-600">
                    Mới
                </Badge>
            )}

            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full"
                            onClick={onView}
                            type="button"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xem ảnh</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-full"
                            onClick={onRemove}
                            type="button"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xóa ảnh</TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}
