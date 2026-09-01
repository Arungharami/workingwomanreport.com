import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Curated legacy redirects — see migration/redirects.json for the source of
  // truth and rationale. This is intentionally a small, hand-verified list,
  // not a blanket mapping of the ~11.8k legacy WordPress URLs: most legacy
  // posts are wire-syndicated or unreviewed content that does not have (and
  // should not automatically get) a new home on this site. Unmatched legacy
  // article URLs are instead handled by the `[legacySlug]` catch-all route,
  // which shows a metadata-only "legacy archive" notice instead of a bare
  // 404 or a blanket redirect to the homepage.
  async redirects() {
    return [
      {
        source: "/about-the-show",
        destination: "/show",
        permanent: true,
      },
      {
        source: "/about-working-woman-report-host-allison-haunss",
        destination: "/people/allison-haunss",
        permanent: true,
      },
      {
        source: "/working-woman-report-now-on-rnn-tv",
        destination: "/show/archive",
        permanent: true,
      },
      {
        source: "/category/the-show",
        destination: "/show",
        permanent: true,
      },
      {
        source: "/category/business",
        destination: "/stories?category=Business",
        permanent: true,
      },
      {
        source: "/category/business/your-money",
        destination: "/stories?category=Money",
        permanent: true,
      },
      {
        source: "/category/entertainment",
        destination: "/stories?category=Entertainment",
        permanent: true,
      },
      {
        source: "/author/ahunss",
        destination: "/people/allison-haunss",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
