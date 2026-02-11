/**
 * ReactorCore — futuristic energy device centerpiece.
 *
 * ── Migration notes ───────────────────────────────────────────────
 * All scroll-driven animation now reads from the timeline system:
 *   - Rotation + scale: useWaypointValue(REACTOR_WAYPOINTS, key)
 *   - No direct scroll access — all data flows through timeline hooks.
 *
 * Time-based animation (core pulse, shell spin, ring orbits, glow)
 * is NOT timeline-driven — it uses the clock and respects reducedMotion.
 *
 * Mouse reactivity uses the shared mouseState store (input, not scroll).
 *
 * Performance: all mutation happens in useFrame; React never re-renders.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

import { mouseState, deviceState } from "../config/sections";
import { useWaypointValue } from "./Hooks/useWaypointValue";
import { REACTOR_WAYPOINTS } from "../config/animation.config";

export function HeroModel() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const shell1Ref = useRef<Mesh>(null);
  const shell2Ref = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  /* ── timeline-driven values (stable getters, no re-render) ──── */

  const getRotation = useWaypointValue(REACTOR_WAYPOINTS, "rotation");
  const getScale = useWaypointValue(REACTOR_WAYPOINTS, "scale");

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const speed = deviceState.reducedMotion ? 0 : 1;

    /* ── scroll-driven rotation & scale (via timeline) ─────────── */
    groupRef.current.rotation.y = getRotation() + t * 0.08 * speed;
    groupRef.current.scale.setScalar(getScale());

    /* ── gentle float ──────────────────────────────────────────── */
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.06 * speed;

    /* ── mouse reactivity (input-driven, not scroll) ───────────── */
    const mx = mouseState.x * 0.12;
    const my = mouseState.y * 0.12;
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      my,
      0.04,
    );
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      -mx,
      0.04,
    );

    /* ── core pulse (time-based) ───────────────────────────────── */
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.03 * speed;
      coreRef.current.scale.setScalar(pulse);
    }

    /* ── shell rotations (time-based) ──────────────────────────── */
    if (shell1Ref.current) {
      shell1Ref.current.rotation.x = t * 0.15 * speed;
      shell1Ref.current.rotation.z = t * 0.1 * speed;
    }
    if (shell2Ref.current) {
      shell2Ref.current.rotation.y = -t * 0.12 * speed;
      shell2Ref.current.rotation.x = t * 0.08 * speed;
    }

    /* ── ring orbits (time-based) ──────────────────────────────── */
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.2 * speed;
    if (ring2Ref.current) ring2Ref.current.rotation.y = t * 0.18 * speed;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.15 * speed;

    /* ── glow breath (time-based) ──────────────────────────────── */
    if (glowRef.current) {
      const glow = 1 + Math.sin(t * 1.2) * 0.1 * speed;
      glowRef.current.scale.setScalar(glow);
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Inner core — glowing icosahedron ─────────────────── */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          color="#8aafff"
          emissive="#6b8cff"
          emissiveIntensity={2.5}
          metalness={0.3}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* ── Core glow halo ───────────────────────────────────── */}
      <mesh ref={glowRef} scale={2}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color="#6b8cff"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* ── Wireframe shell 1 — icosahedron ──────────────────── */}
      <mesh ref={shell1Ref}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#4fd1ff"
          emissive="#4fd1ff"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>

      {/* ── Wireframe shell 2 — dodecahedron ─────────────────── */}
      <mesh ref={shell2Ref}>
        <dodecahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={0.35}
          wireframe
          transparent
          opacity={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* ── Energy ring 1 ────────────────────────────────────── */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.05, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#4fd1ff"
          emissive="#4fd1ff"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* ── Energy ring 2 ────────────────────────────────────── */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.25, 0.006, 16, 100]} />
        <meshStandardMaterial
          color="#6b8cff"
          emissive="#6b8cff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {/* ── Energy ring 3 ────────────────────────────────────── */}
      <mesh ref={ring3Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.45, 0.005, 16, 100]} />
        <meshStandardMaterial
          color="#8aafff"
          emissive="#8aafff"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* ── Floating data nodes ──────────────────────────────── */}
      {!deviceState.isMobile &&
        Array.from({ length: 8 }).map((_, i) => (
          <DataNode key={i} index={i} />
        ))}
    </group>
  );
}

/* ── small orbiting data node (time-based only, no scroll) ─────── */

function DataNode({ index }: { index: number }) {
  const ref = useRef<Mesh>(null);
  const baseAngle = (index / 8) * Math.PI * 2;
  const radius = 0.95 + (index % 3) * 0.25;
  const yOffset = ((index % 4) - 1.5) * 0.25;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const speed = deviceState.reducedMotion ? 0 : 0.08 + index * 0.015;
    const angle = baseAngle + t * speed;

    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 0.4 + index) * 0.1;
    ref.current.rotation.x = t * 0.25;
    ref.current.rotation.y = t * 0.18;
  });

  const size = 0.02 + (index % 3) * 0.012;
  const isAccent = index % 3 === 0;

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[size]} />
      <meshStandardMaterial
        color={isAccent ? "#4fd1ff" : "#6b8cff"}
        emissive={isAccent ? "#4fd1ff" : "#6b8cff"}
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </mesh>
  );
}
