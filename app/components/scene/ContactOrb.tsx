/**
 * Animated glowing orb that fades in during the Contact section.
 * Features a pulsing core, a glow shell, and orbiting particles.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh, Group, MeshStandardMaterial } from "three";
import { scrollState } from "../config/sections";

export function ContactOrb() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<MeshStandardMaterial>(null);
  const glowMatRef = useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current || !coreMatRef.current) return;
    const time = state.clock.elapsedTime;

    // Fade in near end of projects / contact section (progress ≥ 0.85)
    // Adjusted for 800vh page (contact starts at ~progress 1.0)
    const progress = scrollState.progress;
    let targetOpacity = 0;
    if (progress >= 0.85) {
      targetOpacity = Math.min(1, (progress - 0.85) / 0.12);
    }

    coreMatRef.current.opacity = MathUtils.lerp(
      coreMatRef.current.opacity,
      targetOpacity,
      0.08
    );
    groupRef.current.visible = coreMatRef.current.opacity > 0.01;

    if (glowMatRef.current) {
      glowMatRef.current.opacity = coreMatRef.current.opacity * 0.3;
    }

    // Floating motion
    groupRef.current.position.y = 1.5 + Math.sin(time * 0.8) * 0.2;
    groupRef.current.position.x = 2 + Math.cos(time * 0.5) * 0.15;
    groupRef.current.position.z = -1 + Math.sin(time * 0.6) * 0.1;

    // Pulse scale
    const pulse = 1 + Math.sin(time * 2) * 0.08;
    coreRef.current.scale.setScalar(pulse);

    // Rotate
    groupRef.current.rotation.y = time * 0.3;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={0.8}
          transparent
          opacity={0}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>

      {/* Glow shell */}
      <mesh scale={1.5}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          ref={glowMatRef}
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={0.3}
          transparent
          opacity={0}
          side={2} /* DoubleSide */
        />
      </mesh>

      {/* Orbiting particles */}
      {[0, 1, 2].map((i) => (
        <OrbParticle key={i} index={i} />
      ))}
    </group>
  );
}

/* ── tiny orbiting sphere ──────────────────────────────────────── */

const ORB_COLORS = ["#ff6b8c", "#8cff6b", "#ffcf6b"];

function OrbParticle({ index }: { index: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const angle = (index / 3) * Math.PI * 2 + time * (1 + index * 0.3);
    const radius = 0.45 + index * 0.05;

    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.y = Math.sin(angle * 0.7) * 0.15;
    ref.current.position.z = Math.sin(angle) * radius;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={ORB_COLORS[index]}
        emissive={ORB_COLORS[index]}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
