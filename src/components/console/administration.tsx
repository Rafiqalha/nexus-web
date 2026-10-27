"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Code2 } from "@/components/ui/icons";
import type { ThemePreference } from "@/lib/contracts/console";
import { timestamp } from "@/lib/adapters/evidence";
import { useDemo, useDemoRead } from "./demo-context";
import { ConsoleTitle, DemoGate, EmptyState } from "./shared";
import { explorationSteps } from "./overview";
import { Walkthrough } from "@/components/evidence/walkthrough";

export function IntegrationsScreen() {
  const { explored, toggleExplored } = useDemo();
  return (
    <>
      <ConsoleTitle
        eyebrow="Integration setup"
        title="A clear path into the stack."
      >
        <p>
          Explore the supported staging boundaries before planning a real
          integration.
        </p>
      </ConsoleTitle>
      <div className="console-two-columns">
        <section className="console-panel">
          <Code2 size={26} />
          <h2>Native Rust / C and Android staging</h2>
          <p>
            Developer preview. The public website does not execute the native
            SDK, enroll a device, or issue signing credentials.
          </p>
          <Link
            className="button button-secondary"
            href="/developers#platforms"
          >
            Review verified platform availability <ArrowUpRight size={14} />
          </Link>
        </section>
        <section className="console-panel">
          <h2>Connected capabilities</h2>
          <dl className="console-property-list">
            <div>
              <dt>Authentication</dt>
              <dd>Unavailable · No verified web session contract</dd>
            </div>
            <div>
              <dt>Management reads</dt>
              <dd>Unavailable · No verified management API</dd>
            </div>
            <div>
              <dt>Credentials and mutations</dt>
              <dd>Unavailable · No keys are issued in this demo</dd>
            </div>
            <div>
              <dt>Production enrollment</dt>
              <dd>Blocked in the documented developer preview</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="console-section">
        <h2>Explore a first-request workflow</h2>
        <p>
          These steps record only what you mark explored in this isolated
          session. They do not mark a real SDK integration complete.
        </p>
        <ol className="console-integration-steps">
          {explorationSteps.map((step, index) => (
            <li className="console-panel" key={step.id}>
              <span className="mono">0{index + 1}</span>
              <div>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
                <Link href={step.href}>
                  Open this step <ArrowUpRight size={13} />
                </Link>
              </div>
              <button
                type="button"
                className="button button-secondary"
                aria-pressed={explored.includes(step.id)}
                onClick={() => toggleExplored(step.id)}
              >
                {explored.includes(step.id) && <Check size={14} />}
                {explored.includes(step.id)
                  ? "Marked explored"
                  : "Mark explored"}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <div className="console-boundary-note">
        <strong>Before a connected integration</strong>
        <p>
          A real authentication and tenant-scoped management API must define
          supported reads, errors, timeouts, pagination, and authorization.
          Device enrollment endpoints are not a management API.
        </p>
        <Link href="/developers#sources">
          Read the current source notes <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}

export function AuditScreen() {
  const read = useDemoRead();
  const params = useSearchParams();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const raw = params.get("event");
  const kind = ["workspace", "enrollment", "policy"].includes(raw ?? "")
    ? raw
    : "all";
  const events = read.data.audit
    .filter((event) => kind === "all" || event.operation === kind)
    .toSorted((a, b) => b.at.localeCompare(a.at));
  return (
    <DemoGate>
      <ConsoleTitle eyebrow="Administrative history" title="Audit log">
        <p>
          A fixed synthetic event history. Session controls do not create
          server-recorded audit events.
        </p>
      </ConsoleTitle>
      <nav className="console-filter-links" aria-label="Filter audit events">
        {["all", "workspace", "enrollment", "policy"].map((value) => (
          <Link
            key={value}
            href={`/demo/audit${value === "all" ? "" : `?event=${value}`}`}
            aria-current={value === kind ? "page" : undefined}
          >
            {value === "all"
              ? "All events"
              : `${value[0].toUpperCase()}${value.slice(1)}`}
          </Link>
        ))}
      </nav>
      <p className="console-range">
        {events.length} synthetic events · All times UTC
      </p>
      {events.length ? (
        <div
          className="console-table-scroll"
          role="region"
          aria-label="Synthetic audit events"
          tabIndex={0}
        >
          <table className="console-table">
            <caption>Fixed fixture history · Simulated data</caption>
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Time · UTC</th>
                <th scope="col">Actor</th>
                <th scope="col">Related context</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <th scope="row">
                    {event.label}
                    <small>{event.detail}</small>
                    <small className="mono">{event.id}</small>
                  </th>
                  <td>{timestamp(event.at)}</td>
                  <td>{event.actor}</td>
                  <td>
                    <Link href={event.href}>
                      Inspect context <ArrowUpRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No audit events in this view"
          href="/demo/audit"
          action="View all events"
        >
          Clear the filter or restore Example records to inspect the fixed
          history.
        </EmptyState>
      )}
    </DemoGate>
  );
}

export function SettingsScreen() {
  const { workspace, setWorkspace, theme, setTheme } = useDemo();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const value = String(
      new FormData(event.currentTarget).get("workspace") ?? "",
    ).trim();
    if (!value || value.length > 120) {
      setError("Enter a workspace label between 1 and 120 characters.");
      input.current?.focus();
      return;
    }
    setError("");
    setWorkspace(value);
    setStatus(
      "Demo session label updated. It will reset when this session is reloaded or reset.",
    );
  }
  return (
    <>
      <ConsoleTitle eyebrow="Isolated demo preferences" title="Settings">
        <p>
          Appearance and session presentation only. No real organization or
          account is modified.
        </p>
      </ConsoleTitle>
      <section className="console-panel console-settings-panel">
        <h2>Example workspace</h2>
        <form onSubmit={save} noValidate>
          <div className="field">
            <label htmlFor={`${id}-workspace`}>
              Workspace label · This session
            </label>
            <input
              ref={input}
              id={`${id}-workspace`}
              name="workspace"
              defaultValue={workspace}
              key={workspace}
              maxLength={120}
              aria-invalid={!!error}
              aria-describedby={`${id}-error`}
            />
            <p id={`${id}-error`} className="field-error">
              {error}
            </p>
          </div>
          <button className="button button-primary" type="submit">
            Update session label
          </button>
          <p className="console-form-status" role="status">
            {status}
          </p>
        </form>
      </section>
      <section className="console-panel console-settings-panel">
        <h2>Appearance</h2>
        <label htmlFor={`${id}-theme`}>Console theme</label>
        <select
          id={`${id}-theme`}
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemePreference)}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System preference</option>
        </select>
        <p>
          Stored as a non-secret appearance cookie for this browser. System
          preference follows your device theme.
        </p>
      </section>
      <section className="console-panel console-settings-panel">
        <h2>Workspace boundaries</h2>
        <dl className="console-property-list">
          <div>
            <dt>Workspace ID</dt>
            <dd className="mono">ws_demo_example</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>Staging illustration · Production unavailable</dd>
          </div>
          <div>
            <dt>Illustrative role</dt>
            <dd>Demo viewer · No real identity or tenant membership</dd>
          </div>
          <div>
            <dt>Member and credential management</dt>
            <dd>Unavailable without an authenticated management contract</dd>
          </div>
        </dl>
      </section>
      <section className="console-boundary-note">
        <strong>Reset behavior</strong>
        <p>
          Use Reset demo session above to restore the example workspace label,
          default records, URL filters, and exploration checklist. Your
          appearance preference stays selected. Reloading starts a new demo
          session.
        </p>
        <p>
          No customer data, secret values, or evidence payloads are stored in
          browser storage.
        </p>
      </section>
    </>
  );
}

export function WalkthroughScreen() {
  const { resetVersion } = useDemo();
  return (
    <>
      <ConsoleTitle
        eyebrow="Interactive evidence walkthrough"
        title="One request. Different evidence."
      >
        <p>
          Compare five synthetic outcomes. These controls illustrate evidence
          boundaries and do not execute the SDK.
        </p>
      </ConsoleTitle>
      <div className="console-walkthrough">
        <Walkthrough key={resetVersion} expanded />
      </div>
      <div className="console-boundary-note">
        <strong>From illustration to investigation</strong>
        <p>
          The request list includes durable examples of these decisions, plus
          unknown values and missing metrics.
        </p>
        <Link href="/demo/requests">
          Inspect the request records <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
