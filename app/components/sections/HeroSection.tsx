"use client";

/**
 * Hero landing section with a typewriter heading, fade-in subtitle,
 * CTA button that scrolls to About, and a scroll indicator.
 */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TypeWriter } from "../ui/TypeWriter";
import { styles } from "../styles/styles";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [typingDone, setTypingDone] = useState(false);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hero" style={styles.section}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          {isInView && (
            <TypeWriter
              text="Creative Developer"
              speed={60}
              delay={500}
              onComplete={() => setTypingDone(true)}
            />
          )}
        </h1>

        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={typingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Building immersive digital experiences with code, creativity, and
          cutting-edge web technologies.
        </motion.p>

        <motion.button
          style={styles.button}
          initial={{ opacity: 0, y: 20 }}
          animate={typingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          onClick={scrollToAbout}
          whileHover={{ scale: 1.05, backgroundColor: "#5a7bff" }}
          whileTap={{ scale: 0.95 }}
        >
          Explore My Work
        </motion.button>

        {/* Scroll indicator */}
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
          animate={typingDone ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "1px",
              height: "30px",
              background:
                "linear-gradient(rgba(107,140,255,0.8), transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
