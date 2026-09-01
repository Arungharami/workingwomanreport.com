"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-shell max-w-3xl py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Error
      </p>
      <h1 className="mt-4 font-serif text-5xl">Something went wrong.</h1>
      <p className="mt-5 text-sm leading-7 text-[var(--ink-muted)]">
        The newsroom page could not load. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 inline-flex min-h-11 items-center bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)]"
      >
        Try again
      </button>
    </div>
  );
}
