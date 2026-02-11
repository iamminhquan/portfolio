import type { Chapter } from "./timeline.types";

/**
 * Default chapter layout.
 *
 * Each chapter maps to a named range on the global 0 → 1 timeline.
 * Chapters must be contiguous (no gaps) and sorted by start time.
 *
 * Override by passing a custom array to <TimelineController chapters={…}>.
 */
export const CHAPTERS: Chapter[] = [
  { id: "intro",    start: 0.0, end: 0.3 },
  { id: "toolkit",  start: 0.3, end: 0.6 },
  { id: "projects", start: 0.6, end: 1.0 },
];
