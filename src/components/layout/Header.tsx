"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Camera, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MegaMenu from "@/components/layout/MegaMenu";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  mega?: { title: string; items: { label: string; href: string }[] }[];
};

const navItems: NavItem[] = [
  {
    label: "Destinations",
    href: "/tours",
    mega: [
      {
        title: "Southeast Asia",
        items: [
          { label: "Vietnam Journeys", href: "/tours?country=Vietnam" },
          { label: "Laos Retreats", href: "/tours?country=Laos" },
          { label: "Cambodia Heritage", href: "/tours?country=Cambodia" },
          { label: "Thailand Escapes", href: "/tours?country=Thailand" },
        ],
      },
      {
        title: "Travel Styles",
        items: [
          { label: "Honeymoon", href: "/tours?typology=Honeymoon" },
          { label: "Wellness", href: "/tours?typology=Wellness" },
          { label: "Golf", href: "/tours?typology=Golf" },
          { label: "Family", href: "/tours?typology=Family" },
        ],
      },
      {
        title: "Quick Access",
        items: [
          { label: "Trending Tours", href: "/#trending-tours" },
          { label: "Special Offers", href: "/#pricing-packages" },
          { label: "Travel Journal", href: "/blog" },
          { label: "Tailor-made Request", href: "/tours" },
        ],
      },
    ],
  },
  { label: "Experiences", href: "/tours?typology=Luxury" },
  { label: "Cruise", href: "/tours?tag=Signature" },
  { label: "Shore Excursions", href: "/tours?typology=Family" },
  { label: "SIC Tours", href: "/tours" },
  { label: "Our Offers", href: "/#pricing-packages" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

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
      <div className="hidden border-b border-neutral-200 bg-[#0f1720] px-4 py-2 text-sm text-neutral-200 md:block">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <Phone size={14} /> Hotline: +84 28 7777 2026
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={14} /> concierge@stour.asia
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Social profile" className="hover:text-white">
              <AtSign size={14} />
            </Link>
            <Link href="#" aria-label="Photo updates" className="hover:text-white">
              <Camera size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "px-4 transition-all duration-500",
          isScrolled
            ? "bg-white/88 py-3 shadow-[0_8px_30px_rgba(14,20,29,0.12)] backdrop-blur-xl"
            : "bg-white py-4"
        )}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-900">
            <span className="rounded-full border border-emerald-700/30 bg-emerald-700/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-emerald-800 uppercase">
              ST
            </span>
            <span className="font-heading text-xl font-semibold tracking-wide">STOUR LUXE</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 transition-colors duration-300 hover:text-emerald-700"
                >
                  {item.label}
                  {item.mega ? <ChevronDown size={16} /> : null}
                </Link>
                {item.mega ? <MegaMenu sections={item.mega} /> : null}
              </div>
            ))}
          </nav>

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
              {navItems.map((item) => {
                const open = openMobileSection === item.label;
                return (
                  <div key={item.label} className="rounded-2xl border border-transparent p-1 hover:border-neutral-200">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-2 py-2 text-sm font-medium text-neutral-700"
                      >
                        {item.label}
                      </Link>
                      {item.mega ? (
                        <button
                          type="button"
                          className="p-2 text-neutral-500"
                          onClick={() => setOpenMobileSection(open ? null : item.label)}
                          aria-label={`Toggle submenu for ${item.label}`}
                        >
                          <ChevronDown
                            size={16}
                            className={cn("transition-transform", open && "rotate-180")}
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
                              {section.items.map((entry) => (
                                <li key={entry.label}>
                                  <Link
                                    href={entry.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm text-neutral-600"
                                  >
                                    {entry.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
