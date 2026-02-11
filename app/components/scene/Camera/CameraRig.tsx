/**
 * CameraRig — cinematic camera driven entirely by the global timeline.
 *
 * Architecture decisions
 * ─────────────────────
 * 1. Waypoints are pre-computed once (useMemo) from chapter boundaries
 *    and keyframe config. At each chapter boundary the camera "arrives"
 *    at that chapter's keyframe, then interpolates toward the next.
 *
 * 2. Two-layer interpolation:
 *    a) Linear interpolation between surrounding waypoints (goal).
 *    b) Exponential damping from current position toward the goal.
 *    This produces smooth, cinematic camera motion.
 *
 * 3. Position and lookAt have independent damping constants so the camera
 *    can "lag behind" in position while the gaze snaps more quickly,
 *    creating a natural look-ahead effect.
 *
 * 4. All vector math uses pre-allocated refs — zero per-frame allocations.
 *
 * 5. The component renders null — it only writes to the camera each frame.
 */

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

import { useTimeline } from "../Timeline";
import { CAMERA_KEYFRAMES, type CameraKeyframe } from "./camera.config";

/* ── Types ──────────────────────────────────────────────────────── */

interface Waypoint {
  /** Global progress at which this waypoint sits. */
  t: number;
  /** Camera position at this waypoint. */
  pos: Vector3;
  /** Camera lookAt target at this waypoint. */
  target: Vector3;
}

interface CameraRigProps {
  /** Override the default camera keyframes. */
  keyframes?: Record<string, CameraKeyframe>;
  /**
   * Exponential-decay rate for camera position.
   * Higher = snappier, lower = floatier.
   * @default 3
   */
  damping?: number;
  /**
   * Separate decay rate for the lookAt target.
   * Slightly higher than position damping gives a "look-ahead" feel.
   * @default 4
   */
  lookAtDamping?: number;
}

/* ── Component ──────────────────────────────────────────────────── */

export function CameraRig({
  keyframes = CAMERA_KEYFRAMES,
  damping = 3,
  lookAtDamping = 4,
}: CameraRigProps) {
  const { camera } = useThree();
  const timeline = useTimeline();

  /* ── pre-compute ordered waypoints from chapters + keyframes ─── */

  const waypoints = useMemo<Waypoint[]>(() => {
    const { chapters } = timeline;
    const wp: Waypoint[] = chapters.map((ch) => {
      const kf = keyframes[ch.id];
      return {
        t: ch.start,
        pos: new Vector3(...(kf?.position ?? [0, 2, 8])),
        target: new Vector3(...(kf?.target ?? [0, 0, 0])),
      };
    });

    // Append an end waypoint so the camera has a destination during
    // the final chapter. Uses the last chapter's keyframe by default.
    const last = chapters[chapters.length - 1];
    if (last) {
      const kf = keyframes[last.id];
      wp.push({
        t: last.end,
        pos: new Vector3(...(kf?.position ?? [0, 2, 8])),
        target: new Vector3(...(kf?.target ?? [0, 0, 0])),
      });
    }

    return wp;
  }, [timeline, keyframes]);

  /* ── pre-allocated working vectors (no per-frame GC pressure) ── */

  const goalPos = useRef(new Vector3(0, 2, 8));
  const goalTarget = useRef(new Vector3(0, 0, 0));
  const smoothPos = useRef(new Vector3(0, 2, 8));
  const smoothTarget = useRef(new Vector3(0, 0, 0));

  /* ── per-frame camera update ─────────────────────────────────── */

  useFrame((_, delta) => {
    const { progress } = timeline.getState();

    /* resolve interpolated goal from waypoints */
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i];
      const b = waypoints[i + 1];

      if (progress >= a.t && progress <= b.t) {
        const segLen = b.t - a.t;
        const localT = segLen > 0 ? (progress - a.t) / segLen : 0;

        goalPos.current.lerpVectors(a.pos, b.pos, localT);
        goalTarget.current.lerpVectors(a.target, b.target, localT);
        break;
      }
    }

    /* cinematic damping — frame-rate independent */
    const posFactor = 1 - Math.exp(-damping * delta);
    const tgtFactor = 1 - Math.exp(-lookAtDamping * delta);

    smoothPos.current.lerp(goalPos.current, posFactor);
    smoothTarget.current.lerp(goalTarget.current, tgtFactor);

    /* write to camera */
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);
  });

  return null;
}
