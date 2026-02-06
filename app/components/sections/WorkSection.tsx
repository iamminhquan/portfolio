/**
 * Work/portfolio section highlighting selected projects.
 */

import { styles } from "../styles/styles";

export function WorkSection() {
  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Work</h2>
        <p style={styles.sectionText}>
          A curated selection of projects showcasing expertise in web
          development, 3D graphics, and interactive experiences.
        </p>
      </div>
    </section>
  );
}
