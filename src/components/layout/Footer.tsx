import { AtSign, Camera, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-[#5dc585] text-neutral-100">
            <div className="container grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="font-heading text-2xl text-white">
                        STOUR LUXE
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-200">
                        Curating refined journeys across Southeast Asia with
                        thoughtful concierge service and unforgettable local
                        depth.
                    </p>
                </div>

                <div>
                    <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                        Contact
                    </p>
                    <ul className="space-y-3 text-sm text-neutral-200">
                        <li className="inline-flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5" /> 88 Nguyen
                            Hue, District 1, Ho Chi Minh City
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <Mail size={16} /> concierge@stour.asia
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <Phone size={16} /> +84 28 7777 2026
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                        Useful Links
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/tours"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                All Tours
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/blog"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                Travel Journal
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="text-neutral-200 transition-colors hover:text-white"
                            >
                                About Us
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase">
                        Follow
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            href="#"
                            aria-label="Facebook"
                            className="rounded-full border border-neutral-500 p-2 transition-colors hover:border-white hover:text-white"
                        >
                            <AtSign size={16} />
                        </Link>
                        <Link
                            href="#"
                            aria-label="Instagram"
                            className="rounded-full border border-neutral-500 p-2 transition-colors hover:border-white hover:text-white"
                        >
                            <Camera size={16} />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-white px-4 py-4 text-center text-xs text-neutral-300">
                Copyright {new Date().getFullYear()} STOUR LUXE. All rights
                reserved.
            </div>
        </footer>
    );
}
