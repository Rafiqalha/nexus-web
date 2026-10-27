import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container section" tabIndex={-1}>
      <p className="eyebrow">404 / Page not found</p>
      <h1>This path ends here.</h1>
      <p>
        The page may have moved. Return to the Nexus homepage to explore the
        product.
      </p>
      <Link className="button button-primary" href="/">
        Back to Nexus
      </Link>
    </main>
  );
}
