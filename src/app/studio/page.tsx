import type { Metadata } from "next";
import Link from "next/link";
import { StudioPanel } from "@/components/studio-panel";
import { getCurrentWeeklyStory, getSocialPackage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
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

  const story = getCurrentWeeklyStory();
  const socialPackage = getSocialPackage(story.slug);

  if (!socialPackage) {
    return (
      <div className="container-shell py-10">
        <h1 className="font-serif text-5xl">Social package missing</h1>
      </div>
    );
  }

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
      <div className="mt-10">
        <StudioPanel story={story} socialPackage={socialPackage} />
      </div>
    </div>
  );
}
