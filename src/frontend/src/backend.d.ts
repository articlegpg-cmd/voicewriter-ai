import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface RefineRequest {
    mode: RefineMode;
    text: string;
}
export type RecordingId = bigint;
export interface RefineResult {
    refinedText: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface RecordingInfo {
    id: RecordingId;
    title: string;
    owner: UserId;
    createdAt: Timestamp;
    audioBlobRef: string;
    language: string;
    updatedAt: Timestamp;
    durationSeconds: number;
    transcript: string;
    transcriptStatus: TranscriptStatus;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreateRecordingRequest {
    title: string;
    audioBlobRef: string;
    language: string;
    durationSeconds: number;
}
export interface UpdateTranscriptRequest {
    id: RecordingId;
    status: TranscriptStatus;
    transcript: string;
}
export enum RefineMode {
    summarize = "summarize",
    grammarFix = "grammarFix",
    rewrite = "rewrite",
    removeFiller = "removeFiller"
}
export enum TranscriptStatus {
    pending = "pending",
    error = "error",
    complete = "complete",
    processing = "processing"
}
export interface backendInterface {
    createRecording(req: CreateRecordingRequest): Promise<RecordingInfo>;
    deleteRecording(id: RecordingId): Promise<boolean>;
    getRecording(id: RecordingId): Promise<RecordingInfo | null>;
    listRecordings(): Promise<Array<RecordingInfo>>;
    refineText(req: RefineRequest): Promise<RefineResult>;
    transcribeRecording(id: RecordingId): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateRecordingTitle(id: RecordingId, title: string): Promise<boolean>;
    updateTranscript(req: UpdateTranscriptRequest): Promise<boolean>;
}
