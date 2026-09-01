# Working Woman Report

Working Woman Report is a modern digital television and editorial newsroom for
women-focused business, careers, money, lifestyle, health, technology,
entertainment, and success coverage.

This rebuild centers the product around one authoritative weekly reporting
package: Allison selects and reports one topic, the website becomes the
canonical story, and the same package feeds TV/video, YouTube, short-form
social, X, newsletter, analytics, and archive workflows.

## Architecture

- Next.js App Router, TypeScript strict mode, React, Tailwind CSS.
- File-based content in `content/weekly`, `content/stories`, `content/social`,
  and `content/people`.
- Demo content is marked with `isDemo: true` and excluded from public queries,
  feeds, and sitemaps.
- Validated schemas in `src/lib/content/schema.ts`.
- Provider-independent analytics, newsletter, and social adapter stubs in
  `src/lib`.
- SEO endpoints: metadata API, JSON-LD, sitemap, robots, and RSS.

## Development

```bash
npm install
npm run dev
```

Local checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Publishing This Week's Story

1. Run `npm run story:new -- "Topic Name"` to create blank draft files.
2. Replace all demo text with verified reporting, image/video rights notes,
   source notes, transcript, and SEO fields.
3. Create `content/social/{slug}.json` for YouTube, Instagram, Facebook, TikTok,
   X, newsletter, and website copy.
4. Run `ENABLE_STUDIO=true npm run dev` and open `/studio`.
5. Review Article, Video Metadata, Social Package, SEO, Accessibility, and the
   Publishing Checklist.
6. Do not publish until Allison approval is checked.

## Weekly Workflow

Monday: topic selection and research.
Tuesday: reporting, interviews, and material collection.
Wednesday: article and TV/video preparation.
Thursday: edit, Allison approval, SEO, and social package.
Friday: publish flagship website/video package.
Weekend: short-form clips, engagement, and analytics.

Adjust the schedule to Allison's actual TV timing.

## Social Workflow

Never create disconnected stories for each platform. Start from one canonical
weekly story and adapt it into:

- one flagship article
- one full YouTube video
- two to four short vertical-video concepts
- Instagram feed/Reel package
- Facebook package
- TikTok package
- three to five X posts or a thread
- newsletter package
- SEO package

The app includes safe adapter interfaces only. It does not automatically post to
social networks without official API credentials.

## Legacy Migration

Inspect the old site without blindly republishing syndicated material:

```bash
npm run audit:legacy
npm run migrate:legacy
```

The generated manifest tracks original URL, slug, migration status, ownership
status, asset rights status, canonical URL, and redirect destination. Only move
full text or media when Working Woman Report owns it or reuse authorization is
confirmed.

## Environment Variables

See `.env.example`.

Keep `ENABLE_STUDIO=false` in production unless Studio is deployed behind a
protected editorial environment. Never commit API keys, OAuth tokens, Vercel
tokens, newsletter secrets, or social publishing credentials.

## Deployment

The project is Vercel-ready. Configure `NEXT_PUBLIC_SITE_URL`, confirmed social
profile URLs, analytics provider, newsletter provider, and any future social API
credentials in the deployment environment.

## Future CMS Integration

Presentation components call content helpers rather than reading files directly
from page components. A CMS migration can replace the implementations in
`src/lib/content` while preserving route and component contracts.

## Editorial And AI Policy

AI can assist drafting and preparation. It is not the journalist. Do not
fabricate quotes, statistics, sources, interviews, events, credentials, or image
rights. Important factual claims must be reviewable against source material.
Allison has final editorial approval.
