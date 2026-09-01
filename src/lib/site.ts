import { Camera, CirclePlay, MessageCircle, Music2, Play, Send } from "lucide-react";

export const siteConfig = {
  name: "Working Woman Report",
  shortName: "WWR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://workingwomanreport.com",
  description:
    "A modern digital television and editorial newsroom covering women in business, money, careers, health, technology, entertainment, and success.",
  founder: "Allison Haunss",
  contactEmail: "editorial@workingwomanreport.com",
  social: {
    youtube: {
      label: "YouTube",
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
      icon: CirclePlay,
      configured: Boolean(process.env.NEXT_PUBLIC_YOUTUBE_URL),
    },
    instagram: {
      label: "Instagram",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
      icon: Camera,
      configured: Boolean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    },
    facebook: {
      label: "Facebook",
      url: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
      icon: MessageCircle,
      configured: Boolean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    },
    tiktok: {
      label: "TikTok",
      url: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
      icon: Music2,
      configured: Boolean(process.env.NEXT_PUBLIC_TIKTOK_URL),
    },
    x: {
      label: "X",
      handle: "@WorkingWomanTV",
      url: "https://x.com/WorkingWomanTV",
      icon: Send,
      configured: true,
    },
    watch: {
      label: "Watch",
      url: "/watch",
      icon: Play,
      configured: true,
    },
  },
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/this-week", label: "This Week" },
  { href: "/watch", label: "Watch" },
  { href: "/stories", label: "Stories" },
  { href: "/stories?category=Business", label: "Business" },
  { href: "/stories?category=Money", label: "Money" },
  { href: "/stories?category=Career", label: "Career" },
  { href: "/stories?category=Health", label: "Health" },
  { href: "/stories?category=Life%20%26%20Style", label: "Life & Style" },
  { href: "/stories?category=Technology", label: "Technology" },
  { href: "/stories?category=Entertainment", label: "Entertainment" },
  { href: "/stories?category=Success%20Stories", label: "Success Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const categories = [
  "Business",
  "Money",
  "Career",
  "Health",
  "Life & Style",
  "Technology",
  "Entertainment",
  "Success Stories",
] as const;
