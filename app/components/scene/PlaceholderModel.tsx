/**
 * Placeholder 3D model composed of stacked geometric primitives.
 * Rotates, scales, and floats based on scroll-driven section transitions.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group } from "three";
import { SECTIONS, scrollState } from "../config/sections";

export function PlaceholderModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const totalSections = SECTIONS.length;
    const sectionProgress = scrollState.progress * (totalSections - 1);
    const currentSection = Math.floor(sectionProgress);
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    const t = sectionProgress - currentSection;

    const currentConfig = SECTIONS[currentSection];
    const nextConfig = SECTIONS[nextSection];

    // Interpolate rotation
    const targetRotation = MathUtils.lerp(
      currentConfig.modelRotation,
      nextConfig.modelRotation,
      t
    );
    groupRef.current.rotation.y = targetRotation + time * 0.15;

    // Interpolate scale
    const targetScale = MathUtils.lerp(
      currentConfig.modelScale,
      nextConfig.modelScale,
      t
    );
    groupRef.current.scale.setScalar(targetScale);

    // Subtle floating
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#6b8cff" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ff6b8c" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}
