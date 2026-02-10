"use client";

/**
 * Main Scene component.
 * Orchestrates the fixed 3D canvas (with mouse/scroll tracking,
 * performance detection, studio lighting, and post-processing)
 * and the scrollable HTML sections.
 */

import { useEffect, Suspense, useState, startTransition } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import { scrollState, mouseState, deviceState } from "./config/sections";
import { SceneController } from "./scene/SceneController";
import { HeroModel } from "./scene/HeroModel";
import { FloatingElements } from "./scene/FloatingElements";
import { ContactOrb } from "./scene/ContactOrb";
import { Particles } from "./scene/Particles";
import { Ground } from "./scene/Ground";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ContactSection } from "./sections/ContactSection";
import { styles } from "./styles/styles";

/* ── loading fallback shown while the canvas initialises ────────── */

function CanvasFallback() {
  return (
    <mesh>
      <boxGeometry args={[0, 0, 0]} />
    </mesh>
  );
}

/* ── root component ─────────────────────────────────────────────── */

export default function Scene() {
  const [isLowPerf, setIsLowPerf] = useState(false);

  /* performance + reduced-motion detection */
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memory = (navigator as any).deviceMemory || 8;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lowPerf = false;

    if (isMobile || cores <= 2 || memory <= 2) {
      deviceState.performance = "low";
      deviceState.isMobile = true;
      lowPerf = true;
    } else if (cores <= 4 || memory <= 4) {
      deviceState.performance = "medium";
    }

    if (isMobile) deviceState.isMobile = true;

    deviceState.reducedMotion = mq.matches;
    if (mq.matches) {
      deviceState.performance = "low";
      lowPerf = true;
    }

    /* deferred state update avoids synchronous cascade */
    if (lowPerf) startTransition(() => setIsLowPerf(true));

    const onMqChange = (e: MediaQueryListEvent) => {
      deviceState.reducedMotion = e.matches;
    };
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  /* scroll tracking */
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollState.targetProgress =
        maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* mouse tracking (normalised –1 … 1) */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Fixed 3D Canvas */}
      <div style={styles.canvasWrapper}>
        <Canvas
          shadows={!isLowPerf}
          camera={{ position: [8, 6, 8], fov: 45 }}
          dpr={isLowPerf ? 1 : [1, 1.5]}
          gl={{ antialias: true }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* ── Studio lighting ────────────────────────────── */}
          <ambientLight intensity={0.06} color="#1a1a3e" />

          {/* Key light — warm neutral */}
          <directionalLight
            position={[5, 8, 3]}
            intensity={0.7}
            color="#fff5e6"
            castShadow={!isLowPerf}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.0001}
          />

          {/* Rim light — cool blue accent */}
          <directionalLight
            position={[-3, 2, -4]}
            intensity={0.5}
            color="#4fd1ff"
          />

          {/* Fill — soft accent */}
          <directionalLight
            position={[0, -2, 5]}
            intensity={0.15}
            color="#6b8cff"
          />

          {/* Core glow point light */}
          <pointLight
            position={[0, 0.5, 0]}
            intensity={1.2}
            color="#6b8cff"
            distance={6}
            decay={2}
          />

          {/* ── Scene objects ──────────────────────────────── */}
          <SceneController />
          <Environment preset="night" background={false} />

          <Suspense fallback={<CanvasFallback />}>
            <HeroModel />
            <FloatingElements />
            <ContactOrb />
          </Suspense>

          {!isLowPerf && <Particles count={250} />}
          <Ground />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />

          {/* ── Post-processing ────────────────────────────── */}
          {!isLowPerf && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.4}
                luminanceSmoothing={0.3}
                intensity={0.7}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.15} darkness={0.65} />
            </EffectComposer>
          )}
        </Canvas>
      </div>

      {/* Scrollable HTML Sections */}
      <main style={styles.main}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
