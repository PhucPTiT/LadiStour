"use client";

import { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingRequest } from "@/service/booking/type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type BookingModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: BookingRequest | null;
};

export default function BookingModal({
    open,
    onOpenChange,
    booking,
}: BookingModalProps) {
    const statusLabel = useMemo(() => {
        if (!booking) return "";
        return booking.status === "RECEIVED" ? "Đã nhận" : "Chờ xử lý";
    }, [booking]);

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl!">
                <DialogHeader>
                    <DialogTitle>Chi tiết yêu cầu đặt lịch</DialogTitle>
                    <DialogDescription>
                        Mã booking:{" "}
                        <span className="font-mono font-semibold">
                            {booking.id}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-primary/20 rounded-lg">
                        <div>
                            <label className="text-sm font-semibold ">
                                Tên khách
                            </label>
                            <p className="mt-1 ">{booking.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold ">
                                Email
                            </label>
                            <p className="mt-1 ">
                                <a
                                    href={`mailto:${booking.email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {booking.email}
                                </a>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold ">
                                Số điện thoại
                            </label>
                            <p className="mt-1 ">
                                <a
                                    href={`tel:${booking.phone}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {booking.phone}
                                </a>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold ">
                                Tour
                            </label>
                            <p className="mt-1 ">{booking.nameTour}</p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="p-4 bg-primary/20 rounded-lg">
                        <label className="text-sm font-semibold ">
                            Lời nhắn
                        </label>
                        <p className="mt-2  whitespace-pre-wrap">
                            {booking.message}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-primary/20 rounded-lg">
                        <div>
                            <label className="text-sm font-semibold ">
                                Ngày tạo
                            </label>
                            <p className="mt-1 ">
                                {format(
                                    new Date(booking.createdAt),
                                    "dd/MM/yyyy HH:mm",
                                    {
                                        locale: vi,
                                    },
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold ">
                                Cập nhật lần cuối
                            </label>
                            <p className="mt-1 ">
                                {format(
                                    new Date(booking.updatedAt),
                                    "dd/MM/yyyy HH:mm",
                                    {
                                        locale: vi,
                                    },
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Status and Notification */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-primary/20 rounded-lg">
                        <div>
                            <label className="text-sm font-semibold ">
                                Trạng thái
                            </label>
                            <p className="mt-1">{statusLabel}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold ">
                                Thông báo
                            </label>
                            <p className="mt-1 ">
                                {booking.notificationSent
                                    ? "✓ Đã gửi"
                                    : "✗ Chưa gửi"}
                            </p>
                        </div>
                    </div>

                    {booking.notificationError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                                <span className="font-semibold">
                                    Lỗi thông báo:
                                </span>{" "}
                                {booking.notificationError}
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-end">
                        <Button onClick={() => onOpenChange(false)}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
