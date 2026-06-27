import { useEffect, useMemo, useRef } from 'react';
import { Howl } from 'howler';

type BrandAudioProps = {
  activeSection: string;
  enabled: boolean;
};

function makeAmbienceDataUri() {
  const sampleRate = 22050;
  const seconds = 3.5;
  const length = Math.floor(sampleRate * seconds);
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * bytesPerSample, true);

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const envelope = 0.22 + 0.08 * Math.sin(t * Math.PI * 2 * 0.23);
    const tone =
      Math.sin(t * Math.PI * 2 * 73.42) * 0.38 +
      Math.sin(t * Math.PI * 2 * 146.83) * 0.18 +
      Math.sin(t * Math.PI * 2 * 219.25) * 0.1 +
      Math.sin(t * Math.PI * 2 * 587.33) * 0.025 * Math.sin(t * Math.PI * 2 * 0.37);
    const shaped = Math.tanh(tone * envelope) * 0.2;
    view.setInt16(44 + i * bytesPerSample, shaped * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function makeAccentDataUri() {
  const sampleRate = 22050;
  const seconds = 0.42;
  const length = Math.floor(sampleRate * seconds);
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * bytesPerSample, true);

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 11.5);
    const tone =
      Math.sin(t * Math.PI * 2 * 493.88) * 0.26 +
      Math.sin(t * Math.PI * 2 * 987.77) * 0.12;
    const shaped = Math.tanh(tone * envelope) * 0.12;
    view.setInt16(44 + i * bytesPerSample, shaped * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export default function BrandAudio({ activeSection, enabled }: BrandAudioProps) {
  const soundRef = useRef<Howl | null>(null);
  const accentRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAccentRef = useRef(0);
  const dataUri = useMemo(makeAmbienceDataUri, []);
  const accentDataUri = useMemo(makeAccentDataUri, []);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [dataUri],
      loop: true,
      volume: 0,
      html5: false,
    });
    accentRef.current = new Howl({
      src: [accentDataUri],
      volume: 0.025,
      html5: false,
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      soundRef.current?.unload();
      accentRef.current?.unload();
      window.dispatchEvent(new CustomEvent('brand-audio-energy', { detail: 0 }));
    };
  }, [accentDataUri, dataUri]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    const profile = {
      hero: { volume: 0.12, rate: 0.96 },
      about: { volume: 0.1, rate: 0.9 },
      services: { volume: 0.14, rate: 1.04 },
      'core-values': { volume: 0.12, rate: 0.98 },
      testimonials: { volume: 0.09, rate: 0.88 },
      contact: { volume: 0.17, rate: 1.08 },
    }[activeSection] ?? { volume: 0.11, rate: 1 };
    const targetVolume = enabled ? profile.volume : 0;
    sound.rate(profile.rate);
    sound.fade(sound.volume(), targetVolume, 900);
  }, [activeSection, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.dispatchEvent(new CustomEvent('brand-audio-energy', { detail: 0 }));
      return;
    }

    const sectionWeight = {
      hero: 0.72,
      about: 0.54,
      services: 0.88,
      'core-values': 0.68,
      testimonials: 0.46,
      contact: 1,
    }[activeSection] ?? 0.62;

    const tick = () => {
      const t = performance.now() * 0.001;
      const energy = Math.max(0, Math.min(1, sectionWeight * (0.42 + Math.sin(t * 1.7) * 0.16 + Math.sin(t * 3.1) * 0.08)));
      window.dispatchEvent(new CustomEvent('brand-audio-energy', { detail: energy }));
      document.documentElement.style.setProperty('--audio-energy', energy.toFixed(3));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeSection, enabled]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (enabled && !sound.playing()) {
      sound.play();
      sound.fade(0, 0.13, 650);
    }
    if (!enabled && sound.playing()) {
      sound.fade(sound.volume(), 0, 350);
      window.setTimeout(() => sound.pause(), 380);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const playAccent = (event: Event) => {
      const target = event.target instanceof Element
        ? event.target.closest('a, button, [data-cursor="hover"]')
        : null;
      if (!target || !accentRef.current) return;

      const now = performance.now();
      if (now - lastAccentRef.current < 420) return;
      lastAccentRef.current = now;
      accentRef.current.rate(activeSection === 'services' ? 1.08 : activeSection === 'testimonials' ? 0.88 : 1);
      accentRef.current.volume(event.type === 'pointerdown' ? 0.035 : 0.018);
      accentRef.current.play();
    };

    document.addEventListener('pointerenter', playAccent, true);
    document.addEventListener('pointerdown', playAccent, true);
    return () => {
      document.removeEventListener('pointerenter', playAccent, true);
      document.removeEventListener('pointerdown', playAccent, true);
    };
  }, [activeSection, enabled]);

  return null;
}
