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
import { DestinationResponse } from "@/service/destinations/type";

interface DestinationTableProps {
    destinations: DestinationResponse[];
    onEdit: (destination: DestinationResponse) => void;
    onDelete: (id: string) => void;
}

export function DestinationTable({
    destinations,
    onEdit,
    onDelete,
}: DestinationTableProps) {
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

    const destinationName = destinations.find(
        (d) => d.id === confirmDelete,
    )?.name;
    return (
        <>
            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow className="bg-primary/20">
                        <TableHead className="w-[25%]">Tên Điểm Đến</TableHead>
                        <TableHead className="w-[25%]">Vị Trí</TableHead>
                        <TableHead className="w-[10%] text-center">
                            Nổi Bật
                        </TableHead>
                        <TableHead className="w-[20%] text-center">
                            Hành Động
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {destinations.map((destination) => (
                        <TableRow key={destination.id}>
                            <TableCell className="font-medium truncate">
                                {destination.name}
                            </TableCell>

                            <TableCell className="truncate">
                                {destination.location.city},{" "}
                                {destination.location.country}
                            </TableCell>

                            <TableCell className="text-center">
                                {destination.featured ? "Có" : "Không"}
                            </TableCell>

                            <TableCell className="text-center">
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(destination)}
                                    >
                                        Sửa
                                    </Button>

                                    <Button
                                        className="min-w-17.5"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            setConfirmDelete(destination.id)
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
                    <AlertDialogTitle>Xóa Điểm Đến</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa điểm đến &quot;
                        <strong>{destinationName}</strong>&quot;? Hành động này
                        sẽ xóa cả tất cả các bản dịch của bản ghi này và không
                        thể hoàn tác.
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
