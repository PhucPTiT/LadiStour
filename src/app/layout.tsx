import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "@/app/globals.css";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-cormorant",
    weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "STOUR LUXE | Luxury Southeast Asia Journeys",
        template: "%s | STOUR LUXE",
    },
    description:
        "High-end tailor-made travel in Vietnam, Laos, Cambodia, and Thailand with premium stays, curated experiences, and seamless concierge service.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
            <body className="min-h-screen bg-white text-neutral-900 antialiased">
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
