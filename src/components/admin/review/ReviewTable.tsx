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
import { Review } from "@/service/reviews/type";

interface ReviewTableProps {
    reviews: Review[];
    onEdit: (review: Review) => void;
    onDelete: (id: string) => Promise<void>;
}

export function ReviewTable({ reviews, onEdit, onDelete }: ReviewTableProps) {
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const reviewTarget = reviews.find((review) => review.id === confirmDelete);

    return (
        <>
            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow className="bg-primary/20">
                        <TableHead className="w-[12%]">Tác Giả</TableHead>
                        <TableHead className="w-[8%] text-center">
                            Locale
                        </TableHead>
                        <TableHead className="w-[10%] text-center">
                            Rating
                        </TableHead>
                        <TableHead className="w-[32%]">Nội Dung</TableHead>
                        <TableHead className="w-[23%] text-center">
                            Hành Động
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.id}>
                            <TableCell className="truncate">
                                {review.authorName}
                            </TableCell>

                            <TableCell className="text-center uppercase">
                                {review.locale}
                            </TableCell>

                            <TableCell className="text-center">
                                {review.rating.toFixed(1)}
                            </TableCell>

                            <TableCell className="truncate">
                                {review.comment}
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(review)}
                                    >
                                        Sửa
                                    </Button>

                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            setConfirmDelete(review.id)
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
                    <AlertDialogTitle>Xóa Đánh Giá</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa review của tác giả &quot;
                        <strong>{reviewTarget?.authorName}</strong>&quot;? Hành
                        động này không thể hoàn tác.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel className="min-w-30">
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => void handleConfirmDelete()}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 min-w-30"
                        >
                            {isDeleting ? "Đang xóa..." : "Xóa Đánh Giá"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
