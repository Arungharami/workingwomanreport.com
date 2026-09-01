import { disabledResult, type SocialAdapter } from "./types";

export const facebookAdapter: SocialAdapter = {
  platform: "Facebook",
  isConfigured: () => Boolean(process.env.FACEBOOK_APP_ID),
  prepare: (_story, socialPackage) => socialPackage.facebook,
  publish: async () => disabledResult("Facebook"),
};
