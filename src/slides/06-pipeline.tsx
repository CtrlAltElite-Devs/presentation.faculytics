import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const stages = [
  { label: "Text\nPreprocessing", sub: "Raw Feedback\nto Clean Text", tone: 1 },
  { label: "Sentiment\nClassification", sub: "Positive, Negative\nand Neutral", tone: 0.9 },
  { label: "Sentiment\ngated filtering", sub: "Positive Feedback\ncontains at least\n10 words", tone: 0.8 },
  { label: "Topic\nModeling", sub: "Topics", tone: 0.7 },
  { label: "Recommendation\ngeneration", sub: "Context\nEngineering", tone: 0.6 },
];

function PipelineSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".pipe-title .char", {
        y: 60,
        opacity: 0,
        rotate: -4,
        stagger: 0.03,
        duration: 0.6,
      });

      tl.from(
        ".pipe-stage",
        {
          y: 80,
          scale: 0.7,
          opacity: 0,
          rotateY: 35,
          stagger: 0.13,
          duration: 0.7,
          ease: "deck-overshoot",
        },
        "<0.2"
      );

      tl.from(
        ".pipe-connector",
        {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.13,
          duration: 0.4,
          ease: "deck-out",
        },
        "<0.05"
      );

      tl.from(
        ".pipe-sublabel",
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        },
        "<0.3"
      );

      // Continuous dot travel along the pipeline
      const wrap = ref.current?.querySelector(".pipeline-row");
      if (wrap && !reduce) {
        const stagesEls = wrap.querySelectorAll(".pipe-stage");
        if (stagesEls.length > 1) {
          gsap.set(".traveler", { opacity: 0 });
          const travelTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay: 1.5 });
          stagesEls.forEach((_, i) => {
            if (i === stagesEls.length - 1) return;
            travelTl.fromTo(
              ".traveler",
              { x: () => (stagesEls[i] as HTMLElement).offsetLeft + (stagesEls[i] as HTMLElement).offsetWidth - 8, opacity: 0.0 },
              {
                x: () => (stagesEls[i + 1] as HTMLElement).offsetLeft - 4,
                opacity: 1,
                duration: 0.6,
                ease: "deck-in",
              }
            );
          });
        }
      }

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="flex h-full flex-col">
        <h2
          className="pipe-title mb-10 text-center font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            color: "var(--foreground)",
          }}
        >
          {Array.from("AI Processing ").map((c, i) => (
            <span key={`a${i}`} className="char inline-block whitespace-pre">
              {c}
            </span>
          ))}
          <span className="brand-gradient-text">
            {Array.from("Pipeline").map((c, i) => (
              <span key={`b${i}`} className="char inline-block">
                {c}
              </span>
            ))}
          </span>
          <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>.</span>
        </h2>

        <div className="pipeline-row relative flex flex-1 items-center justify-center gap-2 pb-12">
          {stages.map((s, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div
                className="pipe-stage relative grid aspect-square w-full max-w-[19vh] place-items-center px-4 text-center font-display text-xl/[1.15] font-semibold"
                style={{
                  background: `linear-gradient(150deg,
                    color-mix(in oklab, var(--brand-blue) ${Math.round(s.tone * 95)}%, white),
                    color-mix(in oklab, var(--brand-blue) ${Math.round(s.tone * 75 + 5)}%, white))`,
                  color: "white",
                  borderRadius: i === 0 ? "60% 18% 18% 60%" : i === stages.length - 1 ? "18% 60% 60% 18%" : "18%",
                  boxShadow:
                    "0 30px 60px -25px color-mix(in oklab, var(--brand-blue) 35%, transparent), 0 8px 24px -8px rgb(0 0 0 / 0.1)",
                  textShadow: "0 1px 2px rgb(0 0 0 / 0.15)",
                }}
              >
                <span className="whitespace-pre-line">{s.label}</span>
              </div>
              {i < stages.length - 1 && (
                <div className="pipe-connector relative mx-1 h-[3px] flex-1 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--brand-blue) 60%, white), color-mix(in oklab, var(--brand-blue) 30%, white))",
                  }}
                />
              )}
            </div>
          ))}
          <div
            className="traveler pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 rounded-full"
            style={{
              background: "var(--brand-blue)",
              boxShadow:
                "0 0 0 4px color-mix(in oklab, var(--brand-blue) 25%, transparent), 0 0 16px color-mix(in oklab, var(--brand-blue) 50%, transparent)",
            }}
          />
        </div>

        {/* Sub-labels below */}
        <div className="grid grid-cols-5 gap-2 pb-2">
          {stages.map((s, i) => (
            <div key={i} className="relative grid place-items-center text-center">
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--brand-blue) 60%, transparent), transparent)",
                }}
              />
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 size-3.5 rounded-full"
                style={{
                  background: "var(--brand-blue)",
                  opacity: 0.85,
                }}
              />
              <p className="pipe-sublabel whitespace-pre-line text-base/[1.35] font-medium text-foreground/95">
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

export const slide06Pipeline: SlideDef = {
  id: "pipeline",
  title: "AI Processing Pipeline",
  builds: 0,
  Component: PipelineSlide,
};
