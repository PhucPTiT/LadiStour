"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
import {
    getAllCategories,
    deleteCategory,
} from "@/service/category/CategoryService";
import { Category, CategoryList } from "@/service/category/type";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CategoryForm } from "@/components/admin/category/CategoryForm";

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryList>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Không thể tải danh mục");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setIsDeleting(true);
            await deleteCategory(deleteId);
            setCategories(categories.filter((cat) => cat.id !== deleteId));
            toast.success("Danh mục đã được xóa thành công");
            setDeleteId(null);
        } catch (error) {
            toast.error("Không thể xóa danh mục");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFormSubmit = async (success: boolean) => {
        if (success) {
            setIsFormOpen(false);
            setEditingCategory(null);
            loadCategories();
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    // Sort categories by creation date (newest first)
    const sortedCategories = [...categories].sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Danh Mục
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý danh mục tour của bạn
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm Danh Mục
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Danh Mục</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8">
                            Không tìm thấy danh mục nào. Hãy tạo danh mục đầu
                            tiên của bạn!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary/20">
                                        <TableHead>Tên</TableHead>
                                        <TableHead>Ngôn Ngữ</TableHead>
                                        <TableHead>Tạo</TableHead>
                                        <TableHead className="text-right">
                                            Hành Động
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        category.locale === "vi"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {category.locale.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(
                                                    category.createdAt,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    Chỉnh Sửa
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteId(category.id)
                                                    }
                                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Category Form Modal */}
            {isFormOpen && (
                <CategoryForm
                    category={editingCategory}
                    onSuccess={handleFormSubmit}
                    onClose={handleCloseForm}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa Danh Mục</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa danh mục này? Hành động
                            này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel disabled={isDeleting}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa"
                            )}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
