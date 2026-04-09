import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCachedPostsFeaturedSections } from "@/service/post/PostCacheService";
import { getLocale, getTranslations } from "next-intl/server";
import { calculateReadingMinutesFromHtml } from "@/lib/utils";

export default async function BlogPage() {
    const locale = (await getLocale()) as "vi" | "en";
    const posts = await getCachedPostsFeaturedSections(locale);
    const t = await getTranslations("BlogPage");

    console.log(posts, "***********************************");

    return (
        <section className="container px-4 py-12">
            <h1 className="font-heading text-5xl text-neutral-900">
                {t("header")}
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-600">
                {t("description")}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => {
                    const readingMinutes = calculateReadingMinutesFromHtml(
                        post.contentHtml,
                    );

                    return (
                        <article
                            key={post.id}
                            className="group overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_10px_25px_rgba(17,24,39,0.08)]"
                        >
                            <div className="relative aspect-16/11 overflow-hidden">
                                <Image
                                    src={post.thumbnail}
                                    alt={`Blog cover image for ${post.title}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            <div className="p-5">
                                <h2 className="font-heading text-2xl text-neutral-900">
                                    {post.title}
                                </h2>

                                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                                    {post.excerpt}
                                </p>

                                <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays size={13} />
                                        {post.publishedAt
                                            ? new Date(
                                                  post.publishedAt,
                                              ).toLocaleDateString(
                                                  locale === "vi"
                                                      ? "vi-VN"
                                                      : "en-US",
                                              )
                                            : t("draft")}
                                    </span>

                                    <span className="inline-flex items-center gap-1">
                                        <Clock3 size={13} />
                                        {readingMinutes} {t("min")}
                                    </span>
                                </div>

                                <Link
                                    href={`/${locale}/blog/${post.slug}`}
                                    className="mt-4 inline-flex text-sm font-semibold text-emerald-700"
                                >
                                    {t("readMore")}
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
