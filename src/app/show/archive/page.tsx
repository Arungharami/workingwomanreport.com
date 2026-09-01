import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getShowFamilyRecords, getOwnedHistoricalRecords } from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Show Archive",
  description: "The Working Woman Report show archive — history, segments, and records.",
  robots: { index: false, follow: true },
};

export default function ShowArchivePage() {
  const records = getShowFamilyRecords();
  const historical = getOwnedHistoricalRecords();

  return (
    <div className="container-shell py-10">
      <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/show">The Show</Link>
      </nav>
      <SectionHeader
        eyebrow="The Show"
        title="Show Archive"
        dek={`${records.length} legacy show, video, and profile record${records.length === 1 ? "" : "s"} spanning 2013–2016.`}
      />

      {historical.length ? (
        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          {historical.map((record) => (
            <div key={record.originalUrl} className="border-2 border-[var(--accent)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                Verified historical record
              </p>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                {formatDate(record.publishedDate)}
              </p>
              <p className="mt-1 font-medium leading-snug">{record.title}</p>
            </div>
          ))}
        </section>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {records
          .filter((r) => r.contentOwnershipStatus !== "OWNED")
          .map((record) => (
            <li key={record.originalUrl} className="border border-[var(--line)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">
                {formatDate(record.publishedDate)}
              </p>
              <p className="mt-1 font-medium leading-snug">{record.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                {record.migrationClassification === "WWR_VIDEO"
                  ? "Video / news brief"
                  : "Show record"}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
