"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tour } from "@/service/tour/type";
import { formatPrice } from "@/lib/utils/formatPrice";

type TabKey = "itinerary" | "inclusions" | "price";

type TourTabsProps = {
    tour: Tour;
};

export default function TourTabs({ tour }: TourTabsProps) {
    const t = useTranslations("TourTabs");
    const [tab, setTab] = useState<TabKey>("itinerary");

    return (
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="mb-5 flex flex-wrap gap-2">
                {[
                    { key: "itinerary", label: t("itinerary") },
                    { key: "inclusions", label: t("details") },
                    { key: "price", label: t("pricing") },
                ].map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setTab(item.key as TabKey)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            tab === item.key
                                ? "bg-emerald-700 text-white"
                                : "border border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {tab === "itinerary" ? (
                <div className="space-y-4">
                    {tour.itinerary.map((entry) => (
                        <article
                            key={entry.day}
                            className="rounded-2xl bg-neutral-50 p-4"
                        >
                            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                                {t("day")} {entry.day}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-neutral-900">
                                {entry.title}
                            </h3>
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                                {entry.content}
                            </p>
                        </article>
                    ))}
                </div>
            ) : null}

            {tab === "inclusions" ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                            {t("tourDetails")}
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                            <li className="flex justify-between">
                                <span>{t("duration")}:</span>
                                <span className="font-medium">
                                    {tour.durationDays} {t("days")}
                                    {tour.durationNights &&
                                        ` / ${tour.durationNights} ${t("nights")}`}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span>{t("maxGroupSize")}:</span>
                                <span className="font-medium">
                                    {tour.maxPeople} {t("guests")}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span>{t("status")}:</span>
                                <span className="font-medium capitalize">
                                    {tour.status}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : null}

            {tab === "price" ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                            {t("pricingInformation")}
                        </h3>
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">
                                    {t("regularPrice")}:
                                </span>
                                <span className="font-medium">
                                    {formatPrice(tour.price)} {tour.currency}
                                </span>
                            </div>
                            {tour.salePrice && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">
                                            {t("salePrice")}:
                                        </span>
                                        <span className="font-medium text-emerald-700">
                                            {formatPrice(tour.salePrice)}{" "}
                                            {tour.currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">
                                            {t("savings")}:
                                        </span>
                                        <span className="font-medium text-red-600">
                                            {formatPrice(
                                                tour.price - tour.salePrice,
                                            )}{" "}
                                            {tour.currency} (
                                            {Math.round(
                                                ((tour.price - tour.salePrice) /
                                                    tour.price) *
                                                    100,
                                            )}
                                            %)
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                                <p className="text-xs font-semibold text-emerald-700">
                                    {t("pricePerPerson")}
                                </p>
                                <p className="text-2xl font-bold text-emerald-700">
                                    {formatPrice(tour.salePrice ?? tour.price)}{" "}
                                    {tour.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
