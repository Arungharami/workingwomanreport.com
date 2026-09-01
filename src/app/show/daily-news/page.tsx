import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getDailyNewsRecords } from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Daily News Archive",
  description: "Working Woman Report's Daily News segment archive.",
  robots: { index: false, follow: true },
};

export default function DailyNewsArchivePage() {
  const records = getDailyNewsRecords();

  return (
    <div className="container-shell py-10">
      <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/show">The Show</Link>
      </nav>
      <SectionHeader
        eyebrow="The Show"
        title="Daily News Archive"
        dek={`${records.length} legacy record${records.length === 1 ? "" : "s"} from the show's daily-news segment (2014–2015). Titles and dates only.`}
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {records.map((record) => (
          <li key={record.originalUrl} className="border border-[var(--line)] p-4">
            <p className="text-xs text-[var(--ink-muted)]">
              {formatDate(record.publishedDate)}
            </p>
            <p className="mt-1 font-medium leading-snug">{record.title}</p>
          </li>
        ))}
        {records.length === 0 ? (
          <p className="text-sm text-[var(--ink-muted)]">No daily-news records found.</p>
        ) : null}
      </ul>
    </div>
  );
}
