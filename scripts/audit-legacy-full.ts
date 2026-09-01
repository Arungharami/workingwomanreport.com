/**
 * Full legacy content inventory + classification.
 *
 * Crawls the entire legacy WordPress REST API (not a sample) and produces:
 *  - migration/full-legacy-manifest.json   (one record per legacy post, metadata only)
 *  - migration/rejected-content.json       (records classified SPAM, with reason)
 *  - migration/legacy-migration-summary.json (aggregate counts — never fabricated, derived from the run)
 *
 * This script does NOT copy full article bodies into the manifest and does NOT
 * download any media. It only inspects content long enough to classify it, per
 * the copyright rule: legacy content is not assumed to be owned by Working
 * Woman Report just because it was published on workingwomanreport.com.
 */
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.LEGACY_SITE_URL ?? "https://workingwomanreport.com";
const outDir = path.join(process.cwd(), "migration");
const PER_PAGE = 100;
const REQUEST_DELAY_MS = 120;

type WpPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  categories: number[];
  tags: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
};

type WpCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
};

type Classification =
  | "WWR_ORIGINAL"
  | "WWR_VIDEO"
  | "WWR_PROFILE"
  | "WWR_SHOW"
  | "SYNDICATED"
  | "THIRD_PARTY"
  | "SPAM"
  | "BROKEN"
  | "DUPLICATE"
  | "REVIEW_REQUIRED";

type OwnershipStatus = "OWNED" | "AUTHORIZED" | "METADATA_ONLY" | "REVIEW_REQUIRED" | "SKIP";

// High-confidence only. Earlier drafts also matched bare "casino" / "sports
// betting" / "slot machine" and produced false positives against legitimate
// business journalism about the gambling industry (e.g. WNBA ownership deals
// mentioning sports-betting revenue, a story about a professional slots
// streamer). Confirmed real injections on this install all follow the
// "buy <drug> online <link> no prescription" shape, so that combination — not
// the industry-topic keywords alone — is what we match on.
const SPAM_PATTERNS: RegExp[] = [
  /buy\s+(?:[\w-]+\s+){1,3}online[\s\S]{0,300}no\s+prescription/i,
  /\bviagra\b.{0,60}(buy|order|online)/i,
  /\bcialis\b.{0,60}(buy|order|online)/i,
  /\btadora\b|\btadalafil\b.{0,60}(buy|order|online)|\bsildenafil\b.{0,60}(buy|order|online)/i,
  /best\s+online\s+casino|no\s+deposit\s+free\s+spins|casino\s+bonus\s+code/i,
  /\bescort(s)?\s+(service|agency)\s+(in|near)\b/i,
  /essay\s+writing\s+service|write\s+my\s+essay\s+for\s+me|buy\s+.*(essay|term\s+paper)\s+online/i,
  /\bxxx\b.{0,30}(video|cam|tube)|porn(hub)?\.(com|net)/i,
  /\bhack(ed)?\s+(instagram|facebook|whatsapp)\s+account/i,
  /\bbuy\s+(instagram|facebook|tiktok)\s+followers\b/i,
];

// Known wire/syndication credit markers (Tribune Content Agency distributes to/from
// Miami Herald, LA Times, Chicago Tribune, Kaiser Health News, and many others).
const SYNDICATION_MARKERS: RegExp[] = [
  /distributed by tribune content agency/i,
  /tribune content agency,?\s*llc/i,
  /\(TNS\)/,
  /©\s*\d{4}\s+tribune/i,
  /the associated press/i,
  /kaiser health news/i,
];

const KNOWN_PUBLISHERS = [
  "Miami Herald",
  "Los Angeles Times",
  "Philadelphia Inquirer",
  "Chicago Tribune",
  "Bloomberg",
  "Kaiser Health News",
  "Tribune News Service",
  "The Sacramento Bee",
  "Associated Press",
  "The Charlotte Observer",
  "The Kansas City Star",
  "Fort Worth Star-Telegram",
  "Orlando Sentinel",
  "The Sun Sentinel",
  "The Mercury News",
  "The News & Observer",
  "The State",
  "Idaho Statesman",
  "The Wichita Eagle",
  "Star Tribune",
];

// "<p><em>By NAME<br />\nPUBLISHER.</em></p>" byline pattern used throughout the
// legacy site for syndicated wire copy.
const BYLINE_RE = /<p><em>By\s+([^<]+?)<br\s*\/?>\s*([^<]+?)\.?\s*<\/em><\/p>/i;

const SHOW_PROFILE_SLUGS = new Set([
  "about-the-show",
  "about-working-woman-report-host-allison-haunss",
  "working-woman-report-now-on-rnn-tv",
]);

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s: string) {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&");
}

async function fetchJson<T>(url: string, attempt = 1): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status >= 500 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return fetchJson<T>(url, attempt + 1);
    }
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  return { data: (await response.json()) as T, headers: response.headers };
}

function classify(
  post: WpPost,
  categoryById: Map<number, WpCategory>,
  titleCounts: Map<string, number>,
): {
  classification: Classification;
  ownership: OwnershipStatus;
  sourcePublisher: string;
  notes: string;
} {
  const plainTitle = decodeEntities(stripTags(post.title.rendered));
  const haystack = `${post.title.rendered} ${post.excerpt.rendered} ${post.content.rendered}`;

  // Compromise / spam takes priority — including spam injected inside otherwise
  // legitimate syndicated articles (confirmed present on this install).
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(haystack)) {
      return {
        classification: "SPAM",
        ownership: "SKIP",
        sourcePublisher: "",
        notes: `Matched spam pattern ${pattern}. Legacy WordPress install shows signs of compromise (spam links injected into post content); do not migrate body content.`,
      };
    }
  }

  if (SHOW_PROFILE_SLUGS.has(post.slug)) {
    const isProfile = post.slug.includes("allison");
    return {
      classification: isProfile ? "WWR_PROFILE" : "WWR_SHOW",
      ownership: "OWNED",
      sourcePublisher: "Working Woman Report",
      notes:
        "Working Woman Report self-published show/host record. Historical (2013–2015) — verify currency before reuse as current bio.",
    };
  }

  const categoryIds = post.categories ?? [];
  const categoryNames = categoryIds
    .map((id) => categoryById.get(id)?.name)
    .filter((v): v is string => Boolean(v));
  const inShowFamily = categoryIds.some((id) => [13, 210, 2922, 2923].includes(id));

  const bylineMatch = post.content.rendered.match(BYLINE_RE);
  let sourcePublisher = "";
  if (bylineMatch) {
    const pub = decodeEntities(bylineMatch[2].trim());
    sourcePublisher = pub;
  }
  const markerHit = SYNDICATION_MARKERS.some((m) => m.test(post.content.rendered));
  const knownPublisherHit = KNOWN_PUBLISHERS.find((p) => haystack.includes(p));

  if (markerHit || bylineMatch || knownPublisherHit) {
    return {
      classification: "SYNDICATED",
      ownership: "METADATA_ONLY",
      sourcePublisher:
        sourcePublisher || knownPublisherHit || "Tribune Content Agency (wire syndication)",
      notes:
        "Wire/syndicated copy. Preserve title, source attribution, original URL and categories only. Do not republish full body text without confirmed rights.",
    };
  }

  const seenCount = titleCounts.get(plainTitle) ?? 0;
  titleCounts.set(plainTitle, seenCount + 1);
  if (seenCount > 0) {
    return {
      classification: "DUPLICATE",
      ownership: "SKIP",
      sourcePublisher: "",
      notes: `Duplicate title seen ${seenCount + 1} time(s) in the archive.`,
    };
  }

  if (inShowFamily) {
    const looksLikeBrief =
      /wwr news brief|our website www\.workingwomanreport\.com|working woman report/i.test(
        haystack,
      );
    return {
      classification: categoryIds.includes(210) ? "WWR_VIDEO" : "WWR_SHOW",
      ownership: looksLikeBrief ? "REVIEW_REQUIRED" : "REVIEW_REQUIRED",
      sourcePublisher: "Working Woman Report",
      notes:
        "Categorized under the show/video/success-stories/daily-news taxonomy. Likely original WWR text, but ownership must still be confirmed by Allison before full reuse (self-published ≠ automatically clear for republication under the new brand).",
    };
  }

  return {
    classification: "REVIEW_REQUIRED",
    ownership: "REVIEW_REQUIRED",
    sourcePublisher: knownPublisherHit ?? "",
    notes: `No syndication marker or spam pattern detected. Categories: ${categoryNames.join(", ") || "none"}. Needs manual review before any reuse.`,
  };
}

async function main() {
  console.log(`Auditing full legacy archive at ${baseUrl} ...`);

  // 1. Categories (small, single page).
  const { data: categories } = await fetchJson<WpCategory[]>(
    `${baseUrl}/wp-json/wp/v2/categories?per_page=100`,
  );
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  // 2. Posts — full pagination, no sampling.
  const firstPageUrl = `${baseUrl}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=1&_fields=id,slug,link,date,modified,categories,tags,title,excerpt,content,featured_media`;
  const { headers: firstHeaders } = await fetchJson<WpPost[]>(firstPageUrl);
  const totalPages = Number(firstHeaders.get("x-wp-totalpages") ?? "1");
  const totalPosts = Number(firstHeaders.get("x-wp-total") ?? "0");
  console.log(`Discovered ${totalPosts} posts across ${totalPages} pages.`);

  const allPosts: WpPost[] = [];
  for (let page = 1; page <= totalPages; page += 1) {
    const url = `${baseUrl}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,link,date,modified,categories,tags,title,excerpt,content,featured_media`;
    try {
      const { data } = await fetchJson<WpPost[]>(url);
      allPosts.push(...data);
    } catch (error) {
      console.error(`  page ${page} failed:`, error instanceof Error ? error.message : error);
    }
    if (page % 10 === 0 || page === totalPages) {
      console.log(`  fetched page ${page}/${totalPages} (${allPosts.length} posts so far)`);
    }
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  console.log(`Fetched ${allPosts.length} of ${totalPosts} reported posts. Classifying...`);

  const titleCounts = new Map<string, number>();
  const manifest = allPosts.map((post) => {
    const { classification, ownership, sourcePublisher, notes } = classify(
      post,
      categoryById,
      titleCounts,
    );
    const categoryNames = (post.categories ?? [])
      .map((id) => categoryById.get(id)?.name)
      .filter((v): v is string => Boolean(v));
    const primaryCategory = categoryNames[0] ?? "";
    const subCategory = categoryNames[1] ?? "";

    return {
      originalUrl: post.link,
      title: decodeEntities(stripTags(post.title.rendered)),
      slug: post.slug,
      type: "post",
      category: primaryCategory,
      subcategory: subCategory,
      author: "unavailable via public REST API (author listing disabled on this install)",
      publishedDate: post.date,
      updatedDate: post.modified,
      featuredImage: post.featured_media ? `media:${post.featured_media}` : "",
      inlineImages: [],
      videos: [],
      sourcePublisher,
      canonicalUrl: post.link,
      migrationClassification: classification,
      contentOwnershipStatus: ownership,
      assetRightsStatus: ownership === "OWNED" ? "owned" : "unverified",
      migrationStatus: "not-migrated",
      newUrl: "",
      redirectDestination: "",
      notes,
    };
  });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "full-legacy-manifest.json"),
    JSON.stringify(
      {
        baseUrl,
        generatedAt: new Date().toISOString(),
        totalReportedByApi: totalPosts,
        totalFetched: allPosts.length,
        records: manifest,
      },
      null,
      2,
    ),
  );

  const rejected = manifest.filter((r) => r.migrationClassification === "SPAM");
  fs.writeFileSync(
    path.join(outDir, "rejected-content.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: rejected.length,
        records: rejected.map((r) => ({
          url: r.originalUrl,
          reason: r.notes,
          classification: r.migrationClassification,
        })),
      },
      null,
      2,
    ),
  );

  const byClassification: Record<string, number> = {};
  const byOwnership: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  for (const r of manifest) {
    byClassification[r.migrationClassification] =
      (byClassification[r.migrationClassification] ?? 0) + 1;
    byOwnership[r.contentOwnershipStatus] = (byOwnership[r.contentOwnershipStatus] ?? 0) + 1;
    if (r.category) byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
    const year = r.publishedDate.slice(0, 4);
    byYear[year] = (byYear[year] ?? 0) + 1;
  }

  fs.writeFileSync(
    path.join(outDir, "legacy-migration-summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalReportedByApi: totalPosts,
        totalFetched: allPosts.length,
        totalCategories: categories.length,
        byClassification,
        byOwnership,
        byCategory,
        byYear,
      },
      null,
      2,
    ),
  );

  console.log("Done.");
  console.log("By classification:", byClassification);
  console.log("By ownership:", byOwnership);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
