/**
 * useChapterProgress — returns a getter for the local 0 → 1 progress
 * within a named chapter.
 *
 * This is a thin convenience wrapper around useTimeline().chapterProgress().
 * The returned function is referentially stable and allocation-free.
 *
 * @param id  Chapter identifier (must match a chapter in the config).
 * @returns   A stable () => number getter.
 *
 * @example
 * const getIntro = useChapterProgress("intro");
 *
 * useFrame(() => {
 *   const t = getIntro(); // 0 before intro, 0→1 during, 1 after
 * });
 */

import { useCallback } from "react";
import { useTimeline } from "../Timeline";

export function useChapterProgress(id: string): () => number {
  const { chapterProgress } = useTimeline();

  return useCallback(
    () => chapterProgress(id),
    [chapterProgress, id],
  );
}
