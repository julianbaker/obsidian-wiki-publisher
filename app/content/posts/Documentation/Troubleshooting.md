# Troubleshooting

## Ambiguous WikiLinks

Symptom: `[[Page]]` does not resolve as expected.

Fix: use a path-qualified link, for example `[[Documentation/Page]]`.

## Missing or wrong canonical URLs

Symptom: sitemap/rss/metadata point to the wrong domain.

Fix: set `NEXT_PUBLIC_SITE_URL` in your environment.

## Sync script issues

- Verify `VAULT_PATH` is correct.
- Ensure `sync-vault.sh` is executable.
- Check excluded folders in the script.

## Build failures after route/content changes

Run:

```bash
npm run test
npm run typecheck
npm run build
```

This catches route collisions and typing issues early.
