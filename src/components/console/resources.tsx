"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Smartphone,
  ListChecks,
} from "@/components/ui/icons";
import { measured, timestamp } from "@/lib/adapters/evidence";
import { useDemoRead } from "./demo-context";
import { ConsoleTitle, DemoGate, EmptyState, Timeline } from "./shared";
import { RequestTable } from "./requests";

export function EnrollmentsScreen() {
  const read = useDemoRead();
  const params = useSearchParams();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const raw = params.get("status");
  const status = ["active", "revoked", "unknown"].includes(raw ?? "")
    ? raw
    : "all";
  const records = read.data.enrollments.filter(
    (record) => status === "all" || record.status === status,
  );
  return (
    <DemoGate>
      <ConsoleTitle eyebrow="Enrollment inspection" title="Enrollments">
        <p>Stable enrollment identity and security revision remain separate.</p>
      </ConsoleTitle>
      <nav
        className="console-filter-links"
        aria-label="Filter enrollment status"
      >
        {["all", "active", "revoked", "unknown"].map((value) => (
          <Link
            href={`/demo/enrollments${value === "all" ? "" : `?status=${value}`}`}
            aria-current={status === value ? "page" : undefined}
            key={value}
          >
            {value === "all"
              ? "All enrollments"
              : `${value[0].toUpperCase()}${value.slice(1)}`}
          </Link>
        ))}
      </nav>
      <p className="console-range">
        {records.length} synthetic enrollments · Source: fixed demo fixtures ·
        Staging
      </p>
      {records.length ? (
        <div
          className="console-table-scroll"
          role="region"
          aria-label="Synthetic enrollments"
          tabIndex={0}
        >
          <table className="console-table">
            <caption>Synthetic enrollment records</caption>
            <thead>
              <tr>
                <th scope="col">Enrollment</th>
                <th scope="col">Current status</th>
                <th scope="col">Security level</th>
                <th scope="col">Security revision</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <th scope="row">
                    <Link
                      className="console-record-link"
                      href={`/demo/enrollments/${record.id}`}
                    >
                      <Smartphone size={18} />
                      {record.label}
                      <ArrowUpRight size={13} />
                    </Link>
                    <small className="mono">{record.id}</small>
                  </th>
                  <td>
                    <span className="console-tag">{record.status}</span>
                  </td>
                  <td>{record.securityLevel}</td>
                  <td className="mono">
                    {record.securityRevision ?? "Unavailable"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No enrollments in this view"
          href="/demo/enrollments"
          action="View all enrollment examples"
        >
          Clear the status filter or restore Example records above.
        </EmptyState>
      )}
    </DemoGate>
  );
}

export function EnrollmentDetail({ id }: { id: string }) {
  const read = useDemoRead();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const record = read.data.enrollments.find((value) => value.id === id);
  if (!record)
    return (
      <DemoGate>
        <ConsoleTitle
          eyebrow="Enrollment inspection"
          title="Enrollment unavailable in this scenario"
        />
        <EmptyState
          title="No enrollment record"
          href="/demo/enrollments"
          action="All enrollments"
        >
          Choose Example records above to restore the fixture.
        </EmptyState>
      </DemoGate>
    );
  const related = read.data.requests.filter(
    (request) => request.enrollmentId === id,
  );
  return (
    <DemoGate>
      <Link className="console-back" href="/demo/enrollments">
        <ArrowLeft size={15} /> All enrollments
      </Link>
      <ConsoleTitle
        eyebrow="Enrollment detail · Simulated data"
        title={record.label}
      >
        <p className="mono">{record.id}</p>
      </ConsoleTitle>
      <dl className="console-facts">
        <div>
          <dt>Current enrollment status</dt>
          <dd>{record.status}</dd>
        </div>
        <div>
          <dt>Security level</dt>
          <dd>{record.securityLevel}</dd>
        </div>
        <div>
          <dt>Security revision</dt>
          <dd>{record.securityRevision ?? "Unavailable"}</dd>
        </div>
        <div>
          <dt>Enrolled at</dt>
          <dd>{timestamp(record.enrolledAt)}</dd>
        </div>
      </dl>
      <div className="console-two-columns">
        <section className="console-panel">
          <h2>Identity and lease scope</h2>
          <dl className="console-property-list">
            <div>
              <dt>Stable identity</dt>
              <dd className="mono">{record.id}</dd>
            </div>
            <div>
              <dt>Illustrative offline lease</dt>
              <dd>{measured(record.leaseSeconds, "seconds")}</dd>
            </div>
            <div>
              <dt>Data origin</dt>
              <dd>Simulated. No attestation was performed by this website.</dd>
            </div>
          </dl>
          <p>
            Revocation blocks future operations in the example. Previously
            issued offline evidence may remain usable within its bounded lease.
            A session expiring does not establish enrollment revocation.
          </p>
          <p>
            Enrollment changes and revocation require a real authorized service
            and are unavailable here.
          </p>
        </section>
        <section className="console-panel">
          <h2>Enrollment history</h2>
          <Timeline events={record.events} />
        </section>
      </div>
      <section className="console-section">
        <h2>Related synthetic requests</h2>
        {related.length ? (
          <RequestTable
            records={related}
            caption="Requests referencing this enrollment"
          />
        ) : (
          <EmptyState
            title="No related requests"
            href="/demo/requests"
            action="Browse requests"
          >
            No request in the fixed dataset references this enrollment.
          </EmptyState>
        )}
      </section>
    </DemoGate>
  );
}

export function PoliciesScreen() {
  const read = useDemoRead();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  return (
    <DemoGate>
      <ConsoleTitle eyebrow="Read-only policy context" title="Policies">
        <p>Inspect exact fixture revisions and the scope they model.</p>
      </ConsoleTitle>
      {read.data.policies.length ? (
        <div className="console-policy-list">
          {read.data.policies.map((policy) => (
            <article className="console-panel" key={policy.id}>
              <ListChecks size={22} />
              <div>
                <Link href={`/demo/policies/${policy.id}`}>
                  {policy.id}
                  <ArrowUpRight size={14} />
                </Link>
                <p>{policy.scope}</p>
                <small>
                  Revision {policy.revision} · Effective{" "}
                  {timestamp(policy.effectiveAt)} · Simulated origin
                </small>
              </div>
              <span className="console-tag">{policy.state}</span>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No policies in this scenario"
          href="/demo/integrations"
          action="Explore setup"
        >
          Restore Example records to inspect the synthetic revisions.
        </EmptyState>
      )}
      <div className="console-boundary-note">
        <strong>Read-only by design</strong>
        <p>
          Editing policies, changing the active revision, and creating signed
          policy material require a verified management contract. A browser
          update cannot establish backend success.
        </p>
      </div>
    </DemoGate>
  );
}

export function PolicyDetail({ id }: { id: string }) {
  const read = useDemoRead();
  if (read.status !== "ready") return <DemoGate>{null}</DemoGate>;
  const policy = read.data.policies.find((value) => value.id === id);
  if (!policy)
    return (
      <DemoGate>
        <ConsoleTitle
          eyebrow="Policy inspection"
          title="Policy unavailable in this scenario"
        />
        <EmptyState
          title="No policy record"
          href="/demo/policies"
          action="All policies"
        >
          Choose Example records above to restore this revision.
        </EmptyState>
      </DemoGate>
    );
  return (
    <DemoGate>
      <Link className="console-back" href="/demo/policies">
        <ArrowLeft size={15} /> All policies
      </Link>
      <ConsoleTitle
        eyebrow="Policy revision · Simulated data"
        title={policy.id}
      >
        <p>{policy.scope}</p>
      </ConsoleTitle>
      <dl className="console-facts">
        <div>
          <dt>Exact revision</dt>
          <dd>{policy.revision}</dd>
        </div>
        <div>
          <dt>Effective state</dt>
          <dd>{policy.state}</dd>
        </div>
        <div>
          <dt>Effective at</dt>
          <dd>{timestamp(policy.effectiveAt)}</dd>
        </div>
        <div>
          <dt>Signed digest</dt>
          <dd>{policy.digest ?? "Unavailable · No signed policy artifact"}</dd>
        </div>
      </dl>
      <section className="console-section">
        <h2>Illustrative policy rules</h2>
        <div
          className="console-table-scroll"
          role="region"
          aria-label="Policy rules"
          tabIndex={0}
        >
          <table className="console-table">
            <caption>
              Fixture rules · not an executable or signed security policy
            </caption>
            <thead>
              <tr>
                <th scope="col">Rule</th>
                <th scope="col">Value</th>
                <th scope="col">Scope / limitation</th>
              </tr>
            </thead>
            <tbody>
              {policy.rules.map((rule) => (
                <tr key={rule.label}>
                  <th scope="row">{rule.label}</th>
                  <td>{rule.value}</td>
                  <td>{rule.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="console-boundary-note">
        <strong>No policy mutation is performed</strong>
        <p>
          Origin: Simulated data. Policy signatures, revision conflicts,
          permissions, and audit confirmation need a verified backend contract
          before editing can be enabled.
        </p>
        <Link href={`/demo/requests?${new URLSearchParams({ q: policy.id })}`}>
          Inspect requests referencing this revision <ArrowUpRight size={14} />
        </Link>
      </div>
    </DemoGate>
  );
}
