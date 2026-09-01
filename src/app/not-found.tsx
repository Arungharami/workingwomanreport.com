import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell max-w-3xl py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        404
      </p>
      <h1 className="mt-4 font-serif text-5xl">This page was not found.</h1>
      <p className="mt-5 text-sm leading-7 text-[var(--ink-muted)]">
        The story may still be in editorial review, archived, or waiting for rights
        confirmation.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex min-h-11 items-center bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)]"
      >
        Return home
      </Link>
    </div>
  );
}
