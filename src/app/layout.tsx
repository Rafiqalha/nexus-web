import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteOrigin } from "@/lib/metadata";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Nexus — Evidence for better security decisions",
    template: "%s | Nexus",
  },
  description:
    "Device integrity, session evidence, and server-side verification for sensitive digital interactions.",
  metadataBase: new URL(siteOrigin ?? "http://localhost:3000"),
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
