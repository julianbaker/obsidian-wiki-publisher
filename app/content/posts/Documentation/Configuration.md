# Configuration

Configure site metadata, canonical URL behavior, and content processing.

## Mental model

`lib/site-config.ts` defines site identity and base URL behavior.
Content rendering behavior lives in the content and MDX utilities.

## Do this

1. Edit site metadata in `lib/site-config.ts`:
- `siteName`
- `tagline`
- `description`
- `author`

2. Set canonical URL in production:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

3. Review behavior files when changing rendering/link logic:
- `app/content/utils.ts`
- `app/components/mdx.tsx`
- `app/content/dataview.ts`
- `app/content/timeline.ts`

## Verify

1. Start the app and open any page.
2. Confirm site title/metadata values are correct.
3. Run:

```bash
npm run test
npm run typecheck
npm run build
```

Expected result: no route/link check errors, no type errors, successful build.

## Notes

If `NEXT_PUBLIC_SITE_URL` is missing in production, the app falls back to `https://example.com` and logs a warning.
