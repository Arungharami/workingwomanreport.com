import type { MetadataRoute } from "next";
import { getPublishedStories, getWeeklyStories } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/this-week", "/watch", "/stories", "/about", "/contact"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
    }),
  );
  const weeklyRoutes = getWeeklyStories().map((story) => ({
    url: `${siteConfig.url}/this-week/${story.slug}`,
    lastModified: new Date(story.updatedDate ?? story.publishDate),
  }));
  const storyRoutes = getPublishedStories().map((story) => ({
    url: `${siteConfig.url}/stories/${story.slug}`,
    lastModified: new Date(story.updatedDate ?? story.publishDate),
  }));

  return [...staticRoutes, ...weeklyRoutes, ...storyRoutes];
}
