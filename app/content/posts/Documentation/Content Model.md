# Content Model

All published content is read from `app/content/posts/`.

## Core rules

- `index.md` maps to `/` (homepage).
- Every other markdown file maps to a route derived from folder path + filename.
- Folder notes are supported by naming a file the same as the folder (for example `Documentation/Documentation.md`).

## Route generation

Routes are generated from the relative path, slugified per segment.

Examples:

- `Documentation/Quickstart.md` -> `/documentation/quickstart`
- `Locations/Locations.md` -> `/locations` (folder note de-duplication)
- `index.md` -> `/`

## Frontmatter

Supported fields:

```yaml
---
title: My Page
publishedAt: 2026-03-05
summary: Short summary
image: /images/cover.png
category: Optional Category
published: true
---
```

Notes:

- `title` and `summary` are auto-derived if omitted.
- `publishedAt` defaults to file modified date.
- `published` defaults to `true`.

## Authoring guidance

- Prefer stable, descriptive file names.
- Keep one idea per page.
- Use path-qualified WikiLinks when page names are duplicated.

See [[Documentation/WikiLinks]].
