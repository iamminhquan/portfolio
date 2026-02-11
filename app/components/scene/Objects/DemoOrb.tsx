/**
 * DemoOrb — proof-of-concept component demonstrating the timeline architecture.
 *
 * This orb reacts to each chapter differently:
 *
 *   Intro    → gentle vertical float (sine-wave driven by chapter progress)
 *   Toolkit  → accelerated rotation (spin-up proportional to chapter progress)
 *   Projects → pulsing scale + emissive intensity ramp
 *
 * All animation is driven by the hook system:
 *   - useChapterProgress  → per-chapter 0→1 getters
 *   - useCinematicLerp    → smoothed derived values stored in refs
 *
 * No component reads scroll directly. React never re-renders this component
 * during animation — everything is mutated in useFrame.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type Mesh, type MeshStandardMaterial, MathUtils } from "three";

import { useChapterProgress } from "../Hooks/useChapterProgress";
import { useCinematicLerp } from "../Hooks/useCinematicLerp";

export function DemoOrb() {
  const meshRef = useRef<Mesh>(null!);

  /* ── chapter progress getters (stable references, no re-render) ─ */

  const getIntro    = useChapterProgress("intro");
  const getToolkit  = useChapterProgress("toolkit");
  const getProjects = useChapterProgress("projects");

  /* ── smoothed derived values ─────────────────────────────────── */

  // Scale pulses up during the projects chapter.
  const smoothScale    = useCinematicLerp(1.0, 1.35, getProjects, 4);
  // Emissive intensity rises during toolkit.
  const smoothEmissive = useCinematicLerp(0.3, 0.9, getToolkit, 3);

  /* ── per-frame mutations ─────────────────────────────────────── */

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    /* base rotation — always turning slowly */
    mesh.rotation.y += 0.15 * delta;

    /* intro: gentle vertical float (sine arc over chapter progress) */
    const introT = getIntro();
    mesh.position.y = MathUtils.lerp(0, Math.sin(introT * Math.PI) * 0.4, introT);

    /* toolkit: spin-up — rotation speed scales with chapter progress */
    const toolkitT = getToolkit();
    mesh.rotation.y += toolkitT * 2.5 * delta;
    mesh.rotation.x += toolkitT * 0.8 * delta;

    /* projects: pulsing scale on top of smooth base scale */
    const projectsT = getProjects();
    const pulse = 1 + Math.sin(projectsT * Math.PI * 4) * 0.08 * projectsT;
    mesh.scale.setScalar(smoothScale.current * pulse);

    /* toolkit: emissive intensity follows smoothed value */
    const mat = mesh.material as MeshStandardMaterial;
    if (mat.emissiveIntensity !== undefined) {
      mat.emissiveIntensity = smoothEmissive.current;
    }
  });

  /* ── geometry + material (renders once, never re-renders) ────── */

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.8, 3]} />
      <meshStandardMaterial
        color="#6b8cff"
        emissive="#2a4fff"
        emissiveIntensity={0.3}
        metalness={0.7}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}
