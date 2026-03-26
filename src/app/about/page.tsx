import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about STOUR LUXE, our mission, and our approach to crafting premium travel experiences in Southeast Asia.",
};

export default function AboutPage() {
    return (
        <section className="container px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                    About Us
                </p>
                <h1 className="mt-3 font-heading text-5xl text-neutral-900 md:text-6xl">
                    Travel Design With Precision and Soul
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-neutral-600">
                    STOUR LUXE is a specialist travel studio focused on bespoke
                    journeys across Vietnam, Laos, Cambodia, and Thailand. We
                    blend local expertise with global service standards to
                    design trips that feel effortless, meaningful, and deeply
                    personal.
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    <article className="rounded-[20px] border border-neutral-200 bg-white p-6">
                        <h2 className="font-heading text-3xl text-neutral-900">
                            Our Mission
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                            To craft sophisticated journeys that respect local
                            culture and deliver seamless, memory-rich
                            experiences.
                        </p>
                    </article>
                    <article className="rounded-[20px] border border-neutral-200 bg-white p-6">
                        <h2 className="font-heading text-3xl text-neutral-900">
                            What Makes Us Different
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                            Concierge-level planning, handpicked partners, and
                            destination intelligence built from on-ground teams.
                        </p>
                    </article>
                    <article className="rounded-[20px] border border-neutral-200 bg-white p-6">
                        <h2 className="font-heading text-3xl text-neutral-900">
                            Highlights
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                            24/7 local support, premium private transfers, and
                            carefully layered itineraries for all travel styles.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
}
