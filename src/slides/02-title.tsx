import { useRef } from "react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import type { SlideDef, SlideProps } from "./types";

const team = [
  { name: "Norhanah Umpar", photo: "/landing/umpar_new.png" },
  { name: "Ethan Patrick Bandebas", photo: "/landing/bandebas_new.png" },
  { name: "Leander Lorenz Lubguban", photo: "/landing/lubguban_new.png" },
  { name: "Harvie Purgatorio", photo: "/landing/purgatorio_new.png" },
];

function TitleSlide({ buildStep }: SlideProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();

      // Background blob parallax (subtle, continuous)
      gsap.to(".bg-blob-a", {
        x: "+=40",
        y: "-=30",
        duration: 14,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".bg-blob-b", {
        x: "-=50",
        y: "+=40",
        duration: 18,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

      // Top chips slide in
      tl.from(".tag-chip", {
        y: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
      });

      // Title per-char rise with blur-out
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars,words" });
        tl.from(
          split.chars,
          {
            y: 80,
            opacity: 0,
            filter: "blur(14px)",
            stagger: 0.03,
            duration: 0.9,
          },
          "<0.1"
        );
      }

      // Subtitle
      tl.from(
        ".title-sub",
        { y: 24, opacity: 0, duration: 0.7 },
        "<0.3"
      );

      // Congress metadata chips
      tl.from(
        ".meta-chip",
        { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 },
        "<0.2"
      );

      // Team avatars orbit in
      tl.from(
        ".team-card",
        {
          y: 60,
          scale: 0.7,
          opacity: 0,
          rotate: -8,
          stagger: 0.12,
          duration: 0.8,
          ease: "deck-overshoot",
        },
        "<0.1"
      );

      // Device mockups parallax in
      tl.from(
        ".mock-laptop",
        { x: 140, y: -40, opacity: 0, duration: 1.2 },
        "<0.0"
      );
      tl.from(
        ".mock-phone",
        { x: 80, y: 80, opacity: 0, scale: 0.85, duration: 1.2 },
        "<0.2"
      );

      if (reduce) tl.progress(1);
    },
    { scope: rootRef, dependencies: [buildStep] }
  );

  return (
    <SlideShell>
      <div ref={rootRef} className="relative h-full w-full">
        {/* Animated background blobs */}
        <div
          className="bg-blob-a pointer-events-none absolute -top-20 -right-32 size-[60vh] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 40%, transparent), transparent 65%)",
          }}
        />
        <div
          className="bg-blob-b pointer-events-none absolute -bottom-32 -left-20 size-[55vh] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-yellow) 50%, transparent), transparent 65%)",
          }}
        />

        <div className="relative grid h-full grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-7">
            <div className="flex gap-3">
              <span className="tag-chip rounded-full px-5 py-2 text-sm font-medium text-white"
                style={{
                  background:
                    "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
                }}
              >
                College of Computer Studies
              </span>
              <span className="tag-chip rounded-full px-5 py-2 text-sm font-medium text-white"
                style={{
                  background:
                    "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
                }}
              >
                University of Cebu — Main
              </span>
            </div>

            <h1
              ref={titleRef}
              className="brand-gradient-text font-display font-black leading-[0.95] tracking-tight whitespace-nowrap"
              style={{
                fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
              }}
            >
              Faculytics 2.0
            </h1>

            <p
              className="title-sub max-w-2xl text-2xl/[1.45] text-foreground/95"
              style={{ fontWeight: 500 }}
            >
              A Data Mining Approach for Feedback Analysis,
              <br />
              Generating Actionable Insights and Recommendations
            </p>

            <div className="flex flex-wrap gap-2.5">
              {[
                "UC-CCS Research Congress 2026",
                "May 13, 2026",
                "14th Flr., Auditorium · UC Jones Bldg.",
              ].map((m) => (
                <span
                  key={m}
                  className="meta-chip rounded-full border-2 px-4 py-1.5 text-sm font-medium"
                  style={{
                    borderColor: "color-mix(in oklab, var(--brand-blue) 35%, transparent)",
                    color: "var(--brand-blue)",
                    background: "color-mix(in oklab, var(--brand-blue) 6%, white)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-5">
              {team.map((t) => (
                <div key={t.name} className="team-card">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-40 select-none"
                    draggable={false}
                    style={{
                      filter:
                        "drop-shadow(0 18px 30px color-mix(in oklab, var(--brand-blue) 28%, transparent))",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column - device mockups */}
          <div className="relative h-full w-full">
            <img
              src="/landing/laptop_faculytics.png"
              alt="Faculytics on laptop"
              className="mock-laptop absolute right-[-6%] top-[-6%] w-[115%] max-w-none drop-shadow-2xl"
              style={{ transform: "rotate(-6deg)" }}
            />
            <img
              src="/landing/phone_faculytics.png"
              alt="Faculytics on phone"
              className="mock-phone absolute right-[-6%] bottom-[-2%] w-[62%] drop-shadow-2xl"
              style={{ transform: "rotate(10deg)" }}
            />
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export const slide02Title: SlideDef = {
  id: "title",
  title: "Faculytics 2.0",
  builds: 0,
  Component: TitleSlide,
};
