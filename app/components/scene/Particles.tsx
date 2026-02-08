/**
 * Ambient floating particles that add atmosphere to the 3D scene.
 * Uses a points cloud with slow rotation for a subtle starfield effect.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, BufferAttribute } from "three";
import type { Points } from "three";

export function Particles({ count = 150 }: { count?: number }) {
  const ref = useRef<Points>(null);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        color="#6b8cff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}
