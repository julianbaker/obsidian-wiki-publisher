# Content Model

Define how files map to routes and how metadata is derived.

## Mental model

All published content is read from `app/content/posts/`.
Route paths come from relative file paths, segment by segment.

## Do this

Use these rules when creating content:

- `index.md` maps to `/`.
- Other markdown files map from folder path + filename.
- Folder notes use matching names (for example `Documentation/Documentation.md`).

Route examples:

- `Documentation/Quickstart.md` -> `/documentation/quickstart`
- `Locations/Locations.md` -> `/locations` (folder note de-duplication)
- `index.md` -> `/`

Optional frontmatter:

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

## Verify

1. Create or edit a page under `app/content/posts/`.
2. Run `npm run dev`.
3. Confirm expected route path and page title.
4. Run `npm run test` to catch route collisions and ambiguous bare links.

## Notes

- `title` and `summary` are auto-derived if omitted.
- `publishedAt` defaults to file modified date.
- `published` defaults to `true`.
- Use path-qualified links (`[[Folder/Page]]`) when names are duplicated.

See [[Documentation/WikiLinks]].
