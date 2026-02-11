/**
 * useTimelineValue — maps a range on the global timeline to a 0 → 1 value.
 *
 * Returns a **stable getter function** (not reactive state).
 * Call it inside useFrame to read the current value without
 * triggering React re-renders.
 *
 * @param rangeStart  Global progress at which the value begins rising.
 * @param rangeEnd    Global progress at which the value reaches 1.
 * @param easing      Optional remapping curve (e.g. Easing.smoothstep).
 * @returns           A stable () => number getter.
 *
 * @example
 * const getEnergy = useTimelineValue(0.3, 0.6, Easing.smoothstep);
 *
 * useFrame((_, delta) => {
 *   mesh.current.rotation.y += getEnergy() * delta;
 * });
 */

import { useCallback } from "react";
import { MathUtils } from "three";
import { useTimeline } from "../Timeline";

export function useTimelineValue(
  rangeStart: number,
  rangeEnd: number,
  easing?: (t: number) => number,
): () => number {
  const { getState } = useTimeline();

  return useCallback(() => {
    const { progress } = getState();
    const range = rangeEnd - rangeStart;
    if (range <= 0) return 0;
    const raw = MathUtils.clamp((progress - rangeStart) / range, 0, 1);
    return easing ? easing(raw) : raw;
  }, [getState, rangeStart, rangeEnd, easing]);
}
