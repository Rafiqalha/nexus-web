"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Check,
  CircleHelp,
  Clock3,
  X,
  ArrowUpRight,
  Download,
} from "@/components/ui/icons";
import {
  decisionLabel,
  normalizeDecision,
  timestamp,
} from "@/lib/adapters/evidence";
import { useDemo, useDemoRead } from "./demo-context";

export function ConsoleTitle({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="console-page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children && <div className="console-page-description">{children}</div>}
      </div>
      {action}
    </header>
  );
}
export function DecisionBadge({ value }: { value: string }) {
  const kind = normalizeDecision(value);
  const Icon =
    kind === "accepted"
      ? Check
      : kind === "expired"
        ? Clock3
        : kind === "rejected" || kind === "error"
          ? X
          : CircleHelp;
  return (
    <span className={`decision-badge decision-${kind}`}>
      <Icon size={14} />
      {decisionLabel(value)}
    </span>
  );
}
export function EmptyState({
  title,
  children,
  href,
  action,
}: {
  title: string;
  children: ReactNode;
  href?: string;
  action?: string;
}) {
  return (
    <section className="console-empty">
      <CircleHelp size={28} />
      <h2>{title}</h2>
      <p>{children}</p>
      {href && (
        <Link className="button button-secondary" href={href}>
          {action}
          <ArrowUpRight size={14} />
        </Link>
      )}
    </section>
  );
}
export function ConsoleLoading() {
  return (
    <section
      className="console-state"
      aria-busy="true"
      aria-label="Loading demo records"
    >
      <p className="eyebrow">Simulated data</p>
      <h1>Loading demo records</h1>
      <p>Preparing the synthetic workspace view.</p>
      <div className="console-skeleton" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
export function DemoGate({ children }: { children: ReactNode }) {
  const result = useDemoRead();
  const { setScenario } = useDemo();
  if (result.status === "loading")
    return (
      <>
        <ConsoleLoading />
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setScenario("records")}
        >
          Restore demo data
        </button>
      </>
    );
  if (result.status !== "ready") {
    const state = {
      error: {
        title: "Unable to load demo data",
        body: "This scenario illustrates a service error. An error is not an empty workspace or a policy rejection.",
        action: "Retry demo read",
      },
      denied: {
        title: "Access denied in this scenario",
        body: "This is a simulated permission denial. No real tenant resources were requested.",
        action: "Restore demo access",
      },
      "expired-session": {
        title: "Demo session expired",
        body: "This scenario illustrates an expired session. No real sign-in or customer session is involved.",
        action: "Restore demo session",
      },
    }[result.status];
    return (
      <section className="console-state" role="status">
        <p className="eyebrow">Simulated data · Recovery scenario</p>
        <h1>{state.title}</h1>
        <p>{state.body}</p>
        <p className="mono small">Diagnostic: {result.diagnosticId}</p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => setScenario("records")}
        >
          {state.action}
        </button>
      </section>
    );
  }
  return (
    <>
      {result.data.stale && (
        <div className="console-stale" role="status">
          <Clock3 size={16} />
          <span>
            Stale simulated data · Last successful snapshot:{" "}
            {timestamp(result.data.asOf)}. These records are not a current
            service response.
          </span>
          <button onClick={() => setScenario("records")} type="button">
            Reload demo snapshot
          </button>
        </div>
      )}
      {children}
    </>
  );
}
export function SummaryActions({
  text,
  filename,
}: {
  text: string;
  filename: string;
}) {
  const [status, setStatus] = useState("");
  const content = `NEXUS — SIMULATED DATA\nNot a live verification result.\n\n${text}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("Labeled simulated summary copied.");
    } catch {
      setStatus("Copy is unavailable. Download the labeled summary instead.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Labeled simulated summary download started.");
  }
  return (
    <div className="summary-actions">
      <div>
        <button
          type="button"
          className="button button-secondary"
          onClick={copy}
        >
          Copy summary
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={download}
        >
          <Download size={14} /> Download summary
        </button>
      </div>
      <p role="status">{status}</p>
    </div>
  );
}
export function Timeline({
  events,
}: {
  events: { at: string; label: string; detail: string }[];
}) {
  return events.length ? (
    <ol className="console-timeline">
      {events.map((event, index) => (
        <li key={`${event.at}-${index}`}>
          <time dateTime={event.at}>{timestamp(event.at)}</time>
          <strong>{event.label}</strong>
          <p>{event.detail}</p>
        </li>
      ))}
    </ol>
  ) : (
    <p>No historical events are available in this fixture.</p>
  );
}
