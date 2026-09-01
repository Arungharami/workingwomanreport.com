import { socialConfig } from "./social";

export const brandConfig = {
  brandName: "Working Woman Report",
  shortName: "WWR",
  tagline: "Television + Editorial Newsroom",
  description:
    "A women-focused digital television and editorial newsroom covering entrepreneurship, business, careers, money, lifestyle, health, technology, entertainment, and success stories.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://workingwomanreport.com",
  logo: "",
  logoDark: "",
  favicon: "/favicon.ico",
  defaultOgImage: "/images/newsroom-weekly.svg",
  contactEmail: "editorial@workingwomanreport.com",
  location: "United States",
  reporter: {
    name: "Allison Haunss",
    slug: "allison-haunss",
    role: "Founder / Reporter",
    profilePath: "/people/allison-haunss",
  },
  social: socialConfig,
} as const;
