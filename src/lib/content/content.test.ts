import { describe, expect, it } from "vitest";
import {
  getCurrentStudioWeeklyStory,
  getCurrentWeeklyStory,
  getSearchIndex,
  getSocialPackage,
  searchContent,
} from "@/lib/content";

function expectDefined<T>(value: T | undefined): asserts value is T {
  expect(value).toBeDefined();
}

describe("content helpers", () => {
  it("loads a validated studio weekly story", () => {
    const story = getCurrentStudioWeeklyStory();
    expectDefined(story);
    expect(story.slug).toBe("demo-main-street-growth");
    expect(story.keyTakeaways.length).toBeGreaterThan(2);
  });

  it("loads the matching social package", () => {
    const story = getCurrentStudioWeeklyStory();
    expectDefined(story);
    expect(getSocialPackage(story.slug)?.youtube.title).toContain("DEMO");
  });

  it("keeps demo records out of public content helpers", () => {
    expect(getCurrentWeeklyStory()).toBeUndefined();
    expect(getSearchIndex().some((item) => item.href.includes("demo"))).toBe(false);
    expect(searchContent("capital")).toEqual([]);
  });
});
