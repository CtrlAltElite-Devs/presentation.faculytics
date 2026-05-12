import { useDeck } from "../store/useDeck";
import { slides } from "../slides";

export function Overview() {
  const overview = useDeck((s) => s.overview);
  const toggleOverview = useDeck((s) => s.toggleOverview);
  const goto = useDeck((s) => s.goto);
  const activeIndex = useDeck((s) => s.index);

  if (!overview) return null;

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-md"
      onClick={toggleOverview}
    >
      <div
        className="relative flex h-[88%] w-[92%] flex-col gap-4 overflow-hidden rounded-2xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-bold">All slides</h2>
          <p className="font-mono-deck text-sm text-muted-foreground">
            Press <kbd className="rounded bg-muted px-1.5 py-0.5">O</kbd> or click outside to close
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3 overflow-y-auto pr-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                goto(i, 0, i > activeIndex ? "forward" : "back");
                toggleOverview();
              }}
              className={[
                "group relative flex aspect-video flex-col justify-end overflow-hidden rounded-xl border-2 p-3 text-left transition",
                i === activeIndex
                  ? "border-brand-blue ring-2 ring-brand-blue/40"
                  : "border-border hover:border-brand-blue/50",
              ].join(" ")}
              style={{
                background:
                  "linear-gradient(135deg, var(--surface), var(--background))",
              }}
            >
              <span className="font-mono-deck text-[10px] uppercase tracking-wider text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="line-clamp-2 font-display text-sm font-bold leading-tight">
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
