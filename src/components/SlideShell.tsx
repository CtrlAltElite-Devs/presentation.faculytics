import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  dark?: boolean;
  noPadding?: boolean;
}

export function SlideShell({ children, dark = false, noPadding = false }: Props) {
  return (
    <div
      className={[
        "relative h-full w-full overflow-hidden",
        dark
          ? "bg-[oklch(0.18_0.02_264.53)] text-[oklch(0.95_0_0)]"
          : "deck-bg text-foreground",
        noPadding ? "" : "px-[6vw] py-[5vh]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
