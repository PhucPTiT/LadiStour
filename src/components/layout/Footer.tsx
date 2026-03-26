import { AtSign, Camera, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-[#0f1720] text-neutral-300">
      <div className="container grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl text-white">STOUR LUXE</p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Curating refined journeys across Southeast Asia with thoughtful concierge service and unforgettable local depth.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-neutral-100 uppercase">Contact</p>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="inline-flex items-start gap-2">
              <MapPin size={16} className="mt-0.5" /> 88 Nguyen Hue, District 1, Ho Chi Minh City
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
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-neutral-100 uppercase">Useful Links</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tours" className="text-neutral-400 transition-colors hover:text-white">
                All Tours
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-neutral-400 transition-colors hover:text-white">
                Travel Journal
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 transition-colors hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-neutral-100 uppercase">Follow</p>
          <div className="flex items-center gap-3">
            <Link
              href="#"
              aria-label="Facebook"
              className="rounded-full border border-neutral-700 p-2 transition-colors hover:border-emerald-500 hover:text-white"
            >
              <AtSign size={16} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-neutral-700 p-2 transition-colors hover:border-emerald-500 hover:text-white"
            >
              <Camera size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 px-4 py-4 text-center text-xs text-neutral-500">
        Copyright {new Date().getFullYear()} STOUR LUXE. All rights reserved.
      </div>
    </footer>
  );
}
