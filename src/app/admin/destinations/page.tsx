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
                err instanceof Error
                    ? err.message
                    : "Failed to load destinations",
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
            toast.error("Failed to delete destination. Please try again.");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

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
                    <Button onClick={handleAdd}>Thêm Điểm Đến</Button>
                </div>
            </div>

            <DestinationTable
                destinations={destinations}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DestinationModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                translationGroupId={editingTranslationGroupId}
                onSuccess={fetchDestinations}
            />
        </div>
    );
}
