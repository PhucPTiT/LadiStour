import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyStorySection() {
    return (
        <section
            className="relative overflow-hidden bg-[#f6f4ef] py-24"
            id="company-story"
            data-home-section
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(190,138,57,0.15),transparent_42%)]" />
            <div className="container grid items-center gap-10 px-4 lg:grid-cols-[1.2fr_1fr]">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                        Gioi Thieu Cong Ty
                    </p>
                    <h2 className="mt-3 font-heading text-4xl text-neutral-900 md:text-6xl">
                        Doi ngu chuyen tour chuyen nghiep tai Dong Nam A
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-neutral-700 md:text-base">
                        STOUR TRAVEL duoc xay dung boi doi ngu dieu hanh tour,
                        huong dan vien va chuyen vien san pham co kinh nghiem
                        nhieu nam tai Viet Nam, Lao, Campuchia va Thai Lan.
                        Chung toi tap trung vao toc do phan hoi nhanh, lich
                        trinh ro rang va kha nang xu ly linh hoat theo tung nhom
                        khach.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
                        Loi the cua chung toi la he sinh thai doi tac ban dia,
                        gia canh tranh minh bach va quy trinh cham soc xuyen
                        suot truoc - trong - sau chuyen di. Vi vay, khach hang
                        co the an tam dat tour ke ca vao mua cao diem.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    12+
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Nam kinh nghiem van hanh
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    24/7
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Ho tro xuyen suot hanh trinh
                                </p>
                            </CardContent>
                        </Card>
                        <Card
                            data-home-card
                            className="lux-shadow rounded-2xl border-neutral-200/80 bg-white py-0"
                        >
                            <CardContent className="p-4">
                                <p className="text-3xl font-semibold text-emerald-700">
                                    4
                                </p>
                                <p className="text-sm text-neutral-600">
                                    Quoc gia khai thac chinh
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lux-shadow-3d relative min-h-130 overflow-hidden rounded-[28px] border border-white/60">
                    <Image
                        src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1400&q=80"
                        alt="Company team planning premium travel routes"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                    <p className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 px-4 py-3 text-sm text-neutral-700 backdrop-blur">
                        Moi lich trinh deu duoc kiem tra boi bo phan dieu hanh
                        va cham soc khach hang truoc khi chot, dam bao tinh kha
                        thi va trai nghiem thuc te.
                    </p>
                </div>
            </div>
        </section>
    );
}
