"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type BookingStickyFormProps = {
    tourTitle: string;
};

export default function BookingStickyForm({
    tourTitle,
}: BookingStickyFormProps) {
    const t = useTranslations("BookingStickyForm");
    const [submitted, setSubmitted] = useState(false);

    return (
        <aside className="sticky top-28 rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.08)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                {t("bookingInquiry")}
            </p>
            <h3 className="mt-2 font-heading text-xl text-neutral-900">
                {tourTitle}
            </h3>

            <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                }}
            >
                <input
                    required
                    placeholder={t("yourName")}
                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm"
                />
                <input
                    required
                    type="email"
                    placeholder={t("emailAddress")}
                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm"
                />
                <input
                    required
                    placeholder={t("phoneNumber")}
                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm"
                />
                <input
                    required
                    type="number"
                    min={1}
                    defaultValue={2}
                    placeholder={t("numberOfGuests")}
                    className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm"
                />
                <textarea
                    rows={4}
                    placeholder={t("message")}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                />
                <button
                    type="submit"
                    className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02]"
                >
                    {t("preSalesRequest")}
                </button>
            </form>

            {submitted ? (
                <p className="mt-3 text-sm text-emerald-700">
                    {t("successMessage")}
                </p>
            ) : null}
        </aside>
    );
}
