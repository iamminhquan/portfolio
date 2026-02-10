"use client";

/**
 * Hero landing section — minimal identity statement with sequential
 * fade-in animations. Short, confident, intentional.
 * Respects reduced-motion preferences.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  /* shared reveal variant — fade + gentle upward slide */
  const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

  const reveal = (delay: number) => ({
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.7,
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
      }}
    >
      {/* ── text block ─────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 7vw",
          maxWidth: "660px",
          pointerEvents: "none",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* eyebrow */}
        <motion.span
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "#4fd1ff",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
          variants={reveal(0.3)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Creative Technologist
        </motion.span>

        {/* headline */}
        <motion.h1
          style={{
            fontSize: "clamp(1.9rem, 5.5vw, 3.6rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            textShadow: "0 2px 30px rgba(107, 140, 255, 0.12)",
          }}
          variants={reveal(0.6)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Engineering
          <br />
          Digital Worlds
        </motion.h1>

        {/* supporting line */}
        <motion.p
          style={{
            fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)",
            color: "rgba(255, 255, 255, 0.5)",
            maxWidth: "400px",
            marginTop: "2rem",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
          variants={reveal(1.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          I design and build immersive 3D web experiences
          and real-time interfaces.
        </motion.p>

        {/* CTA */}
        <motion.button
          style={{
            marginTop: "2.25rem",
            padding: "0.8rem 2rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#ffffff",
            background:
              "linear-gradient(135deg, rgba(107,140,255,0.1), rgba(79,209,255,0.1))",
            border: "1px solid rgba(107, 140, 255, 0.2)",
            borderRadius: "10px",
            cursor: "pointer",
            pointerEvents: "auto",
            letterSpacing: "0.06em",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          variants={reveal(1.4)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          onClick={scrollToAbout}
          whileHover={{
            scale: 1.03,
            boxShadow:
              "0 0 25px rgba(107,140,255,0.2), 0 0 50px rgba(107,140,255,0.06)",
            borderColor: "rgba(107, 140, 255, 0.45)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          View My Work
        </motion.button>
      </div>

      {/* ── scroll indicator ───────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: reduced ? 0 : 2.2 }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            color: "rgba(255, 255, 255, 0.2)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "28px",
            background:
              "linear-gradient(rgba(107, 140, 255, 0.35), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
