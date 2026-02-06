/**
 * Section configuration and shared scroll state.
 * Defines camera positions, model parameters, and the mutable scroll
 * interpolation state shared between the 3D scene and the scroll handler.
 */

import { Vector3 } from "three";

export const SECTIONS = [
  {
    id: "hero",
    camera: new Vector3(3, 3, 3),
    modelRotation: 0,
    modelScale: 1,
  },
  {
    id: "about",
    camera: new Vector3(4, 2, 4),
    modelRotation: Math.PI * 0.5,
    modelScale: 1.2,
  },
  {
    id: "work",
    camera: new Vector3(2, 4, 3),
    modelRotation: Math.PI,
    modelScale: 0.9,
  },
  {
    id: "contact",
    camera: new Vector3(3, 1.5, 5),
    modelRotation: Math.PI * 1.5,
    modelScale: 1.1,
  },
];

export const scrollState = {
  progress: 0,
  targetProgress: 0,
  section: 0,
};
