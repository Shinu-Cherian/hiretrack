import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Core3D() {
  const meshRef = useRef(null);
  const pointsRef = useRef(null);

  // Generate particles for the background constellation effect
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       positions[i * 3] = (Math.random() - 0.5) * 15;
       positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
       positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6044" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5bd9d9" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
          <MeshDistortMaterial
            color="#1e2020"
            speed={2}
            distort={0.4}
            metalness={0.8}
            roughness={0.2}
            emissive="#ff6044"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>

      <Points ref={pointsRef} positions={particles}>
        <PointMaterial
          transparent
          color="#ffb4a6"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  );
}
