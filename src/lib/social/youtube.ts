import { disabledResult, type SocialAdapter } from "./types";

export const youtubeAdapter: SocialAdapter = {
  platform: "YouTube",
  isConfigured: () => Boolean(process.env.YOUTUBE_CLIENT_ID),
  prepare: (story, socialPackage) => ({
    storySlug: story.slug,
    ...socialPackage.youtube,
  }),
  publish: async () => disabledResult("YouTube"),
};
