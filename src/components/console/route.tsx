import { Suspense, type ReactNode } from "react";
import { RouteTransition } from "@/components/motion/route-transition";
import { ConsoleLoading } from "./shared";
export function ConsoleRoute({ children }: { children: ReactNode }) {
  return (
    <RouteTransition>
      <Suspense fallback={<ConsoleLoading />}>{children}</Suspense>
    </RouteTransition>
  );
}
