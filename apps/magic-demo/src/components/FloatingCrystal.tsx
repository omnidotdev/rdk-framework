import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import type { Mesh } from "three";

interface FloatingCrystalProps {
  /**
   * Whether the animation is enabled.
   * @default false
   */
  isAnimated?: boolean;
  /** Color. */
  color?: string;
  /** Scale. */
  scale?: number;
}

/**
 * Animated crystal shape for world anchoring demonstration.
 */
const FloatingCrystal = ({
  isAnimated = false,
  color = "#4ecdc4",
  scale = 1,
}: FloatingCrystalProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!isAnimated || !meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;

    // Subtle floating motion
    meshRef.current.position.y = Math.sin(time * 1.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

export default FloatingCrystal;
