/**
 * Timeline system type definitions.
 *
 * The timeline normalises page scroll into a 0 → 1 progress value and
 * divides the journey into named chapters. All animation in the 3D scene
 * reads from this single source of truth — no component should ever
 * touch window.scrollY directly.
 */

/* ── Chapter ────────────────────────────────────────────────────── */

/** A chapter is a named range on the global timeline (0 → 1). */
export interface Chapter {
  /** Unique identifier used to look up camera keyframes and query progress. */
  id: string;
  /** Normalised start position on the global timeline. */
  start: number;
  /** Normalised end position on the global timeline. */
  end: number;
}

/* ── Mutable frame state ────────────────────────────────────────── */

/**
 * Snapshot written every frame by the TimelineController.
 * Stored in a ref — never placed into React state so zero re-renders
 * happen during the animation loop.
 */
export interface TimelineState {
  /** Smoothed global progress (0 → 1). */
  progress: number;
  /** Raw scroll-derived target before damping is applied. */
  targetProgress: number;
  /** Rate of change of smoothed progress, per second. */
  velocity: number;
  /** ID of the chapter the playhead currently sits inside. */
  chapter: string;
}

/* ── Public API ─────────────────────────────────────────────────── */

/**
 * Stable API surface exposed through React context.
 * All methods are referentially stable — safe to call inside useFrame
 * without triggering React re-renders.
 */
export interface TimelineAPI {
  /** Returns the mutable state ref (read inside useFrame). */
  getState: () => TimelineState;
  /**
   * Returns normalised 0 → 1 progress within a named chapter.
   * Clamps to 0 before the chapter starts and 1 after it ends.
   */
  chapterProgress: (id: string) => number;
  /** The chapter configuration array (read-only). */
  chapters: Chapter[];
}
