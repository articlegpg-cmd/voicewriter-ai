import type { RecordingState } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseRecordingReturn {
  state: RecordingState;
  elapsed: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  analyserNode: AnalyserNode | null;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

export function useRecording(): UseRecordingReturn {
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setElapsed(
        accumulatedRef.current +
          Math.floor((now - startTimeRef.current) / 1000),
      );
    }, 500);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up analyser for waveform
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      setAnalyserNode(analyser);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start(250);
      accumulatedRef.current = 0;
      startTimer();
      setState("recording");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "মাইক্রোফোন অ্যাক্সেস ব্যর্থ হয়েছে";
      setError(msg);
    }
  }, [startTimer]);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      clearTimer();
      accumulatedRef.current = elapsed;
      setState("paused");
    }
  }, [clearTimer, elapsed]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setState("recording");
    }
  }, [startTimer]);

  const stop = useCallback(() => {
    clearTimer();
    accumulatedRef.current = elapsed;
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    audioContextRef.current?.close();
    setAnalyserNode(null);
    setState("stopped");
  }, [clearTimer, elapsed]);

  const reset = useCallback(() => {
    clearTimer();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    chunksRef.current = [];
    accumulatedRef.current = 0;
    setElapsed(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setAnalyserNode(null);
    setError(null);
    setState("idle");
  }, [clearTimer, audioUrl]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
      }
      audioContextRef.current?.close();
    };
  }, [audioUrl, clearTimer]);

  return {
    state,
    elapsed,
    audioBlob,
    audioUrl,
    analyserNode,
    start,
    pause,
    resume,
    stop,
    reset,
    error,
  };
}
