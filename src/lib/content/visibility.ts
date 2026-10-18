type PublicationState = {
  status: string;
  isDemo: boolean;
  publishDate: string;
};

/** A future publication date must not expose a story before editorial release. */
export function isPublicContent(story: PublicationState, now = new Date()): boolean {
  const publishTime = Date.parse(story.publishDate);
  return (
    story.status === "published" && !story.isDemo &&
    Number.isFinite(publishTime) && publishTime <= now.getTime()
  );
}
