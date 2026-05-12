import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const rationale = [
  "Faculty evaluation helps improve teaching quality continuously.",
  "Student feedback guides better school decision-making processes.",
  "Faculytics v1 had NLP limits.",
  "Large feedback sets need faster automated analysis.",
  "Improves sentiment analysis to respond.",
  "Personalized insights and recommendations for faculty evaluation.",
];

function RationaleSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".rationale-title .char", {
        y: 60,
        opacity: 0,
        rotate: -4,
        stagger: 0.04,
        duration: 0.7,
      });

      tl.from(
        ".dot",
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "deck-overshoot",
        },
        "<0.2"
      );

      tl.from(
        ".rationale-card",
        {
          y: 60,
          scale: 0.85,
          opacity: 0,
          stagger: { each: 0.08, from: "start" },
          duration: 0.7,
          ease: "deck-overshoot",
        },
        "<0.05"
      );

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="flex h-full flex-col gap-10">
        <h2
          className="rationale-title brand-gradient-text font-display font-black tracking-tight leading-none"
          style={{
            fontSize: "clamp(4rem, 8vw, 8rem)",
          }}
        >
          {"Rationale".split("").map((c, i) => (
            <span key={i} className="char inline-block">
              {c}
            </span>
          ))}
          <span className="char inline-block text-brand-blue" style={{ color: "var(--brand-blue)", WebkitTextFillColor: "var(--brand-blue)" }}>.</span>
        </h2>

        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-6">
          {rationale.map((text, i) => (
            <div
              key={i}
              className="rationale-card relative flex items-center rounded-3xl bg-card px-8 py-8 text-3xl/[1.3] font-semibold text-foreground/95"
              style={{
                boxShadow:
                  "0 20px 50px -20px color-mix(in oklab, var(--brand-blue) 18%, transparent), 0 6px 18px -6px rgb(0 0 0 / 0.07)",
              }}
            >
              <span
                className="dot absolute left-7 top-7 size-2.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 50%, white))",
                }}
              />
              <p className="pl-7">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

export const slide03Rationale: SlideDef = {
  id: "rationale",
  title: "Rationale",
  builds: 0,
  Component: RationaleSlide,
};
