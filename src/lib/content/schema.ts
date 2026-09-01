import { z } from "zod";

export const contentStatusSchema = z.enum([
  "idea",
  "research",
  "reporting",
  "draft",
  "review",
  "approved",
  "scheduled",
  "published",
  "archived",
]);

export const sourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  publisher: z.string().optional(),
  date: z.string().optional(),
  type: z
    .enum(["official", "interview", "report", "research", "news", "dataset", "other"])
    .default("other"),
  note: z.string().optional(),
});

const bodyBlockSchema = z.object({
  heading: z.string().optional(),
  body: z.string(),
});

export const weeklyStorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  dek: z.string(),
  summary: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  status: contentStatusSchema,
  isDemo: z.boolean().default(false),
  publishDate: z.string(),
  airDate: z.string().optional(),
  updatedDate: z.string().optional(),
  author: z.string(),
  reporter: z.string(),
  location: z.string().optional(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  thumbnail: z.string().optional(),
  video: z
    .object({
      title: z.string().optional(),
      duration: z.string().optional(),
      captionUrl: z.string().optional(),
      embedUrl: z.string().url().optional(),
      chapters: z.array(z.string()).default([]),
      relatedVideos: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url(),
            platform: z.string().default("YouTube"),
          }),
        )
        .default([]),
      shortClips: z
        .array(
          z.object({
            title: z.string(),
            hook: z.string(),
            status: z.string().default("planned"),
          }),
        )
        .default([]),
    })
    .optional(),
  youtubeVideoId: z.string().optional(),
  youtubeShortUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  facebookUrl: z.string().url().optional(),
  tiktokUrl: z.string().url().optional(),
  xUrl: z.string().url().optional(),
  sources: z.array(sourceSchema).default([]),
  keyTakeaways: z.array(z.string()).min(1),
  articleBody: z.array(bodyBlockSchema),
  transcript: z.string().optional(),
  quotes: z.array(z.object({ quote: z.string(), attribution: z.string() })).default([]),
  relatedStories: z.array(z.string()).default([]),
  seoTitle: z.string(),
  seoDescription: z.string(),
  canonicalUrl: z.string().optional(),
  socialCopy: z.record(z.string(), z.string()).optional(),
  newsletterCopy: z.string().optional(),
  demoNotice: z.string().optional(),
});

export const storySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  dek: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  status: contentStatusSchema,
  isDemo: z.boolean().default(false),
  publishDate: z.string(),
  updatedDate: z.string().optional(),
  author: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  body: z.array(bodyBlockSchema),
  sources: z.array(sourceSchema).default([]),
  relatedStories: z.array(z.string()).default([]),
  seoTitle: z.string(),
  seoDescription: z.string(),
  demoNotice: z.string().optional(),
});

export const socialPackageSchema = z.object({
  slug: z.string(),
  youtube: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    chapters: z.array(z.string()),
    pinnedComment: z.string(),
    shortTitle: z.string(),
    shortCaption: z.string(),
  }),
  instagram: z.object({
    caption: z.string(),
    reelCaption: z.string(),
    carouselSlides: z.array(z.string()),
    hashtags: z.array(z.string()),
    altText: z.string(),
  }),
  facebook: z.object({
    post: z.string(),
    shortPost: z.string(),
    videoDescription: z.string(),
  }),
  tiktok: z.object({
    hook: z.string(),
    caption: z.string(),
    onscreenText: z.array(z.string()),
    hashtags: z.array(z.string()),
  }),
  x: z.object({
    post1: z.string(),
    post2: z.string(),
    post3: z.string(),
    thread: z.array(z.string()),
  }),
  newsletter: z.object({
    subject: z.string(),
    preview: z.string(),
    body: z.string(),
    callToAction: z.string(),
  }),
  website: z.object({
    headline: z.string(),
    dek: z.string(),
    excerpt: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

export type WeeklyStory = z.infer<typeof weeklyStorySchema>;
export type Story = z.infer<typeof storySchema>;
export type SocialPackage = z.infer<typeof socialPackageSchema>;
export type ContentStatus = z.infer<typeof contentStatusSchema>;
