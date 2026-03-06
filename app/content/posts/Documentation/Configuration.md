# Configuration

## Site configuration

Edit `lib/site-config.ts`:

- `siteName`
- `tagline`
- `description`
- `author`
- `baseUrl` (computed from env)

## Environment variables

Set for production:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

If omitted in production, the app falls back to `https://example.com` and logs a warning.

## Styling

Main styles and theme tokens live in `app/global.css`.

## Content behavior settings

Core content/link behavior lives in:

- `app/content/utils.ts`
- `app/components/mdx.tsx`
- `app/content/dataview.ts`
- `app/content/timeline.ts`
