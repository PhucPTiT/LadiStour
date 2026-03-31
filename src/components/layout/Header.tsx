"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MegaMenu from "@/components/layout/MegaMenu";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

type NavItem = {
    label: string;
    href: string;
    mega?: { title: string; items: { label: string; href: string }[] }[];
};

const navItems: NavItem[] = [
    {
        label: "Tour Du Lich",
        href: "/tours",
        mega: [
            {
                title: "Diem Den Noi Bat",
                items: [
                    {
                        label: "Tour Viet Nam",
                        href: "/tours?country=Vietnam",
                    },
                    { label: "Tour Lao", href: "/tours?country=Laos" },
                    {
                        label: "Tour Campuchia",
                        href: "/tours?country=Cambodia",
                    },
                    {
                        label: "Tour Thai Lan",
                        href: "/tours?country=Thailand",
                    },
                ],
            },
            {
                title: "Loai Hinh Tour",
                items: [
                    { label: "Honeymoon", href: "/tours?typology=Honeymoon" },
                    { label: "Wellness", href: "/tours?typology=Wellness" },
                    { label: "Golf", href: "/tours?typology=Golf" },
                    { label: "Family", href: "/tours?typology=Family" },
                ],
            },
            {
                title: "Truy Cap Nhanh",
                items: [
                    { label: "Tim Nhanh Tour", href: "/#quick-search" },
                    {
                        label: "Diem Den Noi Bat",
                        href: "/#featured-destinations",
                    },
                    { label: "Tour Noi Bat", href: "/#featured-tours" },
                    { label: "Kien Thuc Du Lich", href: "/#travel-blog" },
                ],
            },
        ],
    },
    { label: "Diem Den", href: "/#featured-destinations" },
    { label: "Dich Vu", href: "/#service-highlights" },
    { label: "Ve Chung Toi", href: "/#company-story" },
    { label: "Danh Gia", href: "/#testimonials" },
    { label: "Blog", href: "/blog" },
];

const languages = ["vi", "en"] as const;

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(
        null,
    );
    const t = useTranslations("header");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (nextLocale: (typeof languages)[number]) => {
        if (nextLocale === locale) {
            return;
        }

        router.replace(pathname, { locale: nextLocale });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50">
            <div className="hidden border-b border-white/10 bg-[#5dc585] px-4 py-2 text-sm text-neutral-200 md:block">
                <div className="container flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-xs lg:text-sm">
                        <a
                            href="tel:+842877772026"
                            className="inline-flex items-center gap-2 hover:text-white"
                        >
                            <Phone size={14} /> Hotline: +84 28 7777 2026
                        </a>
                        <a
                            href="mailto:concierge@stour.asia"
                            className="inline-flex items-center gap-2 hover:text-white"
                        >
                            <Mail size={14} /> concierge@stour.asia
                        </a>
                        <Link href="/about" className="hover:text-white">
                            Lien he va ho tro 24/7
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.14em] uppercase text-neutral-300">
                            <Globe size={12} /> {t("language")}
                        </span>
                        <div className="flex rounded-full border border-white/20 p-1">
                            {languages.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={cn(
                                        "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                                        locale === item
                                            ? "bg-white text-[#0f1720]"
                                            : "text-neutral-300 hover:text-white",
                                    )}
                                    onClick={() => switchLocale(item)}
                                    aria-label={t("switchLanguageTo", {
                                        locale: item.toUpperCase(),
                                    })}
                                >
                                    {item.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                            />
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
                        {navItems.map((item) => (
                            <div key={item.label} className="group relative">
                                <Link
                                    href={item.href}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:text-[#ed1925]!"
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
                            className="h-11 rounded-full bg-[#be8a39] px-6 text-sm text-white hover:bg-[#a87932]"
                        >
                            <Link href="/#booking-cta">{t("bookNow")}</Link>
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
                        className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden"
                    >
                        <nav className="container space-y-1">
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
                                                    ? "bg-emerald-700 text-white"
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
                                                                            className="text-sm text-neutral-600"
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
                                <a
                                    href="tel:+842877772026"
                                    className="inline-flex items-center gap-2 text-sm text-neutral-700"
                                >
                                    <Phone size={14} /> +84 28 7777 2026
                                </a>
                                <a
                                    href="mailto:concierge@stour.asia"
                                    className="inline-flex items-center gap-2 text-sm text-neutral-700"
                                >
                                    <Mail size={14} /> concierge@stour.asia
                                </a>
                                <Button
                                    asChild
                                    className="mt-1 h-11 rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
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
        </header>
    );
}
