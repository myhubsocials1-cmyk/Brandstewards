import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D u_texture;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Center coordinates for vortex
  vec2 center = vec2(0.5, 0.5);
  vec2 distVec = uv - center;
  float distToCenter = length(distVec);
  
  // Vortex pull effect
  float vortexStrength = 0.15;
  vec2 vortexUv = uv + distVec * (1.0 - distToCenter) * vortexStrength;
  
  // Calculate distance from mouse
  float dist = distance(uv, u_mouse);
  
  // Subtle mouse interaction ripple
  float ripple = sin(dist * 30.0 - u_time * 5.0) * 0.005 * smoothstep(0.5, 0.0, dist);
  
  // Apply displacement
  vec2 offset = vec2(ripple, 0.0);
  
  // Clean texture sample without chromatic aberration
  vec4 color = texture2D(u_texture, vortexUv + offset);
  
  // Apply a vignette
  float vignette = smoothstep(1.2, 0.3, distance(uv, vec2(0.5)));
  color.rgb *= vignette;
  
  gl_FragColor = color;
}
`;

function ShaderPlane({ videoUrl }: { videoUrl: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'Anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(e => console.error("Video play failed", e));

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    setVideoTexture(texture);

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      texture.dispose();
    };
  }, [videoUrl]);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_texture: { value: null },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useEffect(() => {
    if (videoTexture && materialRef.current) {
      materialRef.current.uniforms.u_texture.value = videoTexture;
    }
  }, [videoTexture]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Smoothly interpolate current mouse
    currentMouse.current.lerp(targetMouse.current, 0.05);

    materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.u_mouse.value.copy(currentMouse.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function FooterShaderBg({ 
  videoUrl, 
  className = "" 
}: { 
  videoUrl: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <ShaderPlane videoUrl={videoUrl} />
      </Canvas>
    </div>
  );
}
