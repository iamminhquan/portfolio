"use client";

/**
 * Main Scene component.
 * Handles scroll tracking and assembles the fixed 3D canvas
 * with scrollable UI sections. All logic is delegated to sub-modules.
 */

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import { scrollState } from "./config/sections";
import { SceneController } from "./scene/SceneController";
import { PlaceholderModel } from "./scene/PlaceholderModel";
import { Ground } from "./scene/Ground";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { WorkSection } from "./sections/WorkSection";
import { ContactSection } from "./sections/ContactSection";
import { styles } from "./styles/styles";

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
