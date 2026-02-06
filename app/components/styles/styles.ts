/**
 * Shared inline styles for the portfolio layout and section components.
 */

import type { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  canvasWrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
  },
  main: {
    position: "relative",
    zIndex: 1,
  },
  section: {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
  },
  sectionAlt: {
    justifyContent: "flex-end",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0 8vw",
    pointerEvents: "none",
    maxWidth: "600px",
  },
  title: {
    fontSize: "clamp(2.5rem, 8vw, 5rem)",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
  },
  sectionTitle: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    color: "rgba(255, 255, 255, 0.85)",
    maxWidth: "500px",
    marginTop: "1rem",
    lineHeight: 1.6,
    textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
  },
  sectionText: {
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    color: "rgba(255, 255, 255, 0.8)",
    maxWidth: "450px",
    marginTop: "1rem",
    lineHeight: 1.7,
    textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
  },
  button: {
    marginTop: "2rem",
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#6b8cff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    pointerEvents: "auto",
    transition: "background-color 0.2s ease",
  },
};
