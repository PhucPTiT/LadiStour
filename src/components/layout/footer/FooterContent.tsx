"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterAccordion from "./FooterAccordion";

type SocialItem = {
    platform: string | null;
    url: string | null;
};

type FooterContentProps = {
    address: string | null;
    phoneNumber: string | null;
    email: string | null;
    social: SocialItem[] | null;
};

export function FooterContent({
    address,
    phoneNumber,
    email,
    social,
}: FooterContentProps) {
    const t = useTranslations("footer");

    const contactItems = [
        address && {
            icon: <MapPin size={14} className="mt-0.5 shrink-0" />,
            content: address,
        },
        email && {
            icon: <Mail size={14} className="shrink-0" />,
            content: email,
        },
        phoneNumber && {
            icon: <Phone size={14} className="shrink-0" />,
            content: phoneNumber,
        },
    ].filter(Boolean) as { icon: React.ReactNode; content: string }[];

    const usefulLinks = [
        { href: "/tours", label: t("allTours") },
        { href: "/blog", label: t("travelJournal") },
        { href: "/about", label: t("aboutUs") },
    ];

    return (
        <footer className="border-t border-neutral-200 bg-primary-happysmile text-neutral-100">
            <div className="container px-4 py-10">
                <div className="hidden gap-10 md:grid md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-neutral-900"
                    >
                        <div className="relative aspect-video min-w-60 rounded-sm overflow-hidden">
                            <Image
                                src="/images/logo-white.png"
                                alt="STOUR TRAVEL logo"
                                className="object-contain"
                                fill
                                sizes="240px"
                            />
                        </div>
                    </Link>

                    <div>
                        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                            {t("contact")}
                        </p>
                        <ul className="space-y-3 text-sm text-neutral-200">
                            {contactItems.map((item, i) => (
                                <li
                                    key={i}
                                    className="inline-flex items-start gap-2"
                                >
                                    {item.icon}
                                    <span>{item.content}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                            {t("usefulLinks")}
                        </p>
                        <ul className="space-y-2 text-sm">
                            {usefulLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-neutral-200 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <FooterSocialLinks
                        followLabel={t("follow")}
                        social={social}
                    />
                </div>

                <div className="md:hidden">
                    <div className="mb-6 flex items-center justify-between">
                        <Link href="/" className="text-neutral-900">
                            <div className="relative h-10 w-36">
                                <Image
                                    src="/images/logo-white.png"
                                    alt="STOUR TRAVEL logo"
                                    className="object-contain object-left"
                                    fill
                                    sizes="144px"
                                />
                            </div>
                        </Link>
                        <FooterSocialLinks
                            followLabel=""
                            social={social}
                            hideLabelOnMobile
                        />
                    </div>

                    <FooterAccordion
                        contactLabel={t("contact")}
                        usefulLinksLabel={t("usefulLinks")}
                        contactItems={contactItems}
                        usefulLinks={usefulLinks}
                    />
                </div>
            </div>

            <div className="border-t border-white/40 px-4 py-4 text-center text-xs text-neutral-200">
                {t("copyright")}
            </div>
        </footer>
    );
}
