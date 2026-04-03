"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DestinationTable } from "@/components/admin/destination/DestinationTable";
import DestinationModal from "@/components/admin/destination/DestinationModal";
import {
    getAllDestinations,
    deleteDestination,
} from "@/service/destinations/DestinationService";
import { DestinationResponse } from "@/service/destinations/type";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AdminDestinationsPage() {
    const [destinations, setDestinations] = useState<DestinationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTranslationGroupId, setEditingTranslationGroupId] = useState<
        string | null
    >(null);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const data = await getAllDestinations();
            setDestinations(data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
            setError(
                err instanceof Error ? err.message : "Lỗi khi tải điểm đến",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleEdit = (destination: DestinationResponse) => {
        setEditingTranslationGroupId(destination.translationGroupId);
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
            await deleteDestination(id);
            setDestinations(destinations.filter((d) => d.id !== id));
            toast.success("Destination deleted successfully.");
        } catch (err) {
            console.error("Failed to delete destination:", err);
            toast.error("Lỗi khi xóa điểm đến. Vui lòng thử lại.");
        }
    };

    if (loading) return <div className="p-4">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">Lỗi {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Điểm Đến
                    </p>
                    <h2 className="text-2xl font-semibold ">
                        Quản Lý Điểm Đến
                    </h2>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                        Thêm Điểm Đến
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Điểm Đến</CardTitle>
                </CardHeader>
                <CardContent>
                    {destinations.length === 0 ? (
                        <div className="text-center py-8 ">
                            Không tìm thấy điểm đến nào. Hãy tạo điểm đến đầu
                            tiên của bạn!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <DestinationTable
                                destinations={destinations}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <DestinationModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                translationGroupId={editingTranslationGroupId}
                onSuccess={fetchDestinations}
            />
        </div>
    );
}
