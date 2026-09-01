import { describe, expect, it } from "vitest";
import {
  getCurrentWeeklyStory,
  getSearchIndex,
  getSocialPackage,
  searchContent,
} from "@/lib/content";

describe("content helpers", () => {
  it("loads a validated current weekly story", () => {
    const story = getCurrentWeeklyStory();
    expect(story.slug).toBe("demo-main-street-growth");
    expect(story.keyTakeaways.length).toBeGreaterThan(2);
  });

  it("loads the matching social package", () => {
    const story = getCurrentWeeklyStory();
    expect(getSocialPackage(story.slug)?.youtube.title).toContain("DEMO");
  });

  it("searches weekly reports and stories", () => {
    expect(getSearchIndex().length).toBeGreaterThan(1);
    expect(searchContent("capital").some((item) => item.href.includes("capital"))).toBe(true);
  });
});
