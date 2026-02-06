/**
 * Controls camera transitions based on scroll progress.
 * Handles the intro animation and section-to-section camera interpolation.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import { SECTIONS, scrollState } from "../config/sections";

export function SceneController() {
  const { camera } = useThree();
  const introProgress = useRef(0);

  useFrame((_, delta) => {
    scrollState.progress = MathUtils.lerp(
      scrollState.progress,
      scrollState.targetProgress,
      0.08
    );

    const totalSections = SECTIONS.length;
    const sectionProgress = scrollState.progress * (totalSections - 1);
    const currentSection = Math.floor(sectionProgress);
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    const t = sectionProgress - currentSection;

    const currentConfig = SECTIONS[currentSection];
    const nextConfig = SECTIONS[nextSection];

    // Intro animation
    if (introProgress.current < 1) {
      introProgress.current = Math.min(introProgress.current + delta * 0.5, 1);
      const eased = 1 - Math.pow(1 - introProgress.current, 3);
      camera.position.lerpVectors(
        new Vector3(8, 6, 8),
        currentConfig.camera,
        eased
      );
    } else {
      // Section-based camera transition
      camera.position.lerpVectors(currentConfig.camera, nextConfig.camera, t);
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}
