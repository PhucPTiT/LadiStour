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
import { Tour } from "@/service/tour/type";
import { Badge } from "@/components/ui/badge";

interface TourTableProps {
    tours: Tour[];
    onEdit: (tour: Tour) => void;
    onDelete: (id: string) => void;
}

export function TourTable({ tours, onEdit, onDelete }: TourTableProps) {
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

    const tourTitle = tours.find((t) => t.id === confirmDelete)?.title;

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

    return (
        <>
            <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/20">
                    <TableRow>
                        <TableHead className="w-[20%]">Tiêu Đề</TableHead>
                        <TableHead className="w-[15%]">Slug</TableHead>
                        <TableHead className="w-[12%] text-center">
                            Giá
                        </TableHead>
                        <TableHead className="w-[12%] text-center">
                            Ngày
                        </TableHead>
                        <TableHead className="w-[12%] text-center">
                            Trạng Thái
                        </TableHead>
                        <TableHead className="w-[10%] text-center">
                            Nổi Bật
                        </TableHead>
                        <TableHead className="w-[19%] text-center">
                            Hành Động
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tours.map((tour) => (
                        <TableRow key={tour.id}>
                            <TableCell className="font-medium truncate">
                                {tour.title}
                            </TableCell>

                            <TableCell className="truncate text-sm">
                                {tour.slug}
                            </TableCell>

                            <TableCell className="text-center text-sm">
                                {tour.currency}{" "}
                                {tour.salePrice
                                    ? tour.salePrice.toLocaleString()
                                    : tour.price.toLocaleString()}
                            </TableCell>

                            <TableCell className="text-center text-sm">
                                {tour.durationDays} ngày
                            </TableCell>

                            <TableCell className="text-center">
                                <Badge className={getStatusColor(tour.status)}>
                                    {getStatusLabel(tour.status)}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-center text-sm">
                                {tour.featured ? "Yes" : "No"}
                            </TableCell>

                            <TableCell className="text-center">
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(tour)}
                                    >
                                        Sửa
                                    </Button>

                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            setConfirmDelete(tour.id)
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
                        Bạn có chắc chắn muốn xóa tour &quot;
                        <strong>{tourTitle}</strong>&quot;? Hành động này sẽ xóa
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
