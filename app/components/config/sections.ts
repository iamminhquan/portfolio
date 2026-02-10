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
  {
    id: "projects",
    camera: new Vector3(3.5, 2, 3),
    modelRotation: Math.PI * 1.3,
    modelScale: 0.95,
  },
  {
    id: "contact",
    camera: new Vector3(3, 1.5, 5),
    modelRotation: Math.PI * 1.7,
    modelScale: 1.05,
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
