"use client";
import { useState } from "react";
import {
  Check,
  Clock3,
  CircleHelp,
  X,
  RotateCcw,
  FileCheck2,
  ArrowDown,
} from "lucide-react";
const scenarios = {
  fresh: {
    label: "Fresh",
    verdict: "Accepted under policy",
    tone: "success",
    signature: "Passed",
    freshness: "Within lease",
    transport: "Response received",
    reason:
      "The enrolled key statement meets the illustrative policy. Capture measurements remain client-reported.",
  },
  expired: {
    label: "Expired",
    verdict: "Expired",
    tone: "warning",
    signature: "Passed",
    freshness: "Lease expired",
    transport: "Response received",
    reason:
      "The evidence is outside its allowed lease. A valid signature does not make expired evidence current.",
  },
  rejected: {
    label: "Rejected",
    verdict: "Rejected",
    tone: "danger",
    signature: "Failed",
    freshness: "Not evaluated",
    transport: "Response received",
    reason:
      "The key signature does not match. The illustrative policy rejects this statement; later checks are not evaluated.",
  },
  unavailable: {
    label: "Missing evidence",
    verdict: "Unavailable",
    tone: "neutral",
    signature: "Unavailable",
    freshness: "Unavailable",
    transport: "Response received",
    reason:
      "Required evidence is missing. No passing result or zero measurement is inferred.",
  },
  error: {
    label: "Server error",
    verdict: "No decision",
    tone: "danger",
    signature: "Not evaluated",
    freshness: "Not evaluated",
    transport: "Request timed out",
    reason:
      "The simulated server did not respond. A transport failure is not a policy rejection.",
  },
} as const;
type Scenario = keyof typeof scenarios;
export function Walkthrough({ expanded = false }: { expanded?: boolean }) {
  const [selected, setSelected] = useState<Scenario>("fresh");
  const current = scenarios[selected];
  const VerdictIcon =
    current.tone === "success"
      ? Check
      : current.tone === "warning"
        ? Clock3
        : current.tone === "danger"
          ? X
          : CircleHelp;
  return (
    <section
      className={`evidence-preview ${expanded ? "expanded" : ""}`}
      aria-label="Interactive evidence walkthrough"
    >
      <div className="preview-top">
        <div className="preview-title">
          <FileCheck2 size={18} aria-hidden="true" />
          <span>Request inspection</span>
        </div>
        <span className="simulation-label">Simulated data</span>
      </div>
      <div
        className="scenario-controls"
        role="group"
        aria-label="Choose a synthetic scenario"
      >
        {(Object.keys(scenarios) as Scenario[])
          .filter(
            (key) => expanded || ["fresh", "expired", "rejected"].includes(key),
          )
          .map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
            >
              {scenarios[key].label}
            </button>
          ))}
      </div>
      <div className="preview-body" aria-live="polite" aria-atomic="true">
        <div className="request-meta">
          <span className="mono">req_demo_01</span>
          <span>Staging illustration</span>
        </div>
        <div className={`verdict ${current.tone}`}>
          <VerdictIcon size={20} aria-hidden="true" />
          <strong>{current.verdict}</strong>
        </div>
        <p className="policy-scope">
          Policy: demo-policy-v1 · Scope: enrolled key statement
        </p>
        <dl className="evidence-rows">
          <div>
            <dt>Key signature</dt>
            <dd>
              {current.signature === "Passed" && (
                <Check size={14} aria-hidden="true" />
              )}
              {current.signature}
            </dd>
          </div>
          <div>
            <dt>Evidence freshness</dt>
            <dd>{current.freshness}</dd>
          </div>
          <div>
            <dt>Capture measurements</dt>
            <dd>
              {selected === "fresh" || selected === "expired"
                ? "Client-reported*"
                : "Unavailable"}
            </dd>
          </div>
          <div>
            <dt>Camera provenance</dt>
            <dd className="muted">Unverified</dd>
          </div>
          <div>
            <dt>Liveness</dt>
            <dd className="muted">Not evaluated</dd>
          </div>
        </dl>
        <div className="preview-note">
          <ArrowDown size={16} aria-hidden="true" />
          <p>{current.reason}</p>
        </div>
        {expanded && (
          <dl className="evidence-rows extended-rows">
            <div>
              <dt>Transport</dt>
              <dd>{current.transport}</dd>
            </div>
            <div>
              <dt>Data origin</dt>
              <dd>Simulated</dd>
            </div>
            <div>
              <dt>Production eligibility</dt>
              <dd>Not established</dd>
            </div>
          </dl>
        )}
      </div>
      <div className="preview-bottom">
        <span>*All values are synthetic. No live verification.</span>
        {expanded && (
          <button
            className="reset-button"
            type="button"
            onClick={() => setSelected("fresh")}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset demo
          </button>
        )}
      </div>
    </section>
  );
}
