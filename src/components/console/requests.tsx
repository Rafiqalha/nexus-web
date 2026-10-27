"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, type FormEvent } from "react";
import type { RequestRecord } from "@/lib/contracts/console";
import {
  decisionLabel,
  evaluationLabel,
  measured,
  normalizeDecision,
  originLabel,
  timestamp,
} from "@/lib/adapters/evidence";
import { demoService, requestQuery } from "@/lib/demo/service";
import { ArrowLeft, ArrowUpRight, FileCheck2 } from "@/components/ui/icons";
import { useDemoRead } from "./demo-context";
import {
  ConsoleTitle,
  DecisionBadge,
  DemoGate,
  EmptyState,
  SummaryActions,
  Timeline,
} from "./shared";

export function RequestTable({
  records,
  caption,
}: {
  records: RequestRecord[];
  caption: string;
}) {
  return (
    <div
      className="console-table-scroll"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="console-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Decision</th>
            <th scope="col">Received · UTC</th>
            <th scope="col">Reason</th>
            <th scope="col">Latency</th>
            <th scope="col">Policy / environment</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <th scope="row">
                <Link
                  className="console-record-link mono"
                  href={`/demo/requests/${record.id}`}
                >
                  <FileCheck2 size={16} />
                  {record.id}
                  <ArrowUpRight size={12} />
                </Link>
              </th>
              <td>
                <DecisionBadge value={record.decision} />
              </td>
              <td>
                <time dateTime={record.receivedAt}>
                  {timestamp(record.receivedAt).slice(11)}
                </time>
              </td>
              <td className="mono console-reason">{record.reasonCode}</td>
              <td className="numeric">{measured(record.latencyMs, "ms")}</td>
              <td>
                <span className="mono">{record.policyId ?? "Unavailable"}</span>
                <small>Staging · Simulated</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RequestsScreen() {
  const read = useDemoRead();
  const params = useSearchParams();
  const router = useRouter();
  const formId = useId();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const query = requestQuery(params);
  const result = demoService.listRequests(read.data.requests, query);
  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const q = String(data.get("q") ?? "")
      .trim()
      .slice(0, 80);
    if (q) next.set("q", q);
    if (data.get("decision") !== "all")
      next.set("decision", String(data.get("decision")));
    if (data.get("sort") !== "newest")
      next.set("sort", String(data.get("sort")));
    router.push(`/demo/requests${next.size ? `?${next}` : ""}`);
  }
  function pageHref(page: number) {
    const next = new URLSearchParams();
    if (query.q) next.set("q", query.q);
    if (query.decision !== "all") next.set("decision", query.decision);
    if (query.sort !== "newest") next.set("sort", query.sort);
    next.set("page", String(page));
    return `/demo/requests?${next}`;
  }
  return (
    <DemoGate>
      <ConsoleTitle eyebrow="Investigation" title="Requests">
        <p>Inspect the decision, its evidence, and the limits of each check.</p>
      </ConsoleTitle>
      <form
        className="console-filters"
        action="/demo/requests"
        method="get"
        onSubmit={apply}
        key={params.toString()}
      >
        <div>
          <label htmlFor={`${formId}-q`}>Search requests</label>
          <input
            id={`${formId}-q`}
            name="q"
            defaultValue={query.q}
            maxLength={80}
            placeholder="Request ID, reason, or policy"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-decision`}>Decision</label>
          <select
            id={`${formId}-decision`}
            name="decision"
            defaultValue={query.decision}
          >
            <option value="all">All decisions</option>
            {[
              "accepted",
              "expired",
              "rejected",
              "unavailable",
              "error",
              "unknown",
            ].map((value) => (
              <option key={value} value={value}>
                {decisionLabel(value)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${formId}-sort`}>Sort requests</label>
          <select id={`${formId}-sort`} name="sort" defaultValue={query.sort}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="latency">Highest measured latency</option>
          </select>
        </div>
        <button type="submit" className="button button-primary">
          Apply filters
        </button>
      </form>
      <div className="console-result-bar">
        <p role="status">
          {result.total} matching requests · {read.data.requests.length}{" "}
          synthetic records in the fixed one-hour snapshot
        </p>
        <Link href="/demo/requests">Clear filters</Link>
      </div>
      {result.items.length ? (
        <>
          <RequestTable
            records={result.items}
            caption="Synthetic staging requests"
          />
          <nav className="console-pagination" aria-label="Request pages">
            {result.page > 1 ? (
              <Link href={pageHref(result.page - 1)}>Previous</Link>
            ) : (
              <span aria-disabled="true">Previous</span>
            )}
            <span>
              Page {result.page} of {result.pages}
            </span>
            {Array.from({ length: result.pages }, (_, index) => index + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={pageHref(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === result.page ? "page" : undefined}
                >
                  {page}
                </Link>
              ),
            )}
            {result.page < result.pages ? (
              <Link href={pageHref(result.page + 1)}>Next</Link>
            ) : (
              <span aria-disabled="true">Next</span>
            )}
          </nav>
        </>
      ) : (
        <EmptyState
          title={
            read.data.requests.length
              ? "No requests match these filters"
              : "No requests in this scenario"
          }
          href={
            read.data.requests.length ? "/demo/requests" : "/demo/integrations"
          }
          action={
            read.data.requests.length
              ? "Clear request filters"
              : "Explore integration setup"
          }
        >
          {read.data.requests.length
            ? "Change the search or decision filter to inspect another synthetic request."
            : "The empty-workspace scenario contains no request records. Explore the setup guide or restore Example records above."}
        </EmptyState>
      )}
    </DemoGate>
  );
}

export function RequestDetail({ id }: { id: string }) {
  const read = useDemoRead();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const record = read.data.requests.find((value) => value.id === id);
  if (!record)
    return (
      <DemoGate>
        <ConsoleTitle
          eyebrow="Request inspection"
          title="No request in this scenario"
        />
        <EmptyState
          title="This scenario has no request record"
          href="/demo/requests"
          action="Return to requests"
        >
          Restore Example records above to inspect the synthetic request at this
          URL.
        </EmptyState>
      </DemoGate>
    );
  const summary = [
    `Request: ${record.id}`,
    `Snapshot: ${read.data.asOf}`,
    `Environment: staging`,
    `Decision: ${decisionLabel(record.decision)}`,
    `Scope: ${record.decisionScope}`,
    `Transport: ${record.transport}`,
    `Reason: ${record.reasonCode}`,
    ...record.evidence.map(
      (item) =>
        `${item.label}: ${evaluationLabel(item.evaluation)}; origin: Simulated; scope: ${item.scope}`,
    ),
    "Camera provenance and liveness are not established. Production eligibility is not established.",
  ].join("\n");
  return (
    <DemoGate>
      <Link className="console-back" href="/demo/requests">
        <ArrowLeft size={15} /> All requests
      </Link>
      <ConsoleTitle
        eyebrow="Request inspection · Simulated data"
        title={record.id}
      >
        <p>{timestamp(record.receivedAt)} · Staging</p>
      </ConsoleTitle>
      <section className="console-decision-panel">
        <DecisionBadge value={record.decision} />
        <h2>{record.decisionScope}</h2>
        <p>{record.reasonText}</p>
        <code>{record.reasonCode}</code>
        {normalizeDecision(record.decision) === "unknown" && (
          <p>
            Unrecognized decision value: <code>{record.decision}</code>
          </p>
        )}
      </section>
      <dl className="console-facts">
        <div>
          <dt>Transport outcome</dt>
          <dd>
            {record.transport === "timeout"
              ? "Request timed out · No service decision"
              : "Response received"}
          </dd>
        </div>
        <div>
          <dt>Data origin</dt>
          <dd>Simulated data</dd>
        </div>
        <div>
          <dt>Measured latency</dt>
          <dd>{measured(record.latencyMs, "ms")}</dd>
        </div>
        <div>
          <dt>Production eligibility</dt>
          <dd>Not established</dd>
        </div>
      </dl>
      <section className="console-section">
        <div className="console-section-heading">
          <div>
            <h2>Evidence and coverage</h2>
            <p>
              Each row preserves its scope. The source describes what this
              synthetic record models.
            </p>
          </div>
        </div>
        <div
          className="console-table-scroll"
          role="region"
          aria-label="Request evidence"
          tabIndex={0}
        >
          <table className="console-table evidence-detail-table">
            <caption>
              Simulated evidence · evaluated at the fixed snapshot, not the
              current clock
            </caption>
            <thead>
              <tr>
                <th scope="col">Check / scope</th>
                <th scope="col">Evaluation</th>
                <th scope="col">Origin</th>
                <th scope="col">Observation / expiry</th>
              </tr>
            </thead>
            <tbody>
              {record.evidence.map((item) => (
                <tr key={item.checkId}>
                  <th scope="row">
                    {item.label}
                    <small>{item.scope}</small>
                    {item.metric && (
                      <small>
                        {item.metric.label}:{" "}
                        <strong>
                          {measured(item.metric.value, item.metric.unit)}
                        </strong>
                      </small>
                    )}
                  </th>
                  <td>
                    <strong>{evaluationLabel(item.evaluation)}</strong>
                    <small className="mono">{item.reasonCode}</small>
                    <small>{item.reasonText}</small>
                    {evaluationLabel(item.evaluation) ===
                      "Unknown evaluation" && <code>{item.evaluation}</code>}
                  </td>
                  <td>
                    {originLabel(item.origin)}
                    <small>Models: {originLabel(item.representedOrigin)}</small>
                  </td>
                  <td>
                    <small>Observed: {timestamp(item.observedAt)}</small>
                    <small>Expires: {timestamp(item.expiresAt)}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="console-two-columns">
        <section className="console-panel">
          <h2>Related context</h2>
          <dl className="console-property-list">
            <div>
              <dt>Enrollment</dt>
              <dd>
                {record.enrollmentId ? (
                  <Link href={`/demo/enrollments/${record.enrollmentId}`}>
                    {record.enrollmentId}
                    <ArrowUpRight size={13} />
                  </Link>
                ) : (
                  "Unavailable"
                )}
              </dd>
            </div>
            <div>
              <dt>Policy</dt>
              <dd>
                {record.policyId ? (
                  <Link href={`/demo/policies/${record.policyId}`}>
                    {record.policyId}
                    <ArrowUpRight size={13} />
                  </Link>
                ) : (
                  "Unavailable"
                )}
              </dd>
            </div>
            <div>
              <dt>Coverage limits</dt>
              <dd>Camera provenance unverified. Liveness not evaluated.</dd>
            </div>
          </dl>
          <SummaryActions
            text={summary}
            filename={`${record.id}-simulated-summary.txt`}
          />
        </section>
        <section className="console-panel">
          <h2>Synthetic event timeline</h2>
          <p>Events explicitly supplied by this fixture.</p>
          <Timeline events={record.events} />
        </section>
      </div>
    </DemoGate>
  );
}
