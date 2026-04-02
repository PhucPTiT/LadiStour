"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/service/post/type";
import { publishPost } from "@/service/post/PostService";
import { toast } from "sonner";

interface PostTableProps {
    posts: Post[];
    categories: Array<{ id: string; name: string }>;
    onEdit: (post: Post) => void;
    onDelete: (id: string) => void;
    onPublishChange?: () => void;
}

export function PostTable({
    posts,
    categories,
    onEdit,
    onDelete,
    onPublishChange,
}: PostTableProps) {
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState<string | null>(null);

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(confirmDelete);
        } finally {
            setIsDeleting(false);
            setConfirmDelete(null);
        }
    };

    const handlePublishToggle = async (post: Post) => {
        if (post.status === "published") {
            toast.info(
                "Để khôi phục trạng thái draft, vui lòng chỉnh sửa post",
            );
            return;
        }

        setIsPublishing(post.id);
        try {
            await publishPost(post.id);
            toast.success("Post đã được công bố thành công");
            onPublishChange?.();
        } catch (error) {
            console.error("Failed to publish post:", error);
            toast.error("Lỗi khi công bố post. Vui lòng thử lại.");
        } finally {
            setIsPublishing(null);
        }
    };

    const postTitle = posts.find((p) => p.id === confirmDelete)?.title;

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || "N/A";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800";
            case "draft":
                return "bg-yellow-100 text-yellow-800";
            case "archived":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "published":
                return "Đã Công Bố";
            case "draft":
                return "Bản Nháp";
            case "archived":
                return "Lưu Trữ";
            default:
                return status;
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getLanguageName = (locale: string) => {
        switch (locale.toLowerCase()) {
            case "vi":
                return "Tiếng Việt";
            case "en":
                return "English";
            default:
                return locale.toUpperCase();
        }
    };

    return (
        <>
            <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/20">
                    <TableRow>
                        <TableHead className="w-[18%]">Tiêu Đề</TableHead>
                        <TableHead className="w-[12%]">Danh Mục</TableHead>
                        <TableHead className="w-[10%] text-center">
                            Ngôn Ngữ
                        </TableHead>
                        <TableHead className="w-[10%] text-center">
                            Trạng Thái
                        </TableHead>
                        <TableHead className="w-[12%] text-center">
                            Ngày Công Bố
                        </TableHead>
                        <TableHead className="w-[15%] text-center">
                            Hành Động
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium truncate">
                                {post.title}
                            </TableCell>

                            <TableCell className="truncate text-sm">
                                {getCategoryName(post.categoryId)}
                            </TableCell>

                            <TableCell className="text-center text-sm">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                    {getLanguageName(post.locale)}
                                </span>
                            </TableCell>

                            <TableCell className="text-center">
                                <Badge className={getStatusColor(post.status)}>
                                    {getStatusLabel(post.status)}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-center text-sm">
                                {formatDate(post.publishedAt)}
                            </TableCell>

                            <TableCell className="text-center">
                                <div className="flex gap-2 justify-end">
                                    {post.status === "draft" && (
                                        <Button
                                            className="min-w-auto px-2"
                                            size="sm"
                                            variant="default"
                                            onClick={() =>
                                                handlePublishToggle(post)
                                            }
                                            disabled={isPublishing === post.id}
                                        >
                                            {isPublishing === post.id
                                                ? "Đang..."
                                                : "Công Bố"}
                                        </Button>
                                    )}

                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(post)}
                                    >
                                        Sửa
                                    </Button>

                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            setConfirmDelete(post.id)
                                        }
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog
                open={!!confirmDelete}
                onOpenChange={() => setConfirmDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa bài viết &quot;
                        <strong>{postTitle}</strong>&quot;? Hành động này sẽ xóa
                        cả tất cả các bản dịch của bản ghi này và không thể hoàn
                        tác.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end">
                        <AlertDialogCancel className="min-w-30">
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 min-w-30"
                        >
                            {isDeleting ? "Đang xóa..." : "Xóa Bản Ghi"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
