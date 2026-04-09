import { Link } from "@/i18n/navigation";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaGithub,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

interface SocialItem {
    platform: string | null;
    url: string | null;
}

interface FooterSocialLinksProps {
    followLabel: string;
    social?: SocialItem[] | null;
    hideLabelOnMobile?: boolean;
}

const SOCIAL_ICONS: Record<string, IconType> = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    twitter: FaTwitter,
    x: FaTwitter,
    linkedin: FaLinkedinIn,
    github: FaGithub,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    email: HiOutlineMail,
};

export default function FooterSocialLinks({
    followLabel,
    social,
    hideLabelOnMobile = false,
}: FooterSocialLinksProps) {
    if (!social || social.length === 0) return null;

    const validSocial = social.filter((s) => s.platform && s.url);
    if (validSocial.length === 0) return null;

    return (
        <div>
            {followLabel && (
                <p
                    className={cn(
                        "mb-4 text-sm font-semibold tracking-[0.18em] text-white uppercase",
                        hideLabelOnMobile && "hidden md:block",
                    )}
                >
                    {followLabel}
                </p>
            )}

            <div className="flex items-center gap-3">
                {validSocial.map((item) => {
                    const platformLower =
                        item.platform?.toLowerCase().trim() || "";

                    const IconComponent = SOCIAL_ICONS[platformLower];
                    if (!IconComponent) return null;

                    return (
                        <Link
                            key={`${item.platform}-${item.url}`}
                            href={item.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Follow us on ${item.platform}`}
                            className="rounded-full border border-white p-2 text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white"
                        >
                            <IconComponent size={16} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
