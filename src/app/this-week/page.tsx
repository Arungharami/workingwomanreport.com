import type { Metadata } from "next";
import { EditorialEmptyState } from "@/components/empty-state";
import { StoryCard } from "@/components/story-card";
import { SectionHeader } from "@/components/ui";
import { getWeeklyStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "This Week",
  description: "Current and archived weekly Working Woman Report packages.",
};

export default function ThisWeekPage() {
  const weeklyStories = getWeeklyStories();
  const publicStories = weeklyStories.filter((story) => !story.isDemo);

  if (!publicStories.length) {
    return <EditorialEmptyState />;
  }

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Weekly Desk"
        title="This Week"
        dek="The canonical home for each flagship topic Allison reports, prepares, presents, and distributes."
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {publicStories.map((story) => (
          <StoryCard key={story.slug} story={story} href={`/this-week/${story.slug}`} />
        ))}
      </div>
    </div>
  );
}
