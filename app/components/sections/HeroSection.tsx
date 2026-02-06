/**
 * Hero landing section with title, subtitle, and CTA button.
 */

import { styles } from "../styles/styles";

export function HeroSection() {
  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h1 style={styles.title}>Creative Developer</h1>
        <p style={styles.subtitle}>
          Building immersive digital experiences with code and creativity.
        </p>
        <button style={styles.button}>View Work</button>
      </div>
    </section>
  );
}
