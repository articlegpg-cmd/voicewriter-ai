import Common "common";

module {
  public type TranscriptStatus = {
    #pending;
    #processing;
    #complete;
    #error;
  };

  public type Recording = {
    id : Common.RecordingId;
    owner : Common.UserId;
    var title : Text;
    var durationSeconds : Float;
    audioBlobRef : Text; // reference key for audio blob storage
    var transcript : Text;
    var transcriptStatus : TranscriptStatus;
    var language : Text;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type RecordingInfo = {
    id : Common.RecordingId;
    owner : Common.UserId;
    title : Text;
    durationSeconds : Float;
    audioBlobRef : Text;
    transcript : Text;
    transcriptStatus : TranscriptStatus;
    language : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateRecordingRequest = {
    title : Text;
    durationSeconds : Float;
    audioBlobRef : Text;
    language : Text;
  };

  public type UpdateTranscriptRequest = {
    id : Common.RecordingId;
    transcript : Text;
    status : TranscriptStatus;
  };

  public type RefineRequest = {
    text : Text;
    mode : RefineMode;
  };

  public type RefineMode = {
    #rewrite;
    #removeFiller;
    #grammarFix;
    #summarize;
  };

  public type RefineResult = {
    refinedText : Text;
  };
};
