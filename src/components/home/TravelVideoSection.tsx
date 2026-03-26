export default function TravelVideoSection() {
    return (
        <section className="bg-[#0f1720] py-24 text-white" data-home-section>
            <div className="container px-4">
                <div className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
                        Travel Video
                    </p>
                    <h2 className="mt-3 font-heading text-4xl leading-tight md:text-6xl">
                        Cam nhan nhiep do hanh trinh qua video gioi thieu
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:text-base">
                        Mot video tong quan de khach hang hinh dung ro hon khong
                        khi, nhiep do va chat luong trai nghiem cua khu vuc Dong
                        Nam A.
                    </p>
                </div>

                <div
                    data-home-card
                    className="lux-shadow-3d overflow-hidden rounded-[28px] border border-white/20 bg-black"
                >
                    <div className="aspect-video w-full">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/VYOjWnS4cMY?rel=0"
                            title="Southeast Asia travel inspiration"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
