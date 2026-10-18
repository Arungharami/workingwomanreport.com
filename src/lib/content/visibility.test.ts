import { describe, expect, it } from "vitest";
import { isPublicContent } from "./visibility";

const now = new Date("2026-10-04T12:00:00Z");
const story = { status: "published", isDemo: false, publishDate: "2026-10-04T12:00:00Z" };

describe("publication visibility", () => {
  it("includes released stories at the publication boundary", () => {
    expect(isPublicContent(story, now)).toBe(true);
  });
  it("withholds future stories and invalid dates", () => {
    expect(isPublicContent({ ...story, publishDate: "2026-10-05T00:00:00Z" }, now)).toBe(false);
    expect(isPublicContent({ ...story, publishDate: "invalid" }, now)).toBe(false);
  });
  it("respects explicit timezone offsets", () => {
    expect(isPublicContent({ ...story, publishDate: "2026-10-04T09:00:00-04:00" }, now)).toBe(false);
  });
  it("never releases demos or unpublished records", () => {
    expect(isPublicContent({ ...story, isDemo: true }, now)).toBe(false);
    expect(isPublicContent({ ...story, status: "scheduled" }, now)).toBe(false);
  });
});
