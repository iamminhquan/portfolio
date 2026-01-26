"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { Group } from "three";

const TARGET_POSITION = new Vector3(3, 3, 3);

function CameraAnimation() {
  const { camera } = useThree();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (progress.current >= 1) return;

    progress.current = Math.min(progress.current + delta * 0.5, 1);
    const eased = 1 - Math.pow(1 - progress.current, 3);

    camera.position.lerpVectors(
      new Vector3(8, 6, 8),
      TARGET_POSITION,
      eased
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  );
}

function PlaceholderModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Base pedestal */}
      <mesh position={[0, -0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Middle section */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Main sphere */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#6b8cff" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Top accent */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ff6b8c" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 6, 8], fov: 50 }}
      style={{ width: "100%", height: "100vh" }}
    >
      <ambientLight intensity={0.15} color="#b0c4de" />
      {/* Key light */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0001}
        shadow-radius={1.5}
      />
      {/* Fill light */}
      <directionalLight
        position={[-4, 3, -2]}
        intensity={0.4}
        color="#a0c4ff"
      />

      <CameraAnimation />
      <Environment preset="studio" background={false} />
      <PlaceholderModel />
      <Ground />
      <OrbitControls />
    </Canvas>
  );
}
