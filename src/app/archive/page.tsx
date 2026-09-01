import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import {
  getArchiveCategories,
  getArchiveYears,
  getManifestMeta,
  queryArchive,
  type LegacyClassification,
} from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Working Woman Report's legacy archive index — browse by year and category. Metadata only; most legacy entries are wire-syndicated or pending rights review, not full articles.",
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ page?: string; year?: string; category?: string; q?: string }>;
};

const CLASSIFICATION_LABEL: Record<LegacyClassification, string> = {
  WWR_ORIGINAL: "Working Woman Report original",
  WWR_VIDEO: "Show / video record",
  WWR_PROFILE: "Host profile record",
  WWR_SHOW: "The Show record",
  SYNDICATED: "Wire / syndicated copy",
  THIRD_PARTY: "Third-party content",
  SPAM: "Removed",
  BROKEN: "Broken link",
  DUPLICATE: "Duplicate entry",
  REVIEW_REQUIRED: "Pending review",
};

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/archive?${qs}` : "/archive";
}

export default async function ArchivePage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const { records, total, totalPages } = queryArchive({
    page,
    year: params.year,
    category: params.category,
    query: params.q,
  });
  const years = getArchiveYears();
  const categories = getArchiveCategories();
  const meta = getManifestMeta();

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Archive"
        title="The Legacy Archive"
        dek="Working Woman Report published from 2013 to 2023. This index is metadata only — titles, dates, categories, and original links — while full content clears legal review."
      />

      <div className="border border-[var(--line)] bg-[var(--paper)] p-4 text-sm leading-6 text-[var(--ink-muted)]">
        <p>
          {meta.totalFetched.toLocaleString()} legacy records audited
          {meta.totalReportedByApi !== meta.totalFetched
            ? ` (of ${meta.totalReportedByApi.toLocaleString()} reported by the legacy site)`
            : ""}
          . Most of the archive is wire-syndicated content or awaiting rights review — see{" "}
          <Link href="/about" className="underline">
            About
          </Link>{" "}
          for the full migration methodology. Spam and compromised entries have been removed
          from this index entirely.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-6 border-y border-[var(--line)] py-5 text-sm">
        <div>
          <p className="font-semibold uppercase tracking-[0.14em] text-xs text-[var(--ink-muted)]">
            Year
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildHref({ category: params.category })}
              className={!params.year ? "underline font-semibold" : "hover:underline"}
            >
              All
            </Link>
            {years.map((year) => (
              <Link
                key={year}
                href={buildHref({ year, category: params.category })}
                className={
                  params.year === year ? "underline font-semibold" : "hover:underline"
                }
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.14em] text-xs text-[var(--ink-muted)]">
            Category
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildHref({ year: params.year })}
              className={!params.category ? "underline font-semibold" : "hover:underline"}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={buildHref({ year: params.year, category })}
                className={
                  params.category === category ? "underline font-semibold" : "hover:underline"
                }
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--ink-muted)]">
        {total.toLocaleString()} record{total === 1 ? "" : "s"} match
        {params.year || params.category ? " your filters" : ""}.
      </p>

      <div className="mt-4 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)]">
        {records.map((record) => (
          <div
            key={record.originalUrl}
            className="grid gap-2 bg-[var(--background)] p-4 sm:grid-cols-[110px_1fr_auto]"
          >
            <span className="text-xs text-[var(--ink-muted)]">
              {record.publishedDate ? formatDate(record.publishedDate) : "Undated"}
            </span>
            <div>
              <p className="font-medium leading-snug">{record.title || "(untitled)"}</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                {[record.category, record.subcategory].filter(Boolean).join(" / ") ||
                  "Uncategorized"}
                {record.sourcePublisher ? ` · Source: ${record.sourcePublisher}` : ""}
              </p>
            </div>
            <span className="self-start whitespace-nowrap text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
              {CLASSIFICATION_LABEL[record.migrationClassification]}
            </span>
          </div>
        ))}
        {records.length === 0 ? (
          <p className="bg-[var(--background)] p-6 text-sm text-[var(--ink-muted)]">
            No records match these filters.
          </p>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-8 flex flex-wrap gap-2 text-sm" aria-label="Archive pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-2">
                {idx > 0 && arr[idx - 1] !== p - 1 ? (
                  <span className="text-[var(--ink-muted)]">…</span>
                ) : null}
                <Link
                  href={buildHref({
                    year: params.year,
                    category: params.category,
                    page: String(p),
                  })}
                  className={
                    p === page
                      ? "flex size-9 items-center justify-center border border-[var(--foreground)] font-semibold"
                      : "flex size-9 items-center justify-center border border-[var(--line)] hover:border-[var(--foreground)]"
                  }
                >
                  {p}
                </Link>
              </span>
            ))}
        </nav>
      ) : null}
    </div>
  );
}
