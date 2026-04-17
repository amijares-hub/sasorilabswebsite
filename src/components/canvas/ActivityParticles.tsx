import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '../../store/useExperienceStore';

interface ActivityParticlesProps {
  count?: number;
}

/**
 * ActivityParticles
 * A high-performance point cloud that reacts to real-time logs via Zustand.
 * Implementation uses BufferGeometry for GPU optimization.
 */
export function ActivityParticles({ count = 3000 }: ActivityParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  // Detect mobile for performance optimization
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);
  const actualCount = isMobile ? 800 : count;
  
  // Select only the activityLevel to prevent unnecessary re-renders
  const activityLevel = useExperienceStore((state) => state.activityLevel);

  // Generate initial particle positions in a hollow sphere/cloud
  const particles = useMemo(() => {
    const temp = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
        const i3 = i * 3;
        const radius = 4 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        temp[i3] = radius * Math.sin(phi) * Math.cos(theta);
        temp[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        temp[i3 + 2] = radius * Math.cos(phi);
    }
    return temp;
  }, [actualCount]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Dynamic pulsing logic based on backend activity level
    const basePulse = Math.sin(time * 2);
    const activityPulse = Math.sin(time * (10 * activityLevel));
    const finalPulse = 1 + (basePulse * 0.05) + (activityPulse * 0.15 * activityLevel);
    
    meshRef.current.scale.set(finalPulse, finalPulse, finalPulse);
    
    // Rotation acceleration based on activity
    meshRef.current.rotation.y += 0.002 + (activityLevel * 0.05);
    meshRef.current.rotation.z += 0.001 + (activityLevel * 0.02);

    // Disable expensive HSL lerping on mobile to save GPU cycles
    if (!isMobile) {
      const material = meshRef.current.material as THREE.PointsMaterial;
      material.color.lerpHSL(
          new THREE.Color(activityLevel > 0.5 ? "#FF0000" : "#E20613"), 
          0.1
      );
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#E20613" // Brand Vinotinto/Red
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
