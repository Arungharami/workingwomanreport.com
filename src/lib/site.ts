import { Play } from "lucide-react";
import { brandConfig } from "../../config/brand";
import { socialConfig } from "../../config/social";

export const siteConfig = {
  name: brandConfig.brandName,
  shortName: brandConfig.shortName,
  tagline: brandConfig.tagline,
  url: brandConfig.siteUrl,
  description: brandConfig.description,
  founder: brandConfig.reporter.name,
  reporter: brandConfig.reporter,
  contactEmail: brandConfig.contactEmail,
  social: {
    youtube: {
      ...socialConfig.youtube,
      configured: Boolean(socialConfig.youtube.url),
    },
    instagram: {
      ...socialConfig.instagram,
      configured: Boolean(socialConfig.instagram.url),
    },
    facebook: {
      ...socialConfig.facebook,
      configured: Boolean(socialConfig.facebook.url),
    },
    tiktok: {
      ...socialConfig.tiktok,
      configured: Boolean(socialConfig.tiktok.url),
    },
    x: {
      ...socialConfig.x,
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
