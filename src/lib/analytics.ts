export type AnalyticsEvent =
  | "article_view"
  | "video_play"
  | "youtube_click"
  | "instagram_click"
  | "facebook_click"
  | "tiktok_click"
  | "x_click"
  | "newsletter_signup"
  | "share_click";

export function trackEvent(event: AnalyticsEvent, payload: Record<string, string> = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:dev]", event, payload);
  }
}
