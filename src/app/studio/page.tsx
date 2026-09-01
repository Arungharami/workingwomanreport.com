import type { Metadata } from "next";
import Link from "next/link";
import { StudioPanel } from "@/components/studio-panel";
import { LegacyMigrationPanel } from "@/components/legacy-migration-panel";
import { getCurrentStudioWeeklyStory, getSocialPackage } from "@/lib/content";
import {
  getMigrationSummary,
  queryStudioArchive,
  type LegacyClassification,
} from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    legacyPage?: string;
    legacyClassification?: string;
    legacyQuery?: string;
  }>;
};

export default async function StudioPage({ searchParams }: Props) {
  const enabled = process.env.ENABLE_STUDIO === "true";

  if (!enabled) {
    return (
      <div className="container-shell max-w-3xl py-10">
        <h1 className="font-serif text-5xl">Studio Disabled</h1>
        <p className="mt-5 text-sm leading-7 text-[var(--ink-muted)]">
          The internal content-preparation screen is disabled. Set ENABLE_STUDIO=true in a
          local or protected environment to review weekly packages, social copy, SEO,
          accessibility, and publishing checklist items.
        </p>
        <Link className="mt-6 inline-block underline" href="/">
          Return home
        </Link>
      </div>
    );
  }

  const params = await searchParams;
  const summary = getMigrationSummary();
  const legacyResult = queryStudioArchive({
    page: Number(params.legacyPage ?? "1") || 1,
    classification: params.legacyClassification as LegacyClassification | undefined,
    query: params.legacyQuery,
  });

  const story = getCurrentStudioWeeklyStory();
  const socialPackage = story ? getSocialPackage(story.slug) : undefined;

  return (
    <div className="container-shell py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Internal Studio
      </p>
      <h1 className="mt-3 font-serif text-5xl">Weekly Package Preparation</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--ink-muted)]">
        No automatic posting happens here. This screen prepares copy, metadata, accessibility
        checks, and Allison approval before publishing.
      </p>

      {story && socialPackage ? (
        <div className="mt-10">
          <StudioPanel story={story} socialPackage={socialPackage} />
        </div>
      ) : (
        <div className="mt-10 border border-[var(--line)] bg-[var(--paper)] p-6">
          <h2 className="font-serif text-2xl">
            {story ? "Social package missing" : "No weekly package found"}
          </h2>
        </div>
      )}

      <div className="mt-16 border-t-2 border-[var(--accent)] pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Internal — Not Public
        </p>
        <h2 className="mt-3 font-serif text-4xl">Legacy Migration</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-muted)]">
          Full audit of the legacy workingwomanreport.com WordPress archive. This screen is
          gated behind ENABLE_STUDIO and never shows to public visitors — see
          docs/legacy-migration-report.md for the narrative writeup.
        </p>
        <LegacyMigrationPanel
          summary={summary}
          result={legacyResult}
          currentClassification={params.legacyClassification}
          currentQuery={params.legacyQuery}
        />
      </div>
    </div>
  );
}
