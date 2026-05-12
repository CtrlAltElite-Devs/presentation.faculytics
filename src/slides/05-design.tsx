import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const cards = [
  "Quantitative Approach using digital or paper questionnaire.",
  "Stakeholders include students, deans, administrators institution wide.",
  "ISO/IEC 25010 evaluation using four-point Likert scale.",
];

const phases = ["Design", "Develop", "Test", "Evaluate"];

function DesignSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".design-title .char", {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
      });
      tl.from(
        ".design-card",
        { x: -60, opacity: 0, stagger: 0.12, duration: 0.7 },
        "<0.2"
      );

      // Connector path draw
      const path = ref.current?.querySelector(".phase-connector") as SVGPathElement | null;
      if (path) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        tl.to(path, { strokeDashoffset: 0, duration: 1.0, ease: "deck-out" }, "<0.1");
      }

      tl.from(
        ".phase",
        {
          scale: 0,
          opacity: 0,
          stagger: 0.18,
          duration: 0.7,
          ease: "deck-overshoot",
        },
        "<0.2"
      );

      tl.from(
        ".phase-label",
        { x: -20, opacity: 0, stagger: 0.18, duration: 0.5 },
        "<0.1"
      );

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="flex h-full flex-col gap-12">
        <h2
          className="design-title font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(4rem, 7.5vw, 8rem)",
            color: "var(--foreground)",
          }}
        >
          {Array.from("Research ").map((c, i) => (
            <span key={`a${i}`} className="char inline-block whitespace-pre">
              {c}
            </span>
          ))}
          <span
            style={{
              background:
                "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 50%, white))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {Array.from("Design").map((c, i) => (
              <span key={`b${i}`} className="char inline-block">
                {c}
              </span>
            ))}
          </span>
          <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>.</span>
        </h2>

        <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-16 items-center">
          {/* Left: 3 cards */}
          <div className="flex flex-col gap-6">
            {cards.map((c, i) => (
              <div
                key={i}
                className="design-card rounded-3xl bg-card px-8 py-7 text-xl/[1.5] font-medium text-foreground/85"
                style={{
                  boxShadow:
                    "0 25px 60px -25px color-mix(in oklab, var(--brand-blue) 22%, transparent), 0 6px 20px -6px rgb(0 0 0 / 0.08)",
                }}
              >
                {c}
              </div>
            ))}
          </div>

          {/* Right: 4 numbered circles with connector */}
          <div className="relative h-full">
            <svg
              className="absolute left-12 top-12 -z-0 h-[calc(100%-6rem)] w-[3px] overflow-visible"
              viewBox="0 0 4 400"
              preserveAspectRatio="none"
            >
              <path
                className="phase-connector"
                d="M 2 0 L 2 400"
                stroke="color-mix(in oklab, var(--brand-blue) 40%, transparent)"
                strokeWidth="3"
                strokeDasharray="6 8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative flex h-full flex-col justify-between py-2">
              {phases.map((p, i) => (
                <div key={p} className="flex items-center gap-6">
                  <div
                    className="phase grid size-24 place-items-center rounded-full font-display text-4xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in oklab, var(--brand-blue) ${
                        85 - i * 6
                      }%, white), var(--brand-blue))`,
                      boxShadow:
                        "0 20px 40px -10px color-mix(in oklab, var(--brand-blue) 45%, transparent)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="phase-label font-display text-5xl font-bold text-foreground/90">
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export const slide05Design: SlideDef = {
  id: "design",
  title: "Research Design",
  builds: 0,
  Component: DesignSlide,
};
