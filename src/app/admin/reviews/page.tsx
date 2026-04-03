"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewTable } from "@/components/admin/review/ReviewTable";
import ReviewModal from "@/components/admin/review/ReviewModal";
import { Review } from "@/service/reviews/type";

import { toast } from "sonner";
import { deleteReview, getAllReviews } from "@/service/reviews/ReviewService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function ReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            const reviewList = await getAllReviews();

            const sortedReviews = reviewList.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );

            setReviews(sortedReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setError(
                err instanceof Error ? err.message : "Lỗi khi tải đánh giá",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchAllReviews();
    }, []);

    const handleAdd = () => {
        setEditingReview(null);
        setIsModalOpen(true);
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleModalChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setEditingReview(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteReview(id);
            setReviews((prev) => prev.filter((review) => review.id !== id));
            toast.success("Review deleted successfully.");
        } catch (err) {
            console.error("Failed to delete review:", err);
            toast.error("Lỗi khi xóa đánh giá. Vui lòng thử lại.");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Lỗi: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Đánh Giá
                    </p>
                    <h2 className="text-2xl font-semibold">Quản Lý Đánh Giá</h2>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                        Thêm Đánh Giá
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 ">
                            Không tìm thấy đánh giá nào. Hãy tạo đánh giá đầu
                            tiên của bạn!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <ReviewTable
                                reviews={reviews}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <ReviewModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                review={editingReview}
                onSuccess={() => {
                    void fetchAllReviews();
                }}
            />
        </div>
    );
}
