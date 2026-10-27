import { PageIntro, TextLink, AccessCTA } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
import { RouteTransition } from "@/components/motion/route-transition";
export const metadata = pageMetadata(
  "Security",
  "Understand what Nexus evidence establishes, what remains unverified, and the current staging and website data boundaries.",
  "/security",
);
export default function Security() {
  return (
    <RouteTransition>
      <PageIntro
        eyebrow="Security and trust"
        title="Be precise about what is proven."
      >
        <p>
          A trustworthy system makes the limits of its evidence visible. Nexus
          separates measured signals, authenticated statements, and policy
          decisions.
        </p>
      </PageIntro>
      <div className="container security-principle">
        <span className="mono">THE CORE DISTINCTION</span>
        <p>
          A verified key statement
          <br />
          <span>is not proof of a live human.</span>
        </p>
      </div>
      <section className="container section">
        <p className="eyebrow">Trust boundaries</p>
        <h2>Ask what each check establishes.</h2>
        <div className="security-grid">
          <article>
            <span className="mono">01 / APPLICATION</span>
            <h3>Measurements describe input</h3>
            <p>
              Frame quality and byte diversity describe supplied data. They do
              not independently establish sensor origin, liveness, or identity.
            </p>
          </article>
          <article>
            <span className="mono">02 / DEVICE KEY</span>
            <h3>Signatures authenticate statements</h3>
            <p>
              A staging receipt can authenticate a statement by an enrolled key.
              A key holder can still report false metrics; signed capture claims
              remain client-reported.
            </p>
          </article>
          <article>
            <span className="mono">03 / SERVER</span>
            <h3>Acceptance has a defined scope</h3>
            <p>
              A policy accepts a receipt in its recorded context. That is not
              automatic transaction authorization or a universal fraud verdict.
            </p>
          </article>
          <article>
            <span className="mono">04 / TIME</span>
            <h3>Revocation follows the lease</h3>
            <p>
              Revocation prevents subsequent issuance. Previously issued offline
              evidence follows its bounded lease; it does not disappear
              instantly from disconnected devices.
            </p>
          </article>
        </div>
        <TextLink href="/developers#sources">
          Review the source contracts
        </TextLink>
      </section>
      <section className="subtle-section">
        <div className="container split-section">
          <div>
            <p className="eyebrow">Deployment scope</p>
            <h2>
              Preview is a release stage.
              <br />
              Not a security approval.
            </h2>
          </div>
          <div>
            <p>
              The enrollment service is an isolated staging service. Production
              enrollment is denied, and no production eligibility is established
              by this website.
            </p>
            <p>
              The public demo performs no live verification. It cannot enroll
              devices, sign evidence, or change a real policy.
            </p>
            <TextLink href="/demo">Inspect the simulated scenarios</TextLink>
          </div>
        </div>
      </section>
      <section className="container section info-columns">
        <article id="data-handling" tabIndex={-1}>
          <p className="eyebrow">Website data handling</p>
          <h2>Keep sensitive evidence out.</h2>
          <p>
            This website requests no camera frames, face images, identity
            documents, or attestation certificates. No analytics or session
            replay is integrated in this implementation.
          </p>
          <p>
            The access form prepares a file locally in your browser. Its
            contents are not submitted to a service or stored in browser
            storage. A downloaded draft stays wherever you choose to save it.
          </p>
          <p>
            Hosting infrastructure may process ordinary request metadata.
            Operator retention terms and approved legal policies must be
            supplied before opening access intake.
          </p>
        </article>
        <article id="reporting" tabIndex={-1}>
          <p className="eyebrow">Security reporting</p>
          <h2>Reporting channel pending.</h2>
          <p>
            An approved, monitored security reporting channel has not yet been
            published. Do not place vulnerabilities, credentials, or private
            evidence in an access-request draft or public repository issue.
          </p>
          <p>
            Private disclosure intake will be linked here once the channel and
            its owner are confirmed.
          </p>
        </article>
      </section>
      <AccessCTA />
    </RouteTransition>
  );
}
