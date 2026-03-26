"use client";

import { useEffect } from "react";

export default function HomeGsapEffects() {
  useEffect(() => {
    let mounted = true;
    let cleanup = () => {};

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted) {
        return;
      }

      const ctx = gsap.context(() => {
        const sectionAnimations = gsap.utils.toArray<HTMLElement>(
          "[data-home-section]:not([data-home-static])"
        );
        const cardAnimations = gsap.utils.toArray<HTMLElement>("[data-home-card]");

        sectionAnimations.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true,
              },
            }
          );
        });

        cardAnimations.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
      });

      cleanup = () => {
        ctx.revert();
      };
    };

    init();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return null;
}
