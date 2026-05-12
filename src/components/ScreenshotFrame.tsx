import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

interface Props {
  src: string;
  alt: string;
  urlBar?: string;
  className?: string;
  /** Caption shown beneath the frame */
  caption?: string;
  /** When true (default), play the entrance animation */
  animate?: boolean;
}

export function ScreenshotFrame({
  src,
  alt,
  urlBar,
  className = "",
  caption,
  animate = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animate) return;
      if (prefersReducedMotion()) return;
      const el = ref.current;
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
    { scope: ref }
  );

  return (
    <figure
      ref={ref}
      className={`relative mx-auto ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className="relative overflow-hidden rounded-xl border bg-card shadow-2xl"
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
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="block w-full h-auto"
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
