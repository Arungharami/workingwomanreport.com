import { z } from "zod";

export const weeklyAnalyticsReportSchema = z.object({
  week: z.string(),
  topic: z.string(),
  websiteViews: z.number().nullable(),
  videoViews: z.number().nullable(),
  averageWatchTime: z.string().nullable(),
  youtubeViews: z.number().nullable(),
  instagramReach: z.number().nullable(),
  facebookReach: z.number().nullable(),
  tiktokViews: z.number().nullable(),
  xImpressions: z.number().nullable(),
  engagement: z.number().nullable(),
  clicks: z.number().nullable(),
  followersAdded: z.number().nullable(),
  bestPlatform: z.string().nullable(),
  bestContent: z.string().nullable(),
  notes: z.string(),
  nextWeekRecommendation: z.string(),
});

export type WeeklyAnalyticsReport = z.infer<typeof weeklyAnalyticsReportSchema>;

export const blankWeeklyAnalyticsReport: WeeklyAnalyticsReport = {
  week: "",
  topic: "",
  websiteViews: null,
  videoViews: null,
  averageWatchTime: null,
  youtubeViews: null,
  instagramReach: null,
  facebookReach: null,
  tiktokViews: null,
  xImpressions: null,
  engagement: null,
  clicks: null,
  followersAdded: null,
  bestPlatform: null,
  bestContent: null,
  notes: "",
  nextWeekRecommendation: "",
};
