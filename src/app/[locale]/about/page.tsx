import { getCachedSettings } from "@/service/settings/SettingCacheService";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { BlogContent } from "@/components/blog/blog-content";
import { getTranslations } from "next-intl/server";
import AboutCompanyMap from "@/components/about/AboutCompanyMap";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about STOUR LUXE, our mission, and our approach to crafting premium travel experiences in Southeast Asia.",
};

export default async function AboutPage() {
    const settings = await getCachedSettings();
    const locale = (await getLocale()) as "vi" | "en";
    const t = await getTranslations("aboutPage");

    const intro = settings?.intro?.[locale] || "";
    const contentHTML = settings?.contentHTMLPageAbout?.[locale] || "";

    return (
        <article className="w-full min-h-screen bg-white pb-8">
            <header className="relative mb-12 overflow-hidden md:mb-10">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')`,
                    }}
                />
                <div className="absolute inset-0 backdrop-blur-xs bg-black/40" />

                <div className="relative z-10 px-8 py-20 border-b-2 border-white/20 flex flex-col items-center text-center">
                    <h1 className="mb-6 text-4xl font-bold leading-snug text-white md:mb-4 md:text-[1.75rem] sm:text-2xl drop-shadow-lg max-w-3xl">
                        {t("title")}
                    </h1>

                    {intro && (
                        <p className="text-lg leading-8 text-white/90 md:text-base drop-shadow max-w-2xl">
                            {intro}
                        </p>
                    )}
                </div>
            </header>

            <div className="mx-auto w-full max-w-225">
                {contentHTML && (
                    <div className="mb-16 md:mb-12">
                        <BlogContent contentHtml={contentHTML} />
                    </div>
                )}
            </div>
            <div className="mx-auto w-full max-w-225 px-4">
                <AboutCompanyMap />
            </div>
        </article>
    );
}
