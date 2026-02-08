"use client";

/**
 * Projects showcase with scroll-activated cards.
 * Each card has an accent bar, description, and technology tags.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles/styles";

const projects = [
  {
    title: "3D Portfolio",
    description:
      "An immersive portfolio website featuring scroll-driven 3D animations, interactive scenes, and smooth camera transitions.",
    tags: ["React", "Three.js", "Next.js", "R3F"],
    accent: "#6b8cff",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack shopping experience with real-time inventory management, payment processing, and responsive design.",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
    accent: "#ff6b8c",
  },
  {
    title: "Data Dashboard",
    description:
      "Interactive analytics dashboard with real-time data visualization, custom charts, and collaborative features.",
    tags: ["React", "D3.js", "TypeScript", "REST API"],
    accent: "#8cff6b",
  },
  {
    title: "Chat Application",
    description:
      "Real-time messaging platform with WebSocket connections, end-to-end encryption, and rich media sharing.",
    tags: ["React", "Socket.io", "Node.js", "MongoDB"],
    accent: "#ffcf6b",
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="projects" style={styles.section}>
      <div style={{ ...styles.content, maxWidth: "600px" }}>
        <motion.h2
          style={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Projects
        </motion.h2>

        <motion.p
          style={styles.sectionText}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Selected work showcasing expertise in web development, 3D graphics,
          and interactive experiences.
        </motion.p>

        {/* Project cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1.75rem",
            width: "100%",
            pointerEvents: "auto",
          }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              whileHover={{
                x: 8,
                boxShadow: `0 8px 40px ${project.accent}22`,
              }}
              style={{
                padding: "1.25rem 1.25rem 1.25rem 1.5rem",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: project.accent,
                  borderRadius: "0 2px 2px 0",
                }}
              />

              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "0.4rem",
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255, 255, 255, 0.55)",
                  lineHeight: 1.55,
                  marginBottom: "0.6rem",
                }}
              >
                {project.description}
              </p>

              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "4px",
                      backgroundColor: `${project.accent}18`,
                      color: project.accent,
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
