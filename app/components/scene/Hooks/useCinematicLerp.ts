/**
 * useCinematicLerp — smoothly interpolates between two values driven by
 * a getter function, with an extra layer of exponential damping.
 *
 * The hook runs its own useFrame internally, so the consumer only needs
 * to read the returned ref's `.current` inside their own useFrame.
 *
 * This creates a two-stage pipeline:
 *   getT() → lerp(a, b, t) → damp toward target
 *
 * The damping produces buttery-smooth transitions even when the input
 * getter jumps (e.g. chapter boundaries).
 *
 * @param a       Value when getT() returns 0.
 * @param b       Value when getT() returns 1.
 * @param getT    A stable getter returning 0 → 1 (e.g. from useChapterProgress).
 * @param lambda  Exponential-decay constant (higher = faster catch-up).
 * @returns       A React ref whose `.current` updates every frame.
 *
 * @example
 * const getProjects = useChapterProgress("projects");
 * const smoothScale = useCinematicLerp(1.0, 1.3, getProjects, 5);
 *
 * useFrame(() => {
 *   mesh.current.scale.setScalar(smoothScale.current);
 * });
 */

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

export function useCinematicLerp(
  a: number,
  b: number,
  getT: () => number,
  lambda: number = 5,
): MutableRefObject<number> {
  const value = useRef(a);

  useFrame((_, delta) => {
    const target = MathUtils.lerp(a, b, getT());
    value.current = MathUtils.damp(value.current, target, lambda, delta);
  });

  return value;
}
