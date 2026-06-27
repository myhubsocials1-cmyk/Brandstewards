import { useRef, useMemo, useEffect } from 'react';
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
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform float u_opacity;

// Classic Perlin 3D Noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;

    vec2 noise_coord = st * 3.0;
    float n = cnoise(vec3(noise_coord, u_time * 0.2));
    float n2 = cnoise(vec3(noise_coord + 10.0, u_time * 0.3));
    
    vec2 distorted_st = st + vec2(n, n2) * 0.1;
    
    float wave = sin(distorted_st.y * 10.0 + u_time) * 0.5 + 0.5;
    float wave2 = sin(distorted_st.x * 8.0 - u_time * 1.5) * 0.5 + 0.5;
    
    vec2 m = u_mouse;
    m.x *= aspect;
    float dist = distance(st, m);
    float mouse_influence = smoothstep(0.4, 0.0, dist);
    
    float mix_factor = cnoise(vec3(distorted_st * 2.0, u_time * 0.1)) * 0.5 + 0.5;
    mix_factor += wave * 0.2 + wave2 * 0.2 + mouse_influence * 0.3;
    
    vec3 final_color = mix(u_color3, u_color1, smoothstep(0.0, 0.4, mix_factor));
    final_color = mix(final_color, u_color2, smoothstep(0.4, 0.7, mix_factor));
    final_color = mix(final_color, u_color4, smoothstep(0.7, 1.0, mix_factor));
    
    float alpha = (cnoise(vec3(st * 5.0, u_time)) * 0.5 + 0.5) * u_opacity + mouse_influence * 0.1;
    
    gl_FragColor = vec4(final_color, alpha);
}
`;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new THREE.Vector3(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : new THREE.Vector3(1,1,1);
};

function FluidDistortion({ 
  colors, 
  opacity 
}: { 
  colors: string[], 
  opacity: number 
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  
  const targetColors = useRef([
    hexToRgb(colors[0] || '#7eb622'),
    hexToRgb(colors[1] || '#f39200'),
    hexToRgb(colors[2] || '#1f2a1d'),
    hexToRgb(colors[3] || '#ffffff')
  ]);
  const targetOpacity = useRef(opacity);

  useEffect(() => {
    targetColors.current = [
      hexToRgb(colors[0] || '#7eb622'),
      hexToRgb(colors[1] || '#f39200'),
      hexToRgb(colors[2] || '#1f2a1d'),
      hexToRgb(colors[3] || '#ffffff')
    ];
    targetOpacity.current = opacity;
  }, [colors, opacity]);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: currentMouse.current },
      u_color1: { value: targetColors.current[0].clone() },
      u_color2: { value: targetColors.current[1].clone() },
      u_color3: { value: targetColors.current[2].clone() },
      u_color4: { value: targetColors.current[3].clone() },
      u_opacity: { value: targetOpacity.current },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    
    const handleResize = () => {
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [uniforms]);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    currentMouse.current.lerp(targetMouse.current, 0.05);

    const matUniforms = materialRef.current.uniforms;
    matUniforms.u_time.value = state.clock.elapsedTime;
    matUniforms.u_mouse.value.copy(currentMouse.current);
    
    // Smoothly interpolate colors and opacity
    matUniforms.u_color1.value.lerp(targetColors.current[0], 0.03);
    matUniforms.u_color2.value.lerp(targetColors.current[1], 0.03);
    matUniforms.u_color3.value.lerp(targetColors.current[2], 0.03);
    matUniforms.u_color4.value.lerp(targetColors.current[3], 0.03);
    matUniforms.u_opacity.value += (targetOpacity.current - matUniforms.u_opacity.value) * 0.03;
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
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function FluidDistortionBg({
  className = "",
  colors = ['#7eb622', '#f39200', '#1f2a1d', '#ffffff'],
  opacity = 0.08
}: {
  className?: string;
  colors?: string[];
  opacity?: number;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <FluidDistortion colors={colors} opacity={opacity} />
      </Canvas>
    </div>
  );
}
