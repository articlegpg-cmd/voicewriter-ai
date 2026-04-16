import Text "mo:core/Text";
import Char "mo:core/Char";
import Types "../types/recordings";

module {
  // Client-side filler word removal for English and Bengali
  public func removeFillersLocally(text : Text) : Text {
    // English and Bengali common filler words/phrases
    let fillers = [
      " um ", " uh ", " like ", " erm ", " er ",
      " you know ", " i mean ", " kind of ", " sort of ",
      " basically ", " actually ", " right ", " okay so ",
      " so um ", " so uh ",
    ];
    var result = " " # text # " ";
    for (filler in fillers.vals()) {
      result := result.replace(#text filler, " ");
    };
    // Trim surrounding spaces we added
    result := result.trim(#char ' ');
    // Collapse multiple spaces
    collapseSpaces(result);
  };

  // Build JSON body for AI text refinement outcall (OpenAI-compatible)
  public func buildRefineBody(req : Types.RefineRequest) : Text {
    let modeInstruction = switch (req.mode) {
      case (#removeFiller) {
        "Remove all filler words and hesitations (um, uh, like, erm, you know, i mean, basically, actually) from the following text. Keep the core meaning fully intact. Return only the cleaned text with no explanation."
      };
      case (#rewrite) {
        "Rewrite the following text into well-organized, polished paragraphs. Fix flow, remove hesitations, and structure the content clearly. Return only the rewritten text with no explanation."
      };
      case (#grammarFix) {
        "Fix all grammar, spelling, and punctuation errors in the following text. Preserve the original meaning and structure. Return only the corrected text with no explanation."
      };
      case (#summarize) {
        "Summarize the following text into concise key points capturing the main ideas. Return only the summary with no explanation."
      };
    };

    let escapedText = escapeJson(req.text);
    let escapedInstruction = escapeJson(modeInstruction);
    "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"" # escapedInstruction # "\"},{\"role\":\"user\",\"content\":\"" # escapedText # "\"}],\"max_tokens\":2000,\"temperature\":0.3}";
  };

  // Parse transcription result — extract "text" field from Whisper JSON response
  // Whisper returns: {"text": "..."}
  public func parseTranscript(jsonResponse : Text) : Text {
    extractJsonStringField(jsonResponse, "text");
  };

  // Parse refined text from OpenAI chat completion JSON response
  // Response: {"choices":[{"message":{"content":"..."}}]}
  public func parseRefined(jsonResponse : Text) : Text {
    let contentMarker = "\"content\":\"";
    switch (findSubstring(jsonResponse, contentMarker)) {
      case (?startIdx) {
        let afterMarker = substringFrom(jsonResponse, startIdx + contentMarker.size());
        unescapeJson(extractUntilUnescapedQuote(afterMarker));
      };
      case null { "" };
    };
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  func collapseSpaces(text : Text) : Text {
    var result = "";
    var prevSpace = false;
    for (ch in text.toIter()) {
      if (ch.toNat32() == 32) {
        if (not prevSpace) { result := result # " " };
        prevSpace := true;
      } else {
        result := result # Text.fromChar(ch);
        prevSpace := false;
      };
    };
    result;
  };

  func escapeJson(text : Text) : Text {
    var result = "";
    for (ch in text.toIter()) {
      let c = ch.toNat32();
      if (c == 34) { result := result # "\\\"" }      // '"'
      else if (c == 92) { result := result # "\\\\" }  // '\'
      else if (c == 10) { result := result # "\\n" }   // '\n'
      else if (c == 13) { result := result # "\\r" }   // '\r'
      else { result := result # Text.fromChar(ch) };
    };
    result;
  };

  func extractJsonStringField(json : Text, fieldName : Text) : Text {
    let marker = "\"" # fieldName # "\":\"";
    switch (findSubstring(json, marker)) {
      case (?startIdx) {
        let afterMarker = substringFrom(json, startIdx + marker.size());
        unescapeJson(extractUntilUnescapedQuote(afterMarker));
      };
      case null { "" };
    };
  };

  func findSubstring(haystack : Text, needle : Text) : ?Nat {
    let hArr = haystack.toArray();
    let nArr = needle.toArray();
    let hLen = hArr.size();
    let nLen = nArr.size();
    if (nLen == 0) { return ?0 };
    if (hLen < nLen) { return null };
    var i = 0;
    while (i + nLen <= hLen) {
      if (matchAt(hArr, nArr, i, nLen)) { return ?i };
      i += 1;
    };
    null;
  };

  func matchAt(hArr : [Char], nArr : [Char], start : Nat, nLen : Nat) : Bool {
    var j = 0;
    while (j < nLen) {
      if (hArr[start + j].toNat32() != nArr[j].toNat32()) { return false };
      j += 1;
    };
    true;
  };

  func substringFrom(text : Text, start : Nat) : Text {
    let arr = text.toArray();
    let len = arr.size();
    if (start >= len) { return "" };
    var result = "";
    var i = start;
    while (i < len) {
      result := result # Text.fromChar(arr[i]);
      i += 1;
    };
    result;
  };

  func extractUntilUnescapedQuote(text : Text) : Text {
    let arr = text.toArray();
    let len = arr.size();
    var result = "";
    var i = 0;
    var escaped = false;
    label scan loop {
      if (i >= len) { break scan };
      let ch = arr[i];
      let c = ch.toNat32();
      if (escaped) {
        result := result # Text.fromChar(ch);
        escaped := false;
      } else if (c == 92) {  // '\'
        escaped := true;
      } else if (c == 34) {  // '"'
        break scan;
      } else {
        result := result # Text.fromChar(ch);
      };
      i += 1;
    };
    result;
  };

  func unescapeJson(text : Text) : Text {
    let arr = text.toArray();
    let len = arr.size();
    var result = "";
    var i = 0;
    while (i < len) {
      let ch = arr[i];
      if (ch.toNat32() == 92 and i + 1 < len) {  // '\'
        let next = arr[i + 1];
        let nc = next.toNat32();
        if (nc == 34) { result := result # "\""; i += 2 }       // '"'
        else if (nc == 92) { result := result # "\\"; i += 2 }  // '\'
        else if (nc == 110) { result := result # "\n"; i += 2 } // 'n'
        else if (nc == 114) { result := result # "\r"; i += 2 } // 'r'
        else if (nc == 116) { result := result # "\t"; i += 2 } // 't'
        else { result := result # Text.fromChar(ch); i += 1 };
      } else {
        result := result # Text.fromChar(ch);
        i += 1;
      };
    };
    result;
  };
};
