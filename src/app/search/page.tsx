import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchContent } from "@/lib/content";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Working Woman Report weekly reports, stories, categories, tags, and people.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = searchContent(q);

  return (
    <div className="container-shell py-10">
      <h1 className="font-serif text-5xl">Search</h1>
      <form className="mt-6 flex max-w-2xl gap-2" action="/search">
        <label htmlFor="q" className="sr-only">
          Search query
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          className="min-h-12 min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-4"
          placeholder="Search weekly reports, stories, tags..."
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center gap-2 bg-[var(--foreground)] px-5 font-semibold text-[var(--background)]"
        >
          <Search size={18} />
          Search
        </button>
      </form>
      <div className="mt-10 grid gap-4">
        {!q ? (
          <p className="text-[var(--ink-muted)]">
            Search will include approved weekly reports, stories, categories, tags, and people.
          </p>
        ) : null}
        {q && !results.length ? (
          <p className="text-[var(--ink-muted)]">No results found.</p>
        ) : null}
        {results.map((result) => (
          <Link
            key={result.href}
            href={result.href}
            className="border-t border-[var(--line)] py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {result.type} / {result.category}
            </p>
            <h2 className="mt-2 font-serif text-2xl">{result.title}</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{result.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
