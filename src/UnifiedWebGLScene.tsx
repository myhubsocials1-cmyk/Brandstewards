import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Theme = {
  colors: string[];
  opacity: number;
};

type UnifiedWebGLSceneProps = {
  activeSection: string;
  themes: Record<string, Theme>;
  videoUrl: string;
};

const FIELD_SIZE = 64;
const SECTION_TRANSITION_MODES: Record<string, number> = {
  hero: 0,
  about: 1,
  services: 2,
  'core-values': 1,
  testimonials: 0,
  contact: 2,
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform sampler2D uVideo;
  uniform sampler2D uVideoFrom;
  uniform sampler2D uField;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uInk;
  uniform float uTime;
  uniform float uHover;
  uniform float uPress;
  uniform float uPulse;
  uniform float uPresence;
  uniform float uOpacity;
  uniform float uSectionBlend;
  uniform float uScrollVelocity;
  uniform float uAudioEnergy;
  uniform float uQuality;
  uniform float uWebGPUReady;
  uniform float uReduceMotion;
  uniform float uTransitionMode;
  uniform float uVideoMix;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 screenRatio, vec2 imageRatio) {
    vec2 ratio = screenRatio / imageRatio;
    vec2 scale = ratio.x < ratio.y ? vec2(1.0, ratio.y / ratio.x) : vec2(ratio.x / ratio.y, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  float softNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 pixelUv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    vec2 pointer = uPointer;
    vec2 delta = uv - pointer;
    delta.x *= aspect;

    vec4 field = texture2D(uField, uv);
    vec2 fieldVelocity = (field.rg * 2.0 - 1.0) * field.a;
    float fieldEnergy = field.a;

    float speed = clamp(length(uVelocity) * 22.0 + fieldEnergy * 1.8, 0.0, 1.0);
    float lensRadius = mix(0.16, 0.088, uHover) * mix(1.0, 0.82, uPress);
    float lens = exp(-dot(delta, delta) / max(0.0001, lensRadius * lensRadius));
    lens *= uPresence;

    vec2 tangent = vec2(-delta.y, delta.x);
    float reactiveEnergy = clamp(uAudioEnergy * 0.55 + abs(uScrollVelocity) * 0.35 + uSectionBlend * 0.45, 0.0, 1.0);
    vec2 refractVec = normalize(delta + 0.0001) * lens * (0.028 + speed * 0.026 + reactiveEnergy * 0.01);
    refractVec += tangent * lens * (0.008 + speed * 0.02);
    refractVec += fieldVelocity * (0.055 + uPulse * 0.035 + uAudioEnergy * 0.018);
    refractVec.y += uScrollVelocity * 0.018 * (0.35 + fieldEnergy);
    refractVec *= mix(1.0, 0.2, uReduceMotion);

    vec2 videoUv = coverUv(uv + refractVec, uResolution.xy, vec2(16.0, 9.0));
    vec2 fromVideoUv = coverUv(uv + refractVec * 0.62 + fieldVelocity * 0.018, uResolution.xy, vec2(16.0, 9.0));
    vec3 fromVideo = texture2D(uVideoFrom, fromVideoUv).rgb;
    vec3 toVideo = texture2D(uVideo, videoUv).rgb;
    float easedVideoMix = smoothstep(0.08, 0.98, uVideoMix);
    easedVideoMix = easedVideoMix * easedVideoMix * (3.0 - 2.0 * easedVideoMix);
    float videoTravel = sin(easedVideoMix * 3.14159);
    float videoMist = softNoise(uv * 3.0 + uTime * 0.045) * 0.08;
    float videoTransitionCoord = uv.y * 0.58 + uv.x * 0.18 + sin(uv.x * 3.0 + uTime * 0.26) * 0.018 + fieldEnergy * 0.035 + videoMist;
    float videoTransitionMask = smoothstep(-0.62, 1.42, videoTransitionCoord + (easedVideoMix - 0.5) * 1.05);
    float videoBlend = mix(easedVideoMix, videoTransitionMask, videoTravel * 0.16 * (1.0 - uReduceMotion));
    vec3 video = mix(fromVideo, toVideo, clamp(videoBlend, 0.0, 1.0));
    float luma = dot(video, vec3(0.2126, 0.7152, 0.0722));
    vec3 grade = mix(uInk, uColorA, smoothstep(0.12, 0.86, luma));
    grade = mix(grade, uColorB, smoothstep(0.58, 1.0, luma) * 0.42);
    vec3 scene = mix(video, grade, 0.36);

    float glassLine = pow(max(0.0, 1.0 - abs(delta.y * 5.3 + delta.x * 1.35)), 7.0) * lens;
    float glassCut = pow(max(0.0, 1.0 - abs(delta.x * 4.2 - delta.y * 0.8)), 11.0) * lens;
    float caustic = (glassLine * 0.6 + glassCut * 0.36) * (0.45 + uHover * 0.7 + uPress * 0.45);
    vec3 lensColor = mix(vec3(0.88, 1.0, 0.72), vec3(1.0, 0.58, 0.16), uHover);
    scene += lensColor * caustic;
    scene += mix(uColorA, uColorB, 0.5 + 0.5 * sin(uTime * 1.6)) * uAudioEnergy * 0.035;
    scene = mix(scene, scene + vec3(0.08, 0.12, 0.055), lens * 0.22);

    float vignette = smoothstep(0.92, 0.18, length((uv - 0.5) * vec2(aspect, 1.0)));
    float grain = softNoise(pixelUv * uResolution.xy + uTime) - 0.5;
    scene += grain * (0.012 + uQuality * 0.01);
    scene *= 0.72 + vignette * 0.52;

    float transitionSweepA = uv.y + sin(uv.x * 6.0 + uTime * 1.15) * 0.04 + uScrollVelocity * 0.08;
    float transitionSweepB = (uv.x + uv.y) * 0.58 + sin((uv.x - uv.y) * 9.0 + uTime * 0.9) * 0.035 + uScrollVelocity * 0.05;
    float radial = length((uv - 0.5) * vec2(aspect, 1.0));
    float transitionSweepC = 1.0 - uv.y + sin(radial * 14.0 - uTime * 0.8) * 0.035 - uScrollVelocity * 0.05;
    float modeB = smoothstep(0.5, 1.5, uTransitionMode);
    float modeC = smoothstep(1.5, 2.5, uTransitionMode);
    float transitionSweep = mix(transitionSweepA, transitionSweepB, modeB);
    transitionSweep = mix(transitionSweep, transitionSweepC, modeC);
    float transitionWave = smoothstep(-0.22, 0.86, transitionSweep);
    float veil = transitionWave * uSectionBlend * (1.0 - uReduceMotion);
    vec3 transitionGrade = mix(uColorA, uColorB, 0.44 + 0.18 * sin(uv.y * 3.14159 + uTime + uTransitionMode));
    scene = mix(scene, mix(scene, transitionGrade, 0.28), veil * 0.48);
    scene += vec3(0.1, 0.14, 0.07) * veil * (0.65 + uWebGPUReady * 0.18);

    float alpha = clamp(uOpacity + lens * 0.18 + fieldEnergy * 0.1 + veil * 0.05 + uAudioEnergy * 0.02, 0.72, 0.98);
    gl_FragColor = vec4(scene, alpha);
  }
`;

type VideoLayer = {
  disposed: boolean;
  texture: THREE.VideoTexture;
  url: string;
  video: HTMLVideoElement;
};

function createVideoLayer(url: string): VideoLayer {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.src = url;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return { disposed: false, texture, url, video };
}

function disposeVideoLayer(layer: VideoLayer | null | undefined) {
  if (!layer || layer.disposed) return;
  layer.disposed = true;
  layer.texture.dispose();
  layer.video.pause();
  layer.video.removeAttribute('src');
  layer.video.load();
}

function useVideoTextureBlend(url: string, fallback: THREE.Texture) {
  const [currentLayer, setCurrentLayer] = useState<VideoLayer | null>(null);
  const currentLayerRef = useRef<VideoLayer | null>(null);
  const previousLayerRef = useRef<VideoLayer | null>(null);
  const pendingLayerRef = useRef<VideoLayer | null>(null);
  const videoMixRef = useRef(1);

  useEffect(() => {
    currentLayerRef.current = currentLayer;
  }, [currentLayer]);

  useEffect(() => {
    let cancelled = false;
    const layer = createVideoLayer(url);
    pendingLayerRef.current = layer;

    const promoteLayer = () => {
      if (cancelled || pendingLayerRef.current !== layer) {
        disposeVideoLayer(layer);
        return;
      }

      setCurrentLayer((previous) => {
        if (previous?.url === layer.url) {
          disposeVideoLayer(layer);
          return previous;
        }

        if (previous) {
          disposeVideoLayer(previousLayerRef.current);
          previousLayerRef.current = previous;
          videoMixRef.current = 0;
        } else {
          videoMixRef.current = 1;
        }

        return layer;
      });
    };

    const start = async () => {
      try {
        await layer.video.play();
      } catch {
        // Autoplay can be delayed until the first gesture; the texture still becomes valid once playback starts.
      }
      promoteLayer();
    };

    start();

    return () => {
      cancelled = true;
      if (pendingLayerRef.current === layer) pendingLayerRef.current = null;
      window.setTimeout(() => {
        if (currentLayerRef.current !== layer && previousLayerRef.current !== layer) {
          disposeVideoLayer(layer);
        }
      }, 0);
    };
  }, [url]);

  useEffect(() => {
    return () => {
      disposeVideoLayer(pendingLayerRef.current);
      disposeVideoLayer(previousLayerRef.current);
      disposeVideoLayer(currentLayerRef.current);
    };
  }, []);

  const currentTexture = currentLayer?.texture ?? fallback;
  const previousTexture = previousLayerRef.current?.texture ?? currentTexture;

  return { currentTexture, previousLayerRef, previousTexture, videoMixRef };
}

function SceneMesh({ activeSection, themes, videoUrl }: UnifiedWebGLSceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size } = useThree();

  const fallbackTexture = useMemo(() => {
    const data = new Uint8Array([29, 45, 25, 255]);
    const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const field = useMemo(() => {
    const data = new Uint8Array(FIELD_SIZE * FIELD_SIZE * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128;
      data[i + 1] = 128;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
    const texture = new THREE.DataTexture(data, FIELD_SIZE, FIELD_SIZE, THREE.RGBAFormat);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return { data, texture };
  }, []);

  const { currentTexture, previousLayerRef, previousTexture, videoMixRef } = useVideoTextureBlend(videoUrl, fallbackTexture);
  const targetPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const previousPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const framePreviousPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const hover = useRef(0);
  const targetHover = useRef(0);
  const press = useRef(0);
  const targetPress = useRef(0);
  const pulse = useRef(0);
  const sectionBlend = useRef(0);
  const scrollVelocity = useRef(0);
  const audioEnergy = useRef(0);
  const targetAudioEnergy = useRef(0);
  const transitionMode = useRef(0);
  const quality = useRef(1);
  const webGPUReady = useRef(0);
  const presence = useRef(1);
  const targetPresence = useRef(1);
  const reduceMotion = useRef(false);
  const magnetTarget = useRef<HTMLElement | null>(null);

  const uniforms = useMemo(
    () => ({
      uVideo: { value: currentTexture },
      uVideoFrom: { value: previousTexture },
      uField: { value: field.texture },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#7eb622') },
      uColorB: { value: new THREE.Color('#f39200') },
      uInk: { value: new THREE.Color('#11150f') },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uPress: { value: 0 },
      uPulse: { value: 0 },
      uPresence: { value: 1 },
      uOpacity: { value: 0.9 },
      uSectionBlend: { value: 0 },
      uScrollVelocity: { value: 0 },
      uAudioEnergy: { value: 0 },
      uQuality: { value: 1 },
      uWebGPUReady: { value: 0 },
      uReduceMotion: { value: 0 },
      uTransitionMode: { value: 0 },
      uVideoMix: { value: 1 },
    }),
    [currentTexture, field.texture, previousTexture, size.height, size.width],
  );

  useEffect(() => {
    uniforms.uVideo.value = currentTexture;
    uniforms.uVideoFrom.value = previousTexture;
  }, [currentTexture, previousTexture, uniforms]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.height, size.width, uniforms]);

  useEffect(() => {
    const theme = themes[activeSection] ?? themes.hero;
    uniforms.uColorA.value.set(theme.colors[0] ?? '#7eb622');
    uniforms.uColorB.value.set(theme.colors[1] ?? '#f39200');
    uniforms.uInk.value.set(theme.colors[2] ?? '#11150f');
    uniforms.uOpacity.value = Math.max(0.78, Math.min(0.96, 0.74 + theme.opacity));
    transitionMode.current = SECTION_TRANSITION_MODES[activeSection] ?? 0;
    uniforms.uTransitionMode.value = transitionMode.current;
    sectionBlend.current = 1;
  }, [activeSection, themes, uniforms]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      reduceMotion.current = media.matches;
      uniforms.uReduceMotion.value = media.matches ? 1 : 0;
    };
    updateMotion();
    media.addEventListener?.('change', updateMotion);
    return () => media.removeEventListener?.('change', updateMotion);
  }, [uniforms]);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    quality.current = coarse || dpr > 2 ? 0.62 : 1;
    uniforms.uQuality.value = quality.current;
    webGPUReady.current = 'gpu' in navigator ? 1 : 0;
    uniforms.uWebGPUReady.value = webGPUReady.current;
    document.documentElement.dataset.webgpu = webGPUReady.current ? 'ready' : 'fallback';
  }, [uniforms]);

  useEffect(() => {
    const scrollRoot = document.querySelector('main');
    let lastScroll = scrollRoot?.scrollTop ?? 0;
    let lastTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const next = scrollRoot?.scrollTop ?? 0;
      const dt = Math.max(16, now - lastTime);
      scrollVelocity.current = THREE.MathUtils.clamp((next - lastScroll) / dt, -3, 3);
      lastScroll = next;
      lastTime = now;
      document.documentElement.style.setProperty('--scroll-velocity', scrollVelocity.current.toFixed(3));
    };

    scrollRoot?.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollRoot?.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onAudioEnergy = (event: Event) => {
      targetAudioEnergy.current = THREE.MathUtils.clamp(Number((event as CustomEvent<number>).detail) || 0, 0, 1);
    };

    window.addEventListener('brand-audio-energy', onAudioEnergy);
    return () => window.removeEventListener('brand-audio-energy', onAudioEnergy);
  }, []);

  useEffect(() => {
    const resetMagnet = () => {
      if (!magnetTarget.current) return;
      magnetTarget.current.style.transform = '';
      magnetTarget.current.style.willChange = '';
      magnetTarget.current = null;
    };

    const splat = (x: number, y: number, vx: number, vy: number, strength: number) => {
      const cx = Math.round(x * (FIELD_SIZE - 1));
      const cy = Math.round(y * (FIELD_SIZE - 1));
      const radius = 5;
      for (let yy = -radius; yy <= radius; yy += 1) {
        for (let xx = -radius; xx <= radius; xx += 1) {
          const px = cx + xx;
          const py = cy + yy;
          if (px < 0 || py < 0 || px >= FIELD_SIZE || py >= FIELD_SIZE) continue;
          const falloff = Math.max(0, 1 - Math.sqrt(xx * xx + yy * yy) / radius);
          const index = (py * FIELD_SIZE + px) * 4;
          const energy = Math.min(255, field.data[index + 3] + 255 * falloff * strength);
          field.data[index] = THREE.MathUtils.clamp(128 + vx * 220 * falloff, 0, 255);
          field.data[index + 1] = THREE.MathUtils.clamp(128 + vy * 220 * falloff, 0, 255);
          field.data[index + 2] = THREE.MathUtils.clamp(field.data[index + 2] + 190 * falloff * pulse.current, 0, 255);
          field.data[index + 3] = energy;
        }
      }
      field.texture.needsUpdate = true;
    };

    const setPointerCss = (name: string, value: string) => {
      document.documentElement.style.setProperty(name, value);
      document.body.style.setProperty(name, value);
    };

    const syncPointerState = (event: PointerEvent) => {
      const x = event.clientX / Math.max(1, window.innerWidth);
      const y = 1 - event.clientY / Math.max(1, window.innerHeight);
      targetPointer.current.set(x, y);
      targetPresence.current = 1;
      setPointerCss('--pointer-x', `${event.clientX}px`);
      setPointerCss('--pointer-y', `${event.clientY}px`);
      setPointerCss('--pointer-xp', `${x * 100}%`);
      setPointerCss('--pointer-yp', `${(1 - y) * 100}%`);

      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('a, button, input, textarea, select, [data-cursor="hover"]')
        : null;
      targetHover.current = target ? 1 : 0;

      if (target !== magnetTarget.current) resetMagnet();
      if (target) {
        const rect = target.getBoundingClientRect();
        const dx = THREE.MathUtils.clamp((event.clientX - rect.left - rect.width / 2) * 0.08, -7, 7);
        const dy = THREE.MathUtils.clamp((event.clientY - rect.top - rect.height / 2) * 0.08, -7, 7);
        target.style.willChange = 'transform';
        target.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        magnetTarget.current = target;
      }

      return { x, y };
    };

    const onPointerMove = (event: PointerEvent) => {
      const { x, y } = syncPointerState(event);
      const vx = x - previousPointer.current.x;
      const vy = y - previousPointer.current.y;
      previousPointer.current.set(x, y);
      splat(x, y, vx * 60, vy * 60, 0.95);
    };

    const onPointerDown = (event: PointerEvent) => {
      targetPress.current = 1;
      pulse.current = 1;
      if (event.pointerType === 'touch') pulse.current = 1.35;
      const { x, y } = syncPointerState(event);
      previousPointer.current.set(x, y);
      splat(x, y, 0, 0, event.pointerType === 'touch' ? 2.1 : 1.4);
    };

    const onPointerUp = () => {
      targetPress.current = 0;
      if (window.matchMedia('(pointer: coarse)').matches) {
        targetHover.current = 0;
        window.setTimeout(() => {
          targetPresence.current = 0;
        }, 1200);
      }
      resetMagnet();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    window.addEventListener('blur', resetMagnet);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', resetMagnet);
      resetMagnet();
    };
  }, [field]);

  useFrame((_, delta) => {
    pointer.current.lerp(targetPointer.current, reduceMotion.current ? 0.42 : 0.18);
    velocity.current
      .set(pointer.current.x - framePreviousPointer.current.x, pointer.current.y - framePreviousPointer.current.y)
      .multiplyScalar(delta > 0 ? 1 / delta : 1);
    framePreviousPointer.current.copy(pointer.current);

    hover.current = THREE.MathUtils.lerp(hover.current, targetHover.current, 0.16);
    press.current = THREE.MathUtils.lerp(press.current, targetPress.current, 0.22);
    pulse.current *= reduceMotion.current ? 0.72 : 0.9;
    sectionBlend.current *= reduceMotion.current ? 0.35 : 0.92;
    videoMixRef.current = THREE.MathUtils.lerp(videoMixRef.current, 1, reduceMotion.current ? 0.42 : 0.024);
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, 0, 0.06);
    audioEnergy.current = THREE.MathUtils.lerp(audioEnergy.current, targetAudioEnergy.current, 0.08);
    presence.current = THREE.MathUtils.lerp(presence.current, targetPresence.current, 0.08);

    for (let i = 0; i < field.data.length; i += 4) {
      field.data[i] = THREE.MathUtils.lerp(field.data[i], 128, 0.08);
      field.data[i + 1] = THREE.MathUtils.lerp(field.data[i + 1], 128, 0.08);
      field.data[i + 2] = THREE.MathUtils.lerp(field.data[i + 2], 0, 0.12);
      field.data[i + 3] = THREE.MathUtils.lerp(field.data[i + 3], 0, 0.07);
    }
    field.texture.needsUpdate = true;

    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uPointer.value.copy(pointer.current);
    material.uniforms.uVelocity.value.copy(velocity.current);
    material.uniforms.uHover.value = hover.current;
    material.uniforms.uPress.value = press.current;
    material.uniforms.uPulse.value = pulse.current;
    material.uniforms.uPresence.value = presence.current;
    material.uniforms.uSectionBlend.value = sectionBlend.current;
    material.uniforms.uScrollVelocity.value = scrollVelocity.current;
    material.uniforms.uAudioEnergy.value = audioEnergy.current;
    material.uniforms.uQuality.value = quality.current;
    material.uniforms.uWebGPUReady.value = webGPUReady.current;
    material.uniforms.uTransitionMode.value = transitionMode.current;
    material.uniforms.uVideoMix.value = videoMixRef.current;
    if (videoMixRef.current > 0.998 && previousLayerRef.current) {
      disposeVideoLayer(previousLayerRef.current);
      previousLayerRef.current = null;
      material.uniforms.uVideoFrom.value = material.uniforms.uVideo.value;
    }
  });

  useEffect(() => {
    return () => {
      fallbackTexture.dispose();
      field.texture.dispose();
    };
  }, [fallbackTexture, field.texture]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[{ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false }]}
      />
    </mesh>
  );
}

export default function UnifiedWebGLScene(props: UnifiedWebGLSceneProps) {
  const maxDpr = typeof window === 'undefined'
    ? 1.5
    : window.matchMedia('(pointer: coarse)').matches || window.devicePixelRatio > 2
      ? 1.15
      : 1.5;

  return (
    <Canvas
      className="brand-webgl-canvas"
      dpr={[1, maxDpr]}
      frameloop="always"
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <SceneMesh {...props} />
    </Canvas>
  );
}
