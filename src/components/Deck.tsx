import { useEffect, useRef, useState } from "react";
import { useDeck } from "../store/useDeck";
import { slides } from "../slides";
import { SlideIndicator } from "./SlideIndicator";
import { Overview } from "./Overview";
import { gsap } from "../lib/gsap";

function parseHash(): { index: number; build: number } {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { index: 0, build: 0 };
  const [idPart, buildPart] = hash.split("/");
  const found = slides.findIndex((s) => s.id === idPart);
  if (found >= 0) return { index: found, build: Number(buildPart) || 0 };
  const num = Number(idPart);
  if (Number.isFinite(num) && num >= 1) {
    return { index: Math.min(num - 1, slides.length - 1), build: 0 };
  }
  return { index: 0, build: 0 };
}

export function Deck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const {
    index,
    buildStep,
    direction,
    blackout,
    shortcuts,
    zoomed,
    setTotal,
    goto,
    next,
    prev,
    first,
    last,
    toggleBlackout,
    toggleShortcuts,
    toggleOverview,
    toggleZoom,
    setZoom,
  } = useDeck();

  const [prevIndex, setPrevIndex] = useState(index);
  const transitioning = prevIndex !== index;

  useEffect(() => {
    setTotal(slides.length);
    const initial = parseHash();
    goto(initial.index, initial.build, "none");

    const onHashChange = () => {
      const { index: i, build: b } = parseHash();
      goto(i, b, "none");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [setTotal, goto]);

  // Keep URL hash synced with state
  useEffect(() => {
    const slide = slides[index];
    if (!slide) return;
    const target = `#/${slide.id}${buildStep > 0 ? `/${buildStep}` : ""}`;
    if (window.location.hash !== target) {
      history.replaceState(null, "", target);
    }
  }, [index, buildStep]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;

      const slide = slides[index];
      const builds = slide?.builds ?? 0;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next(builds);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          first();
          break;
        case "End":
          e.preventDefault();
          last();
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case ".":
          e.preventDefault();
          toggleBlackout();
          break;
        case "o":
        case "O":
          e.preventDefault();
          toggleOverview();
          break;
        case "z":
        case "Z":
          e.preventDefault();
          toggleZoom();
          break;
        case "Escape":
          if (zoomed) {
            e.preventDefault();
            setZoom(false);
          }
          break;
        case "?":
          e.preventDefault();
          toggleShortcuts();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, zoomed, next, prev, first, last, toggleBlackout, toggleShortcuts, toggleOverview, toggleZoom, setZoom]);

  // Adjacent slide image preloader — warm `current ± 1` PNGs only
  useEffect(() => {
    for (const offset of [-1, 1, 2]) {
      const slide = slides[index + offset];
      slide?.preloadAssets?.forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      });
    }
  }, [index]);

  // Cross-fade transition between slides
  useEffect(() => {
    if (prevIndex === index) return;
    const layer = overlayRef.current;
    if (!layer) {
      setPrevIndex(index);
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => setPrevIndex(index),
    });
    tl.fromTo(
      layer,
      { opacity: 0 },
      { opacity: 1, duration: 0.18, ease: "deck-out" }
    );
    tl.to(layer, { opacity: 0, duration: 0.22, ease: "deck-in", delay: 0.04 });
    return () => {
      tl.kill();
    };
  }, [index, prevIndex]);

  const ActiveSlide = slides[index]?.Component;

  return (
    <div ref={rootRef} className="relative h-screen w-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid place-items-center">
        <div className="deck-stage relative bg-background">
          {ActiveSlide ? (
            <ActiveSlide
              key={`${index}-${buildStep}-${direction}`}
              buildStep={buildStep}
              direction={direction}
              isActive={!transitioning}
            />
          ) : null}
        </div>
      </div>

      <SlideIndicator />

      {/* Crossfade overlay for transitions */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-40 bg-background opacity-0"
      />

      {/* Blackout */}
      {blackout && (
        <div
          className="absolute inset-0 z-50 bg-black"
          onClick={toggleBlackout}
        />
      )}

      {/* Overview grid */}
      <Overview />

      {/* Shortcuts overlay */}
      {shortcuts && (
        <div
          className="absolute inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm"
          onClick={toggleShortcuts}
        >
          <div className="panel-surface bg-card text-card-foreground rounded-2xl px-10 py-8 font-mono-deck text-sm max-w-md">
            <h2 className="font-display text-2xl mb-4 font-bold">Keyboard</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="text-muted-foreground">→ Space</dt><dd>Next / build</dd>
              <dt className="text-muted-foreground">← </dt><dd>Previous</dd>
              <dt className="text-muted-foreground">Home / End</dt><dd>First / Last slide</dd>
              <dt className="text-muted-foreground">F</dt><dd>Fullscreen</dd>
              <dt className="text-muted-foreground">.</dt><dd>Blackout</dd>
              <dt className="text-muted-foreground">O</dt><dd>Overview grid</dd>
              <dt className="text-muted-foreground">Z</dt><dd>Zoom UI screenshot</dd>
              <dt className="text-muted-foreground">Esc</dt><dd>Exit zoom</dd>
              <dt className="text-muted-foreground">?</dt><dd>This help</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
