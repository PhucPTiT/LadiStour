"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ContactItem = {
    icon: React.ReactNode;
    content: string;
};

type UsefulLink = {
    href: string;
    label: string;
};

type FooterAccordionProps = {
    contactLabel: string;
    usefulLinksLabel: string;
    contactItems: ContactItem[];
    usefulLinks: UsefulLink[];
};

function AccordionSection({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-t border-white/20">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-[0.18em] text-white uppercase"
            >
                {label}
                <ChevronDown
                    size={16}
                    className={cn(
                        "shrink-0 text-white/70 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300",
                    open ? "max-h-60 pb-4 opacity-100" : "max-h-0 opacity-0",
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default function FooterAccordion({
    contactLabel,
    usefulLinksLabel,
    contactItems,
    usefulLinks,
}: FooterAccordionProps) {
    return (
        <div>
            <AccordionSection label={contactLabel}>
                <ul className="space-y-3 text-sm text-neutral-200">
                    {contactItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            {item.icon}
                            <span>{item.content}</span>
                        </li>
                    ))}
                </ul>
            </AccordionSection>

            <AccordionSection label={usefulLinksLabel}>
                <ul className="space-y-3 text-sm">
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
            </AccordionSection>
        </div>
    );
}
