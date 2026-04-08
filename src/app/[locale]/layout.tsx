// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocaleProvider from "./provider";

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ["latin", "latin-ext"],
    variable: "--font-manrope",
    weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin", "latin-ext"],
    variable: "--font-cormorant",
    weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "STOUR LUXE | Luxury Southeast Asia Journeys",
        template: "%s | STOUR LUXE",
    },
    description:
        "High-end tailor-made travel in Vietnam, Laos, Cambodia, and Thailand.",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={`${beVietnamPro.variable} ${playfairDisplay.variable} antialiased`}
            data-scroll-behavior="smooth"
        >
            <body>
                <LocaleProvider locale={locale}>
                    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </LocaleProvider>
            </body>
        </html>
    );
}
