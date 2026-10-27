import { ArrowUpRight, BookOpen, Code2 } from "@/components/ui/icons";
import { RouteTransition } from "@/components/motion/route-transition";
import { PageIntro, AccessCTA, TextLink } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Developers",
  "Plan a Nexus integration with native Rust and C ABI architecture, staging platform status, and source-backed boundaries.",
  "/developers",
);
export default function Developers() {
  return (
    <RouteTransition>
      <PageIntro
        eyebrow="Developer resources"
        title="Understand the stack. Plan your integration."
      >
        <p>
          Start with the native architecture and the boundaries your application
          needs to preserve. Nexus is currently a developer preview.
        </p>
      </PageIntro>
      <div className="container developer-resource-grid">
        <a className="resource-card" href="#integration">
          <Code2 aria-hidden="true" />
          <div>
            <h2>Integration overview</h2>
            <p>Follow the application-to-server path.</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a className="resource-card" href="#sources">
          <BookOpen aria-hidden="true" />
          <div>
            <h2>Source notes</h2>
            <p>Review contracts and availability.</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <section id="integration" className="container section" tabIndex={-1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Integration overview</p>
            <h2>Four steps. Explicit boundaries.</h2>
          </div>
          <span className="small muted">
            Conceptual sequence · Not an SDK code sample
          </span>
        </div>
        <ol className="integration-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Define the interaction</h3>
              <p>
                Identify the sensitive action, application context, and evidence
                your backend will need. Keep transaction authorization in your
                application.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Connect the native core</h3>
              <p>
                Use the Rust implementation or C ABI within a supported native
                integration. Camera capture, platform permissions, and hardware
                signing belong to the integrating application.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Bind evidence to its context</h3>
              <p>
                In an authorized staging setup, enrollment and a server
                challenge establish the context for a device-key statement.
                Preserve the exact evidence bytes.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Inspect the server result</h3>
              <p>
                Keep transport errors separate from policy decisions. Read the
                evidence scope and origin; do not turn an unavailable check into
                a passing result.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section id="platforms" className="subtle-section" tabIndex={-1}>
        <div className="container">
          <p className="eyebrow">Platform availability</p>
          <h2>Choose from what exists.</h2>
          <div
            className="table-scroll"
            role="region"
            aria-label="Platform availability table"
            tabIndex={0}
          >
            <table>
              <caption>Capability baseline reviewed 27 October 2026</caption>
              <thead>
                <tr>
                  <th scope="col">Integration</th>
                  <th scope="col">Current status</th>
                  <th scope="col">Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Rust core / C ABI</th>
                  <td>
                    <span className="tag">Developer preview</span>
                  </td>
                  <td>
                    Native processing and evidence contracts; ABI 2.11
                    documented.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Android enrollment</th>
                  <td>
                    <span className="tag">Isolated staging</span>
                  </td>
                  <td>
                    Separate service and application integration. No public
                    deployment.
                  </td>
                </tr>
                <tr>
                  <th scope="row">JavaScript / browser SDK</th>
                  <td>Not verified as available</td>
                  <td>
                    This website does not run the native SDK in a browser.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Swift / Flutter / game engines</th>
                  <td>Not verified as available</td>
                  <td>
                    No supported package or release verified for this website.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Production enrollment</th>
                  <td>
                    <span className="tag warning">Blocked</span>
                  </td>
                  <td>
                    Developer preview does not grant production eligibility.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section
        className="container section source-section"
        id="sources"
        tabIndex={-1}
      >
        <div>
          <p className="eyebrow">Source notes</p>
          <h2>
            Read the contract
            <br />
            behind the claim.
          </h2>
          <p>
            Reviewed against repository documentation on 27 October 2026. This
            is a source review, not an independent device test or production
            certification.
          </p>
        </div>
        <div className="source-list">
          <article>
            <h3>Native SDK</h3>
            <p>
              Rust core, C ABI 2.11, capture measurements, and production-denial
              boundary.
            </p>
            <a href="https://github.com/Rafiqalha/nexus-sdk/blob/main/README.md">
              SDK README <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href="https://github.com/Rafiqalha/nexus-sdk/blob/main/docs/api/CAPTURE_RECEIPT_ABI_2_11.md">
              Capture receipt contract · ABI 2.11{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <small>
              Repository access may be required. The README follows the current
              main branch.
            </small>
          </article>
          <article>
            <h3>Staging enrollment</h3>
            <p>
              Android key enrollment, device-bound receipts, client-reported
              capture claims, and bounded offline leases.
            </p>
            <a href="https://github.com/Rafiqalha/nexus-enrollment/blob/main/README.md">
              Enrollment README <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <small>
              Private repository · Authorized repository access required.
            </small>
          </article>
          <TextLink href="/security">
            Read the public trust-boundary summary
          </TextLink>
        </div>
      </section>
      <AccessCTA />
    </RouteTransition>
  );
}
