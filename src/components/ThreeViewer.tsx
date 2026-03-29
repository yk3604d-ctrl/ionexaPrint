import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url?: string }) {
  // If no URL, show a placeholder box
  if (!url) {
    return (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00f3ff" metalness={0.8} roughness={0.2} />
      </mesh>
    );
  }

  // In a real app, we'd use useSTLLoader or similar for .stl files
  // For this demo, we'll use a placeholder or a generic model if provided
  return (
    <mesh castShadow receiveShadow>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#00f3ff" metalness={0.8} roughness={0.2} wireframe />
    </mesh>
  );
}

export default function ThreeViewer({ stlUrl, className }: { stlUrl?: string; className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[300px] bg-dark-bg/50 rounded-xl overflow-hidden ${className}`}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <Model url={stlUrl} />
          </Stage>
          <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enablePan={false} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-white/40 font-mono">
        Interactive 3D Preview
      </div>
    </div>
  );
}
