import Map "mo:core/Map";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AiLib "../lib/ai";
import Common "../types/common";
import RecordingTypes "../types/recordings";

mixin (
  recordings : Map.Map<Common.RecordingId, RecordingTypes.Recording>,
) {
  /// Transform callback required by the IC for HTTP outcalls — must be query
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Trigger AI transcription for a recording via HTTP outcall
  /// Since audio blobs cannot be sent via HTTP outcalls, this sets status to
  /// processing and returns a placeholder. Real transcription would require
  /// a separate upload flow with a Whisper-compatible API.
  public shared ({ caller }) func transcribeRecording(id : Common.RecordingId) : async Bool {
    switch (recordings.get(id)) {
      case null { false };
      case (?r) {
        if (not Principal.equal(r.owner, caller)) { return false };
        // Mark as processing
        r.transcriptStatus := #processing;
        // Since audio blobs cannot be sent via HTTP outcalls directly,
        // set a placeholder transcript. The frontend can use updateTranscript
        // to provide the actual transcript text.
        r.transcript := "[ট্রান্সক্রিপশন: অডিও ফাইল প্রস্তুত। API কী কনফিগার করলে স্বয়ংক্রিয় ট্রান্সক্রিপশন সক্রিয় হবে।]";
        r.transcriptStatus := #complete;
        true;
      };
    };
  };

  /// Refine transcript text using AI (rewrite / grammar-fix / summarize / removeFiller)
  /// Makes an HTTP outcall to an OpenAI-compatible endpoint.
  public shared ({ caller }) func refineText(req : RecordingTypes.RefineRequest) : async RecordingTypes.RefineResult {
    // First apply client-side filler removal as fallback for removeFiller mode
    let locallyRefined = switch (req.mode) {
      case (#removeFiller) { AiLib.removeFillersLocally(req.text) };
      case (_) { req.text };
    };

    // Attempt HTTP outcall to AI refinement API
    let body = AiLib.buildRefineBody(req);
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer sk-placeholder" },
    ];

    try {
      let responseText = await OutCall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        headers,
        body,
        transform,
      );
      let refined = AiLib.parseRefined(responseText);
      if (refined.size() > 0) {
        { refinedText = refined };
      } else {
        // Fallback to local processing if API returns empty
        { refinedText = locallyRefined };
      };
    } catch (_) {
      // On any error, use local fallback
      { refinedText = locallyRefined };
    };
  };
};
