/**
 * Camera waypoint definitions.
 *
 * Each waypoint maps a global timeline progress (t) to a camera
 * position + lookAt target. The CameraRig interpolates linearly
 * between adjacent waypoints and applies cinematic damping on top.
 *
 * Waypoints are decoupled from chapters — you can place as many
 * as you need at any progress value. This allows fine-grained
 * camera control (e.g. subtle drift across a long chapter).
 *
 * Positions use [x, y, z] tuples to keep the config serialisable.
 */

export interface CameraKeyframe {
  /** World-space camera position. */
  position: [number, number, number];
  /** World-space point the camera looks at. */
  target: [number, number, number];
}

export interface CameraWaypoint {
  /** Global timeline progress (0 → 1). */
  t: number;
  /** World-space camera position. */
  position: [number, number, number];
  /** World-space point the camera looks at. */
  target: [number, number, number];
}

/**
 * Default waypoints matching the portfolio section layout.
 *
 * The projects chapter (0.43 → 0.86) has TWO waypoints to create
 * a subtle drift rather than a long interpolation toward contact.
 */
export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  // Hero — front-right view of reactor
  { t: 0.0,   position: [2.8, 1.6, 3.8], target: [0, 0, 0] },
  // About — wider angle, slight elevation
  { t: 0.14,  position: [4.0, 2.0, 3.0], target: [0, 0, 0] },
  // Skills — elevated overview
  { t: 0.29,  position: [2.5, 3.0, 4.5], target: [0, 0, 0] },
  // Projects start — pulled back, reactor as subtle background
  { t: 0.43,  position: [4.0, 2.2, 3.6], target: [0, 0, 0] },
  // Projects end — gentle drift over the long section
  { t: 0.85,  position: [3.9, 2.3, 3.7], target: [0, 0, 0] },
  // Contact — wider, slightly elevated
  { t: 0.86,  position: [4.2, 2.0, 5.5], target: [0, 0, 0] },
  // End hold
  { t: 1.0,   position: [4.2, 2.0, 5.5], target: [0, 0, 0] },
];

/**
 * Legacy chapter-keyed keyframes for backward compatibility
 * with the demo CinematicScene.
 */
export const CAMERA_KEYFRAMES: Record<string, CameraKeyframe> = {
  hero:     { position: [2.8, 1.6, 3.8], target: [0, 0, 0] },
  about:    { position: [4.0, 2.0, 3.0], target: [0, 0, 0] },
  skills:   { position: [2.5, 3.0, 4.5], target: [0, 0, 0] },
  projects: { position: [4.0, 2.2, 3.6], target: [0, 0, 0] },
  contact:  { position: [4.2, 2.0, 5.5], target: [0, 0, 0] },
  // Demo-only (CinematicScene uses these names)
  intro:    { position: [0, 2, 8],       target: [0, 0, 0] },
  toolkit:  { position: [3, 1, 5],       target: [0, 0, 0] },
};
