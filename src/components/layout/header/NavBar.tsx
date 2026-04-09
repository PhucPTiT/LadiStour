"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MegaMenu from "../MegaMenu";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { languages } from "./SwitchLanguage";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { getDestinationFeatures } from "@/service/destinations/DestinationService";
import { getFeaturedPublishedTours } from "@/service/tour/TourService";
import { getSettings } from "@/service/settings/SettingService";

type NavItem = {
    label: string;
    href: string;
    mega?: { title: string; items: { label: string; href: string }[] }[];
};

export default function NavBar() {
    const t = useTranslations("header");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(
        null,
    );
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [settings, setSettings] = useState<{
        phone?: string;
        email?: string;
    }>({});

    const switchLocale = (nextLocale: (typeof languages)[number]) => {
        if (nextLocale === locale) {
            return;
        }

        router.replace(pathname, { locale: nextLocale });
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchNavData = async () => {
            const staticItems: NavItem[] = [
                { label: t("destinations"), href: "/destination" },
                { label: t("services"), href: "/#service-highlights" },
                { label: t("aboutUs"), href: "/about" },
                { label: t("reviews"), href: "/#testimonials" },
                { label: t("blog"), href: "/blog" },
            ];

            setNavItems([]);

            try {
                const [destinations, tours, settingsData] = await Promise.all([
                    getDestinationFeatures(locale),
                    getFeaturedPublishedTours(locale),
                    getSettings(),
                ]);

                // Set contact info from settings
                if (settingsData) {
                    setSettings({
                        phone: settingsData.phoneNumber || "+84 28 7777 2026",
                        email: settingsData.email || "concierge@stour.asia",
                    });
                }
                const destinationItems = destinations
                    .map((dest) => ({
                        label: dest.name,
                        href: `/destination/${dest.slug}`,
                    }))
                    .slice(0, 5);

                const tourItems =
                    tours.length > 0
                        ? tours.slice(0, 5).map((tour) => ({
                              label: tour.title,
                              href: `/tours/${tour.slug}`,
                          }))
                        : [
                              { label: "Featured Tour 1", href: "/tours" },
                              { label: "Featured Tour 2", href: "/tours" },
                          ];

                const categoryItems = tourItems;

                const quickAccessItems = [
                    { label: t("quickSearchTour"), href: "#quick-search" },
                    {
                        label: t("featuredDestinationsLabel"),
                        href: "#featured-destinations",
                    },
                    { label: t("trendingTours"), href: "#featured-tours" },
                    { label: t("travelKnowledge"), href: "#travel-blog" },
                ];

                const tourItem: NavItem = {
                    label: t("tours"),
                    href: "/tours",
                    mega: [
                        {
                            title: t("featuredDestinations"),
                            items: destinationItems,
                        },
                        {
                            title: t("featuredTours"),
                            items: categoryItems,
                        },
                        {
                            title: t("quickAccess"),
                            items: quickAccessItems,
                        },
                    ],
                };

                setNavItems([tourItem, ...staticItems]);
            } catch (error) {
                console.error("Failed to fetch nav data:", error);
                setNavItems(staticItems);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNavData();
    }, [locale, t]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isLoading) {
        return <NavBarSkeleton />;
    }

    return (
        <>
            <div
                className={cn(
                    "px-4 transition-all duration-500",
                    isScrolled
                        ? "bg-white/88 py-3 shadow-[0_8px_30px_rgba(14,20,29,0.12)] backdrop-blur-xl"
                        : "bg-white py-4",
                )}
            >
                <div className="container flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-neutral-900"
                    >
                        <div className="relative aspect-video min-w-20">
                            <Image
                                src="/images/logo.png"
                                alt="STOUR TRAVEL logo"
                                className="object-contain"
                                fill
                                sizes="( max-width: 640px ) 120px, 160px"
                                priority
                            />
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
                        {navItems.map((item) => (
                            <div key={item.label} className="group relative">
                                <Link
                                    href={item.href}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:text-secondary-happysmile!"
                                >
                                    {item.label}
                                    {item.mega ? (
                                        <ChevronDown size={16} />
                                    ) : null}
                                </Link>
                                {item.mega ? (
                                    <MegaMenu sections={item.mega} />
                                ) : null}
                            </div>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        <Button
                            asChild
                            className="h-11 rounded-full bg-secondary-happysmile px-6 text-sm hover:bg-primary-happysmile!"
                        >
                            <Link className="text-white!" href="/booking">
                                {t("bookNow")}
                            </Link>
                        </Button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 lg:hidden"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden max-h-[70vh] overflow-y-auto"
                    >
                        <nav className="space-y-1">
                            <div className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-100 p-3">
                                <div className="text-xs text-neutral-500">
                                    {t("language")}
                                </div>
                                <div className="flex gap-1">
                                    {languages.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => switchLocale(item)}
                                            className={cn(
                                                "rounded-full px-3 py-1 text-xs font-semibold",
                                                locale === item
                                                    ? "bg-primary-happysmile text-white"
                                                    : "bg-white text-neutral-600",
                                            )}
                                        >
                                            {item.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {navItems.map((item) => {
                                const open = openMobileSection === item.label;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-transparent p-1 hover:border-neutral-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={item.href}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className="px-2 py-2 text-sm font-medium text-neutral-700"
                                            >
                                                {item.label}
                                            </Link>
                                            {item.mega ? (
                                                <button
                                                    type="button"
                                                    className="p-2 text-neutral-500"
                                                    onClick={() =>
                                                        setOpenMobileSection(
                                                            open
                                                                ? null
                                                                : item.label,
                                                        )
                                                    }
                                                    aria-label={`Toggle submenu for ${item.label}`}
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={cn(
                                                            "transition-transform",
                                                            open &&
                                                                "rotate-180",
                                                        )}
                                                    />
                                                </button>
                                            ) : null}
                                        </div>
                                        {item.mega && open ? (
                                            <div className="grid gap-3 px-2 pb-2">
                                                {item.mega.map((section) => (
                                                    <div key={section.title}>
                                                        <p className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                                                            {section.title}
                                                        </p>
                                                        <ul className="mt-1 space-y-1">
                                                            {section.items.map(
                                                                (entry) => (
                                                                    <li
                                                                        key={
                                                                            entry.label
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                entry.href
                                                                            }
                                                                            onClick={() =>
                                                                                setMobileOpen(
                                                                                    false,
                                                                                )
                                                                            }
                                                                            className="text-sm text-neutral-600 hover:text-secondary-happysmile! transition-colors"
                                                                        >
                                                                            {
                                                                                entry.label
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}

                            <div className="mt-4 grid gap-2 rounded-2xl border border-neutral-200 p-3">
                                {settings.phone && (
                                    <a
                                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                                        className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-[#ed1925] transition-colors"
                                    >
                                        <Phone size={14} /> {settings.phone}
                                    </a>
                                )}
                                {settings.email && (
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-secondary-happysmile transition-colors"
                                    >
                                        <Mail size={14} /> {settings.email}
                                    </a>
                                )}
                                <Button
                                    asChild
                                    className="mt-1 h-11 rounded-full bg-primary-happysmile text-white hover:bg-primary-happysmile/90"
                                >
                                    <Link
                                        href="/#booking-cta"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {t("bookConsultationNow")}
                                    </Link>
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}

const NavBarSkeleton = () => {
    return (
        <div
            className={cn("px-4 transition-all duration-500", "bg-white py-4")}
        >
            <div className="container flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-neutral-900"
                >
                    <div className="relative aspect-video min-w-20">
                        <div className="animate-pulse rounded bg-neutral-300" />
                    </div>
                </Link>

                <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="group relative">
                            <div className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:text-[#ed1925]!">
                                <div className="h-4 w-16 animate-pulse rounded bg-neutral-300" />
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <div className="h-11 w-32 animate-pulse rounded-full bg-[#da2121]" />
                </div>

                <div className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 lg:hidden">
                    <div className="h-5 w-5 animate-pulse rounded bg-neutral-300" />
                </div>
            </div>
        </div>
    );
};
