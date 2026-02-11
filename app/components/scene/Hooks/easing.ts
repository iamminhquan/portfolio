/**
 * Common easing functions for use with useTimelineValue.
 *
 * Each function maps t ∈ [0, 1] → [0, 1].
 * Pass any of these as the `easing` parameter to reshape the
 * animation curve within a timeline range.
 *
 * @example
 * import { Easing } from "./easing";
 * const get = useTimelineValue(0.3, 0.6, Easing.smoothstep);
 */

export const Easing = {
  linear:        (t: number) => t,
  easeInQuad:    (t: number) => t * t,
  easeOutQuad:   (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic:   (t: number) => t * t * t,
  easeOutCubic:  (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic:(t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  /** Hermite smoothstep — zero-derivative at both ends. */
  smoothstep:    (t: number) => t * t * (3 - 2 * t),
} as const;
