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

export default function Scene() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollState.targetProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed 3D Canvas */}
      <div style={styles.canvasWrapper}>
        <Canvas
          shadows
          camera={{ position: [8, 6, 8], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.15} color="#b0c4de" />
          <directionalLight
            position={[5, 8, 3]}
            intensity={1.5}
            color="#fff5e6"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.0001}
            shadow-radius={1.5}
          />
          <directionalLight
            position={[-4, 3, -2]}
            intensity={0.4}
            color="#a0c4ff"
          />
          <SceneController />
          <Environment preset="studio" background={false} />
          <PlaceholderModel />
          <Ground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Scrollable Sections */}
      <main style={styles.main}>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ContactSection />
      </main>
    </>
  );
}
