/**
 * Camera keyframe definitions.
 *
 * Each entry maps a chapter ID to a camera position + lookAt target.
 * The CameraRig interpolates through these keyframes as the global
 * timeline progresses.
 *
 * Positions use [x, y, z] tuples to keep the config serialisable
 * and free of Three.js imports. The CameraRig converts them to
 * Vector3s at initialisation time.
 */

export interface CameraKeyframe {
  /** World-space camera position. */
  position: [number, number, number];
  /** World-space point the camera looks at. */
  target: [number, number, number];
}

/**
 * Default keyframes matching the default chapter layout.
 *
 * Override by passing a custom record to <CameraRig keyframes={…}>.
 * Every chapter ID in your chapter config should have a matching entry.
 */
export const CAMERA_KEYFRAMES: Record<string, CameraKeyframe> = {
  intro:    { position: [0, 2, 8],     target: [0, 0, 0] },
  toolkit:  { position: [3, 1, 5],     target: [0, 0, 0] },
  projects: { position: [0, 0.5, 2.5], target: [0, 0, 0] },
};
