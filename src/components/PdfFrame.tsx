import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

interface Props {
  /** Path to the PDF under public/ (e.g., "/slides/pdf/ui-dean-report.pdf") */
  src: string;
  urlBar?: string;
  caption?: string;
  className?: string;
  animate?: boolean;
  /**
   * PDF viewer hash params. Defaults hide the toolbar/nav for a cleaner look and
   * fit the page horizontally so multiple pages stack vertically.
   *
   * Chrome/Edge respect: toolbar=0, navpanes=0, view=FitH|FitV|FitB|Fit, page=N, zoom=N
   * Firefox respects most of these too.
   */
  viewerHash?: string;
}

export function PdfFrame({
  src,
  urlBar,
  caption,
  className = "",
  animate = true,
  viewerHash = "#view=FitH&toolbar=0&navpanes=0",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animate) return;
      if (prefersReducedMotion()) return;
      const el = rootRef.current;
      if (!el) return;
      gsap.fromTo(
        el,
        { scale: 0.92, y: 40, opacity: 0, filter: "blur(8px)" },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "deck-out",
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <figure
      ref={rootRef}
      className={`relative mx-auto flex flex-col ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className="relative flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-2xl"
        style={{
          borderColor: "color-mix(in oklab, var(--border) 70%, transparent)",
          boxShadow:
            "0 30px 80px -20px color-mix(in oklab, var(--brand-blue) 25%, transparent), 0 12px 30px -8px rgb(0 0 0 / 0.18)",
        }}
      >
        {urlBar && (
          <div
            className="flex items-center gap-2 border-b px-3 py-2 text-[10px] font-mono-deck"
            style={{
              borderColor:
                "color-mix(in oklab, var(--border) 70%, transparent)",
              backgroundColor:
                "color-mix(in oklab, var(--surface-alt) 60%, transparent)",
              color: "var(--muted-foreground)",
            }}
          >
            <span className="flex gap-1.5">
              <span className="size-2 rounded-full bg-red-400/70" />
              <span className="size-2 rounded-full bg-amber-400/70" />
              <span className="size-2 rounded-full bg-emerald-400/70" />
            </span>
            <span className="ml-2 truncate">{urlBar}</span>
          </div>
        )}
        <iframe
          src={`${src}${viewerHash}`}
          title="Faculty Evaluation Report (PDF)"
          loading="lazy"
          className="flex-1 border-0 bg-white"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-muted-foreground font-mono-deck tracking-wide uppercase">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
