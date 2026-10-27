import type {
  Decision,
  Evaluation,
  EvidenceOrigin,
} from "@/lib/contracts/console";

const decisions: Record<Decision, string> = {
  accepted: "Accepted under policy",
  expired: "Expired",
  rejected: "Rejected",
  unavailable: "Unavailable",
  error: "No decision",
  unknown: "Unknown decision",
};
const evaluations: Record<Evaluation, string> = {
  passed: "Passed",
  failed: "Failed",
  not_evaluated: "Not evaluated",
  unavailable: "Unavailable",
  error: "Error",
  unknown: "Unknown evaluation",
};
export function normalizeDecision(value: string): Decision {
  return Object.hasOwn(decisions, value) ? (value as Decision) : "unknown";
}
export function decisionLabel(value: string) {
  return decisions[normalizeDecision(value)];
}
export function evaluationLabel(value: string) {
  return Object.hasOwn(evaluations, value)
    ? evaluations[value as Evaluation]
    : evaluations.unknown;
}
export function originLabel(value: EvidenceOrigin) {
  return (
    {
      simulated: "Simulated",
      server_verified: "Server verified",
      client_reported: "Client reported",
      unknown: "Unknown origin",
    }[value] ?? "Unknown origin"
  );
}
export function timestamp(value: string | null) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toISOString().replace("T", " ").replace(".000Z", " UTC")
    : "Unavailable";
}
export function measured(value: number | null, unit: string) {
  return value !== null && Number.isFinite(value)
    ? `${value} ${unit}`
    : "Unavailable";
}
