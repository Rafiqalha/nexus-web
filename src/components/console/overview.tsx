"use client";

import Link from "next/link";
import { measured, timestamp } from "@/lib/adapters/evidence";
import { useDemo, useDemoRead } from "./demo-context";
import { ConsoleTitle, DemoGate, EmptyState } from "./shared";
import { RequestTable } from "./requests";
import { ArrowUpRight, Check } from "@/components/ui/icons";

export const explorationSteps = [
  {
    id: "integration",
    label: "Explore the integration path",
    detail: "Review the native and server boundaries.",
    href: "/demo/integrations",
  },
  {
    id: "request",
    label: "Inspect a request",
    detail: "Read a scoped decision and its unknowns.",
    href: "/demo/requests/req_demo_001",
  },
  {
    id: "policy",
    label: "Review the policy context",
    detail: "See the revision and coverage limits.",
    href: "/demo/policies/demo-policy-v1",
  },
];
export function OverviewScreen() {
  const read = useDemoRead();
  const { explored, toggleExplored } = useDemo();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const data = read.data;
  const latencies = data.requests
    .flatMap((record) => (record.latencyMs === null ? [] : [record.latencyMs]))
    .sort((a, b) => a - b);
  const middle = Math.floor(latencies.length / 2);
  const median = latencies.length
    ? latencies.length % 2
      ? latencies[middle]
      : (latencies[middle - 1] + latencies[middle]) / 2
    : null;
  const accepted = data.requests.filter(
    (record) => record.decision === "accepted",
  ).length;
  const errors = data.requests.filter(
    (record) => record.transport === "timeout",
  ).length;
  return (
    <DemoGate>
      <ConsoleTitle
        eyebrow="Workspace overview"
        title="Evidence, in context."
        action={
          <Link className="button button-primary" href="/demo/requests">
            Inspect requests <ArrowUpRight size={15} />
          </Link>
        }
      >
        <p>
          A synthetic staging workspace for exploring how request evidence is
          presented.
        </p>
      </ConsoleTitle>
      <section className="console-onboarding">
        <div className="console-section-heading">
          <div>
            <h2>Explore your demo workspace</h2>
            <p>
              {explored.length} of {explorationSteps.length} marked explored ·
              Session-only progress
            </p>
          </div>
          <progress
            max={explorationSteps.length}
            value={explored.length}
            aria-label="Demo exploration progress"
          />
        </div>
        <div className="console-setup-grid">
          {explorationSteps.map((step, index) => (
            <article key={step.id}>
              <span className="mono small">0{index + 1}</span>
              <Link href={step.href}>
                {step.label}
                <ArrowUpRight size={14} />
              </Link>
              <p>{step.detail}</p>
              <button
                type="button"
                aria-pressed={explored.includes(step.id)}
                onClick={() => toggleExplored(step.id)}
              >
                {explored.includes(step.id) && <Check size={14} />}
                {explored.includes(step.id)
                  ? "Marked explored"
                  : "Mark explored"}
              </button>
            </article>
          ))}
        </div>
      </section>
      {data.requests.length ? (
        <>
          <div className="console-metrics">
            <article>
              <span>Request volume</span>
              <strong>{data.requests.length}</strong>
              <small>Synthetic records in this range</small>
            </article>
            <article>
              <span>Accepted under policy</span>
              <strong>{accepted}</strong>
              <small>
                {accepted} of {data.requests.length} · Enrolled-key statements
              </small>
            </article>
            <article>
              <span>Transport errors</span>
              <strong>{errors}</strong>
              <small>No policy verdict on timeout</small>
            </article>
            <article>
              <span>Median measured latency</span>
              <strong>{measured(median, "ms")}</strong>
              <small>
                {latencies.length} of {data.requests.length} records have
                measurements
              </small>
            </article>
          </div>
          <p className="console-range">
            Source: fixed synthetic fixtures · {timestamp(data.rangeStart)} –{" "}
            {timestamp(data.asOf)} · Staging. Missing latency values are
            excluded from the median.
          </p>
          <section className="console-section">
            <div className="console-section-heading">
              <div>
                <h2>Recent requests</h2>
                <p>
                  See the statement, decision, and evidence behind each record.
                </p>
              </div>
              <Link href="/demo/requests">
                View all requests <ArrowUpRight size={14} />
              </Link>
            </div>
            <RequestTable
              records={data.requests.slice(0, 5)}
              caption="Recent synthetic requests"
            />
          </section>
        </>
      ) : (
        <EmptyState
          title="Your demo workspace has no requests"
          href="/demo/integrations"
          action="Explore integration setup"
        >
          This is the empty-workspace scenario. Use the setup guide or choose
          Example records to inspect the fixed dataset.
        </EmptyState>
      )}
      <div className="console-boundary-note">
        <strong>What this demo establishes</strong>
        <p>
          These are synthetic evidence examples. Device integrity and a valid
          key statement do not prove liveness, camera origin, or that the
          operator is human.
        </p>
        <Link href="/demo/walkthrough">
          Compare the five interactive scenarios <ArrowUpRight size={14} />
        </Link>
      </div>
    </DemoGate>
  );
}
