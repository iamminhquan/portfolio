"use client";

/**
 * Contact section — cinematic closing scene.
 * Glassmorphism form panel with atmospheric background,
 * staggered entrance animations, and a calm final-chapter feel.
 */

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useInView } from "framer-motion";

/* ── floating particle positions ─────────────────────── */

const PARTICLES: { top: string; left: string; size: number; dur: number; delay: number }[] = [
  { top: "12%", left: "8%",  size: 2, dur: 5,   delay: 0 },
  { top: "28%", left: "85%", size: 3, dur: 6,   delay: 0.8 },
  { top: "65%", left: "12%", size: 2, dur: 4.5, delay: 1.5 },
  { top: "78%", left: "90%", size: 3, dur: 5.5, delay: 0.4 },
  { top: "45%", left: "5%",  size: 2, dur: 6.5, delay: 2 },
  { top: "18%", left: "72%", size: 2, dur: 5.2, delay: 1.2 },
];

/* ── component ───────────────────────────────────────── */

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  /* stagger entrance helper */
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      ref={ref}
      id="contact"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── atmospheric background ─────────────── */}

      {/* Radial accent glow (faint, CSS-only) */}
      <div
        style={{
          position: "absolute",
          width: "min(60vw, 800px)",
          height: "min(60vw, 800px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(107,140,255,0.05) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating accent particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `rgba(107,140,255,${0.12 + (i % 3) * 0.06})`,
            top: p.top,
            left: p.left,
            pointerEvents: "none",
            animation: `contactFloat ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ── content wrapper ────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 520,
          padding: "0 clamp(1.5rem, 5vw, 3rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* section label */}
        <motion.div
          {...fadeUp(0)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.25rem",
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
            Contact
          </span>
          <div
            style={{
              width: 28,
              height: 1,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </motion.div>

        {/* headline */}
        <motion.h2
          {...fadeUp(0.1)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Let&apos;s Build Something{" "}
          <span style={{ color: "var(--accent)" }}>Great</span>
        </motion.h2>

        {/* subtext */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            lineHeight: 1.75,
            maxWidth: 400,
            marginTop: "1rem",
            marginBottom: "2rem",
          }}
        >
          Have a project in mind or want to collaborate? Drop me a message
          and let&apos;s create something extraordinary.
        </motion.p>

        {/* ── glassmorphism form panel ──────────── */}
        <motion.form
          onSubmit={handleSubmit}
          {...fadeUp(0.35)}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            background: "rgba(10, 12, 22, 0.5)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: 20,
            padding: "clamp(1.5rem, 3vw, 2.25rem)",
            pointerEvents: "auto",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="contact-input"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="contact-input"
          />

          <textarea
            placeholder="Your Message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            className="contact-input"
            style={{ resize: "vertical", minHeight: "110px" }}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="contact-submit"
            style={{
              marginTop: "0.25rem",
              width: "100%",
              padding: "0.85rem 2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "var(--accent)",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "center" as const,
            }}
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </motion.button>
        </motion.form>

        {/* footer note */}
        <motion.p
          {...fadeUp(0.5)}
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
            marginTop: "1.5rem",
            letterSpacing: "0.02em",
          }}
        >
          I typically respond within 24 hours.
        </motion.p>
      </div>
    </section>
  );
}
