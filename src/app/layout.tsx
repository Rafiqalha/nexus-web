import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { siteOrigin } from "@/lib/metadata";
import { ScrollEffects } from "@/components/motion/scroll-effects";
import "./globals.css";
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter-sans",
  display: "swap",
  weight: "100 900",
});
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <body>
        <ScrollEffects />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
