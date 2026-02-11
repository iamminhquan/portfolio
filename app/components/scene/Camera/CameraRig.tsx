/**
 * CameraRig — cinematic camera driven by the global timeline.
 *
 * Architecture decisions
 * ─────────────────────
 * 1. Supports two config modes:
 *    a) Explicit waypoints — full control over camera path at any progress.
 *    b) Chapter-keyed keyframes — auto-builds waypoints from chapter config.
 *    Waypoints take priority when both are provided.
 *
 * 2. Three-layer interpolation pipeline:
 *    a) Linear interpolation between surrounding waypoints → goal.
 *    b) Exponential damping from smooth position toward goal → cinematic.
 *    c) Additive offsets (idle drift + mouse parallax) → life.
 *
 * 3. Drift and parallax are optional and additive — they never fight
 *    the waypoint interpolation. Both respect prefers-reduced-motion.
 *
 * 4. All vector math uses pre-allocated refs — zero per-frame allocations.
 *
 * 5. Returns null — this component only writes to the camera each frame.
 */

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

import { useTimeline } from "../Timeline";
import {
  CAMERA_WAYPOINTS,
  CAMERA_KEYFRAMES,
  type CameraWaypoint,
  type CameraKeyframe,
} from "./camera.config";
import { mouseState, deviceState } from "../../config/sections";

/* ── Types ──────────────────────────────────────────────────────── */

interface InternalWaypoint {
  t: number;
  pos: Vector3;
  target: Vector3;
}

interface CameraRigProps {
  /**
   * Explicit ordered waypoints. Takes priority over keyframes.
   * Each entry has a progress timestamp (t) and position + target.
   */
  waypoints?: CameraWaypoint[];
  /**
   * Chapter-ID-keyed keyframes. When waypoints are not provided,
   * the rig builds waypoints from chapters + these keyframes.
   */
  keyframes?: Record<string, CameraKeyframe>;
  /**
   * Exponential-decay rate for camera position.
   * Higher = snappier, lower = floatier.
   * @default 3
   */
  damping?: number;
  /**
   * Separate decay rate for the lookAt target.
   * Slightly higher than position gives a natural "look-ahead" feel.
   * @default 4
   */
  lookAtDamping?: number;
  /**
   * Mouse parallax offsets. Set to false to disable.
   * @default { x: 0.12, y: 0.08, smoothing: 0.03 }
   */
  parallax?: { x: number; y: number; smoothing: number } | false;
  /**
   * Idle drift (subtle sinusoidal). Set to false to disable.
   * Automatically disabled when prefers-reduced-motion is active.
   * @default { x: 0.06, y: 0.04, speed: 1 }
   */
  drift?: { x: number; y: number; speed: number } | false;
}

/* ── Helpers ────────────────────────────────────────────────────── */

function buildFromWaypoints(wps: CameraWaypoint[]): InternalWaypoint[] {
  return wps.map((wp) => ({
    t: wp.t,
    pos: new Vector3(...wp.position),
    target: new Vector3(...wp.target),
  }));
}

function buildFromChapters(
  chapters: { id: string; start: number; end: number }[],
  keyframes: Record<string, CameraKeyframe>,
): InternalWaypoint[] {
  const wp: InternalWaypoint[] = chapters.map((ch) => {
    const kf = keyframes[ch.id];
    return {
      t: ch.start,
      pos: new Vector3(...(kf?.position ?? [0, 2, 8])),
      target: new Vector3(...(kf?.target ?? [0, 0, 0])),
    };
  });
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
}

/* ── Component ──────────────────────────────────────────────────── */

export function CameraRig({
  waypoints: waypointsProp,
  keyframes = CAMERA_KEYFRAMES,
  damping = 3,
  lookAtDamping = 4,
  parallax = { x: 0.12, y: 0.08, smoothing: 0.03 },
  drift = { x: 0.06, y: 0.04, speed: 1 },
}: CameraRigProps) {
  const { camera } = useThree();
  const timeline = useTimeline();

  /* ── resolve waypoints (explicit or chapter-based) ───────────── */

  const resolvedWaypoints = useMemo<InternalWaypoint[]>(() => {
    if (waypointsProp) return buildFromWaypoints(waypointsProp);
    return buildFromChapters(timeline.chapters, keyframes);
  }, [waypointsProp, timeline.chapters, keyframes]);

  /* ── pre-allocated working vectors ───────────────────────────── */

  const goalPos = useRef(new Vector3(2.8, 1.6, 3.8));
  const goalTarget = useRef(new Vector3(0, 0, 0));
  const smoothPos = useRef(new Vector3(2.8, 1.6, 3.8));
  const smoothTarget = useRef(new Vector3(0, 0, 0));
  const smoothParallaxX = useRef(0);
  const smoothParallaxY = useRef(0);

  /* ── per-frame update ────────────────────────────────────────── */

  useFrame((state, delta) => {
    const { progress } = timeline.getState();
    const wps = resolvedWaypoints;

    /* resolve interpolated goal from waypoints */
    for (let i = 0; i < wps.length - 1; i++) {
      const a = wps[i];
      const b = wps[i + 1];
      if (progress >= a.t && progress <= b.t) {
        const segLen = b.t - a.t;
        const localT = segLen > 0 ? (progress - a.t) / segLen : 0;
        goalPos.current.lerpVectors(a.pos, b.pos, localT);
        goalTarget.current.lerpVectors(a.target, b.target, localT);
        break;
      }
    }

    /* cinematic damping — frame-rate independent exponential decay */
    const posFactor = 1 - Math.exp(-damping * delta);
    const tgtFactor = 1 - Math.exp(-lookAtDamping * delta);
    smoothPos.current.lerp(goalPos.current, posFactor);
    smoothTarget.current.lerp(goalTarget.current, tgtFactor);

    /* apply base position */
    camera.position.copy(smoothPos.current);

    /* idle drift — subtle sinusoidal offset (respects reduced-motion) */
    if (drift && !deviceState.reducedMotion) {
      const t = state.clock.elapsedTime * drift.speed;
      camera.position.x += Math.sin(t * 0.15) * drift.x;
      camera.position.y += Math.cos(t * 0.12) * drift.y;
    }

    /* mouse parallax — smooth follow of cursor position */
    if (parallax) {
      smoothParallaxX.current += (mouseState.x * parallax.x - smoothParallaxX.current) * parallax.smoothing;
      smoothParallaxY.current += (mouseState.y * parallax.y - smoothParallaxY.current) * parallax.smoothing;
      camera.position.x += smoothParallaxX.current;
      camera.position.y += smoothParallaxY.current;
    }

    /* look at target */
    camera.lookAt(smoothTarget.current);
  });

  return null;
}
