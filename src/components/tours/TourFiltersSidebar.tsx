"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { destinations, typologies } from "@/lib/data/tours";

type TourFilters = {
  country: string;
  typology: string;
  durationMax: number;
  priceMax: number;
};

type TourFiltersSidebarProps = {
  filters: TourFilters;
  onChange: (next: TourFilters) => void;
};

export default function TourFiltersSidebar({ filters, onChange }: TourFiltersSidebarProps) {
  return (
    <aside className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      <p className="mb-5 text-sm font-semibold tracking-[0.16em] text-neutral-500 uppercase">Filter Tours</p>

      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm text-neutral-600">Destination Country</span>
          <Select
            value={filters.country || "all"}
            onValueChange={(value) => onChange({ ...filters, country: value === "all" ? "" : value })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-neutral-300 bg-white px-3 text-sm text-neutral-700">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
              <SelectItem value="all">All Countries</SelectItem>
              {destinations.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-600">Typology</span>
          <Select
            value={filters.typology || "all"}
            onValueChange={(value) => onChange({ ...filters, typology: value === "all" ? "" : value })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-neutral-300 bg-white px-3 text-sm text-neutral-700">
              <SelectValue placeholder="All Typologies" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-neutral-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
              <SelectItem value="all">All Typologies</SelectItem>
              {typologies.map((typology) => (
                <SelectItem key={typology} value={typology}>
                  {typology}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-600">Duration up to {filters.durationMax} days</span>
          <input
            type="range"
            min={3}
            max={10}
            value={filters.durationMax}
            onChange={(event) => onChange({ ...filters, durationMax: Number(event.target.value) })}
            className="w-full accent-emerald-700"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-neutral-600">Price up to ${filters.priceMax}</span>
          <input
            type="range"
            min={700}
            max={2200}
            step={50}
            value={filters.priceMax}
            onChange={(event) => onChange({ ...filters, priceMax: Number(event.target.value) })}
            className="w-full accent-emerald-700"
          />
        </label>
      </div>
    </aside>
  );
}
