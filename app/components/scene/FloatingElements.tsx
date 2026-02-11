/**
 * Ambient wireframe fragments orbiting the reactor core.
 *
 * ── Migration notes ───────────────────────────────────────────────
 * Visibility is now driven by the timeline system via the envelope()
 * utility and the FRAGMENT_ENVELOPE config. No direct scroll access.
 *
 * Each fragment also reacts to timeline velocity — orbital speed
 * increases subtly when the user is actively scrolling, creating
 * an intentional "the scene is alive" feel.
 *
 * Performance: opacity and position are mutated in useFrame via refs.
 * The fragment array is memoised and never re-created.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh, MeshStandardMaterial } from "three";

import { useTimeline } from "./Timeline";
import { envelope } from "./Hooks/easing";
import { FRAGMENT_ENVELOPE } from "../config/animation.config";

/* ── cool monochrome palette ─────────────────────────── */

const FRAG_COLORS = ["#4fd1ff", "#6b8cff", "#8aafff"];

/* ── per-fragment configuration ──────────────────────── */

interface FragmentCfg {
  radius: number;
  eccentricity: number;
  speed: number;
  tilt: number;
  startAngle: number;
  yBase: number;
  yBob: number;
  yFreq: number;
  size: number;
  geo: "octahedron" | "icosahedron";
  colorIdx: number;
  emissive: number;
  peakOpacity: number;
}

/* ── single orbiting fragment ────────────────────────── */

function Fragment({ cfg }: { cfg: FragmentCfg }) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const { getState } = useTimeline();

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;
    const { progress, velocity } = getState();

    /* ── visibility envelope from config (no hardcoded ranges) ── */
    const vis = envelope(
      progress,
      [FRAGMENT_ENVELOPE.fadeInStart, FRAGMENT_ENVELOPE.fadeInEnd],
      [FRAGMENT_ENVELOPE.fadeOutStart, FRAGMENT_ENVELOPE.fadeOutEnd],
    );

    matRef.current.opacity = MathUtils.lerp(
      matRef.current.opacity,
      vis * cfg.peakOpacity,
      0.06,
    );
    meshRef.current.visible = matRef.current.opacity > 0.005;

    /* ── orbital speed reacts to scroll velocity ── */
    const velocityBoost = 1 + Math.abs(velocity) * 8;

    /* ── elliptical orbit ── */
    const angle = cfg.startAngle + t * cfg.speed * velocityBoost;
    meshRef.current.position.x = Math.cos(angle) * cfg.radius;
    meshRef.current.position.z =
      Math.sin(angle) * cfg.radius * cfg.eccentricity;

    /* vertical: base height + gentle bob + orbital tilt */
    meshRef.current.position.y =
      cfg.yBase +
      Math.sin(t * cfg.yFreq + cfg.startAngle) * cfg.yBob +
      Math.sin(angle) * cfg.tilt * cfg.radius * 0.3;

    /* ── slow coherent tumble ── */
    meshRef.current.rotation.x = t * cfg.speed * 0.8;
    meshRef.current.rotation.z = t * cfg.speed * 0.5;
  });

  const color = FRAG_COLORS[cfg.colorIdx % FRAG_COLORS.length];

  return (
    <mesh ref={meshRef}>
      {cfg.geo === "octahedron" ? (
        <octahedronGeometry args={[cfg.size, 0]} />
      ) : (
        <icosahedronGeometry args={[cfg.size, 0]} />
      )}
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={cfg.emissive}
        wireframe
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── fragment group ──────────────────────────────────── */

export function FloatingElements() {
  const fragments = useMemo<FragmentCfg[]>(
    () => [
      /* ── close ring — brighter, slightly larger ── */
      {
        radius: 1.7,
        eccentricity: 0.85,
        speed: 0.045,
        tilt: 0.12,
        startAngle: 0,
        yBase: 0.6,
        yBob: 0.12,
        yFreq: 0.3,
        size: 0.07,
        geo: "octahedron",
        colorIdx: 0,
        emissive: 0.7,
        peakOpacity: 0.3,
      },
      {
        radius: 1.9,
        eccentricity: 0.9,
        speed: 0.035,
        tilt: -0.08,
        startAngle: Math.PI * 1.1,
        yBase: 0.9,
        yBob: 0.1,
        yFreq: 0.25,
        size: 0.055,
        geo: "icosahedron",
        colorIdx: 1,
        emissive: 0.55,
        peakOpacity: 0.25,
      },
      /* ── mid ring — medium presence ── */
      {
        radius: 2.6,
        eccentricity: 0.82,
        speed: 0.03,
        tilt: 0.18,
        startAngle: Math.PI * 0.4,
        yBase: 1.4,
        yBob: 0.18,
        yFreq: 0.22,
        size: 0.06,
        geo: "octahedron",
        colorIdx: 1,
        emissive: 0.5,
        peakOpacity: 0.22,
      },
      {
        radius: 2.4,
        eccentricity: 0.88,
        speed: 0.025,
        tilt: -0.14,
        startAngle: Math.PI * 1.6,
        yBase: 0.2,
        yBob: 0.14,
        yFreq: 0.2,
        size: 0.05,
        geo: "icosahedron",
        colorIdx: 2,
        emissive: 0.45,
        peakOpacity: 0.2,
      },
      /* ── far ring — faint, atmospheric ── */
      {
        radius: 3.3,
        eccentricity: 0.78,
        speed: 0.02,
        tilt: 0.22,
        startAngle: Math.PI * 0.8,
        yBase: 0.5,
        yBob: 0.1,
        yFreq: 0.18,
        size: 0.04,
        geo: "octahedron",
        colorIdx: 2,
        emissive: 0.35,
        peakOpacity: 0.15,
      },
      {
        radius: 3.5,
        eccentricity: 0.75,
        speed: 0.018,
        tilt: -0.1,
        startAngle: Math.PI * 1.9,
        yBase: 1.8,
        yBob: 0.08,
        yFreq: 0.15,
        size: 0.035,
        geo: "icosahedron",
        colorIdx: 0,
        emissive: 0.3,
        peakOpacity: 0.12,
      },
    ],
    [],
  );

  return (
    <group>
      {fragments.map((cfg, i) => (
        <Fragment key={i} cfg={cfg} />
      ))}
    </group>
  );
}
