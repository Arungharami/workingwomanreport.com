import { disabledResult, type SocialAdapter } from "./types";

export const tiktokAdapter: SocialAdapter = {
  platform: "TikTok",
  isConfigured: () => Boolean(process.env.TIKTOK_CLIENT_KEY),
  prepare: (_story, socialPackage) => socialPackage.tiktok,
  publish: async () => disabledResult("TikTok"),
};
