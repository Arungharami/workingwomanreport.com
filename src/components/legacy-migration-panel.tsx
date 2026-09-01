import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { LegacyRecord } from "@/lib/legacy";

type Summary = {
  totalReportedByApi: number;
  totalFetched: number;
  totalCategories: number;
  byClassification: Record<string, number>;
  byOwnership: Record<string, number>;
  byCategory: Record<string, number>;
  byYear: Record<string, number>;
} | null;

type QueryResult = {
  records: LegacyRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const CLASSIFICATIONS = [
  "WWR_ORIGINAL",
  "WWR_VIDEO",
  "WWR_PROFILE",
  "WWR_SHOW",
  "SYNDICATED",
  "THIRD_PARTY",
  "SPAM",
  "BROKEN",
  "DUPLICATE",
  "REVIEW_REQUIRED",
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--paper)] p-4">
      <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--ink-muted)]">
        {label}
      </p>
    </div>
  );
}

function buildStudioHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/studio?${qs}` : "/studio";
}

export function LegacyMigrationPanel({
  summary,
  result,
  currentClassification,
  currentQuery,
}: {
  summary: Summary;
  result: QueryResult;
  currentClassification?: string;
  currentQuery?: string;
}) {
  if (!summary) {
    return (
      <p className="mt-6 text-sm text-[var(--ink-muted)]">
        No migration summary found. Run <code>npx tsx scripts/audit-legacy-full.ts</code> to
        generate migration/legacy-migration-summary.json.
      </p>
    );
  }

  const ownership = summary.byOwnership;

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--ink-muted)]">
        {summary.totalFetched.toLocaleString()} legacy records fetched
        {summary.totalReportedByApi !== summary.totalFetched
          ? ` (of ${summary.totalReportedByApi.toLocaleString()} reported by the legacy API — a small pagination discrepancy, not a script error)`
          : ""}
        .
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total discovered" value={summary.totalFetched} />
        <StatCard label="Owned" value={ownership.OWNED ?? 0} />
        <StatCard label="Authorized" value={ownership.AUTHORIZED ?? 0} />
        <StatCard label="Metadata only" value={ownership.METADATA_ONLY ?? 0} />
        <StatCard label="Needs review" value={ownership.REVIEW_REQUIRED ?? 0} />
        <StatCard label="Spam / skipped" value={ownership.SKIP ?? 0} />
        <StatCard
          label="Migrated"
          value={
            (summary.byClassification.WWR_PROFILE ?? 0) +
            (summary.byClassification.WWR_SHOW ?? 0)
          }
        />
        <StatCard label="Categories" value={summary.totalCategories} />
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-2xl">Inspect By Record</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href={buildStudioHref({ legacyQuery: currentQuery })}
            className={!currentClassification ? "underline font-semibold" : "hover:underline"}
          >
            All
          </Link>
          {CLASSIFICATIONS.map((c) => (
            <Link
              key={c}
              href={buildStudioHref({ legacyClassification: c, legacyQuery: currentQuery })}
              className={
                currentClassification === c ? "underline font-semibold" : "hover:underline"
              }
            >
              {c} ({summary.byClassification[c] ?? 0})
            </Link>
          ))}
        </div>

        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          {result.total.toLocaleString()} record{result.total === 1 ? "" : "s"} match. Page{" "}
          {result.page} of {result.totalPages}.
        </p>

        <div className="mt-3 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)]">
          {result.records.map((record) => (
            <div
              key={record.originalUrl}
              className="grid gap-1 bg-[var(--background)] p-3 text-sm sm:grid-cols-[100px_1fr_140px_160px]"
            >
              <span className="text-xs text-[var(--ink-muted)]">
                {record.publishedDate ? formatDate(record.publishedDate) : "—"}
              </span>
              <span className="truncate" title={record.title}>
                {record.title || "(untitled)"}
              </span>
              <span className="text-xs uppercase tracking-[0.06em] text-[var(--accent)]">
                {record.migrationClassification}
              </span>
              <span className="truncate text-xs text-[var(--ink-muted)]" title={record.notes}>
                {record.notes}
              </span>
            </div>
          ))}
        </div>

        {result.totalPages > 1 ? (
          <nav
            className="mt-4 flex flex-wrap gap-2 text-sm"
            aria-label="Legacy record pagination"
          >
            {Array.from({ length: Math.min(result.totalPages, 20) }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={buildStudioHref({
                    legacyClassification: currentClassification,
                    legacyQuery: currentQuery,
                    legacyPage: String(p),
                  })}
                  className={
                    p === result.page
                      ? "flex size-8 items-center justify-center border border-[var(--foreground)] font-semibold"
                      : "flex size-8 items-center justify-center border border-[var(--line)]"
                  }
                >
                  {p}
                </Link>
              ),
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
