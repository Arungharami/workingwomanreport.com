import { getPublishedStories, getPublishedWeeklyStories } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const items = [...getPublishedWeeklyStories(), ...getPublishedStories()]
    .map((item) => {
      const path = "summary" in item ? `/this-week/${item.slug}` : `/stories/${item.slug}`;
      return `<item><title><![CDATA[${item.title}]]></title><link>${siteConfig.url}${path}</link><guid>${siteConfig.url}${path}</guid><description><![CDATA[${item.dek}]]></description><pubDate>${new Date(item.publishDate).toUTCString()}</pubDate></item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${siteConfig.description}</description>${items}</channel></rss>`,
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
      },
    },
  );
}
