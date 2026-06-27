import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float u_time;
attribute float size;
varying vec3 vColor;

void main() {
  vColor = color;
  vec3 pos = position;
  
  // Add some slow floating motion
  pos.x += sin(u_time * 0.5 + pos.y) * 0.1;
  pos.y += cos(u_time * 0.3 + pos.x) * 0.1;
  pos.z += sin(u_time * 0.4 + pos.z) * 0.1;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size * (30.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.2, dist) * 0.6;
  gl_FragColor = vec4(vColor, alpha);
}
`;

function Particles({ count = 200, color = "#f39200" }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      baseColor.toArray(col, i * 3);
      sz[i] = Math.random() * 5.0 + 2.0;
    }
    return [pos, col, sz];
  }, [count, color]);

  const uniforms = useMemo(() => ({
    u_time: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleCloud({ 
  color, 
  className = "" 
}: { 
  color: string, 
  className?: string 
}) {
  return (
    <div className={`${className} pointer-events-none`}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Particles color={color} count={150} />
      </Canvas>
    </div>
  );
}
