import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : "button-primary"}`}
      href={href}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="container page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="lead">{children}</div>
    </div>
  );
}
export function AccessCTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">Build with context</p>
          <h2>
            Make the evidence
            <br />
            part of the decision.
          </h2>
          <p>Explore how Nexus could fit your application.</p>
        </div>
        <div className="cta-actions">
          <ButtonLink href="/request-access">
            Request developer access
          </ButtonLink>
          <span className="small muted">
            Developer preview · Access intake not yet open
          </span>
        </div>
      </div>
    </section>
  );
}
export function Wordmark() {
  return (
    <span className="wordmark">
      <svg
        viewBox="0 0 28 28"
        width="28"
        height="28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 23V5l18 18V5M5 14h18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="14" r="3" fill="currentColor" />
        <circle cx="23" cy="14" r="3" fill="currentColor" />
      </svg>
      Nexus<span className="wordmark-dot">.</span>
    </span>
  );
}
