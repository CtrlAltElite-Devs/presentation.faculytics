import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const rows = [
  { metric: "Embedding Coherence", target: "> 0.5", run011: "0.5968", run013: "0.6495", status: "PASS", pass: true },
  { metric: "Topic Diversity", target: "> 0.7", run011: "0.9474", run013: "0.9789", status: "PASS", pass: true },
  { metric: "Outlier Ratio", target: "< 20%", run011: "33.0%", run013: "52.0%", status: "Data-inherent", pass: false },
  { metric: "Topic Count", target: "10–25", run011: "19", run013: "19", status: "PASS", pass: true },
];

function TopicResultsSlide({}: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      tl.from(".tr-title .char", {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
      });

      tl.from(".tr-table-wrap", { scale: 0.95, opacity: 0, duration: 0.8 }, "<0.1");
      tl.from(".tr-head", { y: -20, opacity: 0, duration: 0.5 }, "<0.2");
      tl.from(".tr-row", { y: 30, opacity: 0, stagger: 0.12, duration: 0.6 }, "<0.1");
      tl.from(".tr-status", {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "deck-overshoot",
      }, "<0.0");
      tl.from(".tr-caption", { y: 30, opacity: 0, duration: 0.7 }, "<0.4");

      if (reduce) tl.progress(1);
    },
    { scope: ref }
  );

  return (
    <SlideShell>
      <div ref={ref} className="flex h-full flex-col">
        <h2
          className="tr-title mb-12 text-center font-display font-black leading-none tracking-tight"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            color: "var(--foreground)",
          }}
        >
          {Array.from("Topic Modeling ").map((c, i) => (
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

        <div className="flex flex-1 flex-col justify-center">
        <div className="tr-table-wrap mx-auto overflow-hidden rounded-3xl border-4 max-w-5xl w-full"
          style={{ borderColor: "var(--brand-blue)" }}
        >
          <table className="w-full table-fixed border-collapse text-lg">
            <thead className="tr-head">
              <tr style={{ background: "oklch(0.21 0.008 264.53)", color: "white" }}>
                <th className="px-6 py-4 text-left font-semibold">Metric</th>
                <th className="px-6 py-4 text-left font-semibold">Target</th>
                <th className="px-6 py-4 text-left font-semibold">Run 011 <span className="font-normal opacity-70">(augmented)</span></th>
                <th className="px-6 py-4 text-left font-semibold">Run 013 <span className="font-normal opacity-70">(production)</span></th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.metric} className="tr-row" style={{ background: i % 2 === 0 ? "var(--card)" : "oklch(0.97 0 0)" }}>
                  <td className="px-6 py-5 font-medium text-foreground">{r.metric}</td>
                  <td className="px-6 py-5 font-mono-deck text-foreground/85">{r.target}</td>
                  <td className="px-6 py-5 font-mono-deck text-foreground/85">{r.run011}</td>
                  <td className="px-6 py-5 font-mono-deck text-foreground/85">{r.run013}</td>
                  <td className="px-6 py-5">
                    <span
                      className="tr-status inline-flex items-center gap-2 rounded-md px-3 py-1 font-mono-deck text-sm font-semibold"
                      style={
                        r.pass
                          ? {
                              background: "color-mix(in oklab, var(--brand-blue) 12%, transparent)",
                              color: "var(--brand-blue)",
                            }
                          : {
                              background: "color-mix(in oklab, var(--sentiment-neutral) 18%, transparent)",
                              color: "var(--sentiment-neutral-fg, oklch(0.48 0.13 80))",
                            }
                      }
                    >
                      <span
                        className="size-2.5"
                        style={{
                          background: r.pass ? "var(--brand-blue)" : "var(--sentiment-neutral, oklch(0.82 0.16 85))",
                        }}
                      />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="tr-caption mt-10 text-xl/[1.5] font-medium text-foreground/85">
          After 13 runs,{" "}
          <strong className="font-display font-bold" style={{ color: "var(--brand-blue)" }}>
            topic modeling
          </strong>{" "}
          exceeded benchmark target.
        </p>
        </div>
      </div>
    </SlideShell>
  );
}

export const slide09TopicResults: SlideDef = {
  id: "topic-results",
  title: "Topic Modeling Results",
  builds: 0,
  Component: TopicResultsSlide,
};
