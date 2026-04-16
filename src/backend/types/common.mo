import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type Timestamp = Time.Time;
  public type RecordingId = Nat;
  public type Counter = { var value : Nat };
};
