import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getLegacyRecordBySlug } from "@/lib/legacy";

/**
 * Catch-all for legacy WordPress permalinks (`workingwomanreport.com/<slug>/`)
 * that don't match a real route on the new site and aren't in the small
 * hand-curated redirect list (see next.config.ts + migration/redirects.json).
 *
 * This intentionally does NOT reproduce article bodies or redirect to the
 * homepage. It looks the slug up in the full legacy audit and, if found,
 * shows a metadata-only notice — otherwise a normal 404. SPAM-classified
 * records always 404 (getLegacyRecordBySlug filters them out).
 */

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ legacySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacySlug } = await params;
  const record = getLegacyRecordBySlug(legacySlug);
  if (!record) {
    return {};
  }
  return {
    title: record.title || "Legacy archive record",
    robots: { index: false, follow: true },
  };
}

export default async function LegacySlugPage({ params }: Props) {
  const { legacySlug } = await params;
  const record = getLegacyRecordBySlug(legacySlug);
  if (!record) {
    notFound();
  }

  const isSyndicated = record.migrationClassification === "SYNDICATED";
  const isReview = record.migrationClassification === "REVIEW_REQUIRED";

  return (
    <div className="container-shell max-w-3xl py-10">
      <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/archive">Archive</Link>
      </nav>
      <SectionHeader eyebrow="Legacy Archive Record" title={record.title || "(untitled)"} />
      <dl className="grid gap-3 border-y border-[var(--line)] py-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Originally published
          </dt>
          <dd className="mt-1">
            {record.publishedDate ? formatDate(record.publishedDate) : "Undated"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Category
          </dt>
          <dd className="mt-1">
            {[record.category, record.subcategory].filter(Boolean).join(" / ") ||
              "Uncategorized"}
          </dd>
        </div>
        {record.sourcePublisher ? (
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              Source / original reporting
            </dt>
            <dd className="mt-1">{record.sourcePublisher}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 border border-[var(--line)] bg-[var(--paper)] p-5 text-sm leading-6 text-[var(--ink-muted)]">
        {isSyndicated ? (
          <p>
            This record was wire-syndicated content distributed to Working Woman Report by a
            third-party news service, not original Working Woman Report reporting. The article
            body is not reproduced here; the original publisher is credited above.
          </p>
        ) : isReview ? (
          <p>
            This record is part of the legacy Working Woman Report archive and has not yet
            completed content-ownership review. It is shown here as a metadata record only —
            the original article body is not reproduced pending Allison&rsquo;s confirmation of
            rights.
          </p>
        ) : (
          <p>
            This record is part of the legacy Working Woman Report archive. It is shown here as
            a metadata record only, pending full migration review.
          </p>
        )}
      </div>

      <div className="mt-8">
        <Link href="/archive" className="underline">
          Browse the full archive
        </Link>
      </div>
    </div>
  );
}
