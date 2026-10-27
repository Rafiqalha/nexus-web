import type {
  AuditEvent,
  ConsoleSnapshot,
  EnrollmentRecord,
  EvidenceItem,
  PolicyRecord,
  RequestRecord,
} from "@/lib/contracts/console";

export const DEMO_AS_OF = "2026-10-27T09:00:00.000Z";
export const DEFAULT_WORKSPACE = "Nexus example workspace";
const at = (minutes: number) =>
  new Date(Date.parse(DEMO_AS_OF) + minutes * 60_000).toISOString();

export const enrollments: EnrollmentRecord[] = [
  {
    id: "enr_demo_android_01",
    label: "Android staging device",
    status: "active",
    securityLevel: "hardware-backed",
    securityRevision: "security-rev-3",
    enrolledAt: at(-50),
    leaseSeconds: 600,
    events: [
      {
        at: at(-50),
        label: "Enrollment fixture created",
        detail: "Synthetic hardware-backed enrollment context.",
      },
      {
        at: at(-40),
        label: "Security revision recorded",
        detail:
          "Illustrative security-rev-3; this website performed no attestation.",
      },
    ],
  },
  {
    id: "enr_demo_software_02",
    label: "Software-backed evaluation device",
    status: "active",
    securityLevel: "software-backed",
    securityRevision: "security-rev-1",
    enrolledAt: at(-45),
    leaseSeconds: 600,
    events: [
      {
        at: at(-45),
        label: "Enrollment fixture created",
        detail:
          "Software-backed context, distinct from hardware-backed evidence.",
      },
    ],
  },
  {
    id: "enr_demo_revoked_03",
    label: "Revoked staging device",
    status: "revoked",
    securityLevel: "hardware-backed",
    securityRevision: "security-rev-4",
    enrolledAt: at(-55),
    leaseSeconds: 600,
    events: [
      {
        at: at(-55),
        label: "Enrollment fixture created",
        detail: "A historical synthetic enrollment.",
      },
      {
        at: at(-20),
        label: "Revocation fixture recorded",
        detail:
          "Future operations are blocked in this illustrative state. Previously issued offline evidence may remain within its lease.",
      },
    ],
  },
  {
    id: "enr_demo_unknown_04",
    label: "Unclassified evidence source",
    status: "unknown",
    securityLevel: "unknown",
    securityRevision: null,
    enrolledAt: null,
    leaseSeconds: null,
    events: [],
  },
];

const rules = [
  {
    label: "Key statement",
    value: "Signature and enrolled-key context required",
    limit: "Authenticates a statement; not camera provenance.",
  },
  {
    label: "Freshness",
    value: "Illustrative maximum lease: 600 seconds",
    limit: "Assessed against the fixed demo snapshot.",
  },
  {
    label: "Capture measurements",
    value: "Reported separately",
    limit:
      "Client-reported measurements do not become server-verified sensor evidence.",
  },
  {
    label: "Camera provenance and liveness",
    value: "Not established by this policy",
    limit: "No human or biometric verdict is inferred.",
  },
];
export const policies: PolicyRecord[] = [
  {
    id: "demo-policy-v1",
    revision: "1",
    state: "active",
    effectiveAt: at(-40),
    digest: null,
    scope: "Enrolled key statement in an illustrative staging context",
    rules,
  },
  {
    id: "demo-policy-v0",
    revision: "0",
    state: "superseded",
    effectiveAt: at(-58),
    digest: null,
    scope: "Historical illustrative enrolled-key policy",
    rules: rules.map((rule) => ({ ...rule })),
  },
];

const variants = [
  {
    decision: "accepted",
    reasonCode: "STATEMENT_ACCEPTED",
    reasonText:
      "The enrolled key statement meets the illustrative policy. This is not a liveness or human verdict.",
  },
  {
    decision: "expired",
    reasonCode: "LEASE_EXPIRED",
    reasonText:
      "The evidence lease has expired at the fixed snapshot. A valid signature does not make evidence current.",
  },
  {
    decision: "rejected",
    reasonCode: "SIGNATURE_MISMATCH",
    reasonText:
      "The statement signature fails the illustrative key check. Later checks are not evaluated.",
  },
  {
    decision: "unavailable",
    reasonCode: "EVIDENCE_MISSING",
    reasonText:
      "Required evidence is absent. Missing observations and metrics remain unavailable.",
  },
  {
    decision: "error",
    reasonCode: "TRANSPORT_TIMEOUT",
    reasonText:
      "The simulated service timed out. No policy decision was received.",
  },
  {
    decision: "policy_indeterminate_v2",
    reasonCode: "UNRECOGNIZED_DECISION",
    reasonText:
      "The fixture contains an unknown decision value. It must not be treated as accepted.",
  },
];

function evidence(index: number, observedAt: string): EvidenceItem[] {
  const kind = index % variants.length;
  const reported = kind === 0 || kind === 1;
  const missing = kind === 3;
  const base = (
    checkId: string,
    label: string,
    scope: string,
  ): EvidenceItem => ({
    checkId,
    label,
    scope,
    evaluation: "not_evaluated",
    origin: "simulated",
    representedOrigin: "unknown",
    observedAt: null,
    expiresAt: null,
    reasonCode: "CHECK_NOT_RUN",
    reasonText: "This check was not evaluated in the synthetic scenario.",
  });
  return [
    {
      ...base(
        "key-signature",
        "Key signature",
        "Authenticity of the enrolled key statement",
      ),
      evaluation: reported
        ? "passed"
        : kind === 2
          ? "failed"
          : missing
            ? "unavailable"
            : kind === 5
              ? "future_check_pending"
              : "not_evaluated",
      representedOrigin: "server_verified",
      observedAt: reported || kind === 2 ? observedAt : null,
      reasonCode: reported ? "KEY_MATCH" : variants[kind].reasonCode,
      reasonText: variants[kind].reasonText,
    },
    {
      ...base(
        "freshness",
        "Evidence freshness",
        "Whether this statement is within its policy lease",
      ),
      evaluation:
        kind === 0
          ? "passed"
          : kind === 1
            ? "failed"
            : missing
              ? "unavailable"
              : "not_evaluated",
      representedOrigin: "server_verified",
      observedAt: reported ? observedAt : null,
      expiresAt:
        kind === 0
          ? new Date(Date.parse(observedAt) + 600_000).toISOString()
          : kind === 1
            ? at(-15)
            : null,
      reasonCode:
        kind === 0
          ? "WITHIN_LEASE"
          : kind === 1
            ? "LEASE_EXPIRED"
            : "NO_FRESHNESS_DECISION",
      reasonText:
        kind === 0
          ? "Within the illustrative lease at the fixed snapshot."
          : kind === 1
            ? "Lease expired before the snapshot."
            : "Freshness was not established.",
    },
    {
      ...base(
        "capture-quality",
        "Capture measurement",
        "Client-reported input quality; no liveness or sensor provenance",
      ),
      evaluation: reported
        ? "not_evaluated"
        : missing
          ? "unavailable"
          : "not_evaluated",
      representedOrigin: "client_reported",
      observedAt: reported ? observedAt : null,
      metric: {
        label: "Reported quality score",
        value: reported ? (index === 6 ? 0 : 0.84) : null,
        unit: "(0–1)",
      },
      reasonCode: reported ? "CLIENT_CLAIM_ONLY" : "METRIC_UNAVAILABLE",
      reasonText: reported
        ? "This numeric claim is not independently verified by the website."
        : "No measurement was supplied; it is not zero.",
    },
    {
      ...base(
        "camera-provenance",
        "Camera provenance",
        "Origin of the physical camera input",
      ),
      evaluation: "unavailable",
      reasonCode: "PROVENANCE_UNVERIFIED",
      reasonText:
        "A device-key signature does not establish camera sensor origin.",
    },
    {
      ...base("liveness", "Liveness", "Whether a live person is present"),
      reasonCode: "LIVENESS_NOT_EVALUATED",
      reasonText:
        "The demonstration does not evaluate liveness or prove humanity.",
    },
  ];
}
export const requests: RequestRecord[] = Array.from(
  { length: 18 },
  (_, index) => {
    const variant = variants[index % variants.length];
    const receivedAt = at(-index / 2 - 1);
    const timeout = variant.decision === "error";
    return {
      ...variant,
      id: `req_demo_${String(index + 1).padStart(3, "0")}`,
      receivedAt,
      environment: "staging",
      decisionScope: "Enrolled key statement only",
      transport: timeout ? "timeout" : "responded",
      latencyMs:
        timeout || variant.decision === "unavailable" ? null : 36 + index * 7,
      enrollmentId:
        variant.decision === "unavailable"
          ? null
          : index === 13
            ? enrollments[2].id
            : index % variants.length === 5
              ? enrollments[3].id
              : enrollments[index % 2].id,
      policyId: "demo-policy-v1",
      evidence: evidence(index, receivedAt),
      events: [
        {
          at: receivedAt,
          label: "Synthetic request recorded",
          detail:
            "The fixture supplies this request event; no network verification occurred.",
        },
        {
          at: receivedAt,
          label: timeout
            ? "Timeout fixture recorded"
            : "Synthetic response recorded",
          detail: variant.reasonText,
        },
      ],
    };
  },
);

export const audit: AuditEvent[] = [
  {
    id: "evt_demo_001",
    at: at(-58),
    actor: "Fixture author · simulated",
    operation: "workspace",
    label: "Example workspace initialized",
    detail: "Fixed synthetic history, not a real account event.",
    href: "/demo/settings",
  },
  {
    id: "evt_demo_002",
    at: at(-55),
    actor: "Fixture author · simulated",
    operation: "enrollment",
    label: "Enrollment example created",
    detail: "Historical enrollment fixture.",
    href: "/demo/enrollments/enr_demo_revoked_03",
  },
  {
    id: "evt_demo_003",
    at: at(-50),
    actor: "Fixture author · simulated",
    operation: "enrollment",
    label: "Android enrollment example created",
    detail: "No hardware attestation was performed by this website.",
    href: "/demo/enrollments/enr_demo_android_01",
  },
  {
    id: "evt_demo_004",
    at: at(-40),
    actor: "Fixture author · simulated",
    operation: "policy",
    label: "Policy revision 1 selected in fixture",
    detail: "Illustrative read-only policy context.",
    href: "/demo/policies/demo-policy-v1",
  },
  {
    id: "evt_demo_005",
    at: at(-20),
    actor: "Fixture author · simulated",
    operation: "enrollment",
    label: "Revocation example recorded",
    detail:
      "This history does not promise immediate invalidation of offline evidence.",
    href: "/demo/enrollments/enr_demo_revoked_03",
  },
];

export const snapshot: ConsoleSnapshot = {
  mode: "demo",
  workspaceId: "ws_demo_example",
  project: "Android staging evaluation",
  environment: "staging",
  asOf: DEMO_AS_OF,
  rangeStart: at(-60),
  stale: false,
  requests,
  enrollments,
  policies,
  audit,
};
