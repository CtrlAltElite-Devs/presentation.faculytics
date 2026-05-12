import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const items = [
  "BERTopic using LaBSE embeddings",
  "UMAP for dimensionality reduction",
  "HDBSCAN for clustering",
  "KeyBERTInspired for keyword extraction",
];

function TopicArchSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      const arc = ref.current?.querySelector(".semi-arc") as SVGPathElement | null;
      if (arc) {
        const len = arc.getTotalLength();
        arc.style.strokeDasharray = `${len}`;
        arc.style.strokeDashoffset = `${len}`;
        tl.to(arc, { strokeDashoffset: 0, duration: 1.2, ease: "deck-out" });
      }

      tl.from(".ta-title .char", { y: 50, opacity: 0, stagger: 0.03, duration: 0.6 }, "<0.1");

      tl.from(".ta-num", {
        scale: 0,
        opacity: 0,
        stagger: 0.13,
        duration: 0.6,
        ease: "deck-overshoot",
      }, "<0.1");

      tl.from(".ta-text", { x: -30, opacity: 0, stagger: 0.13, duration: 0.6 }, "<0.1");

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="grid h-full grid-cols-[1.3fr_0.7fr] items-center gap-12">
        {/* Left: numbered list (text-first, num after) */}
        <ol className="flex flex-col gap-7 pr-12">
          {items.map((text, i) => (
            <li key={i} className="flex items-baseline justify-end gap-6">
              <span className="ta-text max-w-2xl text-right text-2xl/[1.45] font-medium text-foreground/85">
                {text}
              </span>
              <span
                className="ta-num font-display text-5xl font-black"
                style={{
                  color: "var(--brand-blue)",
                  minWidth: "3.5rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>

        {/* Right: title + mirrored half-circle */}
        <div className="relative">
          <svg
            viewBox="0 0 200 400"
            className="absolute -left-12 top-1/2 h-[80%] w-auto -translate-y-1/2"
            style={{ transform: "translateY(-50%) scaleX(-1)" }}
          >
            <defs>
              <linearGradient id="ta-arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop offset="100%" stopColor="color-mix(in oklab, var(--brand-blue) 50%, white)" />
              </linearGradient>
            </defs>
            <path
              className="semi-arc"
              d="M 0 0 A 200 200 0 0 1 0 400 Z"
              fill="url(#ta-arc-grad)"
            />
          </svg>
          <h2
            className="ta-title relative text-right font-display font-black leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
              color: "var(--foreground)",
            }}
          >
            {Array.from("Topic ").map((c, i) => (
              <span key={`a${i}`} className="char inline-block whitespace-pre">
                {c}
              </span>
            ))}
            {Array.from("Modeling").map((c, i) => (
              <span key={`b${i}`} className="char inline-block">
                {c}
              </span>
            ))}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 50%, white))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {Array.from("Architecture").map((c, i) => (
                <span key={`c${i}`} className="char inline-block">
                  {c}
                </span>
              ))}
            </span>
            <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>.</span>
          </h2>
        </div>
      </div>
    </SlideShell>
  );
}

export const slide08TopicArch: SlideDef = {
  id: "topic-arch",
  title: "Topic Modeling Architecture",
  builds: 0,
  Component: TopicArchSlide,
};
