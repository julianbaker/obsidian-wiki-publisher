# Obsidian Wiki Publisher

Turn an Obsidian vault into a published, navigable website with WikiLinks, backlinks, Dataview-style queries, timelines, and graph view.

## Origin

This started as a worldbuilding project called Bob Loblore's Lore Blog.
It grew past that, but the idea stayed simple: Obsidian Publish costs money, so I built my own.

## What this is

- Next.js App Router site
- Markdown content sourced from `app/content/posts/`
- Obsidian-first linking model (`[[WikiLinks]]`)
- Folder-aware routing and sidebar navigation

## Core Features

- WikiLinks with path-aware resolution
- Backlinks (`Linked References` per page)
- Dataview-style `LIST` and `TABLE` blocks
- Timeline block rendering (` ```timeline `)
- Graph view of link relationships
- Optional Obsidian vault sync script (`npm run sync`)

## Quick Start

```bash
git clone <your-repo-url>
cd obsidian-wiki-publisher
npm install
npm run dev
```

Open `http://localhost:3000`.

Optional vault sync:

```bash
export VAULT_PATH="/path/to/your/obsidian/vault"
npm run sync
```

## Production Configuration

Set your canonical URL:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## Documentation

Canonical user documentation lives inside the wiki content so docs are browsable on the site itself.

- Docs source folder: `app/content/posts/Documentation/`
- Docs entry page (local route): `/documentation`
- First pages:
  - `/documentation/quickstart`
  - `/documentation/content-model`
  - `/documentation/wikilinks`
  - `/documentation/syncing-from-obsidian`

If you are editing docs, update files under `app/content/posts/Documentation/`.

## Quality Checks

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## Open Source

- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

## License

MIT, see [LICENSE](./LICENSE).
