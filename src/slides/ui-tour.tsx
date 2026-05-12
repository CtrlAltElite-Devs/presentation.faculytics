import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { SlideShell } from "../components/SlideShell";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { HtmlSnapshot } from "../components/HtmlSnapshot";
import { PdfFrame } from "../components/PdfFrame";
import { useDeck } from "../store/useDeck";
import type { SlideDef, SlideProps } from "./types";

type Role = "Student" | "Faculty" | "Dean" | "Superadmin";

const roleAccent: Record<Role, string> = {
  Student: "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
  Faculty: "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 65%, white))",
  Dean: "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 50%, white))",
  Superadmin: "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 40%, white))",
};

const roleUrl: Record<Role, string> = {
  Student: "app.faculytics/student",
  Faculty: "app.faculytics/faculty",
  Dean: "app.faculytics/dean",
  Superadmin: "app.faculytics/superadmin",
};

interface UiSlideArgs {
  id: string;
  page: number;
  role: Role;
  caption?: string;
  /** Optional URL bar text override */
  urlBar?: string;
  /**
   * Optional path to a self-contained saved HTML page (under public/).
   * When provided, the slide renders an iframe instead of the PNG.
   * The PNG at `page` becomes a fallback in case the iframe is slow/missing.
   */
  htmlPath?: string;
  /** If true, allow scripts inside the iframe (Next.js hydration). Default false. */
  htmlAllowScripts?: boolean;
  /** Scroll the iframe content to this Y pixel after load */
  htmlScrollY?: number;
  /** Scroll the iframe content so this selector is at top after load */
  htmlScrollToSelector?: string;
  /** Scroll the iframe content so the first element with this exact trimmed text is at top */
  htmlScrollToText?: string;
  /** Y offset added after scroll resolution */
  htmlScrollOffset?: number;
  /** Path to a PDF under public/ (e.g., "/slides/pdf/ui-dean-report.pdf"). If set, renders a PdfFrame instead of HTML/PNG. */
  pdfPath?: string;
}

function makeUiSlide({
  id,
  page,
  role,
  caption,
  urlBar,
  htmlPath,
  htmlAllowScripts,
  htmlScrollY,
  htmlScrollToSelector,
  htmlScrollToText,
  htmlScrollOffset,
  pdfPath,
}: UiSlideArgs): SlideDef {
  const Component = ({}: SlideProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const zoomTlRef = useRef<gsap.core.Timeline | null>(null);
    const hasZoomedAtLeastOnceRef = useRef(false);
    const zoomed = useDeck((s) => s.zoomed);
    const toggleZoom = useDeck((s) => s.toggleZoom);

    // Entrance animation — runs once on mount
    useGSAP(
      () => {
        const reduce = prefersReducedMotion();
        const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

        tl.from(".ui-title .char", {
          y: 50,
          opacity: 0,
          rotate: -4,
          stagger: 0.03,
          duration: 0.5,
        });

        tl.from(
          ".role-chip",
          { x: 60, opacity: 0, duration: 0.7, ease: "deck-overshoot" },
          "<0.05"
        );

        if (reduce) tl.progress(1);
      },
      { scope: ref }
    );

    // Zoom animation — responds to `zoomed` state changes.
    // Zoom IN is "energetic": header retreats first, then frame snaps open with a tiny overshoot.
    // Zoom OUT is "settled": frame eases shut with a power3.out settle, then header drifts back.
    //
    // Skip the very first run while zoomed=false (slide mount). Otherwise we'd kill the
    // HtmlSnapshot/ScreenshotFrame entrance tween mid-fade and the iframe stays at opacity:0.
    useGSAP(
      () => {
        if (!zoomed && !hasZoomedAtLeastOnceRef.current) {
          // Initial mount, nothing to animate — let the entrance animations breathe
          return;
        }
        if (zoomed) hasZoomedAtLeastOnceRef.current = true;

        const reduce = prefersReducedMotion();

        // Kill only the previous zoom timeline, not unrelated entrance/idle tweens
        zoomTlRef.current?.kill();

        if (reduce) {
          gsap.set(".ui-header", { y: zoomed ? -80 : 0, autoAlpha: zoomed ? 0 : 1 });
          gsap.set(".ui-frame-wrap", zoomed
            ? { marginLeft: "-6vw", marginRight: "-6vw", marginTop: "-5vh", marginBottom: "-5vh" }
            : { marginLeft: 0, marginRight: 0, marginTop: "1rem", marginBottom: 0 });
          gsap.set(".ui-frame-wrap > figure", { width: zoomed ? "100%" : "88%", maxWidth: zoomed ? "none" : "100%", scale: 1 });
          gsap.set(".zoom-hint", { autoAlpha: zoomed ? 1 : 0 });
          return;
        }

        const tl = gsap.timeline();
        zoomTlRef.current = tl;

        if (zoomed) {
          // ZOOM IN — header retreats, frame snaps open with a small overshoot
          tl.to(".ui-header", {
            y: -80,
            autoAlpha: 0,
            duration: 0.32,
            ease: "power2.in",
          });
          tl.to(
            ".ui-frame-wrap",
            {
              marginLeft: "-6vw",
              marginRight: "-6vw",
              marginTop: "-5vh",
              marginBottom: "-5vh",
              duration: 0.62,
              ease: "power3.out",
            },
            "-=0.18"
          );
          tl.to(
            ".ui-frame-wrap > figure",
            {
              width: "100%",
              maxWidth: "none",
              duration: 0.62,
              ease: "power3.out",
            },
            "<"
          );
          tl.fromTo(
            ".ui-frame-wrap > figure",
            { scale: 1 },
            { scale: 1.012, duration: 0.32, ease: "power2.out" },
            "<0.1"
          );
          tl.to(".ui-frame-wrap > figure", { scale: 1, duration: 0.28, ease: "power2.inOut" });
          tl.to(".zoom-hint", { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, "-=0.2");
        } else {
          // ZOOM OUT — frame "exhales" first (subtle pinch), then settles, then header drifts back in
          tl.to(".zoom-hint", { autoAlpha: 0, duration: 0.18, ease: "power2.in" });
          tl.to(
            ".ui-frame-wrap > figure",
            { scale: 0.985, duration: 0.18, ease: "power2.in" },
            "<"
          );
          tl.to(
            ".ui-frame-wrap",
            {
              marginLeft: 0,
              marginRight: 0,
              marginTop: "1rem",
              marginBottom: 0,
              duration: 0.6,
              ease: "power3.out",
            },
            ">"
          );
          tl.to(
            ".ui-frame-wrap > figure",
            {
              width: "88%",
              maxWidth: "100%",
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            "<"
          );
          tl.to(
            ".ui-header",
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.45,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }
      },
      { scope: ref, dependencies: [zoomed] }
    );

    return (
      <SlideShell>
        <div ref={ref} className="relative flex h-full flex-col">
          <div className="ui-header flex items-start justify-between">
            <h2
              className="ui-title font-display font-black leading-none tracking-tight"
              style={{
                fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
                color: "var(--foreground)",
              }}
            >
              {Array.from("User ").map((c, i) => (
                <span key={`a${i}`} className="char inline-block whitespace-pre">
                  {c}
                </span>
              ))}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 50%, white))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {Array.from("Interface").map((c, i) => (
                  <span key={`b${i}`} className="char inline-block">
                    {c}
                  </span>
                ))}
              </span>
              <span className="char inline-block" style={{ color: "var(--brand-blue)" }}>
                .
              </span>
            </h2>

            <span
              className="role-chip rounded-full px-7 py-3 text-lg font-semibold text-white"
              style={{
                background: roleAccent[role],
                boxShadow:
                  "0 12px 35px -10px color-mix(in oklab, var(--brand-blue) 50%, transparent)",
              }}
            >
              {role} UI
            </span>
          </div>

          <div className="ui-frame-wrap mt-4 flex flex-1 items-center justify-center">
            {pdfPath ? (
              <PdfFrame
                src={pdfPath}
                urlBar={urlBar ?? roleUrl[role]}
                caption={zoomed ? undefined : caption}
                className="h-[78vh] w-auto aspect-[8.5/11]"
              />
            ) : htmlPath ? (
              <HtmlSnapshot
                src={htmlPath}
                fallbackSrc={`/slides/source/page-${String(page).padStart(2, "0")}.png`}
                urlBar={urlBar ?? roleUrl[role]}
                caption={zoomed ? undefined : caption}
                className="w-[88%] max-w-[100%]"
                sandboxScripts={htmlAllowScripts ?? false}
                scrollY={htmlScrollY}
                scrollToSelector={htmlScrollToSelector}
                scrollToText={htmlScrollToText}
                scrollOffset={htmlScrollOffset}
              />
            ) : (
              <ScreenshotFrame
                src={`/slides/source/page-${String(page).padStart(2, "0")}.png`}
                alt={`${role} UI — ${caption ?? "Faculytics screenshot"}`}
                urlBar={urlBar ?? roleUrl[role]}
                className="w-[88%] max-w-[100%]"
                caption={zoomed ? undefined : caption}
              />
            )}
          </div>

          {/* Zoom hint badge — visible only when zoomed */}
          <button
            onClick={toggleZoom}
            className="zoom-hint pointer-events-auto absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-2 font-mono-deck text-xs uppercase tracking-wider text-white opacity-0"
            style={{
              background:
                "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 60%, white))",
              boxShadow:
                "0 12px 35px -10px color-mix(in oklab, var(--brand-blue) 50%, transparent)",
            }}
            aria-label="Exit zoom"
          >
            Esc · exit zoom
          </button>
        </div>
      </SlideShell>
    );
  };

  return {
    id,
    title: `${role} UI — ${caption ?? "Screenshot"}`,
    builds: 0,
    Component,
    preloadAssets: [`/slides/source/page-${String(page).padStart(2, "0")}.png`],
  };
}

// Section divider (role transition)
interface DividerArgs {
  id: string;
  role: Role;
  subtitle: string;
}

function makeDivider({ id, role, subtitle }: DividerArgs): SlideDef {
  const Component = ({}: SlideProps) => {
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(
      () => {
        const reduce = prefersReducedMotion();
        const tl = gsap.timeline({ defaults: { ease: "deck-out" } });

        tl.from(".divider-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "deck-out",
        });
        tl.from(
          ".divider-eyebrow",
          { y: 20, opacity: 0, duration: 0.6 },
          "<0.2"
        );
        tl.from(
          ".divider-title .char",
          { y: 80, opacity: 0, stagger: 0.04, duration: 0.7, ease: "deck-overshoot" },
          "<0.0"
        );
        tl.from(".divider-sub", { y: 30, opacity: 0, duration: 0.7 }, "<0.3");
        tl.from(".divider-dot", {
          scale: 0,
          opacity: 0,
          stagger: 0.06,
          duration: 0.4,
          ease: "deck-overshoot",
        }, "<0.0");
        if (reduce) tl.progress(1);
      },
      { scope: ref }
    );

    return (
      <SlideShell>
        <div ref={ref} className="relative grid h-full w-full place-items-center">
          {/* Background number watermark */}
          <span
            className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[40vh] font-black leading-none tracking-tight"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--brand-blue) 10%, transparent), transparent)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.6,
            }}
            aria-hidden
          >
            {role.charAt(0)}
          </span>

          <div className="relative flex flex-col items-start gap-6">
            <div
              className="divider-rule h-1 w-32 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 30%, transparent))",
              }}
            />
            <p className="divider-eyebrow flex items-center gap-3 font-mono-deck text-sm uppercase tracking-[0.3em] text-muted-foreground">
              <span className="divider-dot size-2 rounded-full" style={{ background: "var(--brand-blue)" }} />
              User Experience
            </p>
            <h2
              className="divider-title font-display font-black leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(5rem, 12vw, 14rem)",
                background:
                  "linear-gradient(120deg, var(--brand-blue), color-mix(in oklab, var(--brand-blue) 35%, white))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {Array.from(role).map((c, i) => (
                <span key={i} className="char inline-block">
                  {c}
                </span>
              ))}
              <span className="char inline-block" style={{ color: "var(--brand-blue)", WebkitTextFillColor: "var(--brand-blue)" }}>.</span>
            </h2>
            <p className="divider-sub max-w-2xl text-2xl/[1.5] font-medium text-foreground/75">
              {subtitle}
            </p>
          </div>
        </div>
      </SlideShell>
    );
  };

  return {
    id,
    title: `${role} Section`,
    builds: 0,
    Component,
  };
}

// Section divider slides
export const slideStudentSection = makeDivider({
  id: "section-student",
  role: "Student",
  subtitle: "Where the data begins — students submit course evaluations through a guided questionnaire flow.",
});

export const slideFacultySection = makeDivider({
  id: "section-faculty",
  role: "Faculty",
  subtitle: "What faculty members see — sentiment, themes, and concrete next steps drawn from student voices.",
});

export const slideDeanSection = makeDivider({
  id: "section-dean",
  role: "Dean",
  subtitle: "Department-wide analytics — rankings, attention flags, and AI-generated action plans across faculty.",
});

export const slideSuperadminSection = makeDivider({
  id: "section-superadmin",
  role: "Superadmin",
  subtitle: "Configuration layer — questionnaire versions, dimensions, and lifecycle management.",
});

// UI tour slides (one per PDF page 11-29)
export const uiTourSlides: SlideDef[] = [
  makeUiSlide({
    id: "ui-student-courses",
    page: 11,
    role: "Student",
    caption: "Courses dashboard",
    urlBar: "app.faculytics.ctr3.org/student/courses",
    htmlPath: "/slides/html/student-courses.html",
  }),
  makeUiSlide({
    id: "ui-student-eval",
    page: 12,
    role: "Student",
    caption: "Faculty evaluation questionnaire",
    urlBar: "app.faculytics.ctr3.org/student/courses/evaluation",
    htmlPath: "/slides/html/student-eval.html",
  }),

  makeUiSlide({
    id: "ui-faculty-overview",
    page: 13,
    role: "Faculty",
    caption: "Analytics overview",
    urlBar: "app.faculytics.ctr3.org/faculty/analytics",
    htmlPath: "/slides/html/faculty-analytics.html",
  }),
  makeUiSlide({
    id: "ui-faculty-themes",
    page: 14,
    role: "Faculty",
    caption: "Themes & suggested actions",
    urlBar: "app.faculytics.ctr3.org/faculty/analytics",
    htmlPath: "/slides/html/faculty-analytics.html",
    htmlScrollToText: "What students are saying",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-faculty-scores",
    page: 15,
    role: "Faculty",
    caption: "Per-section performance & rating distribution",
    urlBar: "app.faculytics.ctr3.org/faculty/analytics",
    htmlPath: "/slides/html/faculty-scores.html",
    htmlScrollToText: "Per-section performance",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-faculty-detail",
    page: 16,
    role: "Faculty",
    caption: "Question-level breakdown",
    urlBar: "app.faculytics.ctr3.org/faculty/analytics",
    htmlPath: "/slides/html/faculty-scores.html",
    htmlScrollToText: "Section 2",
    htmlScrollOffset: -32,
  }),

  makeUiSlide({
    id: "ui-dean-overview",
    page: 17,
    role: "Dean",
    caption: "Department analytics overview",
    urlBar: "app.faculytics.ctr3.org/dean/dashboard",
    htmlPath: "/slides/html/dean-overview.html",
  }),
  makeUiSlide({
    id: "ui-dean-run",
    page: 18,
    role: "Dean",
    caption: "Run record — analysis pipeline status",
    urlBar: "app.faculytics.ctr3.org/dean/dashboard",
    htmlPath: "/slides/html/dean-run.html",
  }),
  makeUiSlide({
    id: "ui-dean-attention",
    page: 19,
    role: "Dean",
    caption: "Faculty requiring attention",
    urlBar: "app.faculytics.ctr3.org/dean/dashboard",
    htmlPath: "/slides/html/dean-overview.html",
    htmlScrollToText: "Faculty Requiring Attention",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-dean-rankings",
    page: 20,
    role: "Dean",
    caption: "Faculty rankings",
    urlBar: "app.faculytics.ctr3.org/dean/dashboard",
    htmlPath: "/slides/html/dean-overview.html",
    htmlScrollToText: "Faculty Rankings",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-dean-faculty",
    page: 21,
    role: "Dean",
    caption: "Faculty list",
    urlBar: "app.faculytics.ctr3.org/dean/faculty",
    htmlPath: "/slides/html/dean-faculty.html",
  }),
  makeUiSlide({
    id: "ui-dean-themes",
    page: 22,
    role: "Dean",
    caption: "Qualitative themes — student voice",
    urlBar: "app.faculytics.ctr3.org/dean/faculty/analysis",
    htmlPath: "/slides/html/dean-analysis.html",
    htmlScrollToText: "What students are saying",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-dean-plans",
    page: 23,
    role: "Dean",
    caption: "Improvement plans — concrete next steps",
    urlBar: "app.faculytics.ctr3.org/dean/faculty/analysis",
    htmlPath: "/slides/html/dean-analysis.html",
    htmlScrollToText: "Concrete next steps",
    htmlScrollOffset: -32,
  }),
  makeUiSlide({
    id: "ui-dean-comments",
    page: 24,
    role: "Dean",
    caption: "Qualitative comments",
    urlBar: "app.faculytics.ctr3.org/dean/faculty/analysis",
    htmlPath: "/slides/html/dean-comments.html",
  }),
  makeUiSlide({
    id: "ui-dean-report",
    page: 25,
    role: "Dean",
    caption: "Faculty evaluation report — generated PDF",
    urlBar: "faculty-report.pdf · S22526",
    pdfPath: "/slides/pdf/ui-dean-report.pdf",
  }),
  makeUiSlide({
    id: "ui-dean-eval-cards",
    page: 26,
    role: "Dean",
    caption: "Evaluation — faculty cards",
    urlBar: "app.faculytics.ctr3.org/dean/evaluation",
    htmlPath: "/slides/html/dean-eval-cards.html",
  }),
  makeUiSlide({
    id: "ui-dean-eval-form",
    page: 27,
    role: "Dean",
    caption: "Faculty evaluation form",
    urlBar: "app.faculytics.ctr3.org/dean/evaluation",
    htmlPath: "/slides/html/dean-eval-form.html",
  }),

  makeUiSlide({
    id: "ui-admin-versions",
    page: 28,
    role: "Superadmin",
    caption: "Questionnaire versions",
    urlBar: "app.faculytics.ctr3.org/superadmin/questionnaires",
    htmlPath: "/slides/html/admin-versions.html",
  }),
  makeUiSlide({
    id: "ui-admin-builder",
    page: 29,
    role: "Superadmin",
    caption: "Questionnaire builder",
    urlBar: "app.faculytics.ctr3.org/superadmin/questionnaires/new",
    htmlPath: "/slides/html/admin-builder.html",
  }),
];
