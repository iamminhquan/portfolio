"use client";

/**
 * Typewriter text effect that reveals characters one at a time
 * with a blinking cursor.
 */

import { useState, useEffect, useCallback } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function TypeWriter({
  text,
  speed = 60,
  delay = 0,
  onComplete,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      handleComplete();
    }
  }, [displayed, text, speed, started, handleComplete]);

  const isComplete = displayed.length === text.length && started;

  return (
    <>
      {displayed}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.9em",
          backgroundColor: "#6b8cff",
          marginLeft: "4px",
          verticalAlign: "text-bottom",
          animation: isComplete ? "blink 1s step-end infinite" : "none",
          opacity: started ? 1 : 0,
        }}
      />
    </>
  );
}
