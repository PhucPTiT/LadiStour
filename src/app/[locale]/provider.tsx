import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleProvider({
    locale,
    children,
}: {
    locale: string;
    children: React.ReactNode;
}) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
