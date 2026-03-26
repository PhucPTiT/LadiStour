import type { Metadata } from "next";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";
import CompanyStorySection from "@/components/home/CompanyStorySection";
import DestinationEditorial from "@/components/home/DestinationEditorial";
import HeroSlider from "@/components/home/HeroSlider";
import HomeGsapEffects from "@/components/home/HomeGsapEffects";
import PricingPackages from "@/components/home/PricingPackages";
import QuickSearch from "@/components/home/QuickSearch";
import SignatureExperiencesSection from "@/components/home/SignatureExperiencesSection";
import Testimonials from "@/components/home/Testimonials";
import TravelVideoSection from "@/components/home/TravelVideoSection";
import TrendingTours from "@/components/home/TrendingTours";
import { blogPosts } from "@/lib/data/blog";
import { tours } from "@/lib/data/tours";

export const metadata: Metadata = {
    title: "Luxury Travel in Southeast Asia",
    description:
        "Discover premium tours across Vietnam, Laos, Cambodia, and Thailand with curated itineraries and seamless concierge planning.",
};

export default function HomePage() {
    return (
        <>
            <HomeGsapEffects />
            <HeroSlider />
            <QuickSearch />
            <DestinationEditorial />
            <TrendingTours tours={tours.slice(0, 6)} />
            <TravelVideoSection />
            <CompanyStorySection />
            <CtaSection />
            <Testimonials />
            <SignatureExperiencesSection />
            <PricingPackages />
            <BlogSection posts={blogPosts.slice(0, 3)} />
        </>
    );
}
