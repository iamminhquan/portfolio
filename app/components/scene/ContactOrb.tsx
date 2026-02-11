/**
 * Animated glowing orb that fades in during the Contact section.
 *
 * ── Migration notes ───────────────────────────────────────────────
 * Visibility is now driven by useChapterProgress("contact") instead
 * of reading scrollState.progress directly. Fade timing is extracted
 * to the CONTACT_ORB config in animation.config.ts.
 *
 * Time-based motion (float, pulse, rotation) is unchanged —
 * it runs off the clock, not the timeline.
 *
 * Performance: all mutation in useFrame via refs. Zero re-renders.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh, Group, MeshStandardMaterial } from "three";

import { useChapterProgress } from "./Hooks/useChapterProgress";
import { CONTACT_ORB } from "../config/animation.config";

export function ContactOrb() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<MeshStandardMaterial>(null);
  const glowMatRef = useRef<MeshStandardMaterial>(null);

  /* ── timeline hook (stable getter, no re-render) ────────────── */
  const getContact = useChapterProgress("contact");

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current || !coreMatRef.current) return;
    const time = state.clock.elapsedTime;

    /* ── fade in via chapter progress + config ─────────────────── */
    const contactT = getContact();
    const range = CONTACT_ORB.fadeEnd - CONTACT_ORB.fadeStart;
    const targetOpacity = range > 0
      ? MathUtils.clamp((contactT - CONTACT_ORB.fadeStart) / range, 0, 1)
      : contactT > 0 ? 1 : 0;

    coreMatRef.current.opacity = MathUtils.lerp(
      coreMatRef.current.opacity,
      targetOpacity,
      0.08,
    );
    groupRef.current.visible = coreMatRef.current.opacity > 0.01;

    if (glowMatRef.current) {
      glowMatRef.current.opacity = coreMatRef.current.opacity * 0.3;
    }

    /* ── floating motion (time-based) ──────────────────────────── */
    groupRef.current.position.y = 1.8 + Math.sin(time * 0.6) * 0.12;
    groupRef.current.position.x = 1.5 + Math.cos(time * 0.4) * 0.1;
    groupRef.current.position.z = -2.5 + Math.sin(time * 0.5) * 0.08;

    /* ── gentle pulse (time-based) ─────────────────────────────── */
    const pulse = 1 + Math.sin(time * 1.5) * 0.04;
    coreRef.current.scale.setScalar(pulse);

    /* ── rotation (time-based) ─────────────────────────────────── */
    groupRef.current.rotation.y = time * 0.3;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={0.5}
          transparent
          opacity={0}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>

      {/* Glow shell */}
      <mesh scale={1.8}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          ref={glowMatRef}
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={0.15}
          transparent
          opacity={0}
          side={2}
        />
      </mesh>

      {/* Orbiting particles */}
      {[0, 1, 2].map((i) => (
        <OrbParticle key={i} index={i} />
      ))}
    </group>
  );
}

/* ── tiny orbiting sphere (time-based only) ────────────────────── */

const ORB_COLORS = ["#ff6b8c", "#8cff6b", "#ffcf6b"];

function OrbParticle({ index }: { index: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const angle = (index / 3) * Math.PI * 2 + time * (1 + index * 0.3);
    const radius = 0.3 + index * 0.04;

    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.y = Math.sin(angle * 0.7) * 0.15;
    ref.current.position.z = Math.sin(angle) * radius;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial
        color={ORB_COLORS[index]}
        emissive={ORB_COLORS[index]}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
