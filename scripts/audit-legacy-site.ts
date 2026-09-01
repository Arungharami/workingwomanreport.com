import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.LEGACY_SITE_URL ?? "https://workingwomanreport.com";
const outputPath = path.join(process.cwd(), "migration", "legacy-audit.json");

function textBetween(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function metaContent(html: string, name: string) {
  const match = html.match(
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
  );
  return match?.[1] ?? "";
}

function linksFrom(html: string) {
  return Array.from(html.matchAll(/href=["']([^"']+)["']/gi))
    .map((match) => match[1])
    .filter((href) => href.startsWith(baseUrl) || href.startsWith("/"))
    .map((href) => new URL(href, baseUrl).toString())
    .filter((href) => href.startsWith(baseUrl));
}

async function fetchHtml(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  return response.text();
}

async function main() {
  const seen = new Set<string>();
  const queue = [baseUrl, `${baseUrl}/category/the-show/`, `${baseUrl}/author/ahunss/`];
  const records: unknown[] = [];

  while (queue.length && records.length < 75) {
    const url = queue.shift();
    if (!url || seen.has(url)) {
      continue;
    }
    seen.add(url);

    try {
      const html = await fetchHtml(url);
      records.push({
        originalUrl: url,
        title: textBetween(html, "title"),
        description: metaContent(html, "description"),
        canonicalUrl: html.match(/rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? "",
        discoveredAt: new Date().toISOString(),
      });
      for (const href of linksFrom(html).slice(0, 20)) {
        if (!seen.has(href)) {
          queue.push(href);
        }
      }
    } catch (error) {
      records.push({
        originalUrl: url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({ baseUrl, records }, null, 2));
  console.log(`Wrote ${records.length} legacy audit records to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
