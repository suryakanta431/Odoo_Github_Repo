import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';

function getPalette(score) {
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
}

function FallbackIsland({ score }) {
  const palette = useMemo(() => getPalette(score), [score]);

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.4}>
        <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.45, 2.1, 0.8, 28]} />
          <meshStandardMaterial color={palette.land} emissive={palette.glow} emissiveIntensity={0.16} />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.35, 1.1, 24]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.glow} emissiveIntensity={0.1} />
        </mesh>
      </Float>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.8, 48]} />
        <meshStandardMaterial color={palette.water} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function EcoIsland({ score }) {
  const groupRef = useRef(null);
  const { scene } = useGLTF('/island.glb');
  const islandScene = useMemo(() => scene.clone(), [scene]);
  const palette = useMemo(() => getPalette(score), [score]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={islandScene} scale={1.3} castShadow receiveShadow />
      </Float>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.1, 48]} />
        <meshStandardMaterial color={palette.water} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default function ESGScene({ score }) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-700/70 bg-slate-950/80">
      <Canvas camera={{ position: [0, 2.3, 6.1], fov: 38 }} shadows={{ type: 'soft' }} dpr={[1, 2]}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 6, 3]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-2.5, 2.2, -2.5]} intensity={0.7} color="#38bdf8" />
        <pointLight position={[0, 3.2, -2]} intensity={2.8} color="#67e8f9" />
        <pointLight position={[3.2, 1.5, 1.3]} intensity={1.2} color="#fde68a" />
        <fog attach="fog" args={["#020617", 5, 16]} />
        <Suspense fallback={<FallbackIsland score={score} />}>
          <EcoIsland score={score} />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          target={[0, 0.55, 0]}
          enableDamping
          dampingFactor={0.07}
          minDistance={4.2}
          maxDistance={8.5}
        />
      </Canvas>
    </div>
  );
}
