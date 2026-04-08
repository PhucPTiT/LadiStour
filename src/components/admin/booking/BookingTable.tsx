"use client";

import { BookingRequest } from "@/service/booking/type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type BookingTableProps = {
    bookings: BookingRequest[];
    onView: (booking: BookingRequest) => void;
    onToggleStatus: (booking: BookingRequest) => void;
    updatingBookingId?: string | null;
};

export function BookingTable({
    bookings,
    onView,
    onToggleStatus,
    updatingBookingId,
}: BookingTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "RECEIVED":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Chờ xử lý";
            case "RECEIVED":
                return "Đã nhận";
            default:
                return status;
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-primary/20">
                        <TableHead>Tên khách</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Tour</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id} className="">
                            <TableCell className="font-medium">
                                {booking.name}
                            </TableCell>
                            <TableCell>{booking.email}</TableCell>
                            <TableCell>{booking.phone}</TableCell>
                            <TableCell className="max-w-xs truncate">
                                {booking.nameTour}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={getStatusColor(booking.status)}
                                >
                                    {getStatusLabel(booking.status)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(booking.createdAt),
                                    "dd/MM/yyyy HH:mm",
                                    {
                                        locale: vi,
                                    },
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(booking)}
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleStatus(booking)}
                                        disabled={
                                            updatingBookingId === booking.id
                                        }
                                        title="Chuyển trạng thái"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
