/**
 * Enhanced ground plane with a subtle grid overlay.
 * Color shifts slightly with scroll progress for atmosphere.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";
import { scrollState } from "../config/sections";

export function Ground() {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    const p = scrollState.progress;
    matRef.current.color.setRGB(0.08 + p * 0.02, 0.08 + p * 0.01, 0.12 + p * 0.03);
  });

  return (
    <>
      <mesh
        ref={ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          ref={matRef}
          color="#141420"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Subtle grid overlay */}
      <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -0.99, 0]} />
    </>
  );
}
