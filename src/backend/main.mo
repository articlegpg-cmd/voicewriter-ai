import Map "mo:core/Map";
import Common "types/common";
import RecordingTypes "types/recordings";
import RecordingsApi "mixins/recordings-api";
import AiApi "mixins/ai-api";

actor {
  let recordings = Map.empty<Common.RecordingId, RecordingTypes.Recording>();
  let idCounter : Common.Counter = { var value = 0 };

  include RecordingsApi(recordings, idCounter);
  include AiApi(recordings);
};
