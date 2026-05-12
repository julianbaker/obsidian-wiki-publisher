# Quickstart

Get the app running, confirm core behavior, and know what to read next.

## Mental model

Content is markdown in `app/content/posts/`.
The app renders that content as a wiki with WikiLinks, backlinks, Dataview blocks, timeline blocks, and graph view.

## Do this

1. Install dependencies.

```bash
npm install
```

2. Start the app.

```bash
npm run dev
```

3. Open `http://localhost:3000`.

4. Optional: sync from Obsidian.

```bash
export VAULT_PATH="/path/to/your/vault"
npm run sync
```

## Verify

Run quality checks before shipping:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

Expected result:
- Lint passes.
- Route checks pass with no collisions/ambiguous bare links.
- Typecheck and build pass.

## Next

1. [[Documentation/Content Model]]
2. [[Documentation/WikiLinks]]
3. [[Documentation/Deployment]]
