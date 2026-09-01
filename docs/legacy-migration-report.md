# Legacy Migration Report

Generated from a full crawl of the legacy WordPress REST API on
`workingwomanreport.com`, run 2026-09-01. Every number below comes from
`scripts/audit-legacy-full.ts` and `scripts/audit-legacy-media.ts` (see
`migration/full-legacy-manifest.json`, `migration/legacy-migration-summary.json`,
`migration/media-manifest.json`). Nothing here is estimated or rounded up —
where the crawl came up short of the API's own reported total, that gap is
stated explicitly rather than hidden.

## Headline numbers

| Metric                                         | Count                                                                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legacy posts reported by the WordPress API     | 11,837                                                                                                                                                                      |
| Legacy posts actually fetched and classified   | 11,837                                                                                                                                                                      |
| Legacy categories                              | 28 (11 in active use; the other 17 have 0 posts and appear to be unused plugin/theme scaffolding)                                                                           |
| Legacy media library items reported by the API | 13,626                                                                                                                                                                      |
| Legacy media items fetched                     | 13,099 (WordPress's REST pagination total drifted slightly across ~137 pages of live pagination — a known API quirk, not a script failure; 0 page requests actually failed) |
| Date range                                     | 2013-10-29 to 2023-08-23 (~10 years)                                                                                                                                        |

## ⚠ Security finding: the legacy WordPress install is compromised

**2,488 of the 11,837 posts (21%) contain injected pharmaceutical-spam links**
in the article body — the classic `buy <drug> online <malicious link> no
prescription` pattern, added into otherwise-legitimate posts (both original
and wire-syndicated). Two confirmed examples, found by direct inspection:

- A Sacramento Bee/Tribune Content Agency wire story about a Kickstarter
  founder had `buy tadora online www.adentalcare.com/wp-content/... no
prescription` appended mid-paragraph.
- A legitimate post about childcare-industry advocacy had `buy cialis black
online gilbertroaddental.com/wp-content/... no prescription` injected the
  same way, pointing at a different malicious domain.

This is not confined to a handful of obviously spammy pages — it is spread
across roughly a fifth of the entire archive, on both real reporting and wire
content. **This means the live legacy WordPress install has almost certainly
been compromised for some time and is still serving this content publicly
today.** This migration does not touch or take down the legacy site (per the
brief), but Allison should be told directly: the legacy site likely needs a
security remediation (WordPress core/plugin update, malware scan, credential
rotation) independent of this migration, ideally before or alongside any
domain cutover.

An earlier draft of the spam classifier also flagged "casino" / "sports
betting" / "slot machine" as spam signals and produced false positives against
legitimate business journalism (a story about WNBA team ownership discussing
sports-betting revenue; a profile of a professional slots streamer). Those
keywords were removed from the classifier; the final 2,488 figure reflects
only the high-confidence pharma-injection pattern, spot-checked against
several real examples before being trusted.

## Classification breakdown (all 11,837 posts)

| Classification       | Count  | What it means                                                                                                                                                                                                                                                     |
| -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SYNDICATED           | 6,804  | Wire copy — mostly distributed via Tribune Content Agency (which itself aggregates Miami Herald, Los Angeles Times, Sacramento Bee, Kaiser Health News, and dozens of other outlets). Title/date/category/source preserved as metadata; body text not reproduced. |
| SPAM                 | 2,488  | Contains the confirmed pharma-injection pattern. Excluded entirely from every public page and from the archive index.                                                                                                                                             |
| REVIEW_REQUIRED      | 2,476  | No syndication marker and no spam pattern found, but also not confirmed as WWR-original. Shown as metadata-only archive records pending Allison's review.                                                                                                         |
| WWR_VIDEO            | 57     | Categorized under the legacy "Videos" taxonomy (2014–2016 "WWR News Brief" text recaps of the daily segment). No actual video files or embeds were found attached to these — see below.                                                                           |
| WWR_SHOW             | 2      | The show's own "About The Show" (2013) and "Now On RNN-TV" (2015) posts.                                                                                                                                                                                          |
| WWR_PROFILE          | 1      | The show's own 2014 host biography for Allison Haunss.                                                                                                                                                                                                            |
| DUPLICATE            | 9      | Repeated titles within the archive.                                                                                                                                                                                                                               |
| THIRD_PARTY / BROKEN | 0 each | No records matched these buckets in this crawl.                                                                                                                                                                                                                   |

Ownership rollup: **3 records are OWNED** (the show/profile posts above,
self-published and low-risk to reuse as historical record). **0 are
AUTHORIZED** (no third-party rights confirmations exist yet). **6,804 are
METADATA_ONLY** (syndicated). **2,533 are REVIEW_REQUIRED.** **2,497 are
SKIP** (spam + duplicates).

## Video and media findings

- No self-hosted video files were found anywhere in the archive.
- Real `<iframe>` YouTube/Vimeo embeds appear in roughly 0.7% of sampled posts
  (3 of 437 sampled across 5 pages spread through the archive) — projecting to
  perhaps 60–90 posts archive-wide. Every embed found belongs to a third party
  (e.g., a Kickstarter founder's own YouTube video embedded inside a wire
  story about her) — not Working Woman Report's own video. None have been
  embedded on the new site.
- The "Videos" category (73 posts, of which 57 classified WWR_VIDEO) turned
  out to be text-only "WWR News Brief" recaps from 2014, not video files.
- The confirmed WWR-owned brand logo (`logo-1-2.png`, 370×140 PNG) was found
  and downloaded by hand — it did not appear in the media library API listing
  at all (it was uploaded via the theme customizer, not the standard media
  uploader), so it required direct verification. See
  `public/media/legacy/brand/logo-1-2.png` and `migration/media-manifest.json`.
- No other media was downloaded. The other ~13,000 media items are
  overwhelmingly attached to syndicated wire posts, whose photo rights were
  never Working Woman Report's to redistribute.

## What was actually migrated into the new site

- The 3 OWNED records (show description, RNN-TV broadcast note, Allison's
  2014 bio) — reproduced verbatim as clearly-labeled **historical** record on
  `/show`, `/show/archive`, and `/people/allison-haunss` (Historical
  Biography section), each dated and captioned as not-yet-reconfirmed for
  current accuracy.
- The confirmed brand logo.
- Full metadata (title, date, category, classification, source attribution)
  for every non-spam record, browsable at `/archive` (paginated by year and
  category) and via the `[legacySlug]` catch-all for direct old-URL hits.
- A curated set of 8 hand-verified redirects for the highest-confidence old
  URLs (see `migration/redirects.json`).

## What was deliberately not migrated

- No full article bodies for any SYNDICATED, REVIEW_REQUIRED, or SPAM record.
- No third-party photography.
- No comments (per the brief — comments often carry personal information and
  are not migrated by default).
- No blanket redirect of the ~11,800 remaining legacy URLs to the homepage —
  unmatched legacy URLs render a metadata-only "legacy archive record" notice
  instead (or a plain 404 for SPAM records), which is both more honest and
  better SEO practice than mass-redirecting unreviewed content.

## Known limitation

Author names could not be resolved from the legacy WordPress REST API — the
`/wp/v2/users` endpoint returns `401 rest_user_cannot_view` on this install
(user listing is disabled), so every record's `author` field says so
explicitly rather than guessing.
