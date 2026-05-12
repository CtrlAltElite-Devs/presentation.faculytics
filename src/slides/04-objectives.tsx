import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const objectives = [
  "Collection and management of feedbacks through integrated questionnaire.",
  "Analyze multilingual feedback.",
  "Classify feedback sentiment.",
  "Extract recurring themes.",
  "Generate actionable recommendations.",
];

const BLOB_A = "M60 -42 C84 -22 94 18 78 48 C62 78 22 92 -14 84 C-50 76 -76 50 -82 18 C-88 -14 -76 -48 -52 -68 C-28 -88 8 -94 32 -84 C56 -74 36 -62 60 -42 Z";
const BLOB_B = "M62 -40 C80 -18 92 22 70 52 C48 82 8 88 -22 78 C-52 68 -76 44 -84 12 C-92 -20 -82 -58 -56 -74 C-30 -90 14 -86 38 -76 C62 -66 44 -62 62 -40 Z";

function ObjectivesSlide({ buildStep }: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();

      // Continuous blob morph
      const blobA = ref.current?.querySelector("#blob-path-a") as SVGPathElement | null;
      if (blobA) {
        gsap.to(blobA, {
          attr: { d: BLOB_B },
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".blob-wrap", {
        scale: 0.6,
        opacity: 0,
        rotate: -25,
        duration: 1.0,
        ease: "deck-overshoot",
      });
      tl.from(
        ".blob-label",
        { y: 30, opacity: 0, stagger: 0.06, duration: 0.6 },
        "<0.3"
      );
      tl.from(
        ".obj-item",
        { x: -30, opacity: 0, stagger: 0.12, duration: 0.6 },
        "<0.1"
      );

      // Animate checkmark draws on initial reveal
      const checks = ref.current?.querySelectorAll(".check-path");
      checks?.forEach((p) => {
        const pathEl = p as SVGPathElement;
        const len = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = `${len}`;
        pathEl.style.strokeDashoffset = `${len}`;
      });

      tl.to(
        ".check-path",
        {
          strokeDashoffset: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "deck-out",
        },
        "<0.2"
      );

      if (reduce) tl.progress(1);
    },
    { scope: ref, dependencies: [buildStep] }
  );

  return (
    <SlideShell>
      <div ref={ref} className="grid h-full grid-cols-[0.85fr_1.15fr] items-center gap-12">
        {/* Left: blob with label */}
        <div className="blob-wrap relative grid h-full max-h-[70vh] place-items-center">
          <svg viewBox="-110 -110 220 220" className="size-full max-w-[60vh]">
            <defs>
              <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-blue)" />
                <stop
                  offset="100%"
                  stopColor="color-mix(in oklab, var(--brand-blue) 50%, white)"
                />
              </linearGradient>
              <filter id="blob-glow">
                <feGaussianBlur stdDeviation="6" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="over" />
              </filter>
            </defs>
            <path id="blob-path-a" d={BLOB_A} fill="url(#blob-grad)" filter="url(#blob-glow)" />
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-white">
              <span className="blob-label block font-display text-5xl font-bold leading-none">Research</span>
              <span className="blob-label block font-display text-5xl font-black leading-tight">Objectives.</span>
            </div>
          </div>
        </div>

        {/* Right: checkmark list */}
        <ul className="flex flex-col gap-7">
          {objectives.map((text, i) => (
            <li key={i} className="obj-item flex items-start gap-5 text-2xl/[1.45] font-medium text-foreground/85">
              <svg className="mt-1.5 size-7 flex-none" viewBox="0 0 32 32" fill="none">
                <path
                  className="check-path"
                  d="M6 16.5 L13 23 L26 9"
                  stroke="var(--brand-blue)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideShell>
  );
}

export const slide04Objectives: SlideDef = {
  id: "objectives",
  title: "Research Objectives",
  builds: 0,
  Component: ObjectivesSlide,
};
