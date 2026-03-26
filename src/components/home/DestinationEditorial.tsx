import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const destinationHighlights = [
  {
    name: "Northern Vietnam",
    text: "Terraced valleys, heritage architecture, and bay cruises crafted for travelers who prefer depth over checklist travel.",
    image:
      "https://images.unsplash.com/photo-1566916118472-84ba6fa2dc78?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Luang Prabang",
    text: "A slower rhythm of temple towns, riverside rituals, and refined boutique stays with immersive cultural access.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Andaman Coast",
    text: "Private coves, yacht-ready coastlines, and design-led resorts balanced by meaningful local experiences.",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function DestinationEditorial() {
  return (
    <section className="relative overflow-hidden py-24" data-home-section>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-fixed bg-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1720]/90 via-[#0f1720]/80 to-[#0f1720]/60" />
      <div className="absolute -right-28 top-20 h-72 w-72 rounded-full bg-[#be8a39]/25 blur-3xl" />
      <div className="absolute -left-28 bottom-8 h-64 w-64 rounded-full bg-emerald-700/20 blur-3xl" />

      <div className="container relative px-4 text-white">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">Destination Editorial</p>
          <h2 className="mt-3 font-heading text-4xl leading-tight md:text-6xl">
            Places That Deserve More Than A Quick Visit
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-200 md:text-base">
            Each itinerary is built around meaningful pacing and local texture. Instead of rushing between landmarks,
            we curate windows of time where design, cuisine, and culture naturally unfold. This is why our journeys
            feel less like packaged tours and more like thoughtful narratives crafted around your travel style.
          </p>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-3">
          {destinationHighlights.map((item) => (
            <Card
              key={item.name}
              data-home-card
              className="lux-shadow-3d overflow-hidden rounded-[22px] border-white/25 bg-white/12 py-0 text-white backdrop-blur"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={`${item.name} travel inspiration`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl text-white">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 text-sm leading-relaxed text-neutral-200">{item.text}</CardContent>
            </Card>
          ))}
        </div>

        <Button asChild className="mt-8 rounded-full bg-[#be8a39] px-7 py-3 text-white hover:bg-[#a87932]">
          <Link href="/tours">Explore destinations</Link>
        </Button>
      </div>
    </section>
  );
}
