import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import SwitchLanguage from "./SwitchLanguage";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getCachedSettings } from "@/service/settings/SettingCacheService";

async function TopBarContent({ contactText }: { contactText: string }) {
    const settings = await getCachedSettings();
    const phone = settings?.phoneNumber || "";
    const email = settings?.email || "";

    return (
        <div className="flex items-center gap-6 text-xs lg:text-sm">
            {phone && (
                <Link
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 hover:text-white"
                >
                    <Phone size={14} /> Hotline: {phone}
                </Link>
            )}

            {email && (
                <Link
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 hover:text-white"
                >
                    <Mail size={14} /> {email}
                </Link>
            )}

            <Link href="/about" className="hover:text-white">
                {contactText} 24/7
            </Link>
        </div>
    );
}

export default async function TopBar() {
    const t = await getTranslations("header");
    const contactText = t("contactAndSupport");

    return (
        <div className="hidden border-b border-white/10 bg-primary-happysmile px-4 py-2 text-sm text-neutral-200 md:block">
            <div className="container flex items-center justify-between gap-4">
                <TopBarContent contactText={contactText} />
                <Suspense fallback={null}>
                    {" "}
                    <SwitchLanguage />
                </Suspense>
            </div>
        </div>
    );
}
