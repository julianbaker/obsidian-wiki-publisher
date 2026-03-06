# Dataview

The project supports lightweight Dataview-style blocks at render time.

## Supported blocks

- `LIST`
- `TABLE`

## Examples

```dataview
LIST
FROM "Documentation"
```

```dataview
TABLE file.folder, summary
FROM "Documentation"
WHERE contains(file.name, "Guide")
SORT title
```

## Current query support

- `FROM` supports folder paths.
- `WHERE` currently supports `contains(file.name, "...")`.
- Results are title-sorted.

## Notes

- This is intentionally limited and predictable.
- Results are generated from published pages only.
- If you need full Dataview compatibility, extend `app/content/dataview.ts`.
