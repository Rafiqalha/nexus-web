"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import {
  Activity,
  FileCheck2,
  Smartphone,
  ListChecks,
  Code2,
  BookOpen,
  PanelLeft,
  ArrowLeft,
  Menu,
  RotateCcw,
} from "@/components/ui/icons";
import { Wordmark } from "@/components/marketing/shared";
import { useDemo } from "./demo-context";

const links = [
  { href: "/demo", label: "Overview", icon: Activity },
  { href: "/demo/requests", label: "Requests", icon: FileCheck2 },
  { href: "/demo/enrollments", label: "Enrollments", icon: Smartphone },
  { href: "/demo/policies", label: "Policies", icon: ListChecks },
  { href: "/demo/integrations", label: "Integrations", icon: Code2 },
  { href: "/demo/audit", label: "Audit log", icon: BookOpen },
  { href: "/demo/settings", label: "Settings", icon: PanelLeft },
];
function Navigation({
  mobile,
  close,
}: {
  mobile?: boolean;
  close?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={mobile ? "Mobile demo navigation" : "Demo navigation"}>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={close}
          aria-current={
            (href === "/demo" ? pathname === href : pathname.startsWith(href))
              ? "page"
              : undefined
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ))}
      {mobile && (
        <>
          <Link href="/demo/walkthrough" onClick={close}>
            <Code2 size={18} />
            Evidence walkthrough
          </Link>
          <Link href="/product" onClick={close}>
            <ArrowLeft size={18} />
            Back to product
          </Link>
        </>
      )}
    </nav>
  );
}
export function DemoShell({ children }: { children: ReactNode }) {
  const { workspace, scenario, setScenario, theme, reset } = useDemo();
  const menu = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const current =
    links.find(
      (link) => link.href !== "/demo" && pathname.startsWith(link.href),
    )?.label ?? (pathname === "/demo/walkthrough" ? "Walkthrough" : "Overview");
  function close() {
    if (menu.current) menu.current.open = false;
  }
  return (
    <div className="console-shell" data-theme={theme}>
      <aside className="console-sidebar">
        <Link className="console-brand" href="/" aria-label="Nexus home">
          <Wordmark />
        </Link>
        <div className="console-workspace">
          <span className="workspace-avatar">N</span>
          <span title={workspace}>
            {workspace}
            <small>Example workspace</small>
          </span>
        </div>
        <p className="console-nav-label">Workspace</p>
        <Navigation />
        <div className="console-sidebar-bottom">
          <Link href="/demo/walkthrough">
            <Code2 size={16} /> Evidence walkthrough
          </Link>
          <Link href="/product">
            <ArrowLeft size={16} /> Back to product
          </Link>
          <p>
            Isolated demo session
            <br />
            No live services or credentials.
          </p>
        </div>
      </aside>
      <div className="console-main-column">
        <header className="console-topbar">
          <details
            className="console-mobile-nav"
            ref={menu}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                close();
                menu.current?.querySelector("summary")?.focus();
              }
            }}
          >
            <summary aria-label="Toggle demo navigation">
              <Menu size={20} />
              <span>Menu</span>
            </summary>
            <Navigation mobile close={close} />
          </details>
          <div className="console-breadcrumb">
            <span title={workspace}>{workspace}</span>
            <span aria-hidden="true">/</span>
            <strong>{current}</strong>
          </div>
          <span className="console-environment">
            <span className="status-dot" /> Staging
          </span>
          <span className="simulation-label">Simulated data</span>
        </header>
        <div className="console-demo-banner">
          <strong>Demo workspace · Staging</strong>
          <span>
            Fixed synthetic records. No real verification or account changes.
          </span>
          <button type="button" onClick={reset}>
            <RotateCcw size={14} /> Reset demo session
          </button>
        </div>
        <noscript>
          <p className="console-noscript">
            JavaScript is required for session controls and appearance
            preferences. Navigation links remain available.
          </p>
        </noscript>
        <div className="console-scenario-bar">
          <span>Snapshot · 27 Oct 2026, 09:00 UTC</span>
          <label htmlFor="demo-state">Demo state</label>
          <select
            id="demo-state"
            value={scenario}
            onChange={(event) =>
              setScenario(event.target.value as typeof scenario)
            }
          >
            <option value="records">Example records</option>
            <option value="empty">Empty workspace</option>
            <option value="error">Service error</option>
            <option value="denied">Permission denied</option>
            <option value="expired-session">Session expired</option>
            <option value="stale">Stale data</option>
            <option value="loading">Loading</option>
          </select>
        </div>
        <main id="main-content" tabIndex={-1} className="console-content">
          {children}
        </main>
        <footer className="console-footer">
          Simulated staging context · Production eligibility is not established.
        </footer>
      </div>
    </div>
  );
}
