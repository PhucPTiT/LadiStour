import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getCachedPostsFeaturedSections } from "@/service/post/PostCacheService";
import { getLocale, getTranslations } from "next-intl/server";

export default async function BlogSection() {
    const locale = (await getLocale()) as "vi" | "en";
    const posts = await getCachedPostsFeaturedSections(locale);
    const t = await getTranslations("BlogSection");
    return (
        <section
            className="bg-[linear-gradient(180deg,#ffffff_0%,#f8f7f4_100%)] py-24"
            id="travel-blog"
            data-home-section
        >
            <div className="container px-4">
                <div className="mb-10 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                            {t("header")}
                        </p>
                        <h2 className="mt-2 font-heading text-3xl text-neutral-900 md:text-5xl">
                            {t("description")}
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="text-sm font-semibold text-emerald-700"
                    >
                        {t("viewAll")}
                    </Link>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    {posts?.slice(0, 6).map((post) => (
                        <Card
                            key={post.id}
                            data-home-card
                            className="lux-shadow-3d group overflow-hidden rounded-[22px] border border-neutral-200/80 bg-white py-0 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-16/11 overflow-hidden">
                                <Image
                                    src={post.thumbnail}
                                    alt={`Article cover for ${post.title}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                            <CardContent className="p-5">
                                <p className="inline-flex items-center gap-1 text-xs text-neutral-500">
                                    <CalendarDays size={13} />{" "}
                                    {new Date(
                                        post!.publishedAt || new Date(),
                                    ).toLocaleDateString(
                                        locale === "vi" ? "vi-VN" : "en-US",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        },
                                    )}
                                </p>
                                <h3 className="mt-3 font-heading text-2xl text-neutral-900">
                                    {post.title}
                                </h3>
                                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="mt-4 inline-flex text-sm font-semibold text-emerald-700"
                                >
                                    {t("readMore")}
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
