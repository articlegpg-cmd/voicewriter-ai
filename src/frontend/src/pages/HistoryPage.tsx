import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteRecording,
  useListRecordings,
  useUpdateRecordingTitle,
} from "@/hooks/useBackend";
import type { RecordingId, RecordingInfo } from "@/types";
import { TranscriptStatus } from "@/types";
import { Check, Clock, Mic, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(ts: bigint): string {
  const d = new Date(Number(ts / 1_000_000n));
  return d.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: TranscriptStatus }) {
  if (status === TranscriptStatus.complete)
    return (
      <Badge className="bg-primary/20 text-primary text-[10px]">সম্পন্ন</Badge>
    );
  if (status === TranscriptStatus.processing)
    return (
      <Badge variant="secondary" className="text-[10px]">
        প্রক্রিয়া হচ্ছে
      </Badge>
    );
  if (status === TranscriptStatus.error)
    return (
      <Badge variant="destructive" className="text-[10px]">
        ত্রুটি
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-[10px] text-muted-foreground">
      অপেক্ষমান
    </Badge>
  );
}

interface EditableTitleProps {
  id: RecordingId;
  title: string;
  index: number;
}

function EditableTitle({ id, title, index }: EditableTitleProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const updateTitle = useUpdateRecordingTitle();

  const save = async () => {
    if (!value.trim()) return;
    await updateTitle.mutateAsync({ id, title: value.trim() });
    toast.success("শিরোনাম আপডেট হয়েছে");
    setEditing(false);
  };

  const cancel = () => {
    setValue(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <Input
          className="h-7 text-sm flex-1 min-w-0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          autoFocus
          data-ocid={`history.title_input.${index}`}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={save}
          data-ocid={`history.save_title_button.${index}`}
        >
          <Check size={13} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={cancel}
          data-ocid={`history.cancel_title_button.${index}`}
        >
          <X size={13} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-1 min-w-0">
      <span className="font-medium text-sm text-foreground truncate flex-1 min-w-0">
        {title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
        onClick={() => setEditing(true)}
        data-ocid={`history.edit_button.${index}`}
        aria-label="শিরোনাম সম্পাদনা"
      >
        <Pencil size={12} />
      </Button>
    </div>
  );
}

interface RecordingCardProps {
  recording: RecordingInfo;
  index: number;
}

function RecordingCard({ recording, index }: RecordingCardProps) {
  const deleteRecording = useDeleteRecording();

  const handleDelete = async () => {
    await deleteRecording.mutateAsync(recording.id);
    toast.success("রেকর্ডিং মুছে ফেলা হয়েছে");
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3 transition-smooth hover:border-primary/30"
      data-ocid={`history.item.${index}`}
    >
      <div className="flex items-start gap-2 justify-between">
        <EditableTitle
          id={recording.id}
          title={recording.title}
          index={index}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              data-ocid={`history.delete_button.${index}`}
              aria-label="মুছুন"
            >
              <Trash2 size={14} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid={`history.dialog.${index}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>রেকর্ডিং মুছবেন?</AlertDialogTitle>
              <AlertDialogDescription>
                এই রেকর্ডিং স্থায়ীভাবে মুছে যাবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid={`history.cancel_button.${index}`}>
                বাতিল
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid={`history.confirm_button.${index}`}
              >
                মুছুন
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {formatDuration(recording.durationSeconds)}
        </span>
        <span>{formatDate(recording.createdAt)}</span>
        <StatusBadge status={recording.transcriptStatus} />
      </div>

      {recording.transcript && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 border-t border-border pt-2">
          {recording.transcript}
        </p>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { data: recordings, isLoading, isError } = useListRecordings();

  return (
    <Layout>
      <div className="flex flex-col px-4 pt-6 pb-4 gap-4 max-w-md mx-auto">
        <h2 className="font-display text-lg font-semibold text-foreground">
          রেকর্ডিং ইতিহাস
        </h2>

        {isLoading && (
          <div
            className="flex flex-col gap-3"
            data-ocid="history.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {isError && (
          <div
            className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-center"
            data-ocid="history.error_state"
          >
            <p className="text-destructive text-sm">ডেটা লোড করতে সমস্যা হয়েছে</p>
          </div>
        )}

        {!isLoading && !isError && (!recordings || recordings.length === 0) && (
          <div
            className="flex flex-col items-center justify-center gap-4 bg-card rounded-2xl border border-border p-10 text-center"
            data-ocid="history.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Mic size={26} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                কোনো রেকর্ডিং নেই
              </p>
              <p className="text-xs text-muted-foreground">
                রেকর্ড ট্যাবে গিয়ে প্রথম রেকর্ডিং তৈরি করুন
              </p>
            </div>
          </div>
        )}

        {recordings && recordings.length > 0 && (
          <div className="flex flex-col gap-3" data-ocid="history.list">
            {recordings
              .slice()
              .sort((a, b) => Number(b.createdAt - a.createdAt))
              .map((rec, idx) => (
                <RecordingCard
                  key={rec.id.toString()}
                  recording={rec}
                  index={idx + 1}
                />
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
