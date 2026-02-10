/**
 * Section configuration, scroll state, mouse state, and device state.
 * Defines camera positions, model parameters, and mutable shared state
 * used by both the 3D scene and the scroll/mouse handlers.
 */

import { Vector3 } from "three";

export const SECTIONS = [
  {
    id: "hero",
    camera: new Vector3(2.8, 1.6, 3.8),
    modelRotation: 0,
    modelScale: 1,
  },
  {
    id: "about",
    camera: new Vector3(4, 2, 3),
    modelRotation: Math.PI * 0.5,
    modelScale: 1.1,
  },
  {
    id: "skills",
    camera: new Vector3(2.5, 3, 4.5),
    modelRotation: Math.PI,
    modelScale: 0.85,
  },
  /* ── project sub-sections — camera pulled back, orb scaled down
       so the reactor becomes a background accent ──────────────── */
  {
    id: "projects-1",
    camera: new Vector3(4.0, 2.2, 3.6),
    modelRotation: Math.PI * 1.15,
    modelScale: 0.6,
  },
  {
    id: "projects-2",
    camera: new Vector3(3.8, 2.5, 3.9),
    modelRotation: Math.PI * 1.25,
    modelScale: 0.58,
  },
  {
    id: "projects-3",
    camera: new Vector3(4.2, 2.1, 3.4),
    modelRotation: Math.PI * 1.35,
    modelScale: 0.59,
  },
  {
    id: "projects-4",
    camera: new Vector3(3.9, 2.3, 3.7),
    modelRotation: Math.PI * 1.45,
    modelScale: 0.6,
  },
  {
    id: "contact",
    camera: new Vector3(4.2, 2.0, 5.5),
    modelRotation: Math.PI * 1.7,
    modelScale: 0.55,
  },
];

export const scrollState = {
  progress: 0,
  targetProgress: 0,
  section: 0,
};

export const mouseState = {
  x: 0,
  y: 0,
};

export const deviceState = {
  performance: "high" as "high" | "medium" | "low",
  isMobile: false,
  reducedMotion: false,
};
