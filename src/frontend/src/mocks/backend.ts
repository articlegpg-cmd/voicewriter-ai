import type { backendInterface, RecordingInfo, RefineResult, TransformationOutput } from "../backend";
import { TranscriptStatus, RefineMode } from "../backend";

const sampleRecordings: RecordingInfo[] = [
  {
    id: BigInt(1),
    title: "প্রথম রেকর্ডিং",
    owner: { _isPrincipal: true, _arr: new Uint8Array(29), toText: () => "aaaaa-aa" } as any,
    createdAt: BigInt(Date.now() * 1_000_000),
    audioBlobRef: "blob-ref-1",
    language: "bn",
    updatedAt: BigInt(Date.now() * 1_000_000),
    durationSeconds: 62,
    transcript:
      "আজকের মিটিংয়ে আমরা প্রজেক্টের অগ্রগতি নিয়ে আলোচনা করেছি। প্রধান বিষয়গুলো হলো: নতুন ফিচার ডেভেলপমেন্ট, বাগ ফিক্স এবং পরবর্তী স্প্রিন্টের পরিকল্পনা।",
    transcriptStatus: TranscriptStatus.complete,
  },
  {
    id: BigInt(2),
    title: "টিম আপডেট",
    owner: { _isPrincipal: true, _arr: new Uint8Array(29), toText: () => "aaaaa-aa" } as any,
    createdAt: BigInt((Date.now() - 86400000) * 1_000_000),
    audioBlobRef: "blob-ref-2",
    language: "bn",
    updatedAt: BigInt((Date.now() - 86400000) * 1_000_000),
    durationSeconds: 125,
    transcript:
      "টিম সদস্যরা তাদের কাজের আপডেট দিয়েছেন। সামনের সপ্তাহে ডেডলাইন আছে তাই সবাই মনোযোগ দিয়ে কাজ করছেন।",
    transcriptStatus: TranscriptStatus.complete,
  },
];

export const mockBackend: backendInterface = {
  createRecording: async (req) => ({
    id: BigInt(Date.now()),
    title: req.title,
    owner: { _isPrincipal: true, _arr: new Uint8Array(29), toText: () => "aaaaa-aa" } as any,
    createdAt: BigInt(Date.now() * 1_000_000),
    audioBlobRef: req.audioBlobRef,
    language: req.language,
    updatedAt: BigInt(Date.now() * 1_000_000),
    durationSeconds: req.durationSeconds,
    transcript: "",
    transcriptStatus: TranscriptStatus.pending,
  }),

  deleteRecording: async (_id) => true,

  getRecording: async (id) =>
    sampleRecordings.find((r) => r.id === id) ?? null,

  listRecordings: async () => sampleRecordings,

  refineText: async (req): Promise<RefineResult> => ({
    refinedText:
      req.mode === RefineMode.removeFiller
        ? "ফিলার শব্দ সরানো হয়েছে। এখন টেক্সট পরিষ্কার এবং সুসংগঠিত।"
        : "AI দ্বারা পরিমার্জিত টেক্সট: প্রজেক্টের অগ্রগতি ভালো। সকল টিম সদস্য সক্রিয়ভাবে কাজ করছেন।",
  }),

  transcribeRecording: async (_id) => true,

  transform: async (_input): Promise<TransformationOutput> => ({
    status: BigInt(200),
    body: new Uint8Array(),
    headers: [],
  }),

  updateRecordingTitle: async (_id, _title) => true,

  updateTranscript: async (_req) => true,
};
