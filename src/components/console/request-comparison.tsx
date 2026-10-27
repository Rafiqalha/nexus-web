"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, type FormEvent } from "react";
import type { EvidenceItem, RequestRecord } from "@/lib/contracts/console";
import {
  decisionLabel,
  evaluationLabel,
  measured,
  normalizeDecision,
  originLabel,
  timestamp,
} from "@/lib/adapters/evidence";
import { compareEvidence } from "@/lib/adapters/request-comparison";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/icons";
import { useDemoRead } from "./demo-context";
import { ConsoleTitle, DecisionBadge, DemoGate, EmptyState } from "./shared";

function RequestContext({
  record,
  side,
}: {
  record: RequestRecord;
  side: string;
}) {
  return (
    <article
      className="comparison-context"
      aria-label={`Request ${side} context`}
    >
      <p className="eyebrow">Request {side} · Simulated data</p>
      <h2>
        <Link href={`/demo/requests/${record.id}`}>
          {record.id} <ArrowUpRight size={14} />
        </Link>
      </h2>
      <DecisionBadge value={record.decision} />
      <p>{record.decisionScope}</p>
      <p>{record.reasonText}</p>
      <dl className="comparison-facts">
        <div>
          <dt>Reason</dt>
          <dd className="mono">{record.reasonCode}</dd>
        </div>
        {normalizeDecision(record.decision) === "unknown" && (
          <div>
            <dt>Unknown decision value</dt>
            <dd className="mono">{record.decision}</dd>
          </div>
        )}
        <div>
          <dt>Transport outcome</dt>
          <dd>
            {record.transport === "timeout"
              ? "Request timed out · No service decision"
              : "Response received"}
          </dd>
        </div>
        <div>
          <dt>Received · UTC</dt>
          <dd>{timestamp(record.receivedAt)}</dd>
        </div>
        <div>
          <dt>Measured latency</dt>
          <dd>{measured(record.latencyMs, "ms")}</dd>
        </div>
        <div>
          <dt>Policy</dt>
          <dd>
            {record.policyId ? (
              <Link href={`/demo/policies/${record.policyId}`}>
                {record.policyId}
              </Link>
            ) : (
              "Unavailable"
            )}
          </dd>
        </div>
        <div>
          <dt>Enrollment</dt>
          <dd>
            {record.enrollmentId ? (
              <Link href={`/demo/enrollments/${record.enrollmentId}`}>
                {record.enrollmentId}
              </Link>
            ) : (
              "Unavailable"
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function EvidenceContext({
  item,
  side,
}: {
  item?: EvidenceItem;
  side: string;
}) {
  return (
    <div
      className="comparison-evidence"
      aria-label={`Request ${side} evidence`}
      role="group"
    >
      <p className="comparison-side">Request {side}</p>
      {item ? (
        <>
          <strong>{evaluationLabel(item.evaluation)}</strong>
          <p>{item.reasonText}</p>
          <dl className="comparison-facts">
            <div>
              <dt>Diagnostic</dt>
              <dd className="mono">{item.reasonCode}</dd>
            </div>
            {evaluationLabel(item.evaluation) === "Unknown evaluation" && (
              <div>
                <dt>Unknown evaluation value</dt>
                <dd className="mono">{item.evaluation}</dd>
              </div>
            )}
            <div>
              <dt>Origin</dt>
              <dd>
                {originLabel(item.origin)} · Models:{" "}
                {originLabel(item.representedOrigin)}
              </dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{item.scope}</dd>
            </div>
            {item.metric && (
              <div>
                <dt>{item.metric.label}</dt>
                <dd>{measured(item.metric.value, item.metric.unit)}</dd>
              </div>
            )}
            <div>
              <dt>Observed · UTC</dt>
              <dd>{timestamp(item.observedAt)}</dd>
            </div>
            <div>
              <dt>Expires · UTC</dt>
              <dd>{timestamp(item.expiresAt)}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p>Unavailable in this request. No evaluation or origin is inferred.</p>
      )}
    </div>
  );
}

export function RequestComparison() {
  const read = useDemoRead();
  const params = useSearchParams();
  const router = useRouter();
  const formId = useId();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const records = read.data.requests;
  const initial = !params.has("left") && !params.has("right");
  const leftId = initial ? records[0]?.id : params.get("left");
  const rightId = initial ? records[1]?.id : params.get("right");
  const left = records.find((record) => record.id === leftId);
  const right = records.find((record) => record.id === rightId);
  const valid =
    left &&
    right &&
    left.id !== right.id &&
    params.getAll("left").length <= 1 &&
    params.getAll("right").length <= 1;
  const differencesOnly = params.get("differences") === "1";
  const checks = valid ? compareEvidence(left, right) : [];
  const different = checks.filter((check) => check.different).length;
  const visible = checks.filter((check) => !differencesOnly || check.different);

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams({
      left: String(data.get("left") ?? ""),
      right: String(data.get("right") ?? ""),
    });
    if (data.has("differences")) next.set("differences", "1");
    router.push(`/demo/requests/compare?${next}`, { scroll: false });
  }
  function swap() {
    if (!left || !right) return;
    const next = new URLSearchParams({ left: right.id, right: left.id });
    if (differencesOnly) next.set("differences", "1");
    router.push(`/demo/requests/compare?${next}`, { scroll: false });
  }

  return (
    <DemoGate>
      <Link className="console-back" href="/demo/requests">
        <ArrowLeft size={15} /> All requests
      </Link>
      <ConsoleTitle
        eyebrow="Investigation · Simulated data"
        title="Compare requests"
      >
        <p>
          Follow the evidence behind two decisions. Different details do not
          imply a better or safer request.
        </p>
      </ConsoleTitle>
      {records.length < 2 ? (
        <EmptyState
          title="Two requests are needed to compare"
          href="/demo/integrations"
          action="Explore integration setup"
        >
          This scenario has no comparison pair. Restore Example records above to
          compare synthetic requests.
        </EmptyState>
      ) : (
        <>
          <form
            className="comparison-form"
            action="/demo/requests/compare"
            method="get"
            onSubmit={apply}
            key={params.toString()}
          >
            {(["left", "right"] as const).map((name, index) => (
              <div key={name}>
                <label htmlFor={`${formId}-${name}`}>
                  Request {index === 0 ? "A" : "B"}
                </label>
                <select
                  id={`${formId}-${name}`}
                  name={name}
                  defaultValue={(index === 0 ? left?.id : right?.id) ?? ""}
                  required
                >
                  <option value="" disabled>
                    Choose a request
                  </option>
                  {records.map((record) => (
                    <option value={record.id} key={record.id}>
                      {record.id} · {decisionLabel(record.decision)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button className="button button-primary" type="submit">
              Compare selected requests
            </button>
            <label
              className="comparison-filter"
              htmlFor={`${formId}-differences`}
            >
              <input
                type="checkbox"
                id={`${formId}-differences`}
                name="differences"
                value="1"
                defaultChecked={differencesOnly}
              />
              Show only different evidence
            </label>
          </form>
          {!valid ? (
            <div className="comparison-invalid" role="alert">
              <strong>
                {left && right && left.id === right.id
                  ? "Choose two different requests"
                  : "This comparison pair is unavailable"}
              </strong>
              <p>
                Select two distinct synthetic records above. Missing, unknown,
                or repeated URL parameters are not replaced with another
                request.
              </p>
              <Link
                className="button button-secondary"
                href="/demo/requests/compare"
              >
                Use example pair
              </Link>
            </div>
          ) : (
            <>
              <div className="console-result-bar comparison-result-bar">
                <p role="status">
                  {different} of {checks.length} evidence checks have different
                  details · {visible.length} shown
                </p>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={swap}
                >
                  Swap requests
                </button>
              </div>
              <div className="comparison-pair">
                <RequestContext record={left} side="A" />
                <RequestContext record={right} side="B" />
              </div>
              <section
                className="console-section"
                aria-labelledby={`${formId}-evidence`}
              >
                <div className="console-section-heading">
                  <div>
                    <h2 id={`${formId}-evidence`}>Evidence comparison</h2>
                    <p>
                      Matched by check identity, including scope, origin,
                      observations, expiry, and missing values.
                    </p>
                  </div>
                </div>
                <div className="comparison-checks">
                  {visible.map((check) => (
                    <section
                      className="comparison-check"
                      key={check.checkId}
                      aria-labelledby={`${formId}-${check.checkId}`}
                    >
                      <header>
                        <h3 id={`${formId}-${check.checkId}`}>{check.label}</h3>
                        <span className="console-tag">
                          {check.different
                            ? "Different details"
                            : "Matching details"}
                        </span>
                      </header>
                      <div className="comparison-pair">
                        <EvidenceContext item={check.left} side="A" />
                        <EvidenceContext item={check.right} side="B" />
                      </div>
                    </section>
                  ))}
                  {!visible.length && (
                    <p className="console-panel">
                      No evidence checks differ in the displayed fields.
                      Matching details do not establish security equivalence.
                    </p>
                  )}
                </div>
              </section>
              <div className="console-boundary-note">
                <strong>One fixed snapshot. Two synthetic requests.</strong>
                <p>
                  Staging · {timestamp(read.data.asOf)}. This comparison does
                  not establish causality, camera provenance, liveness, or human
                  identity. Production eligibility is not established.
                </p>
                <Link href="/security">
                  Read the trust boundaries <ArrowUpRight size={14} />
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </DemoGate>
  );
}
