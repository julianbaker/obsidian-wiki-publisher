# Troubleshooting

Diagnose common content, routing, and deployment issues.

## Mental model

Most issues fall into four categories:
- ambiguous WikiLinks
- canonical URL configuration
- sync input/path problems
- build validation failures

## Do this first

Run baseline checks:

```bash
npm run test
npm run typecheck
npm run build
```

## Common issues

### Ambiguous WikiLinks

Symptom: `[[Page]]` does not resolve as expected.

Fix: use a path-qualified link, for example `[[Documentation/Page]]`.

### Missing or wrong canonical URLs

Symptom: sitemap/rss/metadata use the wrong domain.

Fix: set `NEXT_PUBLIC_SITE_URL` in your environment.

### Sync script issues

Symptom: expected files do not appear after sync.

Fixes:
- verify `VAULT_PATH`
- ensure `sync-vault.sh` is executable
- review excluded folders in script settings

### Build failures after content changes

Symptom: route/content updates fail in CI or local build.

Fix: run `npm run test` and resolve reported route collisions or ambiguous links.

## Verify

After applying a fix, re-run:

```bash
npm run test
npm run typecheck
npm run build
```

Expected result: all commands pass.
