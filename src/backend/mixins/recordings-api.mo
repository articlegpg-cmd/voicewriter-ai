import Map "mo:core/Map";
import RecordingsLib "../lib/recordings";
import Common "../types/common";
import RecordingTypes "../types/recordings";

mixin (
  recordings : Map.Map<Common.RecordingId, RecordingTypes.Recording>,
  idCounter : Common.Counter,
) {
  /// Create a new recording entry (audio already uploaded separately)
  public shared ({ caller }) func createRecording(req : RecordingTypes.CreateRecordingRequest) : async RecordingTypes.RecordingInfo {
    let id = idCounter.value;
    idCounter.value += 1;
    RecordingsLib.create(recordings, id, caller, req);
  };

  /// List all recordings owned by the caller
  public shared query ({ caller }) func listRecordings() : async [RecordingTypes.RecordingInfo] {
    RecordingsLib.list(recordings, caller);
  };

  /// Get a single recording by ID
  public shared query ({ caller }) func getRecording(id : Common.RecordingId) : async ?RecordingTypes.RecordingInfo {
    RecordingsLib.get(recordings, caller, id);
  };

  /// Update the title of a recording
  public shared ({ caller }) func updateRecordingTitle(id : Common.RecordingId, title : Text) : async Bool {
    RecordingsLib.updateTitle(recordings, caller, id, title);
  };

  /// Update the transcript and status for a recording
  public shared ({ caller }) func updateTranscript(req : RecordingTypes.UpdateTranscriptRequest) : async Bool {
    RecordingsLib.updateTranscript(recordings, caller, req);
  };

  /// Delete a recording
  public shared ({ caller }) func deleteRecording(id : Common.RecordingId) : async Bool {
    RecordingsLib.delete(recordings, caller, id);
  };
};
