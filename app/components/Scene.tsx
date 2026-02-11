"use client";

/**
 * Root Scene component.
 *
 * Orchestrates the fixed 3D canvas and scrollable HTML sections.
 * The TimelineController is the single source of truth for all
 * scroll-driven animation — no component reads scroll directly.
 *
 * ── Architecture ────────────────────────────────────────────────
 *
 *   <Canvas>
 *     <TimelineController>          ← captures scroll, smooths, resolves chapters
 *       <CameraRig waypoints />     ← interpolates camera through waypoints
 *       <HeroModel />               ← reactor core (timeline-driven rotation/scale)
 *       <FloatingElements />         ← fragments (timeline-driven visibility)
 *       <ContactOrb />              ← contact orb (chapter-driven fade)
 *       <DebugOverlay />            ← press 'D' to toggle timeline HUD
 *     </TimelineController>
 *   </Canvas>
 *
 *   <main>
 *     <HeroSection />  <AboutSection />  <SkillsSection />
 *     <ProjectsSection />  <ContactSection />
 *   </main>
 *
 * ── Data flow ───────────────────────────────────────────────────
 *
 *   window.scrollY → TimelineController → timeline context
 *     → CameraRig      (reads progress, interpolates waypoints)
 *     → HeroModel       (reads progress via useWaypointValue)
 *     → FloatingElements (reads progress via envelope)
 *     → ContactOrb      (reads chapter progress)
 *
 *   mousemove → mouseState (shared mutable store, NOT timeline)
 *     → CameraRig (parallax)
 *     → HeroModel  (reactivity)
 *
 * ── Performance notes ───────────────────────────────────────────
 *
 *   - deviceState detection runs once on mount (useEffect).
 *   - mouseState is written by a passive listener (no React state).
 *   - isLowPerf is the ONLY React state — controls conditional rendering
 *     of shadows, particles, and post-processing at mount time.
 *   - All per-frame animation runs in useFrame inside child components.
 */

import { useEffect, Suspense, useState, startTransition } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import { mouseState, deviceState } from "./config/sections";
import { TimelineController } from "./scene/Timeline";
import { CameraRig } from "./scene/Camera";
import { CAMERA_WAYPOINTS } from "./scene/Camera/camera.config";
import { HeroModel } from "./scene/HeroModel";
import { FloatingElements } from "./scene/FloatingElements";
import { ContactOrb } from "./scene/ContactOrb";
import { Particles } from "./scene/Particles";
import { Ground } from "./scene/Ground";
import { DebugOverlay } from "./scene/Objects/DebugOverlay";
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

  /* ── performance + reduced-motion detection (runs once) ──────── */
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

    if (lowPerf) startTransition(() => setIsLowPerf(true));

    const onMqChange = (e: MediaQueryListEvent) => {
      deviceState.reducedMotion = e.matches;
    };
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  /* ── mouse tracking (normalised –1 … 1) — NOT scroll ────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /*
   * NOTE: No scroll listener here.
   * Scroll capture is handled internally by TimelineController.
   */

  return (
    <>
      {/* ── Fixed 3D Canvas ─────────────────────────────────────── */}
      <div style={styles.canvasWrapper}>
        <Canvas
          shadows={!isLowPerf}
          camera={{ position: [8, 6, 8], fov: 45 }}
          dpr={isLowPerf ? 1 : [1, 1.5]}
          gl={{ antialias: true }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* ── Timeline boundary ───────────────────────────────── */}
          {/*
            Everything inside <TimelineController> can access the
            timeline via useTimeline(). Scroll is captured here and
            smoothed with frame-rate-independent exponential damping.
          */}
          <TimelineController>
            {/* Camera — interpolates waypoints + parallax + drift */}
            <CameraRig waypoints={CAMERA_WAYPOINTS} />

            {/* ── Studio lighting ──────────────────────────────── */}
            <ambientLight intensity={0.06} color="#1a1a3e" />

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

            <directionalLight
              position={[-3, 2, -4]}
              intensity={0.5}
              color="#4fd1ff"
            />

            <directionalLight
              position={[0, -2, 5]}
              intensity={0.15}
              color="#6b8cff"
            />

            <pointLight
              position={[0, 0.5, 0]}
              intensity={1.2}
              color="#6b8cff"
              distance={6}
              decay={2}
            />

            {/* ── Scene objects ─────────────────────────────────── */}
            <Environment preset="night" background={false} />

            <Suspense fallback={<CanvasFallback />}>
              <HeroModel />
              <FloatingElements />
              <ContactOrb />
            </Suspense>

            {!isLowPerf && <Particles count={250} />}
            <Ground />

            {/* ── Debug overlay (press D to toggle) ────────────── */}
            <DebugOverlay />
          </TimelineController>

          {/* OrbitControls disabled — camera is driven by CameraRig */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />

          {/* ── Post-processing ─────────────────────────────────── */}
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

      {/* ── Scrollable HTML Sections ────────────────────────────── */}
      {/*
        HTML sections drive the scroll position, which the
        TimelineController inside the Canvas reads and smooths.
        Sections use framer-motion for their own UI animations
        (useInView, hover effects, sticky scroll for projects).
      */}
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
