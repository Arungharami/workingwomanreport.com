/**
 * Legacy media inventory (metadata only).
 *
 * Pages through the entire WordPress media library and records what exists.
 * Per the copyright rule, this does NOT bulk-download images — most legacy
 * media is attached to syndicated wire posts (Tribune Content Agency, etc.)
 * whose photo rights were never WWR's to begin with. Only the confirmed
 * WWR-owned brand logo has been downloaded by hand (see
 * public/media/legacy/brand/logo-1-2.png), and is recorded here as OWNED.
 */
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.LEGACY_SITE_URL ?? "https://workingwomanreport.com";
const outDir = path.join(process.cwd(), "migration");
const PER_PAGE = 100;
const REQUEST_DELAY_MS = 120;

type WpMedia = {
  id: number;
  slug: string;
  date: string;
  source_url: string;
  mime_type: string;
  media_details?: { width?: number; height?: number; filesize?: number };
  post: number | null;
  alt_text?: string;
};

const KNOWN_OWNED_FILES = new Set(["logo-1-2.png"]);

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

async function main() {
  console.log(`Auditing legacy media library at ${baseUrl} ...`);
  const firstUrl = `${baseUrl}/wp-json/wp/v2/media?per_page=${PER_PAGE}&page=1&_fields=id,slug,date,source_url,mime_type,media_details,post,alt_text`;
  const { headers } = await fetchJson<WpMedia[]>(firstUrl);
  const totalPages = Number(headers.get("x-wp-totalpages") ?? "1");
  const totalItems = Number(headers.get("x-wp-total") ?? "0");
  console.log(`Discovered ${totalItems} media items across ${totalPages} pages.`);

  const byMime: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  const ownedRecords: unknown[] = [];
  let fetchedCount = 0;
  let brokenCount = 0;

  for (let page = 1; page <= totalPages; page += 1) {
    const url = `${baseUrl}/wp-json/wp/v2/media?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,date,source_url,mime_type,media_details,post,alt_text`;
    try {
      const { data } = await fetchJson<WpMedia[]>(url);
      for (const item of data) {
        fetchedCount += 1;
        byMime[item.mime_type] = (byMime[item.mime_type] ?? 0) + 1;
        const year = item.date?.slice(0, 4) ?? "unknown";
        byYear[year] = (byYear[year] ?? 0) + 1;

        const filename = item.source_url?.split("/").pop() ?? "";
        if (KNOWN_OWNED_FILES.has(filename)) {
          ownedRecords.push({
            legacyUrl: item.source_url,
            filename,
            mimeType: item.mime_type,
            dimensions: item.media_details?.width
              ? `${item.media_details.width}x${item.media_details.height}`
              : "",
            associatedPost: item.post,
            usage: "site brand logo",
            copyrightStatus: "owned",
            migrationStatus: "migrated",
            newPath: "/media/legacy/brand/logo-1-2.png",
            checksum: "",
          });
        }
      }
    } catch (error) {
      brokenCount += 1;
      console.error(`  page ${page} failed:`, error instanceof Error ? error.message : error);
    }
    if (page % 20 === 0 || page === totalPages) {
      console.log(`  fetched page ${page}/${totalPages} (${fetchedCount} media so far)`);
    }
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "media-manifest.json"),
    JSON.stringify(
      {
        baseUrl,
        generatedAt: new Date().toISOString(),
        totalReportedByApi: totalItems,
        totalFetched: fetchedCount,
        failedPages: brokenCount,
        byMimeType: byMime,
        byYear,
        note: "This is a metadata inventory only. Bulk media was NOT downloaded — most items are attached to syndicated wire posts (Tribune Content Agency and similar) whose image rights were never Working Woman Report's. Only the confirmed brand logo below was migrated by hand after manual verification.",
        ownedAndMigrated: ownedRecords,
      },
      null,
      2,
    ),
  );

  console.log("Done.");
  console.log("By mime type:", byMime);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
