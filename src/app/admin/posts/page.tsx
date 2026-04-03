"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PostTable } from "@/components/admin/post/PostTable";
import { getAllPost, deletePost } from "@/service/post/PostService";
import { getAllCategories } from "@/service/category/CategoryService";
import { Post } from "@/service/post/type";
import { Category } from "@/service/category/type";
import { toast } from "sonner";
import PostModal from "@/components/admin/post/PostModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function PostPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<
        Array<{ id: string; name: string }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllPost();
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(
                err instanceof Error ? err.message : "Failed to load posts",
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            // Filter to get only unique categories (by id) and map to simple format
            const uniqueCategories: { [key: string]: Category } = {};
            data.forEach((cat) => {
                if (!uniqueCategories[cat.id]) {
                    uniqueCategories[cat.id] = cat;
                }
            });
            setCategories(
                Object.values(uniqueCategories).map((c) => ({
                    id: c.id,
                    name: c.name,
                })),
            );
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        void Promise.all([fetchPosts(), fetchCategories()]);
    }, []);

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleModalChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setEditingPost(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id);
            setPosts(posts.filter((p) => p.id !== id));
            toast.success("Bài viết đã được xóa thành công.");
        } catch (err) {
            console.error("Failed to delete post:", err);
            toast.error("Lỗi khi xóa bài viết. Vui lòng thử lại.");
        }
    };

    const handlePublishChange = () => {
        void fetchPosts();
    };

    if (loading) return <div className="p-4">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">Lỗi: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Bài Viết
                    </p>
                    <h2 className="text-2xl font-semibold">Quản Lý Bài Viết</h2>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                        Thêm Bài Viết
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                    {posts.length === 0 ? (
                        <div className="text-center py-8">
                            Không tìm thấy bài viết nào. Hãy tạo bài viết đầu
                            tiên của bạn!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <PostTable
                                posts={posts}
                                categories={categories}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onPublishChange={handlePublishChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <PostModal
                open={isModalOpen}
                onOpenChange={handleModalChange}
                post={editingPost}
                categories={categories}
                onSuccess={() => void fetchPosts()}
            />
        </div>
    );
}
