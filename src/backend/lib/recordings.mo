import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/recordings";
import Common "../types/common";

module {
  public func toInfo(r : Types.Recording) : Types.RecordingInfo {
    {
      id = r.id;
      owner = r.owner;
      title = r.title;
      durationSeconds = r.durationSeconds;
      audioBlobRef = r.audioBlobRef;
      transcript = r.transcript;
      transcriptStatus = r.transcriptStatus;
      language = r.language;
      createdAt = r.createdAt;
      updatedAt = r.updatedAt;
    };
  };

  public func create(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    nextId : Nat,
    owner : Common.UserId,
    req : Types.CreateRecordingRequest,
  ) : Types.RecordingInfo {
    let now = Time.now();
    let recording : Types.Recording = {
      id = nextId;
      owner = owner;
      var title = req.title;
      var durationSeconds = req.durationSeconds;
      audioBlobRef = req.audioBlobRef;
      var transcript = "";
      var transcriptStatus = #pending;
      var language = req.language;
      createdAt = now;
      var updatedAt = now;
    };
    recordings.add(nextId, recording);
    toInfo(recording);
  };

  public func list(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    owner : Common.UserId,
  ) : [Types.RecordingInfo] {
    recordings.entries().filterMap(
      func((_, r) : (Common.RecordingId, Types.Recording)) : ?Types.RecordingInfo {
        if (Principal.equal(r.owner, owner)) { ?toInfo(r) } else { null }
      }
    ).toArray();
  };

  public func get(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    owner : Common.UserId,
    id : Common.RecordingId,
  ) : ?Types.RecordingInfo {
    switch (recordings.get(id)) {
      case (?r) {
        if (Principal.equal(r.owner, owner)) { ?toInfo(r) } else { null };
      };
      case null { null };
    };
  };

  public func updateTranscript(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    owner : Common.UserId,
    req : Types.UpdateTranscriptRequest,
  ) : Bool {
    switch (recordings.get(req.id)) {
      case (?r) {
        if (not Principal.equal(r.owner, owner)) { return false };
        r.transcript := req.transcript;
        r.transcriptStatus := req.status;
        r.updatedAt := Time.now();
        true;
      };
      case null { false };
    };
  };

  public func updateTitle(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    owner : Common.UserId,
    id : Common.RecordingId,
    title : Text,
  ) : Bool {
    switch (recordings.get(id)) {
      case (?r) {
        if (not Principal.equal(r.owner, owner)) { return false };
        r.title := title;
        r.updatedAt := Time.now();
        true;
      };
      case null { false };
    };
  };

  public func delete(
    recordings : Map.Map<Common.RecordingId, Types.Recording>,
    owner : Common.UserId,
    id : Common.RecordingId,
  ) : Bool {
    switch (recordings.get(id)) {
      case (?r) {
        if (not Principal.equal(r.owner, owner)) { return false };
        recordings.remove(id);
        true;
      };
      case null { false };
    };
  };
};
