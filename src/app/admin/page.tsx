"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    BookOpenIcon,
    FolderTree,
    Globe2,
    Loader2,
    MapPinned,
    MessageSquareText,
    Newspaper,
    Route,
    Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllPost } from "@/service/post/PostService";
import { getAllReviews } from "@/service/reviews/ReviewService";
import { getAllTour } from "@/service/tour/TourService";
import { getAllDestinations } from "@/service/destinations/DestinationService";
import { getAllCategories } from "@/service/category/CategoryService";
import { getSettings } from "@/service/settings/SettingService";
import { getAllBookings } from "@/service/booking/BookingService";
import { toast } from "sonner";

const sections = [
    {
        href: "/admin/posts",
        title: "Bài Viết",
        description: "Tạo nội dung tin tức và blog.",
    },
    {
        href: "/admin/reviews",
        title: "Đánh Giá",
        description: "Duyệt và chỉnh sửa đánh giá.",
    },
    {
        href: "/admin/tours",
        title: "Tour",
        description: "Quản lý mục lục tour.",
    },
    {
        href: "/admin/destinations",
        title: "Điểm Đến",
        description: "Cập nhật điểm đến và điểm nổi bật.",
    },
    {
        href: "/admin/settings",
        title: "Cài Đặt",
        description: "Dữ liệu liên hệ và thông tin toàn cục.",
    },
    {
        href: "/admin/bookings",
        title: "Booking",
        description: "Quản lý yêu cầu đặt lịch.",
    },
];

type DashboardStats = {
    posts: number;
    reviews: number;
    tours: number;
    destinations: number;
    categories: number;
    socialLinks: number;
    publishedPosts: number;
    publishedTours: number;
    featuredTours: number;
    featuredDestinations: number;
    pendingReviews: number;
    bookings: number;
    pendingBookings: number;
};

type RecentItem = {
    id: string;
    title: string;
    module: string;
    date: string;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const initialStats: DashboardStats = {
    posts: 0,
    reviews: 0,
    tours: 0,
    destinations: 0,
    categories: 0,
    socialLinks: 0,
    publishedPosts: 0,
    publishedTours: 0,
    featuredTours: 0,
    bookings: 0,
    pendingBookings: 0,
    featuredDestinations: 0,
    pendingReviews: 0,
};

const isFilled = (value?: string | null) => Boolean(value?.trim());

const toEpoch = (value?: string | null) => {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [settingsScore, setSettingsScore] = useState(0);
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [
                postsRes,
                reviewsRes,
                toursRes,
                destinationsRes,
                categoriesRes,
                settingsRes,
                bookingsRes,
            ] = await Promise.allSettled([
                getAllPost(),
                getAllReviews(),
                getAllTour(),
                getAllDestinations(),
                getAllCategories(),
                getSettings(),
                getAllBookings(),
            ]);

            const posts = postsRes.status === "fulfilled" ? postsRes.value : [];
            const reviews =
                reviewsRes.status === "fulfilled" ? reviewsRes.value : [];
            const tours = toursRes.status === "fulfilled" ? toursRes.value : [];
            const destinations =
                destinationsRes.status === "fulfilled"
                    ? destinationsRes.value
                    : [];
            const categories =
                categoriesRes.status === "fulfilled" ? categoriesRes.value : [];
            const settings =
                settingsRes.status === "fulfilled" ? settingsRes.value : null;
            const bookings =
                bookingsRes.status === "fulfilled" ? bookingsRes.value : [];

            const successCount = [
                postsRes,
                reviewsRes,
                toursRes,
                destinationsRes,
                categoriesRes,
                settingsRes,
                bookingsRes,
            ].filter((item) => item.status === "fulfilled").length;

            if (successCount < 7) {
                toast.error(
                    "Một vài dữ liệu dashboard chưa tải được. Đang hiển thị dữ liệu khả dụng.",
                );
            }

            setStats({
                posts: posts.length,
                reviews: reviews.length,
                tours: tours.length,
                destinations: destinations.length,
                categories: categories.length,
                socialLinks: settings?.social?.length ?? 0,
                publishedPosts: posts.filter(
                    (item) => item.status === "published",
                ).length,
                publishedTours: tours.filter(
                    (item) => item.status === "published",
                ).length,
                featuredTours: tours.filter((item) => item.featured).length,
                featuredDestinations: destinations.filter(
                    (item) => item.featured,
                ).length,
                pendingReviews: reviews.filter((item) => !item.isApproved)
                    .length,
                bookings: bookings.length,
                pendingBookings: bookings.filter(
                    (item) => item.status === "PENDING",
                ).length,
            });

            const settingsChecks = [
                settings ? isFilled(settings.email) : false,
                settings ? isFilled(settings.phoneNumber) : false,
                settings ? isFilled(settings.address) : false,
                settings ? isFilled(settings.intro?.vi) : false,
                settings ? isFilled(settings.intro?.en) : false,
                settings ? isFilled(settings.contentHTMLPageAbout?.vi) : false,
                settings ? isFilled(settings.contentHTMLPageAbout?.en) : false,
                settings ? (settings.social?.length ?? 0) > 0 : false,
            ];

            const completed = settingsChecks.filter(Boolean).length;
            setSettingsScore(
                Math.round((completed / settingsChecks.length) * 100),
            );

            const recent: RecentItem[] = [
                ...reviews.map((item) => ({
                    id: item.id,
                    title: item.authorName,
                    module: "Review",
                    date: item.updatedAt,
                })),
                ...tours.map((item) => ({
                    id: item.id,
                    title: item.title,
                    module: "Tour",
                    date: item.updatedAt,
                })),
                ...destinations.map((item) => ({
                    id: item.id,
                    title: item.name,
                    module: "Destination",
                    date: item.updatedAt,
                })),
                ...categories.map((item) => ({
                    id: item.id,
                    title: item.name,
                    module: "Category",
                    date: item.updatedAt,
                })),
                ...posts
                    .filter((item) => item.publishedAt)
                    .map((item) => ({
                        id: item.id,
                        title: item.title,
                        module: "Post",
                        date: item.publishedAt as string,
                    })),
            ]
                .sort((a, b) => toEpoch(b.date) - toEpoch(a.date))
                .slice(0, 6);

            setRecentItems(recent);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            toast.error("Không thể tải dữ liệu dashboard.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboardData();
    }, [loadDashboardData]);

    const kpiCards = useMemo(
        () => [
            {
                title: "Bài Viết",
                value: stats.posts,
                icon: Newspaper,
                meta: `${stats.publishedPosts} đã công bố`,
            },
            {
                title: "Đánh Giá",
                value: stats.reviews,
                icon: MessageSquareText,
                meta: `${stats.pendingReviews} đang chờ`,
            },
            {
                title: "Tour",
                value: stats.tours,
                icon: Route,
                meta: `${stats.publishedTours} đã công bố`,
            },
            {
                title: "Điểm Đến",
                value: stats.destinations,
                icon: MapPinned,
                meta: `${stats.featuredDestinations} nổi bật`,
            },
            {
                title: "Danh Mục",
                value: stats.categories,
                icon: FolderTree,
                meta: "Sức khỏe phân loại",
            },
            {
                title: "Booking",
                value: stats.bookings,
                icon: BookOpenIcon,
                meta: `${stats.pendingBookings} chờ xử lý`,
            },
            {
                title: "Cài Đặt",
                value: stats.socialLinks,
                icon: Settings,
                meta: `${settingsScore}% hoàn thành`,
            },
        ],
        [settingsScore, stats],
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Tổng Quan
                    </p>
                    <h2 className="text-2xl font-semibold">
                        Bảng Điều Khiển Admin
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Theo dõi dữ liệu CMS, kiểm tra trạng thái nội dung và đi
                        nhanh đến từng module quản trị.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => void loadDashboardData()}
                    disabled={loading}
                    className="gap-2"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Activity className="h-4 w-4" />
                    )}
                    Tải Lại Dữ Liệu
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {kpiCards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <CardTitle className="text-base">
                                {card.title}
                            </CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">
                                {numberFormatter.format(card.value)}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {card.meta}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Hành Động Nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {sections.map((section) => (
                            <div
                                key={section.href}
                                className="rounded-lg border bg-card p-4"
                            >
                                <p className="font-medium">{section.title}</p>
                                <p className="mt-1 text-sm text-neutral-500">
                                    {section.description}
                                </p>
                                <Button asChild size="sm" className="mt-4">
                                    <Link href={section.href}>Mở</Link>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Trạng Thái Hệ Thống</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm">Hoàn thành cài đặt</span>
                            <Badge
                                variant={
                                    settingsScore >= 80
                                        ? "default"
                                        : settingsScore >= 50
                                          ? "secondary"
                                          : "destructive"
                                }
                            >
                                {settingsScore}%
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm">Đánh giá đang chờ</span>
                            <Badge
                                variant={
                                    stats.pendingReviews === 0
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {stats.pendingReviews}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm">Booking chờ xử lý</span>
                            <Badge
                                variant={
                                    stats.pendingBookings === 0
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {stats.pendingBookings}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm">Nội dung nổi bật</span>
                            <Badge variant="secondary">
                                {stats.featuredTours +
                                    stats.featuredDestinations}
                            </Badge>
                        </div>

                        <div className="rounded-md border p-3">
                            <p className="mb-1 text-sm">Phạm vi ngôn ngữ</p>
                            <p className="text-xs text-muted-foreground">
                                Nội dung song ngữ đang được quản lý qua modules
                                Tours, Destinations, Settings và Reviews.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <Globe2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    VI / EN hoạt động
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card className="md:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Cập Nhật Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Chưa có dữ liệu cập nhật gần đây.
                            </p>
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {recentItems.map((item) => (
                                    <div
                                        key={`${item.module}-${item.id}`}
                                        className="rounded-md border p-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="line-clamp-1 text-sm font-medium">
                                                {item.title}
                                            </p>
                                            <Badge variant="outline">
                                                {item.module}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {formatDateTime(item.date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
