"use client";

/**
 * Skills & Tools section with an animated grid of skill badges.
 * Each badge has a colored dot, hover lift, and spring-in animation.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles/styles";

const skills = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Three.js", color: "#049ef4" },
  { name: "R3F", color: "#6b8cff" },
  { name: "Node.js", color: "#339933" },
  { name: "Tailwind", color: "#06b6d4" },
  { name: "Framer Motion", color: "#ff0080" },
  { name: "Git", color: "#f05032" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Docker", color: "#2496ed" },
  { name: "AWS", color: "#ff9900" },
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="skills" style={styles.section}>
      <div style={{ ...styles.content, maxWidth: "700px" }}>
        <motion.h2
          style={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Skills &amp; Tools
        </motion.h2>

        <motion.p
          style={styles.sectionText}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Technologies I work with to bring ideas to life.
        </motion.p>

        {/* Skill grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.75rem",
            marginTop: "2rem",
            width: "100%",
            pointerEvents: "auto",
          }}
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.06,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: `0 8px 30px ${skill.color}33`,
              }}
              style={{
                padding: "0.9rem 0.5rem",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${skill.color}22`,
                backdropFilter: "blur(10px)",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: skill.color,
                  boxShadow: `0 0 10px ${skill.color}66`,
                }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
