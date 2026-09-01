import fs from "node:fs";
import path from "node:path";

/**
 * Read-only access to the legacy content audit produced by
 * scripts/audit-legacy-full.ts. This is deliberately server-only (file-system
 * reads, never imported by a client component) so the ~11.8k-record manifest
 * never ships to the browser bundle — pages that need it read it on the
 * server and only render the small slice they actually display.
 *
 * SPAM-classified records are filtered out of every public-facing accessor
 * in this file. They still exist in the manifest for the internal Studio
 * audit screen, but nothing meant for visitors will ever surface them.
 */

export type LegacyClassification =
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

export type LegacyOwnership =
  "OWNED" | "AUTHORIZED" | "METADATA_ONLY" | "REVIEW_REQUIRED" | "SKIP";

export type LegacyRecord = {
  originalUrl: string;
  title: string;
  slug: string;
  type: string;
  category: string;
  subcategory: string;
  author: string;
  publishedDate: string;
  updatedDate: string;
  featuredImage: string;
  inlineImages: string[];
  videos: string[];
  sourcePublisher: string;
  canonicalUrl: string;
  migrationClassification: LegacyClassification;
  contentOwnershipStatus: LegacyOwnership;
  assetRightsStatus: string;
  migrationStatus: string;
  newUrl: string;
  redirectDestination: string;
  notes: string;
};

type ManifestFile = {
  baseUrl: string;
  generatedAt: string;
  totalReportedByApi: number;
  totalFetched: number;
  records: LegacyRecord[];
};

type SummaryFile = {
  generatedAt: string;
  totalReportedByApi: number;
  totalFetched: number;
  totalCategories: number;
  byClassification: Record<string, number>;
  byOwnership: Record<string, number>;
  byCategory: Record<string, number>;
  byYear: Record<string, number>;
};

const migrationRoot = path.join(process.cwd(), "migration");

let manifestCache: ManifestFile | null = null;
let slugIndexCache: Map<string, LegacyRecord> | null = null;

function readJson<T>(filename: string): T | null {
  const filePath = path.join(migrationRoot, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function loadManifest(): ManifestFile {
  if (!manifestCache) {
    manifestCache = readJson<ManifestFile>("full-legacy-manifest.json") ?? {
      baseUrl: "",
      generatedAt: "",
      totalReportedByApi: 0,
      totalFetched: 0,
      records: [],
    };
  }
  return manifestCache;
}

function slugIndex(): Map<string, LegacyRecord> {
  if (!slugIndexCache) {
    slugIndexCache = new Map(loadManifest().records.map((r) => [r.slug, r]));
  }
  return slugIndexCache;
}

export function getMigrationSummary(): SummaryFile | null {
  return readJson<SummaryFile>("legacy-migration-summary.json");
}

export function getManifestMeta() {
  const m = loadManifest();
  return {
    baseUrl: m.baseUrl,
    generatedAt: m.generatedAt,
    totalReportedByApi: m.totalReportedByApi,
    totalFetched: m.totalFetched,
  };
}

const PUBLIC_HIDDEN: LegacyClassification[] = ["SPAM"];

function publicRecords(): LegacyRecord[] {
  return loadManifest().records.filter(
    (r) => !PUBLIC_HIDDEN.includes(r.migrationClassification),
  );
}

/** Records belonging to the show/video/profile family — the small, largely
 * self-published slice of the archive (~60 records) that is realistic to
 * feature individually rather than just as archive metadata. */
export function getShowFamilyRecords(): LegacyRecord[] {
  return publicRecords()
    .filter((r) =>
      (["WWR_SHOW", "WWR_VIDEO", "WWR_PROFILE"] as LegacyClassification[]).includes(
        r.migrationClassification,
      ),
    )
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getSuccessStoryRecords(): LegacyRecord[] {
  return getShowFamilyRecords().filter(
    (r) => r.subcategory === "Success Stories" || r.category === "Success Stories",
  );
}

export function getDailyNewsRecords(): LegacyRecord[] {
  return getShowFamilyRecords().filter(
    (r) => r.subcategory === "Daily News" || r.category === "Daily News",
  );
}

export function getOwnedHistoricalRecords(): LegacyRecord[] {
  return publicRecords().filter((r) => r.contentOwnershipStatus === "OWNED");
}

export type ArchiveFilter = {
  page?: number;
  pageSize?: number;
  year?: string;
  category?: string;
  classification?: LegacyClassification;
  query?: string;
};

export function getArchiveYears(): string[] {
  const years = new Set(
    publicRecords()
      .map((r) => r.publishedDate.slice(0, 4))
      .filter(Boolean),
  );
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function getArchiveCategories(): string[] {
  const categories = new Set(
    publicRecords()
      .map((r) => r.category)
      .filter(Boolean),
  );
  return Array.from(categories).sort();
}

export function queryArchive(filter: ArchiveFilter) {
  const pageSize = Math.min(filter.pageSize ?? 24, 48);
  const page = Math.max(filter.page ?? 1, 1);

  let records = publicRecords();
  if (filter.year) {
    records = records.filter((r) => r.publishedDate.startsWith(filter.year!));
  }
  if (filter.category) {
    records = records.filter((r) => r.category === filter.category);
  }
  if (filter.classification) {
    records = records.filter((r) => r.migrationClassification === filter.classification);
  }
  if (filter.query) {
    const q = filter.query.trim().toLowerCase();
    if (q) {
      records = records.filter((r) => r.title.toLowerCase().includes(q));
    }
  }

  records = [...records].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

  const total = records.length;
  const start = (page - 1) * pageSize;
  const pageRecords = records.slice(start, start + pageSize);

  return {
    records: pageRecords,
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

/** Studio-only: same shape as queryArchive but does NOT hide SPAM records,
 * since the internal copyright-audit screen needs to show and let Allison
 * inspect exactly what was rejected and why. Never call this from a
 * public-facing page. */
export function queryStudioArchive(filter: ArchiveFilter) {
  const pageSize = Math.min(filter.pageSize ?? 25, 100);
  const page = Math.max(filter.page ?? 1, 1);

  let records = loadManifest().records;
  if (filter.classification) {
    records = records.filter((r) => r.migrationClassification === filter.classification);
  }
  if (filter.query) {
    const q = filter.query.trim().toLowerCase();
    if (q) {
      records = records.filter(
        (r) => r.title.toLowerCase().includes(q) || r.originalUrl.toLowerCase().includes(q),
      );
    }
  }

  records = [...records].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

  const total = records.length;
  const start = (page - 1) * pageSize;
  const pageRecords = records.slice(start, start + pageSize);

  return {
    records: pageRecords,
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

/** Looks up a single legacy slug for the `[legacySlug]` catch-all route.
 * Returns null for SPAM records — callers should treat that the same as
 * "not found" and render a real 404, never a page. */
export function getLegacyRecordBySlug(slug: string): LegacyRecord | null {
  const record = slugIndex().get(slug);
  if (!record || record.migrationClassification === "SPAM") {
    return null;
  }
  return record;
}
