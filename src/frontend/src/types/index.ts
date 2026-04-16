export type {
  RecordingInfo,
  RecordingId,
  CreateRecordingRequest,
  UpdateTranscriptRequest,
  RefineRequest,
  RefineResult,
  Timestamp,
  UserId,
} from "@/backend.d";
export { RefineMode, TranscriptStatus } from "@/backend.d";

export type RecordingState = "idle" | "recording" | "paused" | "stopped";

export interface RecordingSession {
  state: RecordingState;
  elapsed: number; // seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface WaveformBar {
  height: number; // 0–100 percentage
  index: number;
}
