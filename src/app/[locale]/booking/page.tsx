import type { Metadata } from "next";
import BookingForm from "@/components/booking/BookingForm";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Book Your Tour",
    description:
        "Book your dream tour with STOUR LUXE. Fill in your details and our team will contact you within 24 hours.",
};

export default async function BookingPage() {
    const t = await getTranslations("BookingPage");

    return (
        <article className="w-full min-h-screen bg-linear-to-b from-neutral-50 to-white py-16">
            {/* Header Section */}
            <header className="mb-12 text-center">
                <h1 className="font-heading text-4xl font-bold text-neutral-900 md:text-3xl">
                    {t("header")}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">
                    {t("subtitle")}
                </p>
            </header>

            {/* Form Section */}
            <div className="container px-4 pb-12">
                <BookingForm />
            </div>

            {/* Info Section */}
            <section className="container px-4 mt-16">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                            <svg
                                className="h-6 w-6 text-emerald-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-neutral-900">
                            {t("info.fastResponse.title")}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                            {t("info.fastResponse.description")}
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                className="h-6 w-6 text-blue-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-neutral-900">
                            {t("info.expertTeam.title")}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                            {t("info.expertTeam.description")}
                        </p>
                    </div>

                    <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <svg
                                className="h-6 w-6 text-purple-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-neutral-900">
                            {t("info.customizedTours.title")}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                            {t("info.customizedTours.description")}
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
}
