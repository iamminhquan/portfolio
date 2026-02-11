/**
 * DebugOverlay — toggleable HUD showing live timeline state.
 *
 * Toggle with the 'D' key. Shows:
 *   - Global progress (0 → 1)
 *   - Scroll velocity
 *   - Active chapter
 *   - Per-chapter local progress
 *
 * Performance: the overlay text is updated via direct DOM mutation
 * inside useFrame — zero React re-renders during animation.
 * Only the visibility toggle causes a React state update (on keypress).
 *
 * Uses drei's <Html fullscreen> to render HTML inside the Canvas.
 */

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useTimeline } from "../Timeline";

export function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);
  const timeline = useTimeline();

  /* ── toggle on 'D' key ───────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        // Don't toggle if user is typing in a form
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── update text via DOM mutation (no React re-render) ───────── */
  useFrame(() => {
    if (!visible || !textRef.current) return;
    const s = timeline.getState();

    // Build chapter progress lines
    const chapterLines = timeline.chapters
      .map((ch) => {
        const cp = timeline.chapterProgress(ch.id);
        const bar = "█".repeat(Math.round(cp * 16)).padEnd(16, "░");
        const active = s.chapter === ch.id ? " ◀" : "";
        return `  ${ch.id.padEnd(10)} ${bar} ${cp.toFixed(2)}${active}`;
      })
      .join("\n");

    textRef.current.textContent = [
      `── Timeline Debug ──`,
      `progress : ${s.progress.toFixed(4)}`,
      `velocity : ${s.velocity.toFixed(4)}`,
      `chapter  : ${s.chapter}`,
      ``,
      `── Chapters ──`,
      chapterLines,
    ].join("\n");
  });

  if (!visible) return null;

  return (
    <Html fullscreen>
      <pre
        ref={textRef}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          margin: 0,
          background: "rgba(0, 0, 0, 0.85)",
          color: "#4fd1ff",
          fontFamily: "'Geist Mono', 'SF Mono', 'Consolas', monospace",
          fontSize: 11,
          lineHeight: 1.6,
          padding: "14px 18px",
          borderRadius: 10,
          border: "1px solid rgba(79, 209, 255, 0.15)",
          whiteSpace: "pre",
          zIndex: 9999,
          pointerEvents: "none",
          userSelect: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />
    </Html>
  );
}
