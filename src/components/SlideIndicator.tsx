import { useDeck } from "../store/useDeck";

export function SlideIndicator() {
  const index = useDeck((s) => s.index);
  const total = useDeck((s) => s.total);
  const buildStep = useDeck((s) => s.buildStep);

  return (
    <div className="fixed bottom-4 right-6 z-50 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] tracking-wider uppercase panel-surface font-mono-deck text-muted-foreground select-none">
      <span className="text-foreground/80 font-medium">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="opacity-50">/</span>
      <span>{String(total).padStart(2, "0")}</span>
      {buildStep > 0 && (
        <span className="ml-1 text-brand-blue">·{buildStep}</span>
      )}
    </div>
  );
}
