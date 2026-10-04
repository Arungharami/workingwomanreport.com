# Engineering review — October 4, 2026

## Scope

Source review of `src/lib/content/index.ts`, schema, content tests, newsletter adapter, and repository configuration. This review addresses a bounded correctness issue; it does not certify the entire application, rerun all research experiments, or establish production readiness.

## Finding and repair

Public helpers exposed any non-demo story marked published, even if its publishDate was in the future or invalid.

Introduce a shared publication predicate requiring published status, non-demo content, a valid timestamp and a publication date at or before now. Apply it to both weekly and ordinary stories; studio access retains drafts.

## Verification

6 direct Node assertions passed for release boundary, future dates, invalid dates, timezone offsets, demos and scheduled status. Vitest integration, Next typecheck/lint/build are NOT_RUN locally because package installation is unavailable; existing CI runs them.

All changed Python files were syntax-compiled. Package installation from this workspace is blocked, so full dependency-backed suites and production builds are not described as passed. GitHub checks on the pull request provide the remaining integration validation.

## Next implementation work

Populate verified, approved editorial records before public launch. Configure newsletter/social/analytics providers and add persistent editorial storage where required. For scheduled releases on statically generated routes, arrange a rebuild or explicit revalidation at release time; a clock predicate alone does not refresh a cached build.

## Evidence boundary

No raw benchmark data, measured research results, corpus approval records, model releases or production deployments were changed. Any affected scientific output must be re-executed and linked to the accepted source commit before updating manuscript claims.
