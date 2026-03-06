# Dataview

The project supports lightweight Dataview-style blocks at render time.

## Supported blocks

- `LIST`
- `TABLE`

## Live example: LIST query

Query:

````markdown
```dataview
LIST
FROM "Documentation"
```
````

Rendered output:

```dataview
LIST
FROM "Documentation"
```

## Live example: TABLE query with WHERE

Query:

````markdown
```dataview
TABLE file.folder, summary
FROM "Documentation"
WHERE contains(file.name, "Wiki")
SORT title
```
````

Rendered output:

```dataview
TABLE file.folder, summary
FROM "Documentation"
WHERE contains(file.name, "Wiki")
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
