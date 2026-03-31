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
import { blogPosts } from "@/lib/data/blog";
import { tours } from "@/lib/data/tours";

export const metadata: Metadata = {
    title: "Du Lich Dong Nam A Cao Cap",
    description:
        "Dat tour nhanh, tim diem den noi bat, xem dich vu cong ty va lich khoi hanh moi nhat tai STOUR TRAVEL.",
};

export default function HomePage() {
    return (
        <>
            <HomeGsapEffects />
            <HeroSlider />
            <QuickSearch />
            <DestinationEditorial />
            <SignatureExperiencesSection />
            <TrendingTours tours={tours.slice(0, 6)} />
            <CompanyStorySection />
            <CtaSection />
            <Testimonials />
            <BlogSection posts={blogPosts.slice(0, 3)} />
        </>
    );
}
