import Link from "next/link";

type MegaMenuSection = {
    title: string;
    items: { label: string; href: string }[];
};

type MegaMenuProps = {
    sections: MegaMenuSection[];
};

export default function MegaMenu({ sections }: MegaMenuProps) {
    return (
        <div className="absolute left-0 top-full z-40 hidden w-[720px] rounded-3xl border border-black/5 bg-white/95 p-6 shadow-[0_18px_50px_rgba(17,24,39,0.14)] backdrop-blur-xl group-hover:block">
            <div className="grid grid-cols-3 gap-5">
                {sections.map((section) => (
                    <div key={section.title}>
                        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                            {section.title}
                        </p>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-neutral-700 transition-colors duration-300 hover:text-emerald-700"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
