import { disabledResult, type SocialAdapter } from "./types";

export const instagramAdapter: SocialAdapter = {
  platform: "Instagram",
  isConfigured: () => Boolean(process.env.INSTAGRAM_APP_ID),
  prepare: (_story, socialPackage) => socialPackage.instagram,
  publish: async () => disabledResult("Instagram"),
};
