# Dataview

Use Dataview-style blocks to generate list/table views from published pages.

## Mental model

A `dataview` block is evaluated during rendering and replaced with normal markdown output.

## Do this

LIST input example:

````markdown
```dataview
LIST
FROM "Documentation"
```
````

LIST rendered output:

```dataview
LIST
FROM "Documentation"
```

TABLE input example:

````markdown
```dataview
TABLE file.folder, summary
FROM "Documentation"
WHERE contains(file.name, "Wiki")
SORT title
```
````

TABLE rendered output:

```dataview
TABLE file.folder, summary
FROM "Documentation"
WHERE contains(file.name, "Wiki")
SORT title
```

## Verify

- LIST query returns pages in the target folder.
- TABLE query returns expected rows/columns.
- `npm run test` still passes after query/content changes.

## Limits

- Supported block types: `LIST`, `TABLE`.
- `FROM` supports folder paths.
- `WHERE` currently supports `contains(file.name, "...")`.
- Results are title-sorted (`SORT` is accepted but not yet custom-applied).
- Data only includes published pages.
