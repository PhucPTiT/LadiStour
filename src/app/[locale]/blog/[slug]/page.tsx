import { getCachedPostsFeaturedSectionsBySlug } from "@/service/post/PostCacheService";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog/blog-content";

export default async function BlogDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const post = await getCachedPostsFeaturedSectionsBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="w-full min-h-screen bg-white px-4 py-8 md:px-4 md:py-12">
            <div className="mx-auto w-full max-w-225">
                {/* Header */}
                <header className="mb-10 border-b-2 border-neutral-200 pb-8 md:mb-6 md:pb-6">
                    <h1 className="mb-5 wrap-break-word text-4xl font-bold leading-snug text-neutral-900 md:mb-4 md:text-[1.75rem] sm:text-2xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-[0.95rem] text-neutral-600 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3">
                        {/* Date */}
                        {post.publishedAt && (
                            <span className="flex items-center font-medium text-neutral-600">
                                <span className="mr-2">📅</span>
                                {new Date(post.publishedAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </span>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-indigo-100 hover:text-blue-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* Thumbnail */}
                <div className="mb-10 overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:mb-8 md:rounded-lg">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={1200}
                        height={600}
                        priority
                        className="block h-auto w-full object-cover"
                    />
                </div>

                {/* Excerpt */}
                <div className="mb-10 rounded-lg border-l-4 border-blue-700 bg-linear-to-br from-slate-50 to-slate-100 p-6 md:mb-8 md:p-4">
                    <p className="text-[1.05rem] font-medium leading-8 text-neutral-800">
                        {post.excerpt}
                    </p>
                </div>

                {/* Content */}
                <div className="mb-12 md:mb-8">
                    <BlogContent contentHtml={post.contentHtml} />
                </div>
            </div>
        </article>
    );
}
