import { Compass, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experiencePillars = [
  {
    icon: Compass,
    title: "Route Intelligence",
    text: "Smart sequencing and transfer timing keep your itinerary smooth while preserving spacious, unhurried days.",
  },
  {
    icon: Gem,
    title: "Design-Led Stays",
    text: "We favor hotels with architectural character, elevated service culture, and a strong sense of place.",
  },
  {
    icon: ShieldCheck,
    title: "Operational Confidence",
    text: "Pre-arranged logistics, vetted partners, and active monitoring so your trip feels effortless in real time.",
  },
  {
    icon: Sparkles,
    title: "Private Touches",
    text: "From milestone dinners to curated local encounters, details are customized around your travel style.",
  },
];

export default function SignatureExperiencesSection() {
  return (
    <section className="py-24" data-home-section>
      <div className="container px-4">
        <div className="lux-shadow-3d rounded-[30px] border border-neutral-200/80 bg-white p-6 md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">Signature Approach</p>
          <h2 className="mt-3 max-w-4xl font-heading text-4xl text-neutral-900 md:text-6xl">
            The Craft Behind A High-End Journey
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Premium travel is not only about luxury inventory. It is about choreography: the right moment, the right
            sequence, and the right local context. Our team designs each journey around these principles, delivering
            comfort, identity, and depth from start to finish.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {experiencePillars.map((item) => (
              <Card key={item.title} data-home-card className="lux-shadow rounded-2xl border-neutral-200/80 bg-neutral-50 py-0">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-2xl text-neutral-900">
                    <item.icon className="size-5 text-emerald-700" /> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5 text-sm leading-relaxed text-neutral-600">{item.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
