"use client";

/**
 * Hero landing section — cinematic spatial typography with pseudo-3D
 * depth, holographic glass panel, and scroll-linked motion.
 *
 * The text is designed to feel embedded in the 3D scene rather than
 * flat overlay UI. Uses layered drop-shadows for volumetric depth,
 * gradient text with animated light sweep, and the CinematicPanel
 * wrapper for scroll parallax + mouse-responsive micro-tilt.
 *
 * Respects reduced-motion preferences throughout.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CinematicPanel } from "../ui/CinematicPanel";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── shared reveal variant — fade + gentle upward slide ─────── */
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
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 7vw",
      }}
    >
      {/* ── floating glass panel with parallax + tilt ────────── */}
      <CinematicPanel
        glass
        scanlines
        parallaxStrength={35}
        rotationStrength={1.2}
        style={{ padding: "2.5rem 2.5rem 3rem" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "620px",
            pointerEvents: "none",
            position: "relative",
          }}
        >
          {/* ── eyebrow with accent line ─────────────────────── */}
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.75rem",
            }}
            variants={reveal(0.3)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div
              style={{
                width: 20,
                height: 1,
                background: "rgba(79, 209, 255, 0.5)",
                boxShadow: "0 0 8px rgba(79, 209, 255, 0.3)",
              }}
            />
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
              Creative Technologist
            </span>
          </motion.div>

          {/* ── headline — gradient text + sweep + volumetric shadow ── */}
          <motion.h1
            className="cinematic-headline"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              filter: [
                "drop-shadow(0 0 30px rgba(79, 209, 255, 0.15))",
                "drop-shadow(0 0 60px rgba(107, 140, 255, 0.08))",
                "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))",
              ].join(" "),
            }}
            variants={reveal(0.6)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Engineering
            <br />
            Digital Worlds
          </motion.h1>

          {/* ── supporting line ───────────────────────────────── */}
          <motion.p
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
              color: "rgba(255, 255, 255, 0.45)",
              maxWidth: "420px",
              marginTop: "2rem",
              lineHeight: 1.7,
              fontWeight: 400,
              textShadow: "0 0 20px rgba(79, 209, 255, 0.05)",
            }}
            variants={reveal(1.1)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            I design and build immersive 3D web experiences
            and real-time interfaces.
          </motion.p>

          {/* ── CTA button — glass morphism ───────────────────── */}
          <motion.button
            style={{
              marginTop: "2.5rem",
              padding: "0.85rem 2.2rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, rgba(79, 209, 255, 0.06), rgba(107, 140, 255, 0.04))",
              border: "1px solid rgba(79, 209, 255, 0.12)",
              borderRadius: "12px",
              cursor: "pointer",
              pointerEvents: "auto",
              letterSpacing: "0.06em",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: [
                "0 0 20px rgba(79, 209, 255, 0.04)",
                "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
                "0 4px 16px rgba(0, 0, 0, 0.2)",
              ].join(", "),
              textShadow: "0 0 10px rgba(79, 209, 255, 0.2)",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
            variants={reveal(1.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onClick={scrollToAbout}
            whileHover={{
              scale: 1.03,
              boxShadow: [
                "0 0 30px rgba(79, 209, 255, 0.12)",
                "0 0 60px rgba(107, 140, 255, 0.06)",
                "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
                "0 4px 20px rgba(0, 0, 0, 0.3)",
              ].join(", "),
              borderColor: "rgba(79, 209, 255, 0.25)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
          </motion.button>
        </div>
      </CinematicPanel>

      {/* ── scroll indicator ───────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: reduced ? 0 : 2.2 }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            color: "rgba(79, 209, 255, 0.3)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontFamily: "var(--font-geist-mono), monospace",
            textShadow: "0 0 8px rgba(79, 209, 255, 0.15)",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "1px",
            height: "32px",
            background:
              "linear-gradient(rgba(79, 209, 255, 0.3), transparent)",
            boxShadow: "0 0 6px rgba(79, 209, 255, 0.15)",
          }}
        />
      </motion.div>
    </section>
  );
}
