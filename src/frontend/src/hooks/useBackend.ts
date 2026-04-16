import { createActor } from "@/backend";
import type {
  CreateRecordingRequest,
  RecordingId,
  RecordingInfo,
  RefineRequest,
  RefineResult,
  UpdateTranscriptRequest,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

// ─── List Recordings ─────────────────────────────────────────────────────────

export function useListRecordings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RecordingInfo[]>({
    queryKey: ["recordings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRecordings();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Get Single Recording ────────────────────────────────────────────────────

export function useGetRecording(id: RecordingId | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RecordingInfo | null>({
    queryKey: ["recording", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getRecording(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Create Recording ────────────────────────────────────────────────────────

export function useCreateRecording() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<RecordingInfo, Error, CreateRecordingRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      return actor.createRecording(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recordings"] });
    },
  });
}

// ─── Delete Recording ────────────────────────────────────────────────────────

export function useDeleteRecording() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, RecordingId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      return actor.deleteRecording(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recordings"] });
    },
  });
}

// ─── Update Title ────────────────────────────────────────────────────────────

export function useUpdateRecordingTitle() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: RecordingId; title: string }>({
    mutationFn: async ({ id, title }) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      return actor.updateRecordingTitle(id, title);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["recordings"] });
      qc.invalidateQueries({ queryKey: ["recording", id.toString()] });
    },
  });
}

// ─── Update Transcript ───────────────────────────────────────────────────────

export function useUpdateTranscript() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, UpdateTranscriptRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      return actor.updateTranscript(req);
    },
    onSuccess: (_data, req) => {
      qc.invalidateQueries({ queryKey: ["recordings"] });
      qc.invalidateQueries({ queryKey: ["recording", req.id.toString()] });
    },
  });
}

// ─── Transcribe Recording ─────────────────────────────────────────────────────

export function useTranscribeRecording() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<RecordingInfo | null, Error, RecordingId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      await actor.transcribeRecording(id);
      // Fetch updated recording to get the transcript text
      return actor.getRecording(id);
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["recordings"] });
      qc.invalidateQueries({ queryKey: ["recording", id.toString()] });
    },
  });
}

// ─── Refine Text ─────────────────────────────────────────────────────────────

export function useRefineText() {
  const { actor } = useBackendActor();
  return useMutation<RefineResult, Error, RefineRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("অ্যাক্টর প্রস্তুত নয়");
      return actor.refineText(req);
    },
  });
}
