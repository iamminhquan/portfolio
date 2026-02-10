"use client";

/**
 * Contact section with a clean form and animated entrance.
 */

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles/styles";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send to API endpoint
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      ref={ref}
      id="contact"
      style={{ ...styles.section, ...styles.sectionAlt }}
    >
      <div
        style={{ ...styles.content, alignItems: "flex-end", maxWidth: "480px" }}
      >
        <motion.h2
          style={styles.sectionTitle}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Get in Touch
        </motion.h2>

        <motion.p
          style={{ ...styles.sectionText, textAlign: "right" }}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Have a project in mind? Let&apos;s create something extraordinary
          together.
        </motion.p>

        {/* Contact form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginTop: "1.5rem",
            width: "100%",
            pointerEvents: "auto",
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
            style={{ resize: "vertical", minHeight: "100px" }}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, backgroundColor: "#5a7bff" }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...styles.button,
              marginTop: "0.25rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
