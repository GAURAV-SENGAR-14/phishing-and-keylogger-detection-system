import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";

actor {
  type ThreatDetection = {
    threatType : ThreatType;
    detectionMethod : DetectionMethod;
    timestamp : Time.Time;
    riskScore : Nat;
    details : Text;
  };

  let detectionsStorage = List.empty<ThreatDetection>();

  type ThreatType = {
    #PhishingURL;
    #Keylogger;
  };

  type DetectionMethod = {
    #PatternMatch;
    #BehavioralAnalysis;
    #ReputationScoring;
  };

  public shared ({ caller }) func analyzeURL(url : Text) : async ThreatDetection {
    let riskScore = calculateRiskScore(url);
    let details = "URL contains potential phishing indicators. Risk score: " # riskScore.toText();

    let detection : ThreatDetection = {
      threatType = #PhishingURL;
      detectionMethod = #PatternMatch;
      timestamp = Time.now();
      riskScore;
      details;
    };

    detectionsStorage.add(detection);

    detection;
  };

  public shared ({ caller }) func detectKeylogger(processName : Text) : async ThreatDetection {
    let riskScore = calculateProcessScore(processName);
    let details = "Process name matches known keylogger signatures. Risk score: " # riskScore.toText();

    let detection : ThreatDetection = {
      threatType = #Keylogger;
      detectionMethod = #BehavioralAnalysis;
      timestamp = Time.now();
      riskScore;
      details;
    };

    detectionsStorage.add(detection);

    detection;
  };

  public query ({ caller }) func getAllDetections() : async [ThreatDetection] {
    detectionsStorage.toArray();
  };

  public query ({ caller }) func getDetectionsByType(threatType : ThreatType) : async [ThreatDetection] {
    detectionsStorage.filter(func(d) { d.threatType == threatType }).toArray();
  };

  public query ({ caller }) func getDetectionsByRiskScore(minScore : Nat) : async [ThreatDetection] {
    detectionsStorage.filter(func(d) { d.riskScore >= minScore }).toArray();
  };

  func calculateRiskScore(url : Text) : Nat {
    var score = 0;

    if (containsPhishingKeywords(url)) {
      score += 50;
    };

    if (isIpBasedDomain(url)) {
      score += 30;
    };

    if (hasExcessiveSubdomains(url)) {
      score += 20;
    };

    score;
  };

  func containsPhishingKeywords(url : Text) : Bool {
    switch (
      ["login", "secure", "account", "verify"].find(
        func(keyword) { url.contains(#text(keyword)) }
      )
    ) {
      case (?_) { true };
      case (null) { false };
    };
  };

  func isIpBasedDomain(url : Text) : Bool {
    url.contains(#text("http://")) and url.contains(#text(".")) and not url.contains(#text("https://"));
  };

  func hasExcessiveSubdomains(url : Text) : Bool {
    let charArray = url.toArray();
    let dotCount = charArray.foldLeft(
      0,
      func(count, c) {
        count + (if (c == '.') { 1 } else { 0 });
      },
    );
    dotCount > 3;
  };

  func calculateProcessScore(processName : Text) : Nat {
    if (isKnownKeyloggerProcess(processName)) {
      80;
    } else if (hasSuspiciousBehavior(processName)) {
      60;
    } else {
      20;
    };
  };

  func isKnownKeyloggerProcess(processName : Text) : Bool {
    switch (
      ["keylog", "logger", "spy", "record"].find(
        func(pattern) { processName.contains(#text(pattern)) }
      )
    ) {
      case (?_) { true };
      case (null) { false };
    };
  };

  func hasSuspiciousBehavior(processName : Text) : Bool {
    processName.contains(#text("input")) or processName.contains(#text("monitor"));
  };
};
