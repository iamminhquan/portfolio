/**
 * Cinematic starfield particles with two density layers.
 * Slow rotation for atmospheric depth in a deep-space backdrop.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, BufferAttribute } from "three";
import type { Points } from "three";
import { deviceState } from "../config/sections";

export function Particles({ count = 200 }: { count?: number }) {
  const layerOneRef = useRef<Points>(null);
  const layerTwoRef = useRef<Points>(null);

  /* bright sparse layer */
  const geo1 = useMemo(() => {
    const geo = new BufferGeometry();
    const n = Math.floor(count * 0.4);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 14 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  /* dim dense layer */
  const geo2 = useMemo(() => {
    const geo = new BufferGeometry();
    const n = Math.floor(count * 0.6);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = Math.random() * 18 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (deviceState.reducedMotion) return;
    const speed = state.clock.elapsedTime;
    if (layerOneRef.current) layerOneRef.current.rotation.y = speed * 0.008;
    if (layerTwoRef.current) layerTwoRef.current.rotation.y = speed * 0.004;
  });

  return (
    <>
      <points ref={layerOneRef} geometry={geo1}>
        <pointsMaterial
          size={0.018}
          color="#8aafff"
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>
      <points ref={layerTwoRef} geometry={geo2}>
        <pointsMaterial
          size={0.01}
          color="#4a5a8a"
          transparent
          opacity={0.25}
          sizeAttenuation
        />
      </points>
    </>
  );
}
