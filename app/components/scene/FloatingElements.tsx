/**
 * Floating geometric elements visible during the About and Skills sections.
 * Represents skills and creativity through abstract shapes that fade in/out
 * based on scroll progress.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh, MeshStandardMaterial } from "three";
import { scrollState } from "../config/sections";

/* ── individual floating shape ──────────────────────────────────── */

interface FloatingShapeProps {
  position: [number, number, number];
  geometry: "box" | "octahedron" | "icosahedron" | "tetrahedron" | "torus";
  color: string;
  size: number;
  speed: number;
  offset: number;
}

function FloatingShape({
  position,
  geometry,
  color,
  size,
  speed,
  offset,
}: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const time = state.clock.elapsedTime;

    // Visibility: fade in during about/skills sections (progress ~0.10–0.65)
    const progress = scrollState.progress;
    let targetOpacity = 0;

    if (progress >= 0.1 && progress <= 0.7) {
      if (progress < 0.2) {
        targetOpacity = (progress - 0.1) / 0.1;
      } else if (progress > 0.6) {
        targetOpacity = 1 - (progress - 0.6) / 0.1;
      } else {
        targetOpacity = 1;
      }
    }

    matRef.current.opacity = MathUtils.lerp(
      matRef.current.opacity,
      targetOpacity,
      0.08
    );
    meshRef.current.visible = matRef.current.opacity > 0.01;

    // Float + drift
    meshRef.current.position.y =
      position[1] + Math.sin(time * speed + offset) * 0.3;
    meshRef.current.position.x =
      position[0] + Math.cos(time * speed * 0.7 + offset) * 0.15;

    // Spin
    meshRef.current.rotation.x = time * speed * 0.5;
    meshRef.current.rotation.y = time * speed * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {geometry === "box" && <boxGeometry args={[size, size, size]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[size]} />}
      {geometry === "icosahedron" && <icosahedronGeometry args={[size, 0]} />}
      {geometry === "tetrahedron" && <tetrahedronGeometry args={[size]} />}
      {geometry === "torus" && (
        <torusGeometry args={[size, size * 0.3, 16, 32]} />
      )}
      <meshStandardMaterial
        ref={matRef}
        color={color}
        metalness={0.6}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.15}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

/* ── group of floating elements ─────────────────────────────────── */

export function FloatingElements() {
  const shapes = useMemo<FloatingShapeProps[]>(
    () => [
      {
        position: [-2.5, 1.5, -1],
        geometry: "octahedron",
        color: "#6b8cff",
        size: 0.15,
        speed: 0.8,
        offset: 0,
      },
      {
        position: [2.8, 0.8, 1.5],
        geometry: "box",
        color: "#ff6b8c",
        size: 0.12,
        speed: 1.0,
        offset: 1,
      },
      {
        position: [-1.5, 2.2, 2],
        geometry: "icosahedron",
        color: "#8cff6b",
        size: 0.13,
        speed: 0.7,
        offset: 2,
      },
      {
        position: [1.8, 1.8, -2],
        geometry: "tetrahedron",
        color: "#ffcf6b",
        size: 0.14,
        speed: 0.9,
        offset: 3,
      },
      {
        position: [-3, 0.5, 0.5],
        geometry: "torus",
        color: "#ff8c6b",
        size: 0.1,
        speed: 0.6,
        offset: 4,
      },
      {
        position: [3, 1.2, -0.5],
        geometry: "octahedron",
        color: "#8c6bff",
        size: 0.11,
        speed: 1.1,
        offset: 5,
      },
      {
        position: [-0.5, 2.5, -2.5],
        geometry: "box",
        color: "#6bffc4",
        size: 0.09,
        speed: 0.75,
        offset: 6,
      },
      {
        position: [0.5, 0.3, 3],
        geometry: "icosahedron",
        color: "#ff6bda",
        size: 0.12,
        speed: 0.85,
        offset: 7,
      },
    ],
    []
  );

  return (
    <group>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
    </group>
  );
}
