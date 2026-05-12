import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const conclusions = [
  "Analyzes multilingual feedback",
  "Identifies sentiment and themes",
  "Generates actionable recommendations",
];

const recommendations = [
  "Campus and Program-Level Recommendations",
  "Expanded Feedback Scope",
  "Stable Model Hosting",
  "Local Deployment of Recommendation Models",
];

function ConclusionsSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      // Split wipe: left panel wipes left-to-right, right panel right-to-left
      tl.fromTo(
        ".panel-left",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "deck-out" }
      );
      tl.fromTo(
        ".panel-right",
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: "deck-out" },
        "<"
      );

      // Titles
      tl.from(".conc-title .char", {
        y: 60,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
      }, "<0.3");
      tl.from(".rec-title .char", {
        y: 60,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
      }, "<0");

      // Bullets — staggered between sides
      tl.from(".conc-pill", {
        x: -50,
        opacity: 0,
        stagger: 0.18,
        duration: 0.6,
        ease: "deck-overshoot",
      }, "<0.3");
      tl.from(".rec-pill", {
        x: 50,
        opacity: 0,
        stagger: 0.18,
        duration: 0.6,
        ease: "deck-overshoot",
      }, "<0.1");

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell noPadding>
      <div ref={ref} className="grid h-full w-full grid-cols-2">
        {/* Left panel — light */}
        <div
          className="panel-left relative flex h-full flex-col justify-center gap-10 px-[5vw] py-[5vh]"
          style={{
            background:
              "linear-gradient(135deg, var(--surface), var(--background))",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--brand-yellow) 30%, transparent), transparent 40%)",
            }}
          />
          <h2
            className="conc-title relative font-display font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(3rem, 5vw, 5rem)",
              background:
                "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 40%, white))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {Array.from("Conclusions").map((c, i) => (
              <span key={i} className="char inline-block">
                {c}
              </span>
            ))}
          </h2>

          <ul className="relative flex flex-col gap-5">
            {conclusions.map((c, i) => (
              <li
                key={i}
                className="conc-pill rounded-full bg-card px-8 py-5 text-xl/[1.45] font-semibold text-foreground/95"
                style={{
                  boxShadow:
                    "0 20px 45px -18px color-mix(in oklab, var(--brand-blue) 25%, transparent), 0 6px 16px -6px rgb(0 0 0 / 0.08)",
                }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel — dark */}
        <div
          className="panel-right relative flex h-full flex-col justify-center gap-10 px-[5vw] py-[5vh] text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.21 0.04 264.53), oklch(0.15 0.02 264.53))",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 30%, color-mix(in oklab, var(--brand-blue) 35%, transparent), transparent 40%)",
            }}
          />
          <h2
            className="rec-title relative font-display font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(3rem, 5vw, 5rem)",
              color: "white",
            }}
          >
            {Array.from("Recommendations").map((c, i) => (
              <span key={i} className="char inline-block">
                {c}
              </span>
            ))}
          </h2>

          <ul className="relative flex flex-col gap-5">
            {recommendations.map((r, i) => (
              <li
                key={i}
                className="rec-pill rounded-full px-8 py-5 text-xl/[1.45] font-semibold"
                style={{
                  background:
                    "linear-gradient(120deg, color-mix(in oklab, var(--brand-blue) 70%, white), var(--brand-blue))",
                  color: "white",
                  boxShadow:
                    "0 20px 45px -18px color-mix(in oklab, var(--brand-blue) 50%, transparent)",
                }}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}

export const slide30Conclusions: SlideDef = {
  id: "conclusions",
  title: "Conclusions & Recommendations",
  builds: 0,
  Component: ConclusionsSlide,
};
