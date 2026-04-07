import { FooterContent } from "./footer/FooterContent";
import { getCachedSettings } from "@/service/settings/SettingCacheService";

export default async function Footer() {
    const settings = await getCachedSettings();
    const { address, phoneNumber, email, social } = settings;

    return (
        <FooterContent
            address={address}
            phoneNumber={phoneNumber}
            email={email}
            social={social}
        />
    );
}
