"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Menu, ArrowUpRight } from "lucide-react";
import { Wordmark } from "./shared";
const links = [
  ["/product", "Product"],
  ["/developers", "Developers"],
  ["/security", "Security"],
  ["/company", "Company"],
] as const;
export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  function close() {
    if (menu.current) menu.current.open = false;
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link" href="/" aria-label="Nexus home">
          <Wordmark />
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/request-access" className="header-cta">
          Request access <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <details
          className="mobile-menu"
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
              menu.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label="Toggle navigation">
            <Menu aria-hidden="true" size={22} />
            <span>Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
            <Link href="/demo" onClick={close}>
              Illustrative demo
            </Link>
            <Link href="/request-access" onClick={close}>
              Request access <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
