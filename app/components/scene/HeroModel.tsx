/**
 * Interactive hero 3D model that subtly reacts to mouse movement.
 * Composed of a central reflective sphere, orbiting torus rings,
 * floating satellite octahedrons, and a base platform.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";
import { SECTIONS, scrollState, mouseState } from "../config/sections";

export function HeroModel() {
  const groupRef = useRef<Group>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const totalSections = SECTIONS.length;
    const sectionProgress = scrollState.progress * (totalSections - 1);
    const currentSection = Math.floor(
      Math.min(sectionProgress, totalSections - 2)
    );
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    const t = sectionProgress - currentSection;

    const currentConfig = SECTIONS[currentSection];
    const nextConfig = SECTIONS[nextSection];

    // Interpolate rotation from scroll
    const targetRotation = MathUtils.lerp(
      currentConfig.modelRotation,
      nextConfig.modelRotation,
      t
    );
    groupRef.current.rotation.y = targetRotation + time * 0.12;

    // Interpolate scale
    const targetScale = MathUtils.lerp(
      currentConfig.modelScale,
      nextConfig.modelScale,
      t
    );
    groupRef.current.scale.setScalar(targetScale);

    // Subtle floating
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.1;

    // Mouse reactivity — tilt toward cursor
    const mouseInfluence = 0.15;
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseState.y * mouseInfluence,
      0.05
    );
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      -mouseState.x * mouseInfluence,
      0.05
    );

    // Animate orbiting rings
    if (ring1Ref.current) ring1Ref.current.rotation.x = time * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.y = time * 0.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = time * 0.3;

    // Core pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <mesh ref={coreRef} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#6b8cff"
          metalness={0.9}
          roughness={0.1}
          emissive="#6b8cff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Ring 1 — horizontal orbit */}
      <mesh ref={ring1Ref} castShadow>
        <torusGeometry args={[0.85, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#ff6b8c"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff6b8c"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Ring 2 — tilted orbit */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <torusGeometry args={[1.05, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#8cff6b"
          metalness={0.8}
          roughness={0.2}
          emissive="#8cff6b"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Ring 3 — vertical orbit */}
      <mesh ref={ring3Ref} rotation={[0, 0, Math.PI / 4]} castShadow>
        <torusGeometry args={[1.25, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#ffcf6b"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffcf6b"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Floating satellites */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Satellite
          key={i}
          index={i}
          baseAngle={(i / 6) * Math.PI * 2}
          radius={1.6 + (i % 2) * 0.3}
        />
      ))}

      {/* Base platform */}
      <mesh position={[0, -0.85, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.1, 32]} />
        <meshStandardMaterial
          color="#2a2a3a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

/* ── small orbiting octahedron ─────────────────────────────────── */

const SAT_COLORS = [
  "#6b8cff",
  "#ff6b8c",
  "#8cff6b",
  "#ffcf6b",
  "#ff8c6b",
  "#8c6bff",
];

function Satellite({
  index,
  baseAngle,
  radius,
}: {
  index: number;
  baseAngle: number;
  radius: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const speed = 0.2 + index * 0.05;
    const angle = baseAngle + time * speed;

    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = Math.sin(time * 0.8 + index) * 0.3;
    ref.current.rotation.x = time * (0.5 + index * 0.1);
    ref.current.rotation.y = time * (0.3 + index * 0.1);
  });

  const size = 0.06 + (index % 3) * 0.03;

  return (
    <mesh ref={ref} castShadow>
      <octahedronGeometry args={[size]} />
      <meshStandardMaterial
        color={SAT_COLORS[index]}
        metalness={0.7}
        roughness={0.3}
        emissive={SAT_COLORS[index]}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
