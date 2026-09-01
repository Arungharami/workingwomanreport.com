# Domain Migration Plan

## Current Legacy Site

The current public site at `workingwomanreport.com` should remain live until the
new Vercel deployment is verified and redirect preservation is ready.

## New Vercel Site

Deploy a preview first. Verify build output, routes, metadata, RSS, sitemap,
robots, Studio disabled state, and mobile layouts before production promotion.

## DNS Preparation

Confirm who controls DNS, registrar access, apex records, and `www` records.
Do not modify DNS without explicit authorization.

## WWW vs Apex

Choose a canonical domain before launch. Recommended options are either
`https://workingwomanreport.com` or `https://www.workingwomanreport.com`, with
the other redirecting permanently to the canonical version.

## Redirect Preservation

Use `migration/legacy-manifest.json` to map legacy URLs to new destinations.
Metadata-only or rights-unverified legacy items should redirect to an archive,
category, or search page rather than republishing unauthorized copy.

## SSL

Verify Vercel has issued SSL certificates for both apex and `www` before traffic
cutover.

## Search Console

Verify the canonical domain, submit `/sitemap.xml`, monitor crawl errors, and
request indexing for the first approved weekly package.

## Analytics

Configure the selected analytics provider before launch. Do not install invasive
tracking or commit credentials.

## Rollback Process

Keep legacy hosting unchanged during cutover. If critical launch issues appear,
restore DNS to the legacy host and pause production promotion while fixes are
validated in preview.
