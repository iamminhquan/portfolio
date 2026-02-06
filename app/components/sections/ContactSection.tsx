/**
 * Contact section with a call-to-action to collaborate.
 */

import { styles } from "../styles/styles";

export function ContactSection() {
  return (
    <section style={{ ...styles.section, ...styles.sectionAlt }}>
      <div style={{ ...styles.content, alignItems: "flex-end" }}>
        <h2 style={styles.sectionTitle}>Contact</h2>
        <p style={styles.sectionText}>
          Let&apos;s collaborate on your next project. Reach out and let&apos;s
          create something extraordinary together.
        </p>
        <button style={styles.button}>Get in Touch</button>
      </div>
    </section>
  );
}
