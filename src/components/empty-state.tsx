import Link from "next/link";

export function EditorialEmptyState({
  title = "New reporting from Working Woman Report is coming soon.",
  dek = "The newsroom is ready for Allison's first approved weekly package. Demo records remain available in Studio and tests, but they are not shown as public journalism.",
}: {
  title?: string;
  dek?: string;
}) {
  return (
    <section className="container-shell py-16">
      <div className="border-y border-[var(--line)] py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Editorial Desk
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">{dek}</p>
        <Link
          href="/about"
          className="mt-7 inline-flex min-h-11 items-center bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)]"
        >
          About the newsroom
        </Link>
      </div>
    </section>
  );
}
