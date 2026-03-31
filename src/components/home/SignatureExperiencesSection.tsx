import { Compass, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experiencePillars = [
    {
        icon: Compass,
        title: "Thiet Ke Lich Trinh Theo Nhu Cau",
        text: "Tu van 1-1 de xay dung lo trinh theo ngan sach, so ngay va muc tieu chuyen di cua tung nhom khach.",
    },
    {
        icon: Gem,
        title: "Combo Khach San - Di Chuyen - Trai Nghiem",
        text: "Dong bo toan bo dich vu trong mot goi de ban de dang dat tour va kiem soat chi phi.",
    },
    {
        icon: ShieldCheck,
        title: "Ho Tro Van Hanh 24/7",
        text: "Co doi ngu xu ly su co va cap nhat lich trinh theo thoi gian thuc trong suot chuyen di.",
    },
    {
        icon: Sparkles,
        title: "Uu Dai Dinh Ky Theo Mua",
        text: "Lien tuc cap nhat cac chuong trinh khuyen mai tour bien, tour di san va tour gia dinh theo tung thang.",
    },
];

export default function SignatureExperiencesSection() {
    return (
        <section className="py-24" id="service-highlights" data-home-section>
            <div className="container px-4">
                <div className="lux-shadow-3d rounded-[30px] border border-neutral-200/80 bg-white p-6 md:p-10">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        Dich Vu Cung Cap
                    </p>
                    <h2 className="mt-3 max-w-4xl font-heading text-4xl text-neutral-900 md:text-6xl">
                        Giai phap tour tron goi cho tung nhu cau
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
                        Chung toi khong chi ban tour. STOUR TRAVEL cung cap he
                        thong dich vu tu tu van, dat tour, van hanh den cham soc
                        sau chuyen di. Muc tieu la giup ban dat tour nhanh, di
                        dung nhu ke hoach va an tam trong moi hanh trinh.
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        {experiencePillars.map((item) => (
                            <Card
                                key={item.title}
                                data-home-card
                                className="lux-shadow rounded-2xl border-neutral-200/80 bg-neutral-50 py-0"
                            >
                                <CardHeader className="pb-0">
                                    <CardTitle className="flex items-center gap-2 text-2xl text-neutral-900">
                                        <item.icon className="size-5 text-emerald-700" />{" "}
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-5 text-sm leading-relaxed text-neutral-600">
                                    {item.text}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
