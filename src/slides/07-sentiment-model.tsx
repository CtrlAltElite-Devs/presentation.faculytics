import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const items = [
  "Gemma 4 26B-A4B",
  "LoRA Fine-tuning",
  "Three classes: positive, neutral, negative",
  "Multilingual dataset: English, Cebuano, Tagalog, Taglish, Cebuano-English",
];

function SentimentModelSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      // Semicircle arc draw via dashoffset
      const arc = ref.current?.querySelector(".semi-arc") as SVGPathElement | null;
      if (arc) {
        const len = arc.getTotalLength();
        arc.style.strokeDasharray = `${len}`;
        arc.style.strokeDashoffset = `${len}`;
        tl.to(arc, { strokeDashoffset: 0, duration: 1.2, ease: "deck-out" });
      }

      tl.from(".sm-title .char", {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
      }, "<0.1");

      tl.from(
        ".sm-num",
        {
          scale: 0,
          opacity: 0,
          stagger: 0.13,
          duration: 0.6,
          ease: "deck-overshoot",
        },
        "<0.1"
      );

      tl.from(
        ".sm-text",
        {
          x: 30,
          opacity: 0,
          stagger: 0.13,
          duration: 0.6,
        },
        "<0.1"
      );

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="grid h-full grid-cols-[0.7fr_1.3fr] items-center gap-12">
        {/* Left: title + half-circle */}
        <div className="relative">
          <svg viewBox="0 0 200 400" className="absolute -right-12 top-1/2 h-[80%] w-auto -translate-y-1/2">
            <defs>
              <linearGradient id="sm-arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop offset="100%" stopColor="color-mix(in oklab, var(--brand-blue) 50%, white)" />
              </linearGradient>
            </defs>
            <path
              className="semi-arc"
              d="M 0 0 A 200 200 0 0 1 0 400 Z"
              fill="url(#sm-arc-grad)"
              stroke="var(--brand-blue)"
              strokeWidth="0"
            />
          </svg>
          <h2
            className="sm-title relative font-display font-black leading-[0.95] tracking-tighter"
            style={{
              fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
              color: "var(--foreground)",
            }}
          >
            {Array.from("Sentiment ").map((c, i) => (
              <span key={`a${i}`} className="char inline-block whitespace-pre">
                {c}
              </span>
            ))}
            <br />
            <span className="brand-gradient-text">
              {Array.from("Classification").map((c, i) => (
                <span key={`b${i}`} className="char inline-block">
                  {c}
                </span>
              ))}
            </span>
            <br />
            <span style={{ color: "var(--foreground)" }}>
              {Array.from("Model").map((c, i) => (
                <span key={`c${i}`} className="char inline-block">
                  {c}
                </span>
              ))}
            </span>
            <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>.</span>
          </h2>
        </div>

        {/* Right: numbered list */}
        <ol className="flex flex-col gap-7 pl-12">
          {items.map((text, i) => (
            <li key={i} className="flex items-baseline gap-6">
              <span
                className="sm-num font-display text-5xl font-black"
                style={{
                  color: "var(--brand-blue)",
                  minWidth: "3.5rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sm-text max-w-2xl text-2xl/[1.45] font-medium text-foreground/95">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </SlideShell>
  );
}

export const slide07SentimentModel: SlideDef = {
  id: "sentiment-model",
  title: "Sentiment Classification Model",
  builds: 0,
  Component: SentimentModelSlide,
};
