"use client";

/**
 * Skills section — grouped skill chips with category labels,
 * glassmorphism cards, and smooth micro-interactions.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { styles } from "../styles/styles";

interface SkillGroup {
  label: string;
  accent: string;
  items: string[];
}

const groups: SkillGroup[] = [
  {
    label: "Frontend",
    accent: "#6b8cff",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    label: "3D & Real-time",
    accent: "#4fd1ff",
    items: ["Three.js", "React Three Fiber"],
  },
  {
    label: "Backend & Tools",
    accent: "#8aafff",
    items: ["Node.js", "PostgreSQL", "Docker", "AWS", "Git"],
  },
];

export function SkillsSection() {
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
    <section ref={ref} id="skills" style={styles.section}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 7vw",
          maxWidth: "640px",
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
          Toolkit
        </motion.span>

        {/* subtitle */}
        <motion.p
          style={{
            fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)",
            color: "rgba(255, 255, 255, 0.5)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: "380px",
          }}
          variants={reveal(0.3)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Technologies and tools I reach for when building for the modern web.
        </motion.p>

        {/* skill groups */}
        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {groups.map((group, gi) => {
            const groupDelay = 0.5 + gi * 0.25;
            return (
              <motion.div
                key={group.label}
                variants={reveal(groupDelay)}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {/* category label */}
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    color: group.accent,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-geist-mono), monospace",
                    marginBottom: "0.75rem",
                    display: "block",
                  }}
                >
                  {group.label}
                </span>

                {/* chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    pointerEvents: "auto",
                  }}
                >
                  {group.items.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: reduced ? 0 : 0.4,
                        delay: reduced ? 0 : groupDelay + 0.15 + si * 0.06,
                        ease,
                      }}
                      whileHover={{
                        scale: 1.06,
                        boxShadow: `0 0 20px ${group.accent}25, 0 0 40px ${group.accent}10`,
                        borderColor: `${group.accent}50`,
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.8)",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        cursor: "default",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        transition: "border-color 0.3s, box-shadow 0.3s",
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
