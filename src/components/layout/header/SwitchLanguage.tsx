"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function SwitchLanguage() {
    const t = useTranslations("header");
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const switchLocale = (nextLocale: (typeof languages)[number]) => {
        if (nextLocale === locale) {
            return;
        }

        router.replace(pathname, { locale: nextLocale });
    };

    return (
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
    );
}

export const languages = ["vi", "en"] as const;
