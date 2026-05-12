import { useRef } from "react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const team = [
  "Norhanah Umpar",
  "Ethan Patrick Bandebas",
  "Leander Lorenz Lubguban",
  "Harvie Purgatorio",
];

function ThankYouSlide({}: SlideProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".ty-chip", {
        y: -20,
        opacity: 0,
        duration: 0.6,
      });

      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });
        tl.from(
          split.chars,
          {
            y: 80,
            opacity: 0,
            filter: "blur(14px)",
            stagger: 0.03,
            duration: 0.9,
          },
          "<0.1"
        );
      }

      tl.from(".ty-sub", { y: 28, opacity: 0, duration: 0.7 }, "<0.4");
      tl.from(".ty-divider", { scaleX: 0, transformOrigin: "left center", duration: 0.7 }, "<0.2");
      tl.from(".ty-credit", { y: 20, opacity: 0, duration: 0.6 }, "<0.2");
      tl.from(".ty-meta", { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, "<0.1");

      // Subtle background blob drift
      if (!reduce) {
        gsap.to(".ty-blob-a", {
          x: "+=40",
          y: "-=24",
          duration: 14,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(".ty-blob-b", {
          x: "-=36",
          y: "+=28",
          duration: 16,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (reduce) tl.progress(1);
    },
    { scope: rootRef }
  );

  return (
    <SlideShell>
      <div ref={rootRef} className="relative flex h-full w-full flex-col items-center justify-center">
        <div
          className="ty-blob-a pointer-events-none absolute -top-24 -left-24 size-[60vh] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-yellow) 45%, transparent), transparent 65%)",
          }}
        />
        <div
          className="ty-blob-b pointer-events-none absolute -bottom-24 -right-24 size-[55vh] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 40%, transparent), transparent 65%)",
          }}
        />

        <span
          className="ty-chip relative mb-8 rounded-full px-5 py-2 text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
          }}
        >
          UC-CCS Research Congress 2026
        </span>

        <h1
          ref={titleRef}
          className="relative font-display font-black leading-[0.95] tracking-tight"
          style={{
            fontSize: "clamp(5rem, 12vw, 12rem)",
            background:
              "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 45%, white))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Thank You.
        </h1>

        <p
          className="ty-sub relative mt-6 text-3xl/[1.3] font-semibold text-foreground/95"
        >
          Questions are welcome.
        </p>

        <div
          className="ty-divider relative mt-12 h-[3px] w-[40vw] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--brand-blue), transparent)",
          }}
        />

        <p className="ty-credit relative mt-8 max-w-4xl text-center text-xl font-medium text-foreground/95">
          {team.join("  ·  ")}
        </p>

        <div className="ty-meta-row relative mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {[
            "University of Cebu — Main",
            "College of Computer Studies",
            "May 13, 2026",
          ].map((m) => (
            <span
              key={m}
              className="ty-meta rounded-full border-2 px-4 py-1.5 text-sm font-medium"
              style={{
                borderColor: "color-mix(in oklab, var(--brand-blue) 35%, transparent)",
                color: "var(--brand-blue)",
                background: "color-mix(in oklab, var(--brand-blue) 6%, white)",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

export const slide31ThankYou: SlideDef = {
  id: "thank-you",
  title: "Thank You",
  builds: 0,
  Component: ThankYouSlide,
};
