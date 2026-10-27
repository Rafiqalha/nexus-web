import Link from "next/link";
import { Wordmark } from "./shared";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" aria-label="Nexus home">
              <Wordmark />
            </Link>
            <p>
              Evidence for better
              <br />
              security decisions.
            </p>
          </div>
          <nav aria-label="Product links">
            <h2>Product</h2>
            <Link href="/product">Architecture</Link>
            <Link href="/demo">Illustrative demo</Link>
            <Link href="/security">Trust boundaries</Link>
          </nav>
          <nav aria-label="Developer links">
            <h2>Developers</h2>
            <Link href="/developers">Integration overview</Link>
            <Link href="/developers#platforms">Platform availability</Link>
            <Link href="/developers#sources">Source notes</Link>
          </nav>
          <nav aria-label="Company links">
            <h2>Company</h2>
            <Link href="/company">Our approach</Link>
            <Link href="/request-access">Request access</Link>
            <Link href="/security#data-handling">Website data handling</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>Nexus · Developer preview</span>
          <span>Built around evidence. Clear about its limits.</span>
        </div>
      </div>
    </footer>
  );
}
