import { Layout } from "@/components/Layout";
import { Waveform } from "@/components/Waveform";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateRecording,
  useRefineText,
  useTranscribeRecording,
} from "@/hooks/useBackend";
import { useRecording } from "@/hooks/useRecording";
import { RefineMode } from "@/types";
import {
  Check,
  Copy,
  Download,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Wand2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RecordingPage() {
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
    error,
  } = useRecording();
  const createRecording = useCreateRecording();
  const transcribeRecording = useTranscribeRecording();
  const refineText = useRefineText();

  const [transcript, setTranscript] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const [_savedId, setSavedId] = useState<bigint | null>(null);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleSaveAndTranscribe = useCallback(async () => {
    if (!audioBlob) return;
    try {
      const title = `রেকর্ডিং ${new Date().toLocaleDateString("bn-BD")}`;
      const rec = await createRecording.mutateAsync({
        title,
        audioBlobRef: "",
        language: "bn",
        durationSeconds: elapsed,
      });
      setSavedId(rec.id);
      toast.success("রেকর্ডিং সংরক্ষিত হয়েছে");
      const result = await transcribeRecording.mutateAsync(rec.id);
      const rawText = result?.transcript ?? "";
      setOriginalTranscript(rawText);
      setTranscript(rawText);
      toast.success("ট্রান্সক্রিপশন শুরু হয়েছে");
    } catch {
      toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
    }
  }, [audioBlob, createRecording, transcribeRecording, elapsed]);

  const handleRefine = useCallback(
    async (mode: RefineMode) => {
      if (!transcript.trim()) return;
      try {
        const result = await refineText.mutateAsync({ mode, text: transcript });
        setTranscript(result.refinedText);
        toast.success("টেক্সট পরিমার্জন সম্পন্ন");
      } catch {
        toast.error("পরিমার্জন ব্যর্থ হয়েছে");
      }
    },
    [transcript, refineText],
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [transcript]);

  const handleExport = useCallback(() => {
    if (!transcript.trim()) return;
    const title = `রেকর্ডিং ${new Date().toLocaleDateString("bn-BD")}`;
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transcript]);

  const handleReset = useCallback(() => {
    reset();
    setTranscript("");
    setOriginalTranscript("");
    setSavedId(null);
  }, [reset]);

  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isStopped = state === "stopped";
  const isIdle = state === "idle";

  return (
    <Layout>
      <div className="flex flex-col items-center px-4 pt-6 pb-4 gap-6 max-w-md mx-auto">
        {/* Status Badge */}
        <div className="flex items-center gap-2" data-ocid="recording.status">
          {isRecording && (
            <Badge className="bg-destructive/90 text-destructive-foreground recording-pulse gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive-foreground inline-block" />
              রেকর্ড হচ্ছে
            </Badge>
          )}
          {isPaused && <Badge variant="secondary">বিরতি</Badge>}
          {isStopped && (
            <Badge className="bg-primary/20 text-primary">সম্পন্ন</Badge>
          )}
          {isIdle && (
            <Badge variant="outline" className="text-muted-foreground">
              প্রস্তুত
            </Badge>
          )}
        </div>

        {/* Timer */}
        <div
          className="font-display text-5xl font-semibold tabular-nums tracking-tight text-foreground"
          data-ocid="recording.timer"
        >
          {formatTime(elapsed)}
        </div>

        {/* Waveform */}
        <div className="w-full bg-card rounded-2xl border border-border p-5 flex items-center justify-center h-24">
          <Waveform
            analyserNode={analyserNode}
            isActive={isRecording}
            barCount={28}
            className="w-full h-16"
          />
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          {isIdle && (
            <Button
              size="lg"
              className="w-16 h-16 rounded-full shadow-lg transition-smooth hover:scale-105 active:scale-95"
              onClick={start}
              data-ocid="recording.start_button"
              aria-label="রেকর্ড শুরু"
            >
              <Mic size={28} />
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full transition-smooth hover:scale-105"
                onClick={pause}
                data-ocid="recording.pause_button"
                aria-label="বিরতি"
              >
                <Pause size={22} />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg transition-smooth hover:scale-105 active:scale-95 recording-pulse"
                onClick={handleStop}
                data-ocid="recording.stop_button"
                aria-label="থামুন"
              >
                <Square size={24} fill="currentColor" />
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full transition-smooth hover:scale-105"
                onClick={resume}
                data-ocid="recording.resume_button"
                aria-label="চালিয়ে যান"
              >
                <Play size={22} />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg transition-smooth hover:scale-105"
                onClick={handleStop}
                data-ocid="recording.stop_button"
                aria-label="থামুন"
              >
                <Square size={24} fill="currentColor" />
              </Button>
            </>
          )}

          {isStopped && (
            <Button
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full transition-smooth hover:scale-105"
              onClick={handleReset}
              data-ocid="recording.reset_button"
              aria-label="পুনরায় শুরু"
            >
              <RotateCcw size={18} />
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-destructive text-sm text-center"
            data-ocid="recording.error_state"
          >
            {error}
          </p>
        )}

        {/* Save & Transcribe */}
        {isStopped && audioBlob && (
          <Button
            className="w-full h-12 rounded-xl font-medium transition-smooth"
            onClick={handleSaveAndTranscribe}
            disabled={
              createRecording.isPending || transcribeRecording.isPending
            }
            data-ocid="recording.save_button"
          >
            {createRecording.isPending || transcribeRecording.isPending
              ? "প্রক্রিয়া হচ্ছে..."
              : "সংরক্ষণ ও ট্রান্সক্রাইব করুন"}
          </Button>
        )}

        {/* Transcript Section */}
        {(isStopped || transcript || originalTranscript) && (
          <div className="w-full flex flex-col gap-4">
            {/* Original Transcript (read-only) */}
            {originalTranscript && (
              <div className="w-full bg-muted/40 rounded-2xl border border-border p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  মূল ট্রান্সক্রিপ্ট
                </span>
                <p
                  className="text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                  data-ocid="recording.original_transcript"
                >
                  {originalTranscript}
                </p>
              </div>
            )}

            {/* Cleaned / Edited Transcript */}
            <div className="w-full bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  পরিমার্জিত ট্রান্সক্রিপ্ট
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    disabled={!transcript}
                    data-ocid="recording.export_button"
                    aria-label="রপ্তানি করুন"
                  >
                    <Download size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!transcript}
                    data-ocid="recording.copy_button"
                    aria-label="কপি করুন"
                  >
                    {copied ? (
                      <Check size={16} className="text-primary" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
              </div>

              <Textarea
                className="min-h-32 resize-none bg-background border-input text-foreground placeholder:text-muted-foreground text-sm leading-relaxed"
                placeholder="পরিমার্জিত ট্রান্সক্রিপ্ট এখানে দেখাবে..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                data-ocid="recording.transcript_textarea"
              />

              {/* AI Refine actions */}
              <div className="flex flex-wrap gap-2">
                <RefineChip
                  label="ফিলার বাদ দিন"
                  mode={RefineMode.removeFiller}
                  onRefine={handleRefine}
                  loading={refineText.isPending}
                  dataOcid="recording.remove_filler_button"
                />
                <RefineChip
                  label="পুনর্লিখন"
                  mode={RefineMode.rewrite}
                  onRefine={handleRefine}
                  loading={refineText.isPending}
                  dataOcid="recording.rewrite_button"
                />
                <RefineChip
                  label="সারসংক্ষেপ"
                  mode={RefineMode.summarize}
                  onRefine={handleRefine}
                  loading={refineText.isPending}
                  dataOcid="recording.summarize_button"
                />
                <RefineChip
                  label="ব্যাকরণ ঠিক করুন"
                  mode={RefineMode.grammarFix}
                  onRefine={handleRefine}
                  loading={refineText.isPending}
                  dataOcid="recording.grammar_fix_button"
                />
              </div>

              {/* Export button */}
              {transcript && (
                <Button
                  variant="outline"
                  className="w-full gap-2 transition-smooth"
                  onClick={handleExport}
                  data-ocid="recording.export_txt_button"
                >
                  <Download size={16} />
                  রপ্তানি করুন (.txt)
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

interface RefineChipProps {
  label: string;
  mode: RefineMode;
  onRefine: (mode: RefineMode) => void;
  loading: boolean;
  dataOcid: string;
}

function RefineChip({
  label,
  mode,
  onRefine,
  loading,
  dataOcid,
}: RefineChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 rounded-full text-xs gap-1.5 transition-smooth"
      onClick={() => onRefine(mode)}
      disabled={loading}
      data-ocid={dataOcid}
    >
      <Wand2 size={12} />
      {label}
    </Button>
  );
}
