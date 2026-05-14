import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Custom GLSL Shader for that "Elite" glow
const ParticleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#FF6044") },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uScroll: { value: 0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    uniform vec3 uMouse;
    attribute float size;
    varying vec3 vColor;
    
    void main() {
      vec3 pos = position;
      
      // Storytelling Morph: From Nebula to Grid
      float morph = smoothstep(0.0, 0.5, uScroll);
      
      // Nebula movement (Noise-like)
      pos.x += sin(pos.z * 0.2 + uTime * 0.5) * 10.0 * (1.0 - morph);
      pos.y += cos(pos.x * 0.2 + uTime * 0.5) * 10.0 * (1.0 - morph);
      
      // Grid alignment on scroll
      vec3 gridPos = vec3(
        floor(pos.x / 40.0) * 40.0,
        floor(pos.y / 40.0) * 40.0,
        floor(pos.z / 40.0) * 40.0
      );
      pos = mix(pos, gridPos, morph * 0.8);

      // Mouse Interaction (Push)
      float dist = distance(pos, uMouse * 300.0);
      if (dist < 100.0) {
        pos += normalize(pos - uMouse * 300.0) * (100.0 - dist) * 0.5;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.0, 0.5, r);
      gl_FragColor = vec4(uColor, alpha * 0.6);
    }
  `
};

function SceneParticles({ scrollProgress }) {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();
  
  const count = 6000;
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 600;
      s[i] = Math.random() * 4 + 1;
    }
    return [pos, s];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#FF6044") },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uScroll: { value: 0 },
  }), []);

  useFrame((state) => {
    const { clock } = state;
    meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    meshRef.current.material.uniforms.uScroll.value = scrollProgress;
    
    // Smooth mouse follow
    const targetMouseX = mouse.x;
    const targetMouseY = mouse.y;
    meshRef.current.material.uniforms.uMouse.value.x += (targetMouseX - meshRef.current.material.uniforms.uMouse.value.x) * 0.05;
    meshRef.current.material.uniforms.uMouse.value.y += (targetMouseY - meshRef.current.material.uniforms.uMouse.value.y) * 0.05;
    
    // Slight auto-rotation
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.x += 0.0005;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        args={[ParticleShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3DScene({ scrollProgress = 0 }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 500], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneParticles scrollProgress={scrollProgress} />
        <PerspectiveCamera makeDefault position={[0, 0, 600]} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
