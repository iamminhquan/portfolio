/**
 * Ground plane that receives shadows from the 3D model.
 */

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  );
}
