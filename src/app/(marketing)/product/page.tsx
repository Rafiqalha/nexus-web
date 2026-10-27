import { Activity, FileKey2, ListChecks } from "@/components/ui/icons";
import { RouteTransition } from "@/components/motion/route-transition";
import { Architecture } from "@/components/marketing/architecture";
import { AccessCTA, PageIntro, TextLink } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Product",
  "Explore the Nexus application, native SDK, signed evidence, and server verification architecture.",
  "/product",
);
export default function Product() {
  return (
    <RouteTransition>
      <PageIntro
        eyebrow="The product"
        title="Every decision needs its evidence."
      >
        <p>
          Nexus connects the context collected in your application with the
          checks performed by your verification backend.
        </p>
      </PageIntro>
      <section
        id="architecture"
        className="container architecture-page"
        tabIndex={-1}
      >
        <h2 className="sr-only">Application to server evidence flow</h2>
        <Architecture />
        <p className="source-caption">
          Conceptual staging flow.{" "}
          <TextLink href="/developers#sources">
            Source and availability notes
          </TextLink>
        </p>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What each layer contributes</p>
            <h2>
              Context, verification,
              <br />
              and visibility.
            </h2>
          </div>
          <TextLink href="/demo">Try the illustrative demo</TextLink>
        </div>
        <div className="feature-rows">
          <article>
            <span className="feature-icon">
              <Activity aria-hidden="true" />
            </span>
            <div>
              <h3>Session integrity</h3>
              <p>
                A capture result needs the context of the session that produced
                it. The native core provides lifecycle, capture, and structured
                frame measurements.
              </p>
            </div>
            <aside>
              <strong>Know the boundary</strong>
              <p>
                Quality, duplicate, and spectral measurements are not biometric
                or liveness verdicts.
              </p>
            </aside>
          </article>
          <article>
            <span className="feature-icon">
              <FileKey2 aria-hidden="true" />
            </span>
            <div>
              <h3>Evidence verification</h3>
              <p>
                The staging service checks a device-bound statement against its
                registered key, challenge, and policy context.
              </p>
            </div>
            <aside>
              <strong>Know the boundary</strong>
              <p>
                A valid signature authenticates the statement. Capture metrics
                remain client-reported.
              </p>
            </aside>
          </article>
          <article>
            <span className="feature-icon">
              <ListChecks aria-hidden="true" />
            </span>
            <div>
              <h3>Policy visibility</h3>
              <p>
                Inspect how a decision relates to evidence, its origin, and
                checks that were unavailable. Explore these distinctions in the
                walkthrough.
              </p>
            </div>
            <aside>
              <strong>Know the boundary</strong>
              <p>
                The public walkthrough is synthetic. A connected customer
                console requires a management API and authentication.
              </p>
            </aside>
          </article>
        </div>
      </section>
      <section className="subtle-section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Deployment scope</p>
            <h2>
              Start in staging.
              <br />
              Keep the limits visible.
            </h2>
          </div>
          <div>
            <p className="lead">
              The native core and isolated Android enrollment flow are
              developer-preview building blocks.
            </p>
            <p>
              Production enrollment is denied. The enrollment service has no
              public management API, and this website does not provide signing
              or enrollment services.
            </p>
            <TextLink href="/developers#platforms">
              Check integration availability
            </TextLink>
          </div>
        </div>
      </section>
      <AccessCTA />
    </RouteTransition>
  );
}
