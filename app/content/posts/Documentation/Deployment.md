# Deployment

Deploy the site and verify production-safe configuration.

## Mental model

Deployment is standard Next.js hosting. Vercel is the default target.
Build-time checks should pass before each deploy.

## Do this

1. Push repository to GitHub.
2. Import the project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` for production.
4. Deploy.

Before pushing, run:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## Verify

After deploy:

1. Open the live site and check key pages (`/`, `/documentation`, `/graph`).
2. Confirm canonical URLs use the production domain.
3. Confirm link graph and WikiLinks navigation work.

## Notes

CI workflow coverage includes lint, content route checks, typecheck, build, and high-severity audit.
See `.github/workflows/ci.yml`.
