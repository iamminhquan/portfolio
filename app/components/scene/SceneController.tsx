/**
 * Controls camera transitions based on scroll progress.
 * Handles the intro animation, section-to-section interpolation,
 * idle camera drift, and smooth mouse parallax.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import { SECTIONS, scrollState, mouseState, deviceState } from "../config/sections";

export function SceneController() {
  const { camera } = useThree();
  const introProgress = useRef(0);
  const smoothParallaxX = useRef(0);
  const smoothParallaxY = useRef(0);

  useFrame((state, delta) => {
    /* ── smooth scroll interpolation ───────────────────────── */
    scrollState.progress = MathUtils.lerp(
      scrollState.progress,
      scrollState.targetProgress,
      0.08,
    );

    const t = state.clock.elapsedTime;
    const totalSections = SECTIONS.length;
    const sp = scrollState.progress * (totalSections - 1);
    const cur = Math.floor(sp);
    const nxt = Math.min(cur + 1, totalSections - 1);
    const frac = sp - cur;

    const currentConfig = SECTIONS[cur];
    const nextConfig = SECTIONS[nxt];

    /* ── intro animation ───────────────────────────────────── */
    if (introProgress.current < 1) {
      introProgress.current = Math.min(
        introProgress.current + delta * 0.5,
        1,
      );
      const eased = 1 - Math.pow(1 - introProgress.current, 3);
      camera.position.lerpVectors(
        new Vector3(8, 6, 8),
        currentConfig.camera,
        eased,
      );
    } else {
      /* ── section-based camera transition ──────────────────── */
      camera.position.lerpVectors(
        currentConfig.camera,
        nextConfig.camera,
        frac,
      );
    }

    /* ── idle camera drift (subtle sinusoidal) ─────────────── */
    if (!deviceState.reducedMotion) {
      const driftX = Math.sin(t * 0.15) * 0.06;
      const driftY = Math.cos(t * 0.12) * 0.04;
      camera.position.x += driftX;
      camera.position.y += driftY;
    }

    /* ── mouse parallax (smooth) ───────────────────────────── */
    smoothParallaxX.current = MathUtils.lerp(
      smoothParallaxX.current,
      mouseState.x * 0.12,
      0.03,
    );
    smoothParallaxY.current = MathUtils.lerp(
      smoothParallaxY.current,
      mouseState.y * 0.08,
      0.03,
    );
    camera.position.x += smoothParallaxX.current;
    camera.position.y += smoothParallaxY.current;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
