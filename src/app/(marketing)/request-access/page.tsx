import { Check } from "@/components/ui/icons";
import { RouteTransition } from "@/components/motion/route-transition";
import { AccessForm } from "@/components/marketing/access-form";
import { TextLink } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Request developer access",
  "Prepare a local Nexus access-request draft. Access intake is not yet open; no form data is submitted.",
  "/request-access",
);
export default function RequestAccess() {
  return (
    <RouteTransition>
      <section className="container access-layout">
        <div className="access-copy">
          <p className="eyebrow">Request developer access</p>
          <h1>
            Let’s put your
            <br />
            use case in context.
          </h1>
          <p className="lead">
            Planning a native integration or exploring a sensitive workflow?
            Prepare the details for a future pilot conversation.
          </p>
          <ul className="access-benefits">
            <li>
              <Check size={18} aria-hidden="true" />
              Describe the interaction you need to evaluate
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Identify your platform and integration path
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Keep a local copy of your request
            </li>
          </ul>
          <div className="access-note">
            <h2>Before you begin</h2>
            <p>
              Nexus is a developer preview. Production enrollment is blocked. A
              delivery service and an approved contact channel are not yet
              available.
            </p>
            <TextLink href="/developers#platforms">
              Review platform availability
            </TextLink>
          </div>
        </div>
        <AccessForm />
      </section>
    </RouteTransition>
  );
}
