"use client";

import { motion } from "framer-motion";
import BookingStickyForm from "@/components/tours/BookingStickyForm";
import TourGallery from "@/components/tours/TourGallery";
import TourTabs from "@/components/tours/TourTabs";
import { Tour } from "@/lib/data/tours";
import { formatPrice } from "@/lib/utils/formatPrice";

type TourDetailContentProps = {
  tour: Tour;
};

export default function TourDetailContent({ tour }: TourDetailContentProps) {
  return (
    <div className="container px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-7">
          <TourGallery title={tour.title} images={tour.images} />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="rounded-[24px] border border-neutral-200 bg-white p-6"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">{tour.country}</p>
            <h1 className="mt-2 font-heading text-4xl text-neutral-900">{tour.title}</h1>
            <p className="mt-3 text-neutral-600">{tour.description}</p>
            <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Starting from</p>
              {tour.salePrice ? <p className="text-sm text-neutral-400 line-through">{formatPrice(tour.price)}</p> : null}
              <p className="text-3xl font-semibold text-emerald-700">{formatPrice(tour.salePrice ?? tour.price)}</p>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <TourTabs tour={tour} />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="rounded-[24px] border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center"
          >
            <h2 className="font-heading text-3xl text-neutral-900">Map</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Interactive map placeholder. In production, connect this section to a map provider and route coordinates.
            </p>
          </motion.section>
        </div>

        <div>
          <BookingStickyForm tourTitle={tour.title} />
        </div>
      </div>
    </div>
  );
}
