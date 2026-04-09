import type { Metadata } from "next";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";
import CompanyStorySection from "@/components/home/CompanyStorySection";
import DestinationEditorial from "@/components/home/DestinationEditorial";
import HeroSlider from "@/components/home/HeroSlider";
import HomeGsapEffects from "@/components/home/HomeGsapEffects";
import QuickSearch from "@/components/home/QuickSearch";
import SignatureExperiencesSection from "@/components/home/SignatureExperiencesSection";
import Testimonials from "@/components/home/Testimonials";
import TrendingTours from "@/components/home/TrendingTours";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Du Lich Dong Nam A Cao Cap",
    description:
        "Dat tour nhanh, tim diem den noi bat, xem dich vu cong ty va lich khoi hanh moi nhat tai STOUR TRAVEL.",
};

export default function HomePage() {
    return (
        <div className="max-w-screen">
            <Suspense fallback="Loading GSAP effects...">
                <HomeGsapEffects />
            </Suspense>
            <HeroSlider />
            <QuickSearch />
            <Suspense fallback="Loading destinations...">
                <DestinationEditorial />
            </Suspense>
            <Suspense fallback="Loading signature experiences...">
                <SignatureExperiencesSection />
            </Suspense>
            <Suspense fallback="Loading trending tours...">
                <TrendingTours />
            </Suspense>
            <Suspense fallback="Loading company story...">
                <CompanyStorySection />
            </Suspense>
            <Suspense fallback="Loading call-to-action...">
                <CtaSection />
            </Suspense>
            <Testimonials />
            <Suspense fallback="Loading blog posts...">
                <BlogSection />
            </Suspense>
        </div>
    );
}
