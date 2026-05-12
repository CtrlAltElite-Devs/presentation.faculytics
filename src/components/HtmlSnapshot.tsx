import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

interface Props {
  /** Path to the saved HTML file under public/ (e.g., "/slides/html/student-courses.html") */
  src: string;
  /** Optional fallback image to show if the iframe is slow or fails (a still-frame PNG) */
  fallbackSrc?: string;
  /** Native viewport width the saved page was captured at (default 1920) */
  nativeWidth?: number;
  /** Native viewport height the saved page was captured at (default 1080) */
  nativeHeight?: number;
  urlBar?: string;
  caption?: string;
  className?: string;
  animate?: boolean;
  /**
   * If true, the iframe is sandboxed without `allow-scripts` — Next.js SSR'd markup
   * still renders perfectly but no JS runs inside. Safest. Default: true.
   */
  sandboxScripts?: boolean;
  /** After load, scroll the iframe content to this Y pixel (in iframe coordinates) */
  scrollY?: number;
  /** After load, scroll the iframe content so that this selector is at the top */
  scrollToSelector?: string;
  /** After load, find the first element whose trimmed text content equals this string, then scroll to it */
  scrollToText?: string;
  /** Y offset (px) applied after scroll — negative pulls the target down from the top edge */
  scrollOffset?: number;
}

export function HtmlSnapshot({
  src,
  fallbackSrc,
  nativeWidth = 1920,
  nativeHeight = 1080,
  urlBar,
  caption,
  className = "",
  animate = true,
  sandboxScripts = false,
  scrollY,
  scrollToSelector,
  scrollToText,
  scrollOffset = 0,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [loaded, setLoaded] = useState(false);

  // ResizeObserver — scale the 1920×1080 iframe down to fit the stage width
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w / nativeWidth);
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [nativeWidth]);

  // Entrance animation
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

  // Sandbox tokens — keep same-origin for fonts/CSS, optionally allow scripts.
  const sandbox = sandboxScripts
    ? "allow-same-origin allow-scripts"
    : "allow-same-origin";

  return (
    <figure
      ref={rootRef}
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

        {/* Scaled iframe stage */}
        <div
          ref={stageRef}
          className="relative w-full overflow-hidden bg-background"
          style={{ aspectRatio: `${nativeWidth} / ${nativeHeight}` }}
        >
          {/* Fallback PNG underneath (visible until iframe loads) */}
          {fallbackSrc && !loaded && (
            <img
              src={fallbackSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
          )}
          <iframe
            ref={iframeRef}
            src={src}
            sandbox={sandbox}
            title="Faculytics product preview"
            loading="lazy"
            onLoad={() => {
              setLoaded(true);
              const iframe = iframeRef.current;
              const doc = iframe?.contentDocument;
              const win = iframe?.contentWindow;
              if (!doc || !win) return;

              const findByText = (text: string): Element | null => {
                const target = text.trim();
                const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
                  acceptNode: (node) =>
                    (node.textContent ?? "").trim() === target
                      ? NodeFilter.FILTER_ACCEPT
                      : NodeFilter.FILTER_REJECT,
                });
                const node = walker.nextNode();
                return node?.parentElement ?? null;
              };

              try {
                let target: Element | null = null;
                if (scrollToSelector) target = doc.querySelector(scrollToSelector);
                if (!target && scrollToText) target = findByText(scrollToText);

                if (target) {
                  const rect = target.getBoundingClientRect();
                  const y = rect.top + win.scrollY + scrollOffset;
                  win.scrollTo(0, y);
                  return;
                }
                if (typeof scrollY === "number") {
                  win.scrollTo(0, scrollY);
                }
              } catch {
                // Cross-origin or sandbox-restricted; ignore silently
              }
            }}
            className="absolute left-0 top-0 z-10 border-0"
            style={{
              width: `${nativeWidth}px`,
              height: `${nativeHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              opacity: loaded ? 1 : 0,
              transition: "opacity 250ms ease-out",
            }}
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-muted-foreground font-mono-deck tracking-wide uppercase">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
