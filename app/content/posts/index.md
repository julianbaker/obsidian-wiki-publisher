# Bob Loblore Lore Blog

### The idea
This started as a worldbuilding project called Bob LobLore’s Lore Blog. It grew past that, but the idea stayed simple: Obsidian Publish costs money, so I built my own. Obsidian Wiki Publisher turns a vault into a public, navigable wiki with the features that actually matter: WikiLinks, backlinks, Dataview-style queries, timelines, and a graph view.

### How it works
Content lives as markdown files in the repo, with an optional sync script that pulls directly from an Obsidian vault. The site uses Next.js with folder-aware routing, so the structure of your vault maps naturally to the structure of the site.

Links use Obsidian’s [[WikiLink]] syntax with path-aware resolution. Every page shows its backlinks, so you can always trace how notes connect. Dataview-style LIST and TABLE blocks render inline, timelines give chronological views, and a graph view maps relationships across the whole site.

The project is open source under MIT. The documentation lives inside the wiki content itself, so the docs are part of the site they describe.
This contains sample content. Replace it with your own markdown in `app/content/posts/`.

- Use WikiLinks like `[[Getting Started]]` and `[[Features]]`
- Create folders and add a folder note like `1. Docs/1. Docs.md`
- Run `npm run dev` and visit http://localhost:3000

### Documentation

- [[Documentation]]
- [[Documentation/Quickstart]]
- [[Documentation/WikiLinks]]
- [[Documentation/Syncing from Obsidian]]

Repository setup, contribution, and policy docs are in `README.md`.
