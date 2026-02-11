/**
 * useWaypointValue — interpolates a numeric property across ordered waypoints
 * based on global timeline progress.
 *
 * Unlike useTimelineValue (which maps a single range to 0→1), this hook
 * handles multi-segment interpolation with arbitrary numeric output.
 * Perfect for properties that change differently across each chapter
 * (e.g. reactor rotation, scale).
 *
 * Returns a stable getter function. Call inside useFrame.
 *
 * @param waypoints  Sorted array of { t, [key]: value } objects.
 * @param key        The property name to interpolate.
 * @returns          A stable () => number getter.
 *
 * @example
 * const getRotation = useWaypointValue(REACTOR_WAYPOINTS, "rotation");
 * const getScale    = useWaypointValue(REACTOR_WAYPOINTS, "scale");
 *
 * useFrame(() => {
 *   group.rotation.y = getRotation();
 *   group.scale.setScalar(getScale());
 * });
 */

import { useCallback } from "react";
import { MathUtils } from "three";
import { useTimeline } from "../Timeline";

/** A waypoint with a progress timestamp and arbitrary numeric values. */
export interface NumericWaypoint {
  /** Timeline progress (0 → 1). */
  t: number;
  /** Additional numeric properties to interpolate. */
  [key: string]: number;
}

export function useWaypointValue(
  waypoints: NumericWaypoint[],
  key: string,
): () => number {
  const { getState } = useTimeline();

  return useCallback(() => {
    const { progress } = getState();

    // Before first waypoint.
    if (progress <= waypoints[0].t) return waypoints[0][key];

    // Scan for surrounding segment.
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i];
      const b = waypoints[i + 1];
      if (progress >= a.t && progress <= b.t) {
        const seg = b.t - a.t;
        const local = seg > 0 ? (progress - a.t) / seg : 0;
        return MathUtils.lerp(a[key], b[key], local);
      }
    }

    // After last waypoint.
    return waypoints[waypoints.length - 1][key];
  }, [getState, waypoints, key]);
}
