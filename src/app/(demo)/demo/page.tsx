import { Walkthrough } from "@/components/evidence/walkthrough";
import { TextLink } from "@/components/marketing/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = {
  ...pageMetadata(
    "Illustrative demo",
    "Explore synthetic evidence scenarios without live services or credentials.",
    "/demo",
  ),
  robots: { index: false, follow: true },
};
export default function Demo() {
  return (
    <div className="container demo-content">
      <div className="demo-intro">
        <p className="eyebrow">Interactive walkthrough</p>
        <h1>
          One request.
          <br />
          Different evidence.
        </h1>
        <p className="lead">
          Change the scenario to see how a policy decision differs from an
          expired lease, missing evidence, or a server error.
        </p>
        <p>
          Every record is synthetic. These scenarios illustrate trust
          boundaries; they do not execute the SDK or verify a device.
        </p>
        <TextLink href="/security">Understand what each check proves</TextLink>
        <div className="demo-explainer">
          <h2>What to look for</h2>
          <ol>
            <li>Does the service respond?</li>
            <li>What does the policy decide?</li>
            <li>Where does each claim come from?</li>
            <li>Which checks remain unverified?</li>
          </ol>
        </div>
      </div>
      <Walkthrough expanded />
    </div>
  );
}
