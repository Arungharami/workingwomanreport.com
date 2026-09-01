import fs from "node:fs";
import path from "node:path";

const auditPath = path.join(process.cwd(), "migration", "legacy-audit.json");
const manifestPath = path.join(process.cwd(), "migration", "legacy-manifest.json");

type AuditRecord = {
  originalUrl: string;
  title?: string;
  canonicalUrl?: string;
};

type MigrationClassification =
  "OWNED" | "AUTHORIZED" | "METADATA_ONLY" | "REVIEW_REQUIRED" | "SKIP";

function slugFromUrl(url: string) {
  const pathname = new URL(url).pathname.replace(/^\/|\/$/g, "");
  return pathname.split("/").filter(Boolean).at(-1) ?? "legacy-home";
}

function main() {
  if (!fs.existsSync(auditPath)) {
    throw new Error("Run npm run audit:legacy before migration manifest generation.");
  }

  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8")) as {
    records: AuditRecord[];
  };

  const manifest = audit.records.map((record) => ({
    originalUrl: record.originalUrl,
    title: record.title ?? "",
    slug: slugFromUrl(record.originalUrl),
    migrationClassification: "METADATA_ONLY" satisfies MigrationClassification,
    migrationStatus: "metadata-only",
    contentOwnershipStatus: "unverified",
    assetRightsStatus: "unverified",
    redirectDestination: "",
    canonicalUrl: record.canonicalUrl ?? "",
    notes:
      "Do not migrate full text or assets until Working Woman Report ownership or reuse authorization is confirmed.",
  }));

  fs.writeFileSync(manifestPath, JSON.stringify({ records: manifest }, null, 2));
  console.log(`Wrote migration manifest to ${manifestPath}`);
}

main();
