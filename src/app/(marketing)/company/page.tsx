import { PageIntro, AccessCTA, TextLink } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Company",
  "Why Nexus is building evidence infrastructure for sensitive digital interactions.",
  "/company",
);
export default function Company() {
  return (
    <>
      <PageIntro
        eyebrow="Why Nexus"
        title="Better decisions start with better evidence."
      >
        <p>
          We are building toward a world where sensitive digital interactions
          can be evaluated with clear, inspectable context.
        </p>
      </PageIntro>
      <section className="container company-story">
        <div className="company-statement">
          <span className="eyebrow">Our conviction</span>
          <h2>
            Trust should have
            <br />
            an explanation.
          </h2>
          <div className="statement-lines" aria-hidden="true">
            <span>Context</span>
            <span>Evidence</span>
            <span>Decision</span>
          </div>
        </div>
        <div className="company-prose">
          <p className="lead">
            Engineering teams need to understand why a request should be
            trusted—and where the available evidence stops.
          </p>
          <p>
            Nexus connects device integrity, session evidence, and server-side
            verification. Our initial focus is fintech engineering and e-KYC
            workflows, where the distinction between a completed action and a
            verified statement matters.
          </p>
          <p>
            The long-term mission is infrastructure for human-verified
            interactions. The current work is deliberately specific: a native
            core, staging evidence contracts, and clear boundaries around what
            they establish.
          </p>
          <TextLink href="/product">Explore what we are building</TextLink>
        </div>
      </section>
      <section className="container section">
        <p className="eyebrow">How we build</p>
        <h2>Clarity is part of the product.</h2>
        <div className="principles">
          <article>
            <span className="mono">01</span>
            <h3>Evidence before assertion</h3>
            <p>
              Describe the check, its source, and its scope. Keep unknowns
              visible.
            </p>
          </article>
          <article>
            <span className="mono">02</span>
            <h3>Useful increments</h3>
            <p>
              Make each workflow understandable and inspectable, from native
              processing to the server decision.
            </p>
          </article>
          <article>
            <span className="mono">03</span>
            <h3>Honest availability</h3>
            <p>
              Separate the mission from current capabilities, and staging from
              production.
            </p>
          </article>
        </div>
      </section>
      <section className="subtle-section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Current chapter</p>
            <h2>Developer preview.</h2>
          </div>
          <div>
            <p className="lead">
              The architecture is ready to explore. Production access is not
              open.
            </p>
            <p>
              Review the integration baseline, test the synthetic walkthrough,
              and prepare the context for a future pilot conversation.
            </p>
            <TextLink href="/developers#platforms">
              Review current availability
            </TextLink>
          </div>
        </div>
      </section>
      <AccessCTA />
    </>
  );
}
