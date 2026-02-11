"use client";

/**
 * React context + consumer hook for the timeline system.
 *
 * Separated from TimelineController so that lightweight leaf components
 * can import only the hook without pulling in the controller logic.
 */

import { createContext, useContext } from "react";
import type { TimelineAPI } from "./timeline.types";

/**
 * Internal context — consumers should use the useTimeline() hook instead.
 */
export const TimelineContext = createContext<TimelineAPI | null>(null);

/**
 * Access the timeline from any component inside <TimelineController>.
 *
 * All returned functions are referentially stable and read from mutable
 * refs, so calling them inside useFrame is cheap and causes zero
 * React re-renders.
 *
 * @example
 * const { getState, chapterProgress } = useTimeline();
 *
 * useFrame(() => {
 *   const { progress } = getState();
 *   const intro = chapterProgress("intro");
 * });
 */
export function useTimeline(): TimelineAPI {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error(
      "useTimeline() must be called inside a <TimelineController>.",
    );
  }
  return ctx;
}
