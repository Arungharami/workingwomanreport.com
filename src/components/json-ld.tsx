import { siteConfig } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        name: siteConfig.name,
        url: siteConfig.url,
        founder: {
          "@type": "Person",
          name: siteConfig.founder,
        },
        sameAs: Object.values(siteConfig.social)
          .filter((item) => item.configured && item.url.startsWith("http"))
          .map((item) => item.url),
      }}
    />
  );
}
