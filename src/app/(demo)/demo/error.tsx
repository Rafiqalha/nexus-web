"use client";
export default function DemoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="console-state" role="alert">
      <p className="eyebrow">Simulated data</p>
      <h1>Unable to display this demo view.</h1>
      <p>
        The view failed to render. Your browser has not performed a live account
        or device operation.
      </p>
      <button className="button button-primary" onClick={reset}>
        Retry this view
      </button>
    </section>
  );
}
