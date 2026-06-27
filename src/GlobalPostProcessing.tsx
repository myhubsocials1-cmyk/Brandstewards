import React from 'react';

export default function GlobalPostProcessing() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-30">
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <filter id="chromaticAberration">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="red" />
          <feOffset dx="2" dy="0" in="red" result="redShift" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="SourceGraphic" result="green" />
          <feOffset dx="-2" dy="0" in="green" result="greenShift" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="SourceGraphic" result="blue" />
          <feBlend mode="screen" in="redShift" in2="greenShift" result="rg" />
          <feBlend mode="screen" in="rg" in2="blue" />
        </filter>
      </svg>
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ filter: 'url(#noiseFilter)', opacity: 0.8 }} 
      />
      {/* Edge chromatic aberration overlay */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.8) 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.5
        }}
      />
    </div>
  );
}
