/**
 * Ultra-subtle ground plane for ambient shadow catching.
 * No visible grid — preserves the deep-space aesthetic.
 */

export function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.3, 0]}
      receiveShadow
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#060610"
        metalness={0.1}
        roughness={0.95}
      />
    </mesh>
  );
}
