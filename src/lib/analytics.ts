export type AnalyticsEvent =
  | "article_view"
  | "weekly_story_view"
  | "video_play"
  | "youtube_click"
  | "instagram_click"
  | "facebook_click"
  | "tiktok_click"
  | "x_click"
  | "newsletter_signup"
  | "share_click"
  | "search"
  | "related_story_click";

export function trackEvent(event: AnalyticsEvent, payload: Record<string, string> = {}) {
  void event;
  void payload;
}
