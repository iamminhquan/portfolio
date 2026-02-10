"use client";

/**
 * About section with a short bio and animated interest tags.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles/styles";

const interests = [
  "Interactive 3D Experiences",
  "Creative Development",
  "UI/UX Design",
  "Open Source",
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="about"
      style={{ ...styles.section, ...styles.sectionAlt }}
    >
      <div
        style={{ ...styles.content, alignItems: "flex-end", maxWidth: "550px" }}
      >
        <motion.h2
          style={styles.sectionTitle}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          About Me
        </motion.h2>

        <motion.p
          style={{ ...styles.sectionText, textAlign: "right" }}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          I&apos;m a creative developer passionate about building immersive web
          experiences. I combine front-end expertise with 3D graphics and
          thoughtful design to create digital products that feel alive.
        </motion.p>

        <motion.p
          style={{
            ...styles.sectionText,
            textAlign: "right",
            marginTop: "0.75rem",
          }}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          When I&apos;m not coding, you&apos;ll find me exploring new creative
          tools, contributing to open-source projects, or experimenting with
          generative art and interactive installations.
        </motion.p>

        {/* Interest tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {interests.map((interest, i) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.8rem",
                borderRadius: "20px",
                border: "1px solid rgba(107, 140, 255, 0.3)",
                color: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(107, 140, 255, 0.1)",
                pointerEvents: "auto",
              }}
            >
              {interest}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
