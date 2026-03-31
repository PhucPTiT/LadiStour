import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/lib/data/blog";

type BlogDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((item) => item.slug === slug);

    if (!post) {
        return {
            title: "Article not found",
            description: "The requested article was not found.",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const post = blogPosts.find((item) => item.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container px-4 py-12">
            <div className="mx-auto max-w-4xl">
                <p className="text-sm text-neutral-500">By {post.author}</p>
                <h1 className="mt-3 font-heading text-4xl leading-tight text-neutral-900 md:text-6xl">
                    {post.title}
                </h1>
                <div className="mt-8 overflow-hidden rounded-[24px]">
                    <Image
                        src={post.coverImage}
                        alt={`Hero image for ${post.title}`}
                        width={1400}
                        height={800}
                        className="h-auto w-full object-cover"
                        priority
                    />
                </div>

                <div className="prose prose-neutral mt-8 max-w-none text-neutral-700">
                    {post.content.map((paragraph) => (
                        <p
                            key={paragraph}
                            className="mb-5 text-lg leading-relaxed"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </article>
    );
}
