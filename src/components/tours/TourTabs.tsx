"use client";

import { useState } from "react";
import { Tour } from "@/lib/data/tours";
import { formatPrice } from "@/lib/utils/formatPrice";

type TabKey = "itinerary" | "inclusions" | "price";

type TourTabsProps = {
  tour: Tour;
};

export default function TourTabs({ tour }: TourTabsProps) {
  const [tab, setTab] = useState<TabKey>("itinerary");

  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { key: "itinerary", label: "Itinerary" },
          { key: "inclusions", label: "Inclusions / Exclusions" },
          { key: "price", label: "Price" },
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
            <article key={entry.day} className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">Day {entry.day}</p>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900">{entry.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{entry.content}</p>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "inclusions" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">Inclusions</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600">
              {tour.inclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">Exclusions</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600">
              {tour.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "price" ? (
        <div className="space-y-2 rounded-2xl bg-neutral-50 p-5">
          <p className="text-sm text-neutral-500">From</p>
          {tour.salePrice ? <p className="text-sm text-neutral-400 line-through">{formatPrice(tour.price)}</p> : null}
          <p className="text-3xl font-semibold text-emerald-700">{formatPrice(tour.salePrice ?? tour.price)}</p>
          <p className="text-sm text-neutral-600">Price per person based on double occupancy.</p>
        </div>
      ) : null}
    </section>
  );
}
