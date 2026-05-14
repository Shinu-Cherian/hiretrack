import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function TechGlobe() {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Very slow, majestic rotation
      groupRef.current.rotation.y = time * 0.05;
      // Slight wobble
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base Globe */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#080909"
          emissive="#0a0a0a"
          roughness={0.7}
          metalness={0.8}
        />
      </Sphere>

      {/* Wireframe overlay for 'Tech' feel */}
      <Sphere args={[2.02, 32, 32]}>
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.05} 
        />
      </Sphere>

      {/* Glowing Orbital Ring 1 */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#FF6044" transparent opacity={0.3} />
      </mesh>

      {/* Glowing Orbital Ring 2 */}
      <mesh rotation={[Math.PI / -2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function Globe3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={2} color="#FF6044" />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#ffffff" />
        <TechGlobe />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
}
