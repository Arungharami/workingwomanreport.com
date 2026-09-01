# Brand System

This documents what the current codebase actually implements, plus what is
genuinely known from the legacy site versus what still needs Allison's
input. It is a working reference, not a finished style guide — several
sections below are explicitly marked as pending approval rather than filled
in with invented values.

## Logo

- **Legacy mark (verified, in use):** `public/media/legacy/brand/logo-1-2.png`
  — a chrome/gold "WORKING WOMAN REPORT" wordmark on a bezeled TV-graphics
  plate (370×140 PNG). Downloaded directly from
  `workingwomanreport.com/wp-content/uploads/2022/05/logo-1-2.png` after
  manual verification; this is Working Woman Report's own site asset, not
  third-party material.
- This is a dated (circa-2013–2022 era) broadcast-graphics-style lockup. Per
  the migration brief, it has **not** been redesigned or reinterpreted —
  doing that without Allison's sign-off risks losing brand recognition she's
  built over a decade. If a modernized wordmark is wanted for the 2026
  redesign, that is a separate design decision for Allison to make, not
  something inferred here.
- `config/brand.ts` currently ships `logo: ""` / `logoDark: ""` (text
  wordmark is used in the header/footer instead of an image). Wiring the
  verified legacy PNG in as the default logo, or commissioning a new one, is
  a decision for Allison — the asset is migrated and available either way.

## Color

Defined in `src/app/globals.css` as CSS custom properties, with a light and
dark palette:

| Token          | Light                      | Dark      | Use                                     |
| -------------- | -------------------------- | --------- | --------------------------------------- |
| `--background` | `#f7f5f0` (warm off-white) | `#11100f` | Page background                         |
| `--foreground` | `#171514`                  | `#f4efe7` | Body text                               |
| `--paper`      | `#fffdfa`                  | `#191715` | Card/section surfaces                   |
| `--ink-muted`  | `#5f5954`                  | `#beb6ac` | Secondary text                          |
| `--line`       | `#ded7cc`                  | `#3a332d` | Borders/dividers                        |
| `--accent`     | `#9f1d35` (deep red)       | `#f05d77` | Eyebrows, CTAs, links-of-note           |
| `--gold`       | `#b3873c`                  | `#d7ad65` | Demo-content flags, editorial highlight |
| `--teal`       | `#0f6b68`                  | `#67c7c0` | Reserved, lightly used                  |

This is a restrained, editorial palette (warm neutral paper tones + one
assertive accent) rather than the legacy site's WordPress-theme look. It does
not attempt to match the chrome/gold of the legacy TV-graphics logo — that
is a live open question if Allison wants closer visual continuity between the
logo and the site chrome.

## Typography

Three type families, loaded via `next/font/google` in `src/app/layout.tsx`:

- **Geist** (sans) — UI text, navigation, body copy.
- **Geist Mono** — reserved for tabular/code-like contexts.
- **Newsreader** (serif) — headlines (`font-serif` utility), giving the
  editorial/television-news register described in the redesign brief.

Headline sizing runs from `text-3xl` (section headers) up to `text-7xl`
(homepage/show hero), set with a tight `leading-none`/`leading-[0.98]` for
the largest sizes to read like a broadcast title card rather than a blog
headline.

## Image and video treatment

- All raster images render through `next/image` with explicit `sizes` and
  `fill` + `aspect-*` wrapper divs to prevent layout shift.
- Hero images use `priority`; below-the-fold images do not.
- Legacy imagery is **not** used for hero treatment anywhere — per the
  copyright rule, no legacy photography was migrated (see
  `docs/legacy-migration-report.md`), so there is nothing legacy to place
  regardless of resolution.
- Video renders through the shared `VideoEmbed` component
  (`src/components/video-embed.tsx`) — YouTube-only, no autoplay audio, and
  it renders an empty state rather than a broken embed when no video ID is
  configured.

## Social treatment

`config/social.ts` is the single source of truth for every social platform
URL (YouTube, Instagram, Facebook, TikTok, X). Every consumer — header,
footer, homepage distribution grid, `SocialFollow` — filters to only
platforms with a real configured URL, so no placeholder or invented handle
is ever rendered. This is already correctly implemented; this document just
records the rule so it doesn't get "fixed" backwards later.

## Pending Allison confirmation

- Whether the legacy chrome/gold logo should be used as-is on the modern
  site, updated, or reserved for "Show" branding only.
- An approved headshot for `content/people/allison-haunss.json` (`photo` /
  `photoAlt` are currently empty — the profile page renders an honest "Photo
  Needed" placeholder rather than a stock or generated image).
- Whether the legacy site's teal/gold accent choices should inform the
  modern palette further, or whether the current restrained red-accent
  system should stand as the permanent identity.
