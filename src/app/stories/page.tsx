import type { Metadata } from "next";
import { EditorialEmptyState } from "@/components/empty-state";
import { StoryCard } from "@/components/story-card";
import { SectionHeader } from "@/components/ui";
import { getPublishedStories } from "@/lib/content";

type Props = { searchParams: Promise<{ category?: string }> };

export const metadata: Metadata = {
  title: "Stories",
  description: "Working Woman Report editorial stories by category and tag.",
};

export default async function StoriesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const stories = getPublishedStories().filter((story) =>
    category ? story.category === category : true,
  );

  if (!stories.length) {
    return (
      <EditorialEmptyState
        title="Approved stories are coming soon."
        dek="The public article index will fill with verified Working Woman Report coverage after Allison-approved content is added."
      />
    );
  }

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Editorial"
        title={category ?? "Stories"}
        dek="Business, money, career, health, life, technology, entertainment, and success coverage."
      />
      <div className="grid gap-8 md:grid-cols-3">
        {stories.map((story) => (
          <StoryCard key={story.slug} story={story} href={`/stories/${story.slug}`} />
        ))}
      </div>
    </div>
  );
}
