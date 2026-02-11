/**
 * Shared mutable state stores for mouse input and device capabilities.
 *
 * These are NOT scroll-related — scroll is handled entirely by the
 * TimelineController. Mouse and device state remain as lightweight
 * mutable stores that any component can read inside useFrame.
 *
 * ── Migration note ──────────────────────────────────────────────
 * The old SECTIONS array and scrollState object have been removed.
 * Camera positions now live in Camera/camera.config.ts (as waypoints).
 * Reactor rotation/scale lives in config/animation.config.ts.
 * Scroll progress is accessed via useTimeline().getState().progress.
 */

export const mouseState = {
  x: 0,
  y: 0,
};

export const deviceState = {
  performance: "high" as "high" | "medium" | "low",
  isMobile: false,
  reducedMotion: false,
};
