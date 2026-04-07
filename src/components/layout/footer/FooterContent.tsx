"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import FooterSocialLinks from "./FooterSocialLinks";

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

    return (
        <footer className="border-t border-neutral-200 bg-[#5dc585] text-neutral-100">
            <div className="container grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-neutral-900"
                >
                    <div className="relative aspect-video min-w-60">
                        <Image
                            src="/images/logo.png"
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
                        {address && (
                            <li className="inline-flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 size-12" />
                                <p>{address}</p>
                            </li>
                        )}
                        {email && (
                            <li className="inline-flex items-center gap-2">
                                <Mail size={16} /> {email}
                            </li>
                        )}
                        {phoneNumber && (
                            <li className="inline-flex items-center gap-2">
                                <Phone size={16} /> {phoneNumber}
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                        {t("usefulLinks")}
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/tours"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                {t("allTours")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/blog"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                {t("travelJournal")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                {t("aboutUs")}
                            </Link>
                        </li>
                    </ul>
                </div>

                <FooterSocialLinks followLabel={t("follow")} social={social} />
            </div>

            <div className="border-t border-white px-4 py-4 text-center text-xs text-neutral-200">
                {t("copyright")}
            </div>
        </footer>
    );
}
