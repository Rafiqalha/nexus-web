import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Braces,
  Check,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
} from "@/components/ui/icons";
import { Walkthrough } from "@/components/evidence/walkthrough";
import { Architecture } from "./architecture";
import { ProductPlaybook } from "./product-playbook";

export function ProductPreview() {
  return (
    <div className="hero-visual">
      <ProductPlaybook
        pages={[
          {
            id: "inspection",
            title: "Request inspection",
            href: "/demo",
            action: "Open the demo",
            content: (
              <div className="playbook-inspection">
                <Walkthrough />
                <aside
                  className="playbook-context"
                  aria-label="Illustration scope"
                >
                  <span className="eyebrow">Inspection context</span>
                  <dl>
                    <div>
                      <dt>Environment</dt>
                      <dd>
                        <span className="status-dot" /> Staging
                      </dd>
                    </div>
                    <div>
                      <dt>Policy revision</dt>
                      <dd className="mono">demo-policy-v1</dd>
                    </div>
                    <div>
                      <dt>Evidence scope</dt>
                      <dd>Enrolled key statement</dd>
                    </div>
                    <div>
                      <dt>Data source</dt>
                      <dd>Illustrative demo</dd>
                    </div>
                  </dl>
                  <Fingerprint size={26} />
                  <p>
                    Know what was checked.
                    <br />
                    See what remains unknown.
                  </p>
                  <Link href="/security">
                    Read the trust boundaries <ArrowUpRight size={14} />
                  </Link>
                </aside>
              </div>
            ),
          },
          {
            id: "evidence",
            title: "Evidence flow",
            href: "/product#architecture",
            action: "Explore the architecture",
            content: (
              <div className="playbook-editorial playbook-evidence">
                <div className="playbook-intro">
                  <span className="eyebrow">The evidence path</span>
                  <h2>
                    From application context
                    <br />
                    to a scoped decision.
                  </h2>
                  <p>
                    Your application starts the interaction. Your backend owns
                    the decision.
                  </p>
                </div>
                <Architecture />
                <div className="playbook-annotations">
                  <span>
                    <Activity size={16} /> Session context
                  </span>
                  <span>
                    <Fingerprint size={16} /> Key statement
                  </span>
                  <span>
                    <FileCheck2 size={16} /> Policy evaluation
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: "integration",
            title: "Integration guide",
            href: "/developers",
            action: "Read the developer guide",
            content: (
              <div className="playbook-editorial playbook-integration">
                <div className="playbook-intro">
                  <span className="eyebrow">For the people building it</span>
                  <h2>
                    A clear path
                    <br />
                    into the stack.
                  </h2>
                  <p>
                    Start with the architecture, then follow a supported,
                    staging integration.
                  </p>
                  <span className="playbook-platform">
                    <Braces size={16} /> Rust core / C ABI{" "}
                    <span>Developer preview</span>
                  </span>
                </div>
                <ol className="playbook-steps">
                  <li>
                    <span className="mono">01</span>
                    <div>
                      <h3>Establish application context</h3>
                      <p>
                        Define the sensitive interaction and its server-side
                        decision boundary.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="mono">02</span>
                    <div>
                      <h3>Integrate the native core</h3>
                      <p>
                        Keep native measurements and app/device policy context
                        distinct.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="mono">03</span>
                    <div>
                      <h3>Evaluate evidence on the server</h3>
                      <p>
                        Check policy, origin, and scope. Keep unsupported checks
                        unavailable.
                      </p>
                    </div>
                  </li>
                  <li className="playbook-steps-note">
                    <span className="status-dot" />
                    <p>Conceptual sequence · No executable SDK calls</p>
                  </li>
                </ol>
              </div>
            ),
          },
          {
            id: "boundaries",
            title: "Trust boundaries",
            href: "/security",
            action: "Read the trust boundaries",
            content: (
              <div className="playbook-editorial playbook-boundaries">
                <div className="playbook-intro">
                  <span className="eyebrow">Explicit by design</span>
                  <h2>
                    Know what was checked.
                    <br />
                    See what remains unknown.
                  </h2>
                  <p>
                    A completed capture, a valid signature, and a policy
                    decision each tell a different story.
                  </p>
                </div>
                <div className="playbook-boundary-list">
                  <div>
                    <Fingerprint size={22} />
                    <h3>Key signature</h3>
                    <span>
                      <Check size={14} /> Authenticates a key statement
                    </span>
                    <p>
                      It does not establish camera origin or prove a live human.
                    </p>
                  </div>
                  <div>
                    <Activity size={22} />
                    <h3>Capture measurements</h3>
                    <span>Client-reported</span>
                    <p>
                      Measured input quality stays separate from verified
                      evidence.
                    </p>
                  </div>
                  <div>
                    <LockKeyhole size={22} />
                    <h3>Policy decision</h3>
                    <span>Bounded by evidence and scope</span>
                    <p>
                      Acceptance is not a universal liveness or identity
                      verdict.
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
      <div className="visual-caption">
        <span>
          Illustrative demo <span aria-hidden="true">·</span> Synthetic
          evidence, explicit boundaries.
        </span>
      </div>
    </div>
  );
}
