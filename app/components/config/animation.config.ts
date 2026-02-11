/**
 * Animation configuration — extracted from scene components.
 *
 * All magic numbers that control scroll-driven animation live here.
 * This makes it easy to tweak behaviour without touching component code.
 */

/* ── Reactor Core (HeroModel) ──────────────────────────────────── */

/**
 * Waypoints for the reactor's rotation and scale across the timeline.
 * Maps to the section transitions in the old SECTIONS config.
 */
export const REACTOR_WAYPOINTS = [
  { t: 0.0,   rotation: 0,               scale: 1.0  },
  { t: 0.14,  rotation: Math.PI * 0.5,   scale: 1.1  },
  { t: 0.29,  rotation: Math.PI,         scale: 0.85 },
  { t: 0.43,  rotation: Math.PI * 1.15,  scale: 0.6  },
  { t: 0.57,  rotation: Math.PI * 1.25,  scale: 0.58 },
  { t: 0.71,  rotation: Math.PI * 1.35,  scale: 0.59 },
  { t: 0.85,  rotation: Math.PI * 1.45,  scale: 0.6  },
  { t: 0.86,  rotation: Math.PI * 1.7,   scale: 0.55 },
  { t: 1.0,   rotation: Math.PI * 1.7,   scale: 0.55 },
];

/* ── Floating Fragments ────────────────────────────────────────── */

/**
 * Trapezoidal visibility envelope for the orbital fragments.
 * Fragments fade in during the about section, stay visible through
 * skills, and fade out before projects.
 */
export const FRAGMENT_ENVELOPE = {
  /** Progress at which fragments begin fading in. */
  fadeInStart:  0.10,
  /** Progress at which fragments reach full opacity. */
  fadeInEnd:    0.18,
  /** Progress at which fragments begin fading out. */
  fadeOutStart: 0.38,
  /** Progress at which fragments are fully invisible. */
  fadeOutEnd:   0.46,
} as const;

/* ── Contact Orb ───────────────────────────────────────────────── */

/**
 * Contact orb fades in over the first half of the contact chapter.
 * These values are in chapter-local progress (0 → 1), not global.
 */
export const CONTACT_ORB = {
  /** Chapter-local progress where fade begins. */
  fadeStart: 0.0,
  /** Chapter-local progress where orb is fully visible. */
  fadeEnd:   0.5,
} as const;
