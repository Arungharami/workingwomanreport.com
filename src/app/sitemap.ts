import type { MetadataRoute } from "next";
import { getPublishedStories, getPublishedWeeklyStories } from "@/lib/content";
import { getPeople } from "@/lib/people";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/this-week",
    "/watch",
    "/stories",
    "/show",
    "/about",
    "/contact",
    "/search",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
  const weeklyRoutes = getPublishedWeeklyStories().map((story) => ({
    url: `${siteConfig.url}/this-week/${story.slug}`,
    lastModified: new Date(story.updatedDate ?? story.publishDate),
  }));
  const storyRoutes = getPublishedStories().map((story) => ({
    url: `${siteConfig.url}/stories/${story.slug}`,
    lastModified: new Date(story.updatedDate ?? story.publishDate),
  }));
  const peopleRoutes = getPeople().map((person) => ({
    url: `${siteConfig.url}/people/${person.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...weeklyRoutes, ...storyRoutes, ...peopleRoutes];
}
