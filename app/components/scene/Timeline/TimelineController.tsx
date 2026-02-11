"use client";

/**
 * TimelineController — the single source of truth for scroll-driven animation.
 *
 * Architecture decisions
 * ─────────────────────
 * 1. Scroll position is captured via a passive listener and written to a ref.
 *    This avoids any React state updates from the scroll event.
 *
 * 2. Smoothing runs inside useFrame (synced to the R3F render loop), using
 *    Three's MathUtils.damp for frame-rate-independent exponential decay.
 *
 * 3. All mutable state lives in a single ref — zero React re-renders occur
 *    per frame. Components read state through getter functions.
 *
 * 4. Velocity is derived from the delta of smoothed progress, giving
 *    downstream components a sense of "scroll energy".
 *
 * 5. The active chapter is resolved by scanning the config each frame.
 *    With a small chapter array this is negligible cost.
 *
 * Usage
 * ─────
 * Wrap your scene inside <TimelineController> (must be a child of <Canvas>):
 *
 *   <Canvas>
 *     <TimelineController>
 *       <CameraRig />
 *       <YourScene />
 *     </TimelineController>
 *   </Canvas>
 */

import { type ReactNode, useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

import { TimelineContext } from "./TimelineContext";
import type { TimelineState, TimelineAPI, Chapter } from "./timeline.types";
import { CHAPTERS } from "./timeline.config";

/* ── Props ──────────────────────────────────────────────────────── */

interface TimelineControllerProps {
  children: ReactNode;
  /** Chapter config — defaults to CHAPTERS from timeline.config.ts. */
  chapters?: Chapter[];
  /**
   * Exponential-decay constant for scroll smoothing.
   * Higher = snappier response, lower = more cinematic lag.
   * @default 4
   */
  damping?: number;
}

/* ── Component ──────────────────────────────────────────────────── */

export function TimelineController({
  children,
  chapters = CHAPTERS,
  damping = 4,
}: TimelineControllerProps) {
  /* ── mutable state (never triggers re-renders) ───────────────── */

  const state = useRef<TimelineState>({
    progress: 0,
    targetProgress: 0,
    velocity: 0,
    chapter: chapters[0]?.id ?? "",
  });

  const prevProgress = useRef(0);

  /* ── scroll capture ──────────────────────────────────────────── */

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      state.current.targetProgress = max > 0 ? window.scrollY / max : 0;
    };

    // Read initial position (handles mid-page reload / back navigation).
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── per-frame smoothing & chapter resolution ────────────────── */

  useFrame((_, delta) => {
    const s = state.current;

    // Stash for velocity calculation.
    prevProgress.current = s.progress;

    // Frame-rate-independent exponential damping.
    s.progress = MathUtils.damp(
      s.progress,
      s.targetProgress,
      damping,
      delta,
    );

    // Velocity = smoothed change per second.
    s.velocity = delta > 0 ? (s.progress - prevProgress.current) / delta : 0;

    // Resolve which chapter the playhead is inside.
    for (const ch of chapters) {
      if (s.progress >= ch.start && s.progress < ch.end) {
        s.chapter = ch.id;
        break;
      }
    }

    // Edge case: progress ≈ 1.0 belongs to the last chapter.
    const last = chapters[chapters.length - 1];
    if (last && s.progress >= last.end - 0.001) {
      s.chapter = last.id;
    }
  });

  /* ── stable API (identity never changes) ─────────────────────── */

  const api = useMemo<TimelineAPI>(
    () => ({
      getState: () => state.current,

      chapterProgress: (id: string) => {
        const ch = chapters.find((c) => c.id === id);
        if (!ch) return 0;
        const range = ch.end - ch.start;
        if (range <= 0) return 0;
        return MathUtils.clamp(
          (state.current.progress - ch.start) / range,
          0,
          1,
        );
      },

      chapters,
    }),
    // chapters is typically a module-level constant, so this memo
    // never invalidates. If you pass a dynamic array, memoize it.
    [chapters],
  );

  /* ── render ──────────────────────────────────────────────────── */

  return (
    <TimelineContext.Provider value={api}>
      {children}
    </TimelineContext.Provider>
  );
}
