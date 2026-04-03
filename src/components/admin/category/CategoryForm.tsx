"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    createCategory,
    updateCategory,
} from "@/service/category/CategoryService";
import { Category } from "@/service/category/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CategoryFormProps {
    category?: Category | null;
    onSuccess: (success: boolean) => void;
    onClose: () => void;
}

export function CategoryForm({
    category,
    onSuccess,
    onClose,
}: CategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        locale: "vi" as "vi" | "en",
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                locale: category.locale,
            });
        }
    }, [category]);

    const handleNameChange = (value: string) => {
        setFormData({
            ...formData,
            name: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Please enter a category name");
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                name: formData.name,
                locale: formData.locale,
            };

            if (category) {
                // Update existing category
                await updateCategory(category.id, payload);
                toast.success("Category updated successfully");
            } else {
                // Create new category
                await createCategory(payload);
                toast.success("Category created successfully");
            }

            onSuccess(true);
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error(
                category
                    ? "Failed to update category"
                    : "Failed to create category",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Cập nhật Danh mục" : "Tạo Danh mục Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? "Cập nhật thông tin danh mục bên dưới"
                            : "Thêm một danh mục mới vào hệ thống"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên Danh mục</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Beach Tours, Mountain Trekking"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locale">Ngôn ngữ</Label>
                        <Select
                            value={formData.locale}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    locale: value as "vi" | "en",
                                })
                            }
                            disabled={isLoading || !!category}
                        >
                            <SelectTrigger id="locale">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vi">
                                    Vietnamese (VI)
                                </SelectItem>
                                <SelectItem value="en">English (EN)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            {category
                                ? "Ngôn ngữ không thể được thay đổi cho các danh mục đã tồn tại"
                                : "Chọn ngôn ngữ cho danh mục này"}
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="min-w-30"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="min-w-30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {category
                                        ? "Đang cập nhật..."
                                        : "Đang tạo..."}
                                </>
                            ) : (
                                <>{category ? "Cập nhật" : "Tạo"} Danh mục</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
