import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ThreatDetection {
    threatType: ThreatType;
    timestamp: Time;
    details: string;
    riskScore: bigint;
    detectionMethod: DetectionMethod;
}
export type Time = bigint;
export enum DetectionMethod {
    BehavioralAnalysis = "BehavioralAnalysis",
    PatternMatch = "PatternMatch",
    ReputationScoring = "ReputationScoring"
}
export enum ThreatType {
    PhishingURL = "PhishingURL",
    Keylogger = "Keylogger"
}
export interface backendInterface {
    analyzeURL(url: string): Promise<ThreatDetection>;
    detectKeylogger(processName: string): Promise<ThreatDetection>;
    getAllDetections(): Promise<Array<ThreatDetection>>;
    getDetectionsByRiskScore(minScore: bigint): Promise<Array<ThreatDetection>>;
    getDetectionsByType(threatType: ThreatType): Promise<Array<ThreatDetection>>;
}
