import { Suspense } from "react";
import { cookies } from "next/headers";
import type { ThemePreference } from "@/lib/contracts/console";
import { DemoProvider } from "@/components/console/demo-context";
import { DemoShell } from "@/components/console/shell";
import { ConsoleLoading } from "@/components/console/shared";
export const metadata = {
  title: { default: "Console demo | Nexus", template: "%s | Nexus demo" },
  description:
    "An isolated Nexus console with fixed, explicitly synthetic staging records.",
  robots: { index: false, follow: false },
};
async function ConfiguredDemo({ children }: { children: React.ReactNode }) {
  const preference = (await cookies()).get("nexus-demo-theme")?.value;
  const initialTheme: ThemePreference =
    preference === "light" || preference === "system" ? preference : "dark";
  return (
    <DemoProvider initialTheme={initialTheme}>
      <DemoShell>{children}</DemoShell>
    </DemoProvider>
  );
}
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="console-boot">
          <span className="simulation-label">Simulated data</span>
          <main id="main-content" tabIndex={-1}>
            <ConsoleLoading />
          </main>
        </div>
      }
    >
      <ConfiguredDemo>{children}</ConfiguredDemo>
    </Suspense>
  );
}
