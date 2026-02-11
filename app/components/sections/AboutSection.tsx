"use client";

/**
 * About section — identity-driven narrative in a floating glass panel.
 *
 * Uses the CinematicPanel wrapper for scroll parallax and mouse-tilt,
 * with a static gradient subheadline and volumetric drop-shadows.
 * Right-aligned layout mirrors the About camera waypoint position.
 *
 * The typography is deliberately more restrained than the hero —
 * no sweep animation, subtler glow — creating visual hierarchy
 * while maintaining the same spatial language.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { styles } from "../styles/styles";
import { CinematicPanel } from "../ui/CinematicPanel";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

  const reveal = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.8,
        delay: reduced ? 0 : delay,
        ease,
      },
    },
  });

  return (
    <section
      ref={ref}
      id="about"
      style={{
        ...styles.section,
        ...styles.sectionAlt,
        padding: "0 7vw",
      }}
    >
      {/* ── floating glass panel with parallax + tilt ────────── */}
      <CinematicPanel
        glass
        scanlines
        parallaxStrength={25}
        rotationStrength={1}
        style={{ padding: "2.5rem" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            maxWidth: "500px",
            pointerEvents: "none",
          }}
        >
          {/* ── eyebrow with accent line (right-aligned) ─────── */}
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.75rem",
            }}
            variants={reveal(0.1)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 500,
                color: "rgba(79, 209, 255, 0.9)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "var(--font-geist-mono), monospace",
                textShadow:
                  "0 0 10px rgba(79, 209, 255, 0.4), 0 0 30px rgba(79, 209, 255, 0.15)",
              }}
            >
              About
            </span>
            <div
              style={{
                width: 20,
                height: 1,
                background: "rgba(79, 209, 255, 0.5)",
                boxShadow: "0 0 8px rgba(79, 209, 255, 0.3)",
              }}
            />
          </motion.div>

          {/* ── identity statement — gradient text + volumetric shadow ── */}
          <motion.p
            className="cinematic-subheadline"
            style={{
              fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
              fontWeight: 600,
              textAlign: "right",
              lineHeight: 1.45,
              margin: 0,
              maxWidth: "440px",
              filter: [
                "drop-shadow(0 0 20px rgba(79, 209, 255, 0.1))",
                "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35))",
              ].join(" "),
            }}
            variants={reveal(0.3)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            I design interactive systems that make the web feel alive.
          </motion.p>

          {/* ── separator ────────────────────────────────────── */}
          <motion.div
            style={{
              width: "60%",
              height: 1,
              marginTop: "1.75rem",
              marginLeft: "auto",
              background:
                "linear-gradient(90deg, transparent, rgba(79, 209, 255, 0.12), rgba(79, 209, 255, 0.06))",
              boxShadow: "0 0 8px rgba(79, 209, 255, 0.05)",
            }}
            variants={reveal(0.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />

          {/* ── capability statement ──────────────────────────── */}
          <motion.p
            style={{
              fontSize: "clamp(0.92rem, 1.4vw, 1.02rem)",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.45)",
              textAlign: "right",
              lineHeight: 1.7,
              marginTop: "1.75rem",
              maxWidth: "440px",
              textShadow: "0 0 15px rgba(79, 209, 255, 0.04)",
            }}
            variants={reveal(0.55)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            My focus is frontend engineering, real-time 3D, and immersive
            interfaces. I build at the edge of what browsers can do.
          </motion.p>

          {/* ── personality statement ─────────────────────────── */}
          <motion.p
            style={{
              fontSize: "clamp(0.92rem, 1.4vw, 1.02rem)",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.35)",
              textAlign: "right",
              lineHeight: 1.7,
              marginTop: "1.5rem",
              maxWidth: "440px",
              textShadow: "0 0 15px rgba(79, 209, 255, 0.03)",
            }}
            variants={reveal(0.8)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Beyond the screen — generative art, open-source, creative
            tooling, and experiments that push the medium forward.
          </motion.p>
        </div>
      </CinematicPanel>
    </section>
  );
}
