import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, Flip, MotionPathPlugin, SplitText, Observer, CustomEase);

CustomEase.create("deck-out", "M0,0 C0.22,1 0.36,1 1,1");
CustomEase.create("deck-in", "M0,0 C0.65,0 0.35,1 1,1");
CustomEase.create("deck-overshoot", "M0,0 C0.34,1.56 0.64,1 1,1");

export { gsap, useGSAP, Flip, MotionPathPlugin, SplitText, Observer, CustomEase };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
