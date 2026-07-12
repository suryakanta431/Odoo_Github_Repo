import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';

function EcoIsland({ score }) {
  const groupRef = useRef(null);

  const palette = useMemo(() => {
    if (score >= 80) {
      return {
        water: '#0f766e',
        land: '#34d399',
        accent: '#fde68a',
        glow: '#67e8f9',
      };
    }
    if (score >= 60) {
      return {
        water: '#1e3a8a',
        land: '#4ade80',
        accent: '#f59e0b',
        glow: '#38bdf8',
      };
    }
    return {
      water: '#0f172a',
      land: '#64748b',
      accent: '#fb923c',
      glow: '#f87171',
    };
  }, [score]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.9, 0.6, 6]} />
          <meshStandardMaterial color={palette.land} roughness={0.7} metalness={0.1} />
        </mesh>

        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.8, 1.4]} />
          <meshStandardMaterial color={palette.accent} roughness={0.4} />
        </mesh>

        <mesh position={[-1.2, 0.9, 0.4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.18, 1.2, 6]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        <mesh position={[1.1, 0.95, -0.8]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.18, 1.1, 6]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>

        <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.7, 1.25, 5]} />
          <meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={0.3} />
        </mesh>
      </Float>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.1, 48]} />
        <meshStandardMaterial color={palette.water} transparent opacity={0.85} />
      </mesh>

      <mesh position={[-2.1, 0.25, 1.4]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.7, 0.4]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[2.0, 0.2, 1.1]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.55, 0.35]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

export default function ESGScene({ score }) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-700/70 bg-slate-950/80">
      <Canvas camera={{ position: [0, 2.8, 6.3], fov: 38 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow />
        <pointLight position={[0, 3, 0]} intensity={2.1} color="#67e8f9" />
        <fog attach="fog" args={["#020617", 5, 16]} />
        <EcoIsland score={score} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
