"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Vector3, MathUtils } from "three";
import type { Group } from "three";

/* ============================================
   Section Configuration
============================================ */

const SECTIONS = [
  {
    id: "hero",
    camera: new Vector3(3, 3, 3),
    modelRotation: 0,
    modelScale: 1,
  },
  {
    id: "about",
    camera: new Vector3(4, 2, 4),
    modelRotation: Math.PI * 0.5,
    modelScale: 1.2,
  },
  {
    id: "work",
    camera: new Vector3(2, 4, 3),
    modelRotation: Math.PI,
    modelScale: 0.9,
  },
  {
    id: "contact",
    camera: new Vector3(3, 1.5, 5),
    modelRotation: Math.PI * 1.5,
    modelScale: 1.1,
  },
];

const scrollState = {
  progress: 0,
  targetProgress: 0,
  section: 0,
};

/* ============================================
   3D Components
============================================ */

function SceneController() {
  const { camera } = useThree();
  const introProgress = useRef(0);

  useFrame((_, delta) => {
    scrollState.progress = MathUtils.lerp(
      scrollState.progress,
      scrollState.targetProgress,
      0.08
    );

    const totalSections = SECTIONS.length;
    const sectionProgress = scrollState.progress * (totalSections - 1);
    const currentSection = Math.floor(sectionProgress);
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    const t = sectionProgress - currentSection;

    const currentConfig = SECTIONS[currentSection];
    const nextConfig = SECTIONS[nextSection];

    // Intro animation
    if (introProgress.current < 1) {
      introProgress.current = Math.min(introProgress.current + delta * 0.5, 1);
      const eased = 1 - Math.pow(1 - introProgress.current, 3);
      camera.position.lerpVectors(
        new Vector3(8, 6, 8),
        currentConfig.camera,
        eased
      );
    } else {
      // Section-based camera transition
      camera.position.lerpVectors(currentConfig.camera, nextConfig.camera, t);
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  );
}

function PlaceholderModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const totalSections = SECTIONS.length;
    const sectionProgress = scrollState.progress * (totalSections - 1);
    const currentSection = Math.floor(sectionProgress);
    const nextSection = Math.min(currentSection + 1, totalSections - 1);
    const t = sectionProgress - currentSection;

    const currentConfig = SECTIONS[currentSection];
    const nextConfig = SECTIONS[nextSection];

    // Interpolate rotation
    const targetRotation = MathUtils.lerp(
      currentConfig.modelRotation,
      nextConfig.modelRotation,
      t
    );
    groupRef.current.rotation.y = targetRotation + time * 0.15;

    // Interpolate scale
    const targetScale = MathUtils.lerp(
      currentConfig.modelScale,
      nextConfig.modelScale,
      t
    );
    groupRef.current.scale.setScalar(targetScale);

    // Subtle floating
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#6b8cff" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ff6b8c" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ============================================
   Section Components
============================================ */

function HeroSection() {
  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h1 style={styles.title}>Creative Developer</h1>
        <p style={styles.subtitle}>
          Building immersive digital experiences with code and creativity.
        </p>
        <button style={styles.button}>View Work</button>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section style={{ ...styles.section, ...styles.sectionAlt }}>
      <div style={{ ...styles.content, alignItems: "flex-end" }}>
        <h2 style={styles.sectionTitle}>About</h2>
        <p style={styles.sectionText}>
          Passionate about crafting beautiful interfaces and memorable
          experiences through clean code and thoughtful design.
        </p>
      </div>
    </section>
  );
}

function WorkSection() {
  return (
    <section style={styles.section}>
      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Work</h2>
        <p style={styles.sectionText}>
          A curated selection of projects showcasing expertise in web
          development, 3D graphics, and interactive experiences.
        </p>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section style={{ ...styles.section, ...styles.sectionAlt }}>
      <div style={{ ...styles.content, alignItems: "flex-end" }}>
        <h2 style={styles.sectionTitle}>Contact</h2>
        <p style={styles.sectionText}>
          Let&apos;s collaborate on your next project. Reach out and let&apos;s
          create something extraordinary together.
        </p>
        <button style={styles.button}>Get in Touch</button>
      </div>
    </section>
  );
}

/* ============================================
   Main Component
============================================ */

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

/* ============================================
   Styles
============================================ */

const styles: Record<string, React.CSSProperties> = {
  canvasWrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
  },
  main: {
    position: "relative",
    zIndex: 1,
  },
  section: {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
  },
  sectionAlt: {
    justifyContent: "flex-end",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0 8vw",
    pointerEvents: "none",
    maxWidth: "600px",
  },
  title: {
    fontSize: "clamp(2.5rem, 8vw, 5rem)",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
  },
  sectionTitle: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    color: "rgba(255, 255, 255, 0.85)",
    maxWidth: "500px",
    marginTop: "1rem",
    lineHeight: 1.6,
    textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
  },
  sectionText: {
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    color: "rgba(255, 255, 255, 0.8)",
    maxWidth: "450px",
    marginTop: "1rem",
    lineHeight: 1.7,
    textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
  },
  button: {
    marginTop: "2rem",
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#6b8cff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    pointerEvents: "auto",
    transition: "background-color 0.2s ease",
  },
};
