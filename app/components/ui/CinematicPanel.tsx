"use client";

/**
 * CinematicPanel — floating glass panel with pseudo-3D depth.
 *
 * Creates spatial presence for HTML content by combining:
 *   - Scroll-linked vertical parallax
 *   - Mouse-responsive micro-tilt (perspective rotation)
 *   - Glass morphism background with rim lighting
 *   - Holographic scanline overlay
 *   - Ambient glow breathing (simulates scene light influence)
 *
 * All transforms run via Framer Motion spring physics for smooth,
 * cinematic easing. Respects prefers-reduced-motion.
 */

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/* ── Props ──────────────────────────────────────────────────────── */

interface CinematicPanelProps {
  children: ReactNode;
  /** Pixels of scroll-linked vertical parallax (default 30) */
  parallaxStrength?: number;
  /** Degrees of micro-rotation (default 1.5) */
  rotationStrength?: number;
  /** Show glass morphism background */
  glass?: boolean;
  /** Show holographic scanline overlay */
  scanlines?: boolean;
  /** Additional className on the perspective wrapper */
  className?: string;
  /** Inline style overrides on the motion container */
  style?: CSSProperties;
}

/* ── Component ──────────────────────────────────────────────────── */

export function CinematicPanel({
  children,
  parallaxStrength = 30,
  rotationStrength = 1.5,
  glass = false,
  scanlines = true,
  className = "",
  style = {},
}: CinematicPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* ── Scroll-linked parallax ───────────────────────────────── */

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const pStr = reduced ? 0 : parallaxStrength;
  const rStr = reduced ? 0 : rotationStrength;

  const y = useTransform(smoothScroll, [0, 1], [pStr, -pStr]);
  const scrollRotX = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [rStr, 0, -rStr],
  );

  /* ── Mouse-linked micro-tilt ──────────────────────────────── */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const mouseTiltX = useTransform(
    smoothMY,
    [-1, 1],
    [rStr * 0.4, -rStr * 0.4],
  );
  const mouseTiltY = useTransform(
    smoothMX,
    [-1, 1],
    [-rStr * 0.3, rStr * 0.3],
  );

  useEffect(() => {
    if (reduced) return;
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY, reduced]);

  /* ── Combine scroll + mouse rotation ──────────────────────── */

  const rotateX = useTransform(
    [scrollRotX, mouseTiltX],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (latest: any) => Number(latest[0]) + Number(latest[1]),
  );

  /* ── Render ───────────────────────────────────────────────── */

  return (
    <div
      style={{ perspective: reduced ? undefined : 1200 }}
      className={className}
    >
      <motion.div
        ref={ref}
        style={{
          y,
          rotateX,
          rotateY: mouseTiltY,
          willChange: "transform",
          position: "relative",
          borderRadius: glass ? 16 : undefined,
          ...style,
        }}
      >
        {/* ── Glass panel background ──────────────────────────── */}
        {glass && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background:
                "linear-gradient(135deg, rgba(79, 209, 255, 0.03), rgba(107, 140, 255, 0.015), rgba(0, 0, 0, 0.2))",
              border: "1px solid rgba(79, 209, 255, 0.07)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: [
                "0 0 50px rgba(79, 209, 255, 0.03)",
                "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
                "inset 0 0 30px rgba(79, 209, 255, 0.015)",
                "0 8px 40px rgba(0, 0, 0, 0.3)",
              ].join(", "),
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {/* Top rim light */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(79, 209, 255, 0.2), transparent)",
              }}
            />
            {/* Bottom rim light */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "15%",
                right: "15%",
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(107, 140, 255, 0.1), transparent)",
              }}
            />
          </div>
        )}

        {/* ── Holographic scanline overlay ─────────────────────── */}
        {scanlines && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(79, 209, 255, 0.015) 2px,
                  rgba(79, 209, 255, 0.015) 4px
                )`,
                animation: "scanlineDrift 10s linear infinite",
              }}
            />
          </div>
        )}

        {/* ── Ambient scene glow ──────────────────────────────── */}
        {glass && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              width: "80%",
              height: "40%",
              transform: "translateX(-50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(79, 209, 255, 0.03), transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              zIndex: -1,
              animation: "glowBreath 4s ease-in-out infinite",
            }}
          />
        )}

        {/* ── Content ─────────────────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
