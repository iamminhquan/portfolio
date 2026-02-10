"use client";

/**
 * About section — identity-driven narrative in three short blocks.
 * Personal, intentional, minimal. Reads like a manifesto, not a resume.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { styles } from "../styles/styles";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

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
      id="about"
      style={{ ...styles.section, ...styles.sectionAlt }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          padding: "0 7vw",
          maxWidth: "580px",
          pointerEvents: "none",
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
          variants={reveal(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          About
        </motion.span>

        {/* identity statement */}
        <motion.p
          style={{
            fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)",
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "right",
            lineHeight: 1.5,
            margin: 0,
            maxWidth: "420px",
          }}
          variants={reveal(0.3)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          I design interactive systems that make the web feel alive.
        </motion.p>

        {/* capability statement */}
        <motion.p
          style={{
            fontSize: "clamp(0.92rem, 1.4vw, 1.02rem)",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "right",
            lineHeight: 1.7,
            marginTop: "2rem",
            maxWidth: "420px",
          }}
          variants={reveal(0.55)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          My focus is frontend engineering, real-time 3D, and immersive
          interfaces. I build at the edge of what browsers can do.
        </motion.p>

        {/* personality statement */}
        <motion.p
          style={{
            fontSize: "clamp(0.92rem, 1.4vw, 1.02rem)",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.4)",
            textAlign: "right",
            lineHeight: 1.7,
            marginTop: "1.75rem",
            maxWidth: "420px",
          }}
          variants={reveal(0.8)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Beyond the screen — generative art, open-source, creative
          tooling, and experiments that push the medium forward.
        </motion.p>
      </div>
    </section>
  );
}
