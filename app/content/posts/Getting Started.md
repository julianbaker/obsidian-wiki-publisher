# Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Sync from Obsidian (optional):
```bash
export VAULT_PATH="/path/to/your/vault"
npm run sync
```

- Create pages in `app/content/posts/`
- Link with WikiLinks like `[[Features]]`
- Browse docs in [[Documentation]]
- Use Dataview blocks, e.g.:

```dataview
LIST
FROM "."
```
