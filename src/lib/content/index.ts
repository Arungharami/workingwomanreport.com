import fs from "node:fs";
import path from "node:path";
import {
  socialPackageSchema,
  storySchema,
  weeklyStorySchema,
  type SocialPackage,
  type Story,
  type WeeklyStory,
} from "./schema";

const contentRoot = path.join(process.cwd(), "content");

function readJsonDirectory<T>(directory: string, parse: (input: unknown) => T): T[] {
  const dir = path.join(contentRoot, directory);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as unknown;
      return parse(raw);
    });
}

function newestFirst<T extends { publishDate: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
}

export function getWeeklyStories(): WeeklyStory[] {
  return newestFirst(readJsonDirectory("weekly", (item) => weeklyStorySchema.parse(item)));
}

export function getPublishedWeeklyStories(): WeeklyStory[] {
  return getWeeklyStories().filter((story) => story.status === "published" && !story.isDemo);
}

export function getCurrentWeeklyStory(): WeeklyStory | undefined {
  return getPublishedWeeklyStories()[0];
}

export function getStudioWeeklyStories(): WeeklyStory[] {
  return getWeeklyStories();
}

export function getCurrentStudioWeeklyStory(): WeeklyStory | undefined {
  return getWeeklyStories()[0];
}

export function getWeeklyStory(slug: string): WeeklyStory | undefined {
  return getPublishedWeeklyStories().find((story) => story.slug === slug);
}

export function getStudioWeeklyStory(slug: string): WeeklyStory | undefined {
  return getWeeklyStories().find((story) => story.slug === slug);
}

export function getStories(): Story[] {
  return newestFirst(readJsonDirectory("stories", (item) => storySchema.parse(item)));
}

export function getPublishedStories(): Story[] {
  return getStories().filter((story) => story.status === "published" && !story.isDemo);
}

export function getStory(slug: string): Story | undefined {
  return getPublishedStories().find((story) => story.slug === slug);
}

export function getStudioStories(): Story[] {
  return getStories();
}

export function getSocialPackages(): SocialPackage[] {
  return readJsonDirectory("social", (item) => socialPackageSchema.parse(item));
}

export function getSocialPackage(slug: string): SocialPackage | undefined {
  return getSocialPackages().find((pack) => pack.slug === slug);
}

export function getSearchIndex() {
  const weekly = getPublishedWeeklyStories().map((item) => ({
    type: "Weekly Report",
    title: item.title,
    dek: item.dek,
    href: `/this-week/${item.slug}`,
    category: item.category,
    tags: item.tags,
  }));
  const stories = getPublishedStories().map((item) => ({
    type: "Story",
    title: item.title,
    dek: item.dek,
    href: `/stories/${item.slug}`,
    category: item.category,
    tags: item.tags,
  }));

  return [...weekly, ...stories];
}

export function searchContent(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return getSearchIndex().filter((item) =>
    [item.title, item.dek, item.category, ...item.tags]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}
