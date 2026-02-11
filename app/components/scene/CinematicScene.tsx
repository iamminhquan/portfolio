"use client";

/**
 * CinematicScene — demonstration root that wires together the full
 * scroll-driven 3D architecture.
 *
 * Layout
 * ──────
 *  ┌─────────────────────────────────────┐
 *  │  Fixed Canvas (z-index: 0)          │
 *  │  ┌─ TimelineController ──────────┐  │
 *  │  │  CameraRig                    │  │
 *  │  │  Lighting + Environment       │  │
 *  │  │  DemoOrb                      │  │
 *  │  └───────────────────────────────┘  │
 *  ├─────────────────────────────────────┤
 *  │  Scrollable HTML (z-index: 1)       │
 *  │  ┌─ section: Intro  (150vh) ─────┐  │
 *  │  ├─ section: Toolkit (150vh) ────┤  │
 *  │  ├─ section: Projects (200vh) ───┤  │
 *  │  └───────────────────────────────┘  │
 *  └─────────────────────────────────────┘
 *
 * Data flow
 * ─────────
 *  window.scrollY → TimelineController (smooth + chapter resolve)
 *     → CameraRig (interpolates keyframes)
 *     → DemoOrb (reads chapter progress via hooks)
 *
 * To extend this with your own scenes: replace <DemoOrb /> with your
 * scene objects, update timeline.config.ts and camera.config.ts, and
 * populate the scroll sections with real content.
 */

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { TimelineController } from "./Timeline";
import { CameraRig } from "./Camera";
import { DemoOrb } from "./Objects";

/* ── Root ───────────────────────────────────────────────────────── */

export function CinematicScene() {
  return (
    <>
      {/* ── Fixed 3D Canvas ─────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(180deg, #080818 0%, #0d0d2b 50%, #080818 100%)",
        }}
      >
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <TimelineController>
            {/* Camera — reads timeline, interpolates keyframes */}
            <CameraRig />

            {/* Lighting */}
            <ambientLight intensity={0.08} color="#1a1a3e" />
            <directionalLight
              position={[5, 8, 3]}
              intensity={0.7}
              color="#fff5e6"
            />
            <directionalLight
              position={[-3, 2, -4]}
              intensity={0.4}
              color="#4fd1ff"
            />
            <pointLight
              position={[0, 0.5, 0]}
              intensity={1}
              color="#6b8cff"
              distance={6}
              decay={2}
            />

            <Environment preset="night" background={false} />

            {/* Scene objects */}
            <DemoOrb />
          </TimelineController>
        </Canvas>
      </div>

      {/* ── Scrollable HTML layer ───────────────────────────────── */}
      {/*
        This layer exists solely to provide scroll range.
        In a real app these would be your content sections.
        Heights are proportional to chapter weights (30%, 30%, 40%)
        plus a 100vh initial viewport.
      */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <ChapterSection label="Intro" height="150vh" />
        <ChapterSection label="Toolkit" height="150vh" />
        <ChapterSection label="Projects" height="200vh" />
      </main>
    </>
  );
}

/* ── Minimal chapter label (visible while scrolling) ─────────────  */

function ChapterSection({
  label,
  height,
}: {
  label: string;
  height: string;
}) {
  return (
    <section
      style={{
        height,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <span
        style={{
          color: "rgba(255, 255, 255, 0.12)",
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 300,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {label}
      </span>
    </section>
  );
}
