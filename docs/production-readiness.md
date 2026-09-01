# Production Readiness

## Security

- Keep `ENABLE_STUDIO=false` in production.
- Do not commit `.env` files, API keys, OAuth secrets, newsletter credentials,
  analytics credentials, or Vercel tokens.
- Only public `NEXT_PUBLIC_*` values are safe for browser exposure.
- External share links use `rel="noreferrer"` where a new tab is opened.
- Public content helpers exclude records marked `isDemo: true`.

## Studio

Studio is an internal preparation dashboard. It has no production authentication
yet, so production deployments must keep it disabled until a protected editorial
environment is configured.

## Vercel

No Vercel project is linked in this checkout. Do not connect or deploy to a
production project until the correct Vercel team/project is confirmed. Deploy a
preview first, verify routes and mobile layouts, then promote intentionally.

## Remaining Configuration

- Confirm YouTube channel URL.
- Confirm Instagram URL.
- Confirm Facebook URL.
- Confirm TikTok URL.
- Confirm production DNS and canonical domain.
- Confirm newsletter provider.
- Confirm analytics provider.
