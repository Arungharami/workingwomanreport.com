import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import legacySlugs from "../migration/legacy-slugs.json";

/**
 * Guarantees a real HTTP 404 for legacy WordPress URLs that don't resolve to
 * anything on the new site.
 *
 * Why this exists: the `[legacySlug]` catch-all page (src/app/[legacySlug]/
 * page.tsx) calls `notFound()` for slugs missing from the audit manifest,
 * which is the documented, correct Next.js pattern — but on this Next.js
 * build, a fully dynamic (no generateStaticParams) route calling notFound()
 * for an unmatched param renders the right "not found" UI while still
 * returning HTTP 200. That's a real, deployment-verified bug in this
 * environment (also reproducible on the pre-existing /people/[slug] route),
 * not something fixable from inside the page component. Proxy runs earlier
 * and has direct control over the response status, so the fix lives here:
 * for a single top-level path segment that isn't a real app route and isn't
 * a known legacy slug, respond with a genuine 404 before the page ever
 * renders. Known slugs (and SPAM, deliberately excluded from
 * legacySlugs.json) fall through to the actual page/behavior as before.
 */

const validLegacySlugs = new Set<string>(legacySlugs as string[]);

// Mirrors the top-level folders under src/app/ plus the special file-based
// routes. Keep in sync if a new top-level route is added.
const KNOWN_TOP_LEVEL_ROUTES = new Set([
  "about",
  "contact",
  "archive",
  "search",
  "privacy",
  "terms",
  "watch",
  "stories",
  "this-week",
  "show",
  "studio",
  "people",
]);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 1) {
    return NextResponse.next();
  }

  const [slug] = segments;
  if (KNOWN_TOP_LEVEL_ROUTES.has(slug) || validLegacySlugs.has(slug)) {
    return NextResponse.next();
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Not Found | Working Woman Report</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:80px auto;padding:0 20px;color:#171514;background:#f7f5f0"><p style="font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9f1d35">404</p><h1 style="font-size:2.5rem;margin:16px 0">This page was not found.</h1><p style="line-height:1.7;color:#5f5954">The story may still be in editorial review, archived, or waiting for rights confirmation.</p><a href="/" style="display:inline-block;margin-top:24px;background:#171514;color:#f7f5f0;padding:12px 20px;font-weight:600;text-decoration:none">Return home</a></body></html>`,
    { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*$).*)"],
};
