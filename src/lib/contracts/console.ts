export type DemoState =
  | "records"
  | "empty"
  | "error"
  | "denied"
  | "expired-session"
  | "stale"
  | "loading";
export type ThemePreference = "dark" | "light" | "system";
export type Decision =
  "accepted" | "expired" | "rejected" | "unavailable" | "error" | "unknown";
export type EvidenceOrigin =
  "server_verified" | "client_reported" | "simulated" | "unknown";
export type Evaluation =
  "passed" | "failed" | "not_evaluated" | "unavailable" | "error" | "unknown";

export interface EvidenceItem {
  checkId: string;
  label: string;
  evaluation: string;
  origin: EvidenceOrigin;
  representedOrigin: Exclude<EvidenceOrigin, "simulated">;
  scope: string;
  observedAt: string | null;
  expiresAt: string | null;
  reasonCode: string;
  reasonText: string;
  metric?: { label: string; value: number | null; unit: string };
}
export interface RequestRecord {
  id: string;
  receivedAt: string;
  environment: "staging";
  decision: string;
  decisionScope: string;
  reasonCode: string;
  reasonText: string;
  transport: "responded" | "timeout";
  latencyMs: number | null;
  enrollmentId: string | null;
  policyId: string | null;
  evidence: EvidenceItem[];
  events: { at: string; label: string; detail: string }[];
}
export interface EnrollmentRecord {
  id: string;
  label: string;
  status: "active" | "revoked" | "unknown";
  securityLevel: "hardware-backed" | "software-backed" | "unknown";
  securityRevision: string | null;
  enrolledAt: string | null;
  leaseSeconds: number | null;
  events: { at: string; label: string; detail: string }[];
}
export interface PolicyRecord {
  id: string;
  revision: string;
  state: "active" | "superseded";
  effectiveAt: string;
  digest: string | null;
  scope: string;
  rules: { label: string; value: string; limit: string }[];
}
export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  operation: "workspace" | "enrollment" | "policy";
  label: string;
  detail: string;
  href: string;
}
export interface ConsoleSnapshot {
  mode: "demo";
  workspaceId: string;
  project: string;
  environment: "staging";
  asOf: string;
  rangeStart: string;
  stale: boolean;
  requests: RequestRecord[];
  enrollments: EnrollmentRecord[];
  policies: PolicyRecord[];
  audit: AuditEvent[];
}
export type ReadResult<T> =
  | { status: "ready"; data: T }
  | {
      status: "loading" | "error" | "denied" | "expired-session";
      diagnosticId: string;
    };
export interface RequestQuery {
  q: string;
  decision: string;
  sort: "newest" | "oldest" | "latency";
  page: number;
}
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  pageSize: number;
}
