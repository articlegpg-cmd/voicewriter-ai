import { useEffect, useRef, useState } from "react";

interface WaveformProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  barCount?: number;
  className?: string;
}

const BAR_COUNT = 20;

// Pre-generate stable bar keys — up to 64 bars supported
const BAR_KEYS: string[] = Array.from({ length: 64 }, (_, i) => `wb${i}`);

export function Waveform({
  analyserNode,
  isActive,
  barCount = BAR_COUNT,
  className = "",
}: WaveformProps) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 15),
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !analyserNode) {
      setHeights(Array.from({ length: barCount }, (_, i) => 8 + (i % 3) * 4));
      return;
    }

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    function draw() {
      analyserNode!.getByteFrequencyData(dataArray);
      const step = Math.floor(dataArray.length / barCount);
      const newHeights = Array.from({ length: barCount }, (_, i) => {
        const val = dataArray[i * step] ?? 0;
        return 8 + Math.round((val / 255) * 56);
      });
      setHeights(newHeights);
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, analyserNode, barCount]);

  return (
    <div
      className={`flex items-center justify-center gap-[3px] ${className}`}
      aria-hidden="true"
      data-ocid="waveform.canvas_target"
    >
      {heights.map((h, i) => {
        const key = BAR_KEYS[i] ?? `wb${i}`;
        return (
          <span
            key={key}
            className={`rounded-full bg-primary transition-all duration-100 ${
              isActive ? "" : "waveform-bar"
            }`}
            style={{
              width: 3,
              height: isActive ? h : undefined,
              animationDelay: isActive ? undefined : `${i * 0.03}s`,
            }}
          />
        );
      })}
    </div>
  );
}
