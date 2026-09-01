import type { Story, WeeklyStory } from "@/lib/content/schema";
import { absoluteUrl } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export function articleJsonLd(story: Story | WeeklyStory, path: string) {
  const url = absoluteUrl(path, siteConfig.url);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: story.seoDescription,
    datePublished: story.publishDate,
    dateModified: story.updatedDate ?? story.publishDate,
    author: {
      "@type": "Person",
      name: "reporter" in story ? story.reporter : story.author,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: url,
    image: [absoluteUrl(story.heroImage, siteConfig.url)],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteConfig.url),
    })),
  };
}

export function videoJsonLd(story: WeeklyStory) {
  if (!story.youtubeVideoId && !story.video?.embedUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: story.video?.title ?? story.title,
    description: story.summary,
    thumbnailUrl: [absoluteUrl(story.thumbnail ?? story.heroImage, siteConfig.url)],
    uploadDate: story.airDate ?? story.publishDate,
    embedUrl:
      story.video?.embedUrl ??
      `https://www.youtube-nocookie.com/embed/${story.youtubeVideoId}`,
  };
}
