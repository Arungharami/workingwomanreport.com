import { disabledResult, type SocialAdapter } from "./types";

export const xAdapter: SocialAdapter = {
  platform: "X",
  isConfigured: () => Boolean(process.env.X_API_KEY),
  prepare: (_story, socialPackage) => socialPackage.x,
  publish: async () => disabledResult("X"),
};
