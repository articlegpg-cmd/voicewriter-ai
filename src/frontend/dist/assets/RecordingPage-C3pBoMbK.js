import { r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-BCOrKxR5.js";
import { c as createLucideIcon, u as useCreateRecording, a as useTranscribeRecording, b as useRefineText, d as ue, L as Layout, B as Badge, e as Button, M as Mic, C as Check, R as RefineMode } from "./index-B1lZ2SgX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode);
const BAR_COUNT = 20;
const BAR_KEYS = Array.from({ length: 64 }, (_, i) => `wb${i}`);
function Waveform({
  analyserNode,
  isActive,
  barCount = BAR_COUNT,
  className = ""
}) {
  const [heights, setHeights] = reactExports.useState(
    () => Array.from({ length: barCount }, () => 15)
  );
  const rafRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isActive || !analyserNode) {
      setHeights(Array.from({ length: barCount }, (_, i) => 8 + i % 3 * 4));
      return;
    }
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    function draw() {
      analyserNode.getByteFrequencyData(dataArray);
      const step = Math.floor(dataArray.length / barCount);
      const newHeights = Array.from({ length: barCount }, (_, i) => {
        const val = dataArray[i * step] ?? 0;
        return 8 + Math.round(val / 255 * 56);
      });
      setHeights(newHeights);
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, analyserNode, barCount]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `flex items-center justify-center gap-[3px] ${className}`,
      "aria-hidden": "true",
      "data-ocid": "waveform.canvas_target",
      children: heights.map((h, i) => {
        const key = BAR_KEYS[i] ?? `wb${i}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `rounded-full bg-primary transition-all duration-100 ${isActive ? "" : "waveform-bar"}`,
            style: {
              width: 3,
              height: isActive ? h : void 0,
              animationDelay: isActive ? void 0 : `${i * 0.03}s`
            }
          },
          key
        );
      })
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function useRecording() {
  const [state, setState] = reactExports.useState("idle");
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [audioBlob, setAudioBlob] = reactExports.useState(null);
  const [audioUrl, setAudioUrl] = reactExports.useState(null);
  const [analyserNode, setAnalyserNode] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const mediaRecorderRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  const streamRef = reactExports.useRef(null);
  const audioContextRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(0);
  const accumulatedRef = reactExports.useRef(0);
  const clearTimer = reactExports.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const startTimer = reactExports.useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setElapsed(
        accumulatedRef.current + Math.floor((now - startTimeRef.current) / 1e3)
      );
    }, 500);
  }, []);
  const start = reactExports.useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      setAnalyserNode(analyser);
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
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
      const msg = err instanceof Error ? err.message : "মাইক্রোফোন অ্যাক্সেস ব্যর্থ হয়েছে";
      setError(msg);
    }
  }, [startTimer]);
  const pause = reactExports.useCallback(() => {
    var _a;
    if (((_a = mediaRecorderRef.current) == null ? void 0 : _a.state) === "recording") {
      mediaRecorderRef.current.pause();
      clearTimer();
      accumulatedRef.current = elapsed;
      setState("paused");
    }
  }, [clearTimer, elapsed]);
  const resume = reactExports.useCallback(() => {
    var _a;
    if (((_a = mediaRecorderRef.current) == null ? void 0 : _a.state) === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setState("recording");
    }
  }, [startTimer]);
  const stop = reactExports.useCallback(() => {
    var _a;
    clearTimer();
    accumulatedRef.current = elapsed;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    (_a = audioContextRef.current) == null ? void 0 : _a.close();
    setAnalyserNode(null);
    setState("stopped");
  }, [clearTimer, elapsed]);
  const reset = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    return () => {
      var _a;
      clearTimer();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
      }
      (_a = audioContextRef.current) == null ? void 0 : _a.close();
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
    error
  };
}
function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function RecordingPage() {
  const {
    state,
    elapsed,
    audioBlob,
    analyserNode,
    start,
    pause,
    resume,
    stop,
    reset,
    error
  } = useRecording();
  const createRecording = useCreateRecording();
  const transcribeRecording = useTranscribeRecording();
  const refineText = useRefineText();
  const [transcript, setTranscript] = reactExports.useState("");
  const [originalTranscript, setOriginalTranscript] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const [_savedId, setSavedId] = reactExports.useState(null);
  const handleStop = reactExports.useCallback(() => {
    stop();
  }, [stop]);
  const handleSaveAndTranscribe = reactExports.useCallback(async () => {
    if (!audioBlob) return;
    try {
      const title = `রেকর্ডিং ${(/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")}`;
      const rec = await createRecording.mutateAsync({
        title,
        audioBlobRef: "",
        language: "bn",
        durationSeconds: elapsed
      });
      setSavedId(rec.id);
      ue.success("রেকর্ডিং সংরক্ষিত হয়েছে");
      const result = await transcribeRecording.mutateAsync(rec.id);
      const rawText = (result == null ? void 0 : result.transcript) ?? "";
      setOriginalTranscript(rawText);
      setTranscript(rawText);
      ue.success("ট্রান্সক্রিপশন শুরু হয়েছে");
    } catch {
      ue.error("সংরক্ষণ ব্যর্থ হয়েছে");
    }
  }, [audioBlob, createRecording, transcribeRecording, elapsed]);
  const handleRefine = reactExports.useCallback(
    async (mode) => {
      if (!transcript.trim()) return;
      try {
        const result = await refineText.mutateAsync({ mode, text: transcript });
        setTranscript(result.refinedText);
        ue.success("টেক্সট পরিমার্জন সম্পন্ন");
      } catch {
        ue.error("পরিমার্জন ব্যর্থ হয়েছে");
      }
    },
    [transcript, refineText]
  );
  const handleCopy = reactExports.useCallback(async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [transcript]);
  const handleExport = reactExports.useCallback(() => {
    if (!transcript.trim()) return;
    const title = `রেকর্ডিং ${(/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")}`;
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transcript]);
  const handleReset = reactExports.useCallback(() => {
    reset();
    setTranscript("");
    setOriginalTranscript("");
    setSavedId(null);
  }, [reset]);
  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isStopped = state === "stopped";
  const isIdle = state === "idle";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-4 pt-6 pb-4 gap-6 max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-ocid": "recording.status", children: [
      isRecording && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-destructive/90 text-destructive-foreground recording-pulse gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-destructive-foreground inline-block" }),
        "রেকর্ড হচ্ছে"
      ] }),
      isPaused && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "বিরতি" }),
      isStopped && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary", children: "সম্পন্ন" }),
      isIdle && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-muted-foreground", children: "প্রস্তুত" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "font-display text-5xl font-semibold tabular-nums tracking-tight text-foreground",
        "data-ocid": "recording.timer",
        children: formatTime(elapsed)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-card rounded-2xl border border-border p-5 flex items-center justify-center h-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Waveform,
      {
        analyserNode,
        isActive: isRecording,
        barCount: 28,
        className: "w-full h-16"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4", children: [
      isIdle && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "w-16 h-16 rounded-full shadow-lg transition-smooth hover:scale-105 active:scale-95",
          onClick: start,
          "data-ocid": "recording.start_button",
          "aria-label": "রেকর্ড শুরু",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 28 })
        }
      ),
      isRecording && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "lg",
            className: "w-14 h-14 rounded-full transition-smooth hover:scale-105",
            onClick: pause,
            "data-ocid": "recording.pause_button",
            "aria-label": "বিরতি",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 22 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            className: "w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg transition-smooth hover:scale-105 active:scale-95 recording-pulse",
            onClick: handleStop,
            "data-ocid": "recording.stop_button",
            "aria-label": "থামুন",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 24, fill: "currentColor" })
          }
        )
      ] }),
      isPaused && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "lg",
            className: "w-14 h-14 rounded-full transition-smooth hover:scale-105",
            onClick: resume,
            "data-ocid": "recording.resume_button",
            "aria-label": "চালিয়ে যান",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 22 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            className: "w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg transition-smooth hover:scale-105",
            onClick: handleStop,
            "data-ocid": "recording.stop_button",
            "aria-label": "থামুন",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { size: 24, fill: "currentColor" })
          }
        )
      ] }),
      isStopped && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "lg",
          className: "w-12 h-12 rounded-full transition-smooth hover:scale-105",
          onClick: handleReset,
          "data-ocid": "recording.reset_button",
          "aria-label": "পুনরায় শুরু",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 18 })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-destructive text-sm text-center",
        "data-ocid": "recording.error_state",
        children: error
      }
    ),
    isStopped && audioBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        className: "w-full h-12 rounded-xl font-medium transition-smooth",
        onClick: handleSaveAndTranscribe,
        disabled: createRecording.isPending || transcribeRecording.isPending,
        "data-ocid": "recording.save_button",
        children: createRecording.isPending || transcribeRecording.isPending ? "প্রক্রিয়া হচ্ছে..." : "সংরক্ষণ ও ট্রান্সক্রাইব করুন"
      }
    ),
    (isStopped || transcript || originalTranscript) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col gap-4", children: [
      originalTranscript && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-muted/40 rounded-2xl border border-border p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "মূল ট্রান্সক্রিপ্ট" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap",
            "data-ocid": "recording.original_transcript",
            children: originalTranscript
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-card rounded-2xl border border-border p-4 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "পরিমার্জিত ট্রান্সক্রিপ্ট" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: handleExport,
                disabled: !transcript,
                "data-ocid": "recording.export_button",
                "aria-label": "রপ্তানি করুন",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: handleCopy,
                disabled: !transcript,
                "data-ocid": "recording.copy_button",
                "aria-label": "কপি করুন",
                children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 16 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            className: "min-h-32 resize-none bg-background border-input text-foreground placeholder:text-muted-foreground text-sm leading-relaxed",
            placeholder: "পরিমার্জিত ট্রান্সক্রিপ্ট এখানে দেখাবে...",
            value: transcript,
            onChange: (e) => setTranscript(e.target.value),
            "data-ocid": "recording.transcript_textarea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefineChip,
            {
              label: "ফিলার বাদ দিন",
              mode: RefineMode.removeFiller,
              onRefine: handleRefine,
              loading: refineText.isPending,
              dataOcid: "recording.remove_filler_button"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefineChip,
            {
              label: "পুনর্লিখন",
              mode: RefineMode.rewrite,
              onRefine: handleRefine,
              loading: refineText.isPending,
              dataOcid: "recording.rewrite_button"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefineChip,
            {
              label: "সারসংক্ষেপ",
              mode: RefineMode.summarize,
              onRefine: handleRefine,
              loading: refineText.isPending,
              dataOcid: "recording.summarize_button"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefineChip,
            {
              label: "ব্যাকরণ ঠিক করুন",
              mode: RefineMode.grammarFix,
              onRefine: handleRefine,
              loading: refineText.isPending,
              dataOcid: "recording.grammar_fix_button"
            }
          )
        ] }),
        transcript && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "w-full gap-2 transition-smooth",
            onClick: handleExport,
            "data-ocid": "recording.export_txt_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
              "রপ্তানি করুন (.txt)"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function RefineChip({
  label,
  mode,
  onRefine,
  loading,
  dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: "h-8 rounded-full text-xs gap-1.5 transition-smooth",
      onClick: () => onRefine(mode),
      disabled: loading,
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 12 }),
        label
      ]
    }
  );
}
export {
  RecordingPage as default
};
