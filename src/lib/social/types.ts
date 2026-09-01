import type { SocialPackage, WeeklyStory } from "@/lib/content/schema";

export type PublishResult = {
  ok: false;
  message: string;
};

export interface SocialAdapter {
  platform: string;
  isConfigured(): boolean;
  prepare(story: WeeklyStory, socialPackage: SocialPackage): Record<string, unknown>;
  publish(): Promise<PublishResult>;
}

export function disabledResult(platform: string): PublishResult {
  return {
    ok: false,
    message: `${platform} publishing is intentionally disabled until official API credentials and editorial approvals are configured.`,
  };
}
