import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const destinationHighlights = [
    {
        name: "Bac Bo - Viet Nam",
        text: "Ket hop Ha Noi, Ha Long, Sa Pa voi nhiep do thong dong, uu tien trai nghiem van hoa ban dia va nghi duong chat luong cao.",
        image: "https://images.unsplash.com/photo-1566916118472-84ba6fa2dc78?auto=format&fit=crop&w=1400&q=80",
    },
    {
        name: "Lao - Luang Prabang",
        text: "Thanh pho di san voi nhiep song cham, phu hop du lich tinh duong, retreat va hanh trinh can bang nang luong.",
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80",
    },
    {
        name: "Thai Lan - Vung Bien Andaman",
        text: "Resort bien cao cap, hoat dong dao rieng, va dich vu concierge lien tuc cho ky nghi gia dinh hoac cap doi.",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
    },
];

export default function DestinationEditorial() {
    return (
        <section
            className="relative overflow-hidden py-24"
            id="featured-destinations"
            data-home-section
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-fixed bg-center" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0f1720]/90 via-[#0f1720]/80 to-[#0f1720]/60" />
            <div className="absolute -right-28 top-20 h-72 w-72 rounded-full bg-[#be8a39]/25 blur-3xl" />
            <div className="absolute -left-28 bottom-8 h-64 w-64 rounded-full bg-emerald-700/20 blur-3xl" />

            <div className="container relative px-4 text-white">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
                        Diem Den Noi Bat
                    </p>
                    <h2 className="mt-3 font-heading text-4xl leading-tight md:text-6xl">
                        Nhung diem den dang duoc dat nhieu nhat
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-200 md:text-base">
                        Moi tour duoc xay dung theo phong cach linh hoat: kham
                        pha, nghi duong hoac ket hop gia dinh. Chung toi uu tien
                        diem den co trai nghiem ro net, lich trinh de di va doi
                        tac dia phuong uy tin de hanh trinh cua ban tron ven tu
                        dau den cuoi.
                    </p>
                </div>

                <div className="mt-11 grid gap-6 md:grid-cols-3">
                    {destinationHighlights.map((item) => (
                        <Card
                            key={item.name}
                            data-home-card
                            className="lux-shadow-3d overflow-hidden rounded-[22px] border-white/25 bg-white/12 py-0 text-white backdrop-blur"
                        >
                            <div className="relative aspect-4/3">
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
                                <CardTitle className="text-2xl text-white">
                                    {item.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-5 text-sm leading-relaxed text-neutral-200">
                                {item.text}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button
                    asChild
                    className="mt-8 rounded-full bg-[#be8a39] px-7 py-3 text-white hover:bg-[#a87932]"
                >
                    <Link href="/tours">Xem tat ca diem den</Link>
                </Button>
            </div>
        </section>
    );
}
