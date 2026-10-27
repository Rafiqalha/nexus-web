import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/marketing/shared";
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="demo-shell">
      <header className="demo-header">
        <div className="container">
          <Link href="/" aria-label="Nexus home">
            <Wordmark />
          </Link>
          <span className="simulation-label">Simulated data</span>
          <Link className="text-link" href="/product">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to product
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="demo-footer container">
        Illustrative demo · No live services, accounts, or credentials. Reset
        restores the fresh scenario.
      </footer>
    </div>
  );
}
