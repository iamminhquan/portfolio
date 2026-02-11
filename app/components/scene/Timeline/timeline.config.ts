import type { Chapter } from "./timeline.types";

/**
 * Chapter layout matching the real portfolio HTML sections.
 *
 * Progress boundaries are derived from section heights:
 *   Hero     100vh  │  About  100vh  │  Skills  100vh
 *   Projects 400vh  │  Contact 100vh │  Total ≈ 800vh
 *
 * With a 100vh viewport, scroll range ≈ 700vh.
 * Each boundary ≈ section-start / scroll-range.
 *
 * Fine-tune these values if section heights change.
 * The TimelineController normalises window.scrollY to 0 → 1,
 * so these numbers map directly to scroll position.
 */
export const CHAPTERS: Chapter[] = [
  { id: "hero",     start: 0.0,   end: 0.14  },
  { id: "about",    start: 0.14,  end: 0.29  },
  { id: "skills",   start: 0.29,  end: 0.43  },
  { id: "projects", start: 0.43,  end: 0.86  },
  { id: "contact",  start: 0.86,  end: 1.0   },
];
