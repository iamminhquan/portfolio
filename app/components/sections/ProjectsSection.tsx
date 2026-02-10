"use client";

/**
 * Scroll-driven cinematic project showcase.
 * Each project is a full-screen spotlight moment with scroll-linked
 * fade / slide transitions. Uses a sticky container pattern with
 * Framer Motion's useScroll for performant, frame-synced animations.
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

/* ── types ───────────────────────────────────────────── */

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;
  liveUrl: string;
  githubUrl: string;
}

/* ── project data ────────────────────────────────────── */

const projects: Project[] = [
  {
    title: "3D Portfolio",
    subtitle: "Immersive Web Experience",
    description:
      "An immersive portfolio website featuring scroll-driven 3D animations, interactive scenes, and smooth camera transitions powered by WebGL.",
    tags: ["React", "Three.js", "Next.js", "R3F", "Framer Motion"],
    accent: "#6b8cff",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "E-Commerce Platform",
    subtitle: "Full-Stack Shopping Experience",
    description:
      "Full-stack shopping experience with real-time inventory management, payment processing, and responsive design.",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
    accent: "#ff6b8c",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Data Dashboard",
    subtitle: "Real-Time Analytics",
    description:
      "Interactive analytics dashboard with real-time data visualization, custom charts, and collaborative features.",
    tags: ["React", "D3.js", "TypeScript", "REST API"],
    accent: "#8cff6b",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Chat Application",
    subtitle: "Real-Time Messaging",
    description:
      "Real-time messaging platform with WebSocket connections, end-to-end encryption, and rich media sharing.",
    tags: ["React", "Socket.io", "Node.js", "MongoDB"],
    accent: "#ffcf6b",
    liveUrl: "#",
    githubUrl: "#",
  },
];

/* ── responsive hook ─────────────────────────────────── */

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* ── scroll easing helpers ───────────────────────────── */

/** Hermite smooth-step — zero-derivative at both endpoints. */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Eased fade envelope for a scroll-driven layer.
 * `local` is the unclamped 0–1 progress within a project segment.
 * `enter` / `exit` define [start, end] for each transition zone.
 * Returns 0–1 visibility with smooth-step easing on both edges.
 */
function scrollFade(
  local: number,
  enter: [number, number],
  exit: [number, number],
  isFirst: boolean,
  isLast: boolean,
): number {
  if (local <= 0) return isFirst ? 1 : 0;
  if (local >= 1) return isLast ? 1 : 0;
  if (!isFirst && local < enter[1]) {
    if (local <= enter[0]) return 0;
    return smoothstep((local - enter[0]) / (enter[1] - enter[0]));
  }
  if (!isLast && local > exit[0]) {
    if (local >= exit[1]) return 0;
    return 1 - smoothstep((local - exit[0]) / (exit[1] - exit[0]));
  }
  return 1;
}

/* ── progress dots (right rail) ──────────────────────── */

function ProgressDots({
  total,
  progress,
}: {
  total: number;
  progress: MotionValue<number>;
}) {
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (v) =>
    setActive(Math.max(0, Math.min(Math.floor(v * total), total - 1))),
  );

  return (
    <div
      style={{
        position: "absolute",
        right: "clamp(1.5rem, 3vw, 3rem)",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        zIndex: 20,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: i === active ? 28 : 12,
            borderRadius: 2,
            backgroundColor:
              i === active ? projects[i].accent : "rgba(255,255,255,0.15)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: i === active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ── project counter (01 / 04) ───────────────────────── */

function Counter({
  total,
  progress,
}: {
  total: number;
  progress: MotionValue<number>;
}) {
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (v) =>
    setActive(Math.max(0, Math.min(Math.floor(v * total), total - 1))),
  );

  return (
    <span
      style={{
        fontFamily: "var(--font-mono), monospace",
        display: "flex",
        alignItems: "baseline",
        gap: "0.2rem",
      }}
    >
      <span
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: projects[active]?.accent ?? "#6b8cff",
          transition: "color 0.4s ease",
        }}
      >
        {String(active + 1).padStart(2, "0")}
      </span>
      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
        {" / "}
        {String(total).padStart(2, "0")}
      </span>
    </span>
  );
}

/* ── browser-chrome preview mockup ───────────────────── */

function Preview({ project }: { project: Project }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: 18,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        position: "relative",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* accent glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 60% 40%, ${project.accent}12 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* chrome bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: `${project.accent}50`,
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            height: 22,
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <span
            style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.18)" }}
          >
            {project.title.toLowerCase().replace(/\s+/g, "-")}.dev
          </span>
        </div>
      </div>

      {/* skeleton content */}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          height: "calc(100% - 42px)",
        }}
      >
        {/* nav skeleton */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div
            style={{
              width: 48,
              height: 6,
              borderRadius: 3,
              background: `${project.accent}25`,
            }}
          />
          <div style={{ flex: 1 }} />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                width: 24,
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>

        {/* hero area */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${project.accent}06, ${project.accent}15)`,
            border: `1px solid ${project.accent}0a`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "35%",
              height: 8,
              borderRadius: 4,
              background: `${project.accent}22`,
            }}
          />
          <div
            style={{
              width: "50%",
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
            }}
          />
        </div>

        {/* card row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.5rem",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 40,
                borderRadius: 8,
                background:
                  i === 0 ? `${project.accent}10` : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  i === 0 ? `${project.accent}10` : "rgba(255,255,255,0.04)"
                }`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── single project panel (layered scroll animation) ─── */

function ProjectPanel({
  project,
  index,
  total,
  scrollProgress,
  isMobile,
}: {
  project: Project;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  isMobile: boolean;
}) {
  const [isActive, setIsActive] = useState(index === 0);

  useMotionValueEvent(scrollProgress, "change", (v) =>
    setIsActive(
      Math.max(0, Math.min(Math.floor(v * total), total - 1)) === index,
    ),
  );

  /* ── segment math ────────────────────────────────── */
  const seg = 1 / total;
  const start = index * seg;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const lp = (v: number) => (v - start) / seg; // local progress 0–1
  const dir = (index % 2 === 1) ? -1 : 1; // flip X for alternating layouts

  /* ── LAYER 1 — content (glass panel + title block) ── */
  //  30 % crossfade on each edge, eased with smoothstep.
  //  Adjacent panels overlap during the transition zone.
  const contentVis = (v: number) =>
    scrollFade(lp(v), [0, 0.28], [0.72, 1], isFirst, isLast);

  const panelOpacity = useTransform(scrollProgress, contentVis);

  const panelX = useTransform(scrollProgress, (v) => {
    const l = lp(v);
    const t = contentVis(v);
    return dir * (l <= 0.5 ? 1 : -1) * 22 * (1 - t);
  });

  const panelScale = useTransform(scrollProgress, (v) =>
    0.97 + 0.03 * contentVis(v),
  );

  const panelY = useTransform(scrollProgress, (v) => {
    const l = Math.max(0, Math.min(1, lp(v)));
    return 12 * (1 - 2 * l); // +12 → –12 continuous parallax
  });

  /* ── LAYER 2 — preview (wider crossfade, opposite slide) ── */
  //  Enters 4 % earlier, exits 4 % later — creates depth overlap
  //  where the preview is briefly visible alone during transitions.
  const previewVis = (v: number) =>
    scrollFade(lp(v), [-0.04, 0.32], [0.68, 1.04], isFirst, isLast);

  const prevOpacity = useTransform(scrollProgress, previewVis);

  const prevX = useTransform(scrollProgress, (v) => {
    const l = lp(v);
    const t = previewVis(v);
    return -dir * (l <= 0.5 ? 1 : -1) * 28 * (1 - t);
  });

  const prevScale = useTransform(scrollProgress, (v) =>
    0.94 + 0.06 * previewVis(v),
  );

  const prevY = useTransform(scrollProgress, (v) => {
    const l = Math.max(0, Math.min(1, lp(v)));
    return 18 * (1 - 2 * l); // +18 → –18 (more parallax = closer depth)
  });

  /* ── LAYER 3 — micro (tags + CTAs — staggered reveal) ── */
  //  Delayed entrance (+8 %), earlier exit (–8 %).
  //  Multiplied with panelOpacity so it never exceeds the panel.
  const microVis = (v: number) =>
    scrollFade(lp(v), [0.08, 0.38], [0.62, 0.92], isFirst, isLast);

  const microOpacity = useTransform(scrollProgress, microVis);

  const microY = useTransform(scrollProgress, (v) => {
    const l = lp(v);
    const t = microVis(v);
    return (l <= 0.5 ? 12 : -8) * (1 - t); // enter from below, exit above
  });

  const isReversed = index % 2 === 1;

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: panelOpacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile
            ? "column"
            : isReversed
              ? "row-reverse"
              : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "1.75rem" : "clamp(1.5rem, 3.5vw, 3rem)",
          width: "100%",
          maxWidth: 1320,
          padding: "0 clamp(2rem, 5vw, 5rem)",
          paddingRight: isMobile
            ? "clamp(2rem, 5vw, 5rem)"
            : "clamp(4rem, 7vw, 7rem)",
        }}
      >
        {/* ── glass panel — content layer ─────────── */}
        <motion.div
          style={{
            flex: isMobile ? "none" : "0 1 44%",
            x: isMobile ? 0 : panelX,
            y: panelY,
            scale: panelScale,
            display: "flex",
            flexDirection: "column",
            background: "rgba(10, 12, 22, 0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: 20,
            padding: "clamp(1.75rem, 3vw, 2.5rem)",
          }}
        >
          {/* project number */}
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: project.accent,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-mono), monospace",
              marginBottom: "1rem",
            }}
          >
            Project {String(index + 1).padStart(2, "0")}
          </span>

          {/* title — oversized for hierarchy */}
          <h3
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {project.title}
          </h3>

          {/* accent rule — separator */}
          <div
            style={{
              width: 56,
              height: 2,
              background: `linear-gradient(90deg, ${project.accent}, ${project.accent}40, transparent)`,
              borderRadius: 1,
              margin: "1.25rem 0 0.75rem",
            }}
          />

          {/* subtitle — strong separation */}
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              marginBottom: "1.25rem",
            }}
          >
            {project.subtitle}
          </p>

          {/* description — comfortable reading width */}
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.25vw, 1.08rem)",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              maxWidth: 480,
              marginBottom: "1.75rem",
            }}
          >
            {project.description}
          </p>

          {/* ── micro layer — staggered reveal ───── */}
          <motion.div
            style={{
              opacity: microOpacity,
              y: microY,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* tech chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
                marginBottom: "2rem",
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.28rem 0.7rem",
                    borderRadius: 100,
                    background: `${project.accent}10`,
                    color: project.accent,
                    border: `1px solid ${project.accent}1a`,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: project.accent,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                View Project
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </motion.a>

              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.04,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.65)",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                GitHub
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── preview — separate depth layer ──────── */}
        <motion.div
          style={{
            flex: isMobile ? "none" : "0 1 54%",
            width: isMobile ? "100%" : "auto",
            opacity: prevOpacity,
            x: isMobile ? 0 : prevX,
            y: prevY,
            scale: prevScale,
          }}
        >
          <Preview project={project} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── main section ────────────────────────────────────── */

export function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Overdamped spring adds cinematic inertia to panel transitions
     while indicators stay snappy on the raw scroll value. */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.0001,
  });

  return (
    <section
      ref={containerRef}
      id="projects"
      style={{
        position: "relative",
        width: "100%",
        height: `${projects.length * 100}vh`,
      }}
    >
      {/* ── sticky viewport ─────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* header bar */}
        <div
          style={{
            position: "absolute",
            top: "clamp(1.5rem, 4vh, 2.5rem)",
            left: "clamp(2rem, 6vw, 6rem)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
            }}
          >
            Featured Work
          </span>
          <div
            style={{
              width: 28,
              height: 1,
              background: "rgba(255,255,255,0.12)",
            }}
          />
          <Counter total={projects.length} progress={scrollYProgress} />
        </div>

        {/* progress dots — desktop only */}
        {!isMobile && (
          <ProgressDots
            total={projects.length}
            progress={scrollYProgress}
          />
        )}

        {/* project panels */}
        {projects.map((p, i) => (
          <ProjectPanel
            key={p.title}
            project={p}
            index={i}
            total={projects.length}
            scrollProgress={smoothProgress}
            isMobile={isMobile}
          />
        ))}

        {/* edge fade — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 100,
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.7), transparent)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
        {/* edge fade — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background:
              "linear-gradient(to top, rgba(10,10,15,0.7), transparent)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      </div>
    </section>
  );
}
