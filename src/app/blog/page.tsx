import type { Metadata } from "next";
import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Travel Journal",
  description: "Guides, inspiration, and insider perspectives for luxury travel in Southeast Asia.",
};

export default function BlogPage() {
  return (
    <section className="container px-4 py-12">
      <h1 className="font-heading text-5xl text-neutral-900">Travel Journal</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Practical planning tips, seasonal guidance, and curated inspiration from our travel specialists.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_10px_25px_rgba(17,24,39,0.08)]"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={`Blog cover image for ${post.title}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <h2 className="font-heading text-2xl text-neutral-900">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={13} /> {new Date(post.publishedAt).toLocaleDateString("en-US")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={13} /> {post.readingMinutes} min
                </span>
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-emerald-700">
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
