import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { BrandEmblem } from "@/components/ui/brand-emblem";
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
      <BrandEmblem />
      <span className="wordmark-name">Nexus</span>
    </span>
  );
}
