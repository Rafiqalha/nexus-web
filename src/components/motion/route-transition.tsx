import { ViewTransition, type ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition default="none" enter="route-enter" exit="route-exit">
      <div className="route-content">{children}</div>
    </ViewTransition>
  );
}
