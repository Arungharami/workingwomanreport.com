# Deployment

The project is Vercel-ready.

Required checks:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Set `NEXT_PUBLIC_SITE_URL` to the production domain. Keep `ENABLE_STUDIO=false`
in production unless a protected editorial environment is configured.

For production, use:

```bash
ENABLE_STUDIO=false
NEXT_PUBLIC_SITE_URL=https://workingwomanreport.com
```

Only use the production domain after DNS and Vercel domain configuration are
confirmed.

Do not commit Vercel tokens, API keys, OAuth secrets, newsletter credentials, or
social publishing credentials.
