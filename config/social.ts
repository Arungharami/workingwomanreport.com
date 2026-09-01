import { Camera, CirclePlay, MessageCircle, Music2, Send } from "lucide-react";

export const socialConfig = {
  youtube: {
    label: "YouTube",
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
    icon: CirclePlay,
  },
  instagram: {
    label: "Instagram",
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    icon: Camera,
  },
  facebook: {
    label: "Facebook",
    url: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    icon: MessageCircle,
  },
  tiktok: {
    label: "TikTok",
    url: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
    icon: Music2,
  },
  x: {
    label: "X",
    handle: "@WorkingWomanTV",
    url: "https://x.com/WorkingWomanTV",
    icon: Send,
  },
} as const;

export function configuredSocialLinks() {
  return Object.values(socialConfig).filter((item) => item.url.length > 0);
}
