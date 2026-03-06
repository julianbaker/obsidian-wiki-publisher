# Deployment

## Vercel (recommended)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` for production.
4. Deploy.

## Pre-deploy checks

Run locally before pushing:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## CI

The repo includes GitHub Actions CI for:

- lint
- content route checks
- typecheck
- build
- audit (high+)

See `.github/workflows/ci.yml`.
