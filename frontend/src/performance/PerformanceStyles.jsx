export default function PerformanceStyles() {
  return (
    <style>{`
      main > section{content-visibility:auto;contain-intrinsic-size:900px}
      .career-reveal-section{will-change:auto!important}

      @media (max-width: 900px), (pointer: coarse){
        .hero-grid,.core-halo,.core-float,.orbit-a,.orbit-b,.orbit-c,.core-beam-a,.core-beam-b,.float-card-a,.float-card-b,.float-card-c,.float-card-d,.scan-surface,.data-fill,.model-layer{animation:none!important}
        .core-stage,.tilt-card{transform:none!important}
        .core-halo{filter:blur(12px)!important}
        .backdrop-blur-2xl{backdrop-filter:blur(10px)!important}
        .backdrop-blur-xl{backdrop-filter:blur(8px)!important}
      }

      @media (prefers-reduced-motion: reduce){
        .hero-grid,.core-halo,.core-float,.orbit-a,.orbit-b,.orbit-c,.core-beam-a,.core-beam-b,.float-card-a,.float-card-b,.float-card-c,.float-card-d,.scan-surface,.data-fill,.model-layer{animation:none!important}
      }
    `}</style>
  );
}
