import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const classRows = [
  { c: "Positive", precision: "0.9883", recall: "0.9585", f1: "0.9732", support: "265" },
  { c: "Negative", precision: "0.9772", recall: "0.9698", f1: "0.9735", support: "265" },
  { c: "Neutral", precision: "0.9420", recall: "0.9774", f1: "0.9594", support: "266" },
  { c: "Macro Avg.", precision: "0.9692", recall: "0.9686", f1: "0.9687", support: "796" },
];

const langRows = [
  { lang: "Taglish", n: "159", acc: "0.9874", f1: "0.9871" },
  { lang: "Ceb-Eng Mix", n: "168", acc: "0.9762", f1: "0.9756" },
  { lang: "Tagalog", n: "110", acc: "0.9727", f1: "0.9735" },
  { lang: "Cebuano", n: "169", acc: "0.9586", f1: "0.9587" },
  { lang: "English", n: "190", acc: "0.9526", f1: "0.9536" },
];

function SentimentResultsSlide({ buildStep }: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".sr-title .char", { y: 50, opacity: 0, stagger: 0.03, duration: 0.6 });

      // Build 0 → hero number
      const heroEl = ref.current?.querySelector(".sr-hero-num") as HTMLElement | null;
      if (heroEl) {
        tl.from(
          heroEl,
          { scale: 0.4, opacity: 0, filter: "blur(20px)", duration: 1.0, ease: "deck-overshoot" },
          "<0.2"
        );
        // Counter
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: 96.86,
            duration: 1.6,
            ease: "deck-out",
            onUpdate: () => {
              heroEl.textContent = `${obj.v.toFixed(2)}%`;
            },
          },
          "<0.2"
        );
      }

      tl.from(".sr-hero-glow", { scale: 0.4, opacity: 0, duration: 1.4, ease: "deck-out" }, "<0.5");
      tl.from(".sr-hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "<0.5");

      // Pulse the glow continuously
      if (!reduce) {
        gsap.to(".sr-hero-glow", {
          scale: 1.15,
          opacity: 0.75,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (reduce) tl.progress(1);
    },
    { scope: ref, dependencies: [buildStep] }
  );

  // Reveal tables on build step 1
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (buildStep < 1) {
        gsap.set(".sr-tables", { autoAlpha: 0, y: 40 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });
      tl.to(".sr-tables", { autoAlpha: 1, y: 0, duration: 0.7 });
      tl.from(
        ".sr-table-card",
        { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 },
        "<0.05"
      );
      tl.from(
        ".sr-table-row",
        { x: -20, opacity: 0, stagger: 0.05, duration: 0.35 },
        "<0.05"
      );
      tl.from(".sr-footer", { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 }, "<0.2");
      if (reduce) tl.progress(1);
    },
    { scope: ref, dependencies: [buildStep] }
  );

  const showTables = buildStep >= 1;

  return (
    <SlideShell>
      <div ref={ref} className="flex h-full flex-col">
        <h2
          className="sr-title text-center font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            color: "var(--foreground)",
          }}
        >
          {Array.from("Sentiment Analysis Model ").map((c, i) => (
            <span key={`a${i}`} className="char inline-block whitespace-pre">
              {c}
            </span>
          ))}
          <span className="brand-gradient-text">
            {Array.from("Results").map((c, i) => (
              <span key={`b${i}`} className="char inline-block">
                {c}
              </span>
            ))}
          </span>
          <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>.</span>
        </h2>

        {!showTables ? (
          <div className="relative flex flex-1 flex-col items-center justify-center">
            <div
              className="sr-hero-glow pointer-events-none absolute size-[80vh] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--brand-yellow) 60%, transparent), transparent 65%)",
                opacity: 0.6,
              }}
            />
            <div
              className="sr-hero-num brand-gradient-text-50-vert relative font-display font-black leading-none tracking-tight text-shadow-glow"
              style={{
                fontSize: "clamp(10rem, 22vw, 24rem)",
              }}
            >
              96.86%
            </div>
            <p className="sr-hero-sub relative mt-4 max-w-3xl text-center text-2xl/[1.5] font-medium text-foreground/95">
              Model achieved <strong style={{ color: "var(--brand-blue)" }}>96.86% accuracy</strong>{" "}
              across all sentiments — every language type exceeded{" "}
              <strong style={{ color: "var(--brand-blue)" }}>0.95 macro F1.</strong>
            </p>
          </div>
        ) : (
          <div className="sr-tables flex flex-1 flex-col items-center justify-center gap-4 pt-6">
            {/* Per-class table */}
            <div
              className="sr-table-card w-full max-w-4xl overflow-hidden rounded-3xl border-4"
              style={{ borderColor: "var(--brand-blue)" }}
            >
              <table className="w-full table-fixed text-base">
                <thead>
                  <tr style={{ background: "oklch(0.21 0.008 264.53)", color: "white" }}>
                    <th className="px-4 py-3 text-left">Class</th>
                    <th className="px-4 py-3 text-left">Precision</th>
                    <th className="px-4 py-3 text-left">Recall</th>
                    <th className="px-4 py-3 text-left">F1-Score</th>
                    <th className="px-4 py-3 text-left">Support</th>
                  </tr>
                </thead>
                <tbody>
                  {classRows.map((r, i) => (
                    <tr key={r.c} className="sr-table-row" style={{ background: i % 2 === 0 ? "var(--card)" : "oklch(0.97 0 0)" }}>
                      <td className="px-4 py-3 font-medium">{r.c}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.precision}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.recall}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.f1}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="sr-footer text-center text-lg/[1.45] font-medium text-foreground/95">
              Model achieved{" "}
              <strong className="font-display" style={{ color: "var(--brand-blue)" }}>96.86% accuracy</strong>{" "}
              across all sentiments.
            </p>

            {/* Per-language table */}
            <div
              className="sr-table-card w-full max-w-4xl overflow-hidden rounded-3xl border-4"
              style={{ borderColor: "var(--brand-blue)" }}
            >
              <table className="w-full table-fixed text-base">
                <thead>
                  <tr style={{ background: "oklch(0.21 0.008 264.53)", color: "white" }}>
                    <th className="px-4 py-3 text-left">Language</th>
                    <th className="px-4 py-3 text-left">N</th>
                    <th className="px-4 py-3 text-left">Accuracy</th>
                    <th className="px-4 py-3 text-left">Macro F1</th>
                  </tr>
                </thead>
                <tbody>
                  {langRows.map((r, i) => (
                    <tr key={r.lang} className="sr-table-row" style={{ background: i % 2 === 0 ? "var(--card)" : "oklch(0.97 0 0)" }}>
                      <td className="px-4 py-3 font-medium">{r.lang}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.n}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.acc}</td>
                      <td className="px-4 py-3 font-mono-deck">{r.f1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="sr-footer text-center text-lg/[1.45] font-medium text-foreground/95">
              All language types exceeded{" "}
              <strong className="font-display" style={{ color: "var(--brand-blue)" }}>0.95 macro F1.</strong>
            </p>
          </div>
        )}
      </div>
    </SlideShell>
  );
}

export const slide10SentimentResults: SlideDef = {
  id: "sentiment-results",
  title: "Sentiment Results",
  builds: 1,
  Component: SentimentResultsSlide,
};
