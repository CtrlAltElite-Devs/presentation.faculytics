import type { ComponentType } from "react";

export interface SlideProps {
  buildStep: number;
  direction: "forward" | "back" | "none";
  isActive: boolean;
}

export interface SlideDef {
  /** URL-safe id used for hash routing */
  id: string;
  /** Human-readable title (shown in overview) */
  title: string;
  /** Number of incremental build steps within this slide (0 = no builds, advance immediately) */
  builds: number;
  /** The slide component */
  Component: ComponentType<SlideProps>;
  /** Optional: dark background variant */
  dark?: boolean;
  /** Optional: image URLs to preload when this slide is adjacent to the active one */
  preloadAssets?: string[];
}
