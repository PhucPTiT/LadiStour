"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TourTable } from "@/components/admin/tour/TourTable";
import TourModal from "@/components/admin/tour/TourModal";
import { getAllTour, deleteTour } from "@/service/tour/TourService";
import { getAllDestinations } from "@/service/destinations/DestinationService";
import { Tour } from "@/service/tour/type";
import { DestinationResponse } from "@/service/destinations/type";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AdminToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [destinations, setDestinations] = useState<
        Array<{ id: string; name: string }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTranslationGroupId, setEditingTranslationGroupId] = useState<
        string | null
    >(null);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const data = await getAllTour();
            setTours(data);
        } catch (err) {
            console.error("Error fetching tours:", err);
            setError(err instanceof Error ? err.message : "Lỗi khi tải tour");
        } finally {
            setLoading(false);
        }
    };

    const fetchDestinations = async () => {
        try {
            const data = await getAllDestinations();
            // Filter to get only unique destinations (by translationGroupId)
            const uniqueDestinations: { [key: string]: DestinationResponse } =
                {};
            data.forEach((dest) => {
                if (!uniqueDestinations[dest.translationGroupId]) {
                    uniqueDestinations[dest.translationGroupId] = dest;
                }
            });
            setDestinations(
                Object.values(uniqueDestinations).map((d) => ({
                    id: d.id,
                    name: d.name,
                })),
            );
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    };

    useEffect(() => {
        void Promise.all([fetchTours(), fetchDestinations()]);
    }, []);

    const handleEdit = (tour: Tour) => {
        setEditingTranslationGroupId(tour.translationGroupId);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTranslationGroupId(null);
        setIsModalOpen(true);
    };

    const handleModalChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setEditingTranslationGroupId(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTour(id);
            setTours(tours.filter((t) => t.id !== id));
            toast.success("Xóa tour thành công.");
        } catch (err) {
            console.error("Failed to delete tour:", err);
            toast.error("Lỗi khi xóa tour. Vui lòng thử lại.");
        }
    };

    const handleSuccess = () => {
        void fetchTours();
    };

    if (loading) return <div className="p-4">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">Lỗi {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Tour
                    </p>
                    <h2 className="text-2xl font-semibold ">Quản Lý Tour</h2>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                        Thêm Tour
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tour</CardTitle>
                </CardHeader>
                <CardContent>
                    {tours.length === 0 ? (
                        <div className="text-center py-8 ">
                            Không tìm thấy tour nào. Hãy tạo tour đầu tiên của
                            bạn!
                        </div>
                    ) : (
                        <TourTable
                            tours={tours}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>

            <TourModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                translationGroupId={editingTranslationGroupId}
                onSuccess={handleSuccess}
                destinations={destinations}
            />
        </div>
    );
}
