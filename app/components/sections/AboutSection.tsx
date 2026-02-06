/**
 * About section describing the developer's focus and philosophy.
 */

import { styles } from "../styles/styles";

export function AboutSection() {
  return (
    <section style={{ ...styles.section, ...styles.sectionAlt }}>
      <div style={{ ...styles.content, alignItems: "flex-end" }}>
        <h2 style={styles.sectionTitle}>About</h2>
        <p style={styles.sectionText}>
          Passionate about crafting beautiful interfaces and memorable
          experiences through clean code and thoughtful design.
        </p>
      </div>
    </section>
  );
}
