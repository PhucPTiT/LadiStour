"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingTable } from "@/components/admin/booking/BookingTable";
import BookingModal from "@/components/admin/booking/BookingModal";
import {
    getAllBookings,
    updateBookingStatus,
} from "@/service/booking/BookingService";
import { BookingRequest } from "@/service/booking/type";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BookingPage() {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] =
        useState<BookingRequest | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | "ALL">("ALL");
    const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
        null,
    );

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllBookings();
            // Sort by created date descending
            const sorted = data.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
            setBookings(sorted);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Lỗi khi tải dữ liệu booking",
            );
            toast.error("Lỗi khi tải dữ liệu booking");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchBookings();
    }, [fetchBookings]);

    const handleView = (booking: BookingRequest) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (booking: BookingRequest) => {
        const nextStatus =
            booking.status === "PENDING" ? "RECEIVED" : "PENDING";

        try {
            setUpdatingBookingId(booking.id);
            await updateBookingStatus(booking.id, nextStatus);

            setBookings((prev) =>
                prev.map((item) =>
                    item.id === booking.id
                        ? { ...item, status: nextStatus }
                        : item,
                ),
            );

            if (selectedBooking?.id === booking.id) {
                setSelectedBooking({ ...booking, status: nextStatus });
            }

            toast.success("Cập nhật trạng thái thành công");
        } catch (error) {
            console.error("Failed to update booking status:", error);
            toast.error("Lỗi khi cập nhật trạng thái");
        } finally {
            setUpdatingBookingId(null);
        }
    };

    const handleModalChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setSelectedBooking(null);
        }
    };

    const filteredBookings =
        filterStatus === "ALL"
            ? bookings
            : bookings.filter((b) => b.status === filterStatus);

    if (loading)
        return (
            <div className="p-4 text-center">
                <p>Đang tải...</p>
            </div>
        );

    if (error) {
        return (
            <div className="p-4 text-red-600">
                <p>Lỗi: {error}</p>
                <Button onClick={() => void fetchBookings()} className="mt-2">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tải lại
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Quản Lý
                    </p>
                    <h2 className="text-2xl font-semibold">Yêu Cầu Đặt Lịch</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => void fetchBookings()}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium ">
                            Tổng yêu cầu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {bookings.length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium ">
                            Chờ xử lý
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {
                                bookings.filter((b) => b.status === "PENDING")
                                    .length
                            }
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium ">
                            Đã nhận
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {
                                bookings.filter((b) => b.status === "RECEIVED")
                                    .length
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách yêu cầu đặt lịch</CardTitle>
                        <Select
                            value={filterStatus}
                            onValueChange={setFilterStatus}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="PENDING">
                                    Chờ xử lý
                                </SelectItem>
                                <SelectItem value="RECEIVED">
                                    Đã nhận
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {bookings.length === 0
                                ? "Không có yêu cầu đặt lịch nào"
                                : "Không có yêu cầu đặt lịch nào với bộ lọc này"}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <BookingTable
                                bookings={filteredBookings}
                                onView={handleView}
                                onToggleStatus={handleToggleStatus}
                                updatingBookingId={updatingBookingId}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            <BookingModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                booking={selectedBooking}
            />
        </div>
    );
}
