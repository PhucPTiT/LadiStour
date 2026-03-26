import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24" data-home-section>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1720]/90 via-[#0f1720]/70 to-[#0f1720]/75" />
      <div className="absolute left-20 top-12 h-52 w-52 rounded-full bg-[#be8a39]/35 blur-3xl" />

      <div className="container relative px-4 text-white">
        <div className="lux-shadow-3d max-w-3xl rounded-[28px] border border-white/25 bg-white/10 p-7 backdrop-blur md:p-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-200 uppercase">Premium Planning Desk</p>
          <h2 className="mt-3 font-heading text-4xl leading-tight md:text-6xl">
            Chua ro section CTA? Day la khu vuc chot lead ro rang nhat
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-100 md:text-base">
            Gui nhanh nhu cau de nhan concept hanh trinh trong 24 gio. Tu honeymoon, golf, family den wellness,
            doi ngu concierge se de xuat route, budget va pace phu hop voi lich trinh cua ban.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full bg-[#be8a39] px-6 text-white hover:bg-[#a87932]">
              <Link href="/tours">
                Dat lich tu van <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full border-white/60 bg-white/10 px-6 text-white hover:bg-white/20">
              <Link href="/about">Xem ve chung toi</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
