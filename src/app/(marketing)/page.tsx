import {
  Activity,
  Fingerprint,
  ListChecks,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { AccessCTA, ButtonLink, TextLink } from "@/components/marketing/shared";
import { Architecture } from "@/components/marketing/architecture";
import { Walkthrough } from "@/components/evidence/walkthrough";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Security for human-verified interactions",
  "Nexus connects device integrity, session evidence, and server-side verification to help applications evaluate sensitive requests.",
  "/",
);
export default function Home() {
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            Evidence infrastructure
          </p>
          <h1>
            Security for
            <br />
            human-verified
            <br />
            <span>interactions.</span>
          </h1>
          <p className="lead">
            Connect device integrity, session evidence, and server-side
            verification. Give sensitive requests the context they deserve.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/request-access">
              Request developer access
            </ButtonLink>
            <TextLink href="/product#architecture">
              Explore the architecture
            </TextLink>
          </div>
          <p className="availability">
            Developer preview <span>·</span> Android staging only
          </p>
        </div>
        <div className="hero-visual">
          <div className="visual-label">
            <span className="mono">01 / EVIDENCE → DECISION</span>
            <span>Illustrative demo</span>
          </div>
          <Walkthrough />
          <div className="visual-caption">
            <span className="caption-line" />
            Know what was checked.
            <br />
            See what remains unknown.
          </div>
        </div>
      </section>
      <div className="context-strip">
        <div className="container">
          <p>
            Built for the decisions
            <br />
            <strong>that need more context.</strong>
          </p>
          <span>Fintech engineering</span>
          <span>e-KYC workflows</span>
          <span>Sensitive app interactions</span>
        </div>
      </div>
      <section className="container section problem-section">
        <div>
          <p className="eyebrow">The missing context</p>
          <h2>
            A client says “success.”
            <br />
            What does that prove?
          </h2>
        </div>
        <div>
          <p className="lead">
            A completed capture, a valid signature, and a policy decision each
            tell a different story. Your backend needs to know which one it is
            acting on.
          </p>
          <p>
            Nexus brings those layers into an inspectable evidence flow, so
            measured signals, verified statements, and unknowns stay distinct.
          </p>
          <TextLink href="/security">Understand the trust boundaries</TextLink>
        </div>
      </section>
      <section className="section architecture-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How Nexus fits</p>
              <h2>
                From application context
                <br />
                to a scoped decision.
              </h2>
            </div>
            <p>
              Your application starts the interaction.
              <br />
              Your backend owns the decision.
            </p>
          </div>
          <Architecture />
          <div className="section-foot">
            <span>
              Native processing. Explicit evidence. Server-side policy.
            </span>
            <TextLink href="/product">See the product architecture</TextLink>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Three connected layers</p>
            <h2>Make trust inspectable.</h2>
          </div>
          <p>
            Useful context at each boundary.
            <br />
            Clear limits at every step.
          </p>
        </div>
        <div className="capabilities">
          <article>
            <Activity aria-hidden="true" />
            <span className="mono small">01 / SESSION</span>
            <h3>Preserve session context</h3>
            <p>
              Structure capture measurements within the native session
              lifecycle.
            </p>
            <p className="capability-limit">
              Quality measurements describe input. They do not establish
              liveness.
            </p>
          </article>
          <article>
            <Fingerprint aria-hidden="true" />
            <span className="mono small">02 / EVIDENCE</span>
            <h3>Verify the statement</h3>
            <p>
              Connect signed evidence to an enrolled key and its expected
              context.
            </p>
            <p className="capability-limit">
              Key authentication does not establish camera provenance.
            </p>
          </article>
          <article>
            <ListChecks aria-hidden="true" />
            <span className="mono small">03 / POLICY</span>
            <h3>Understand the decision</h3>
            <p>
              Keep checks, scope, and unavailable evidence visible together.
            </p>
            <p className="capability-limit">
              An accepted statement is scoped to the policy that evaluated it.
            </p>
          </article>
        </div>
        <p className="source-caption">
          Capability baseline: developer preview.{" "}
          <Link href="/developers#sources">
            Read the source and availability notes{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </p>
      </section>
      <section className="developer-band">
        <div className="container developer-inner">
          <div>
            <p className="eyebrow">For the people building it</p>
            <h2>
              A clear path into
              <br />
              the native stack.
            </h2>
            <p>
              Start with the architecture, check platform availability, and plan
              your staging integration.
            </p>
            <ButtonLink href="/developers">
              Explore developer resources
            </ButtonLink>
          </div>
          <div className="technical-outline">
            <div>
              <Code2 size={20} aria-hidden="true" />
              <span className="mono small">INTEGRATION MAP / CONCEPTUAL</span>
            </div>
            <ol>
              <li>
                <span>01</span>
                <p>
                  Establish application context
                  <small>Define the sensitive interaction</small>
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  Integrate the native core
                  <small>Rust implementation · C ABI</small>
                </p>
              </li>
              <li>
                <span>03</span>
                <p>
                  Evaluate evidence on the server
                  <small>Check policy, origin, and scope</small>
                </p>
              </li>
            </ol>
            <Link href="/developers#platforms">
              Review platform availability{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <AccessCTA />
    </>
  );
}
