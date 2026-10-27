import Link from "next/link";
export default function DemoNotFound() {
  return (
    <section className="console-state">
      <p className="eyebrow">Simulated data · Record not found</p>
      <h1>This demo record does not exist.</h1>
      <p>
        Only fixed synthetic identifiers are available. No live resource was
        requested.
      </p>
      <Link className="button button-secondary" href="/demo/requests">
        Browse synthetic requests
      </Link>
    </section>
  );
}
