# WikiLinks

The renderer supports Obsidian-style links and image embeds.

## Supported syntax

```markdown
[[Page Name]]
[[Page Name|Display Text]]
[[Folder/Page Name]]
[[#Section Heading]]
![[image.png]]
![[path/to/image.png|Alt text]]
```

## Resolution behavior

- Path-qualified links (`[[Folder/Page]]`) resolve directly to the target route.
- Bare links (`[[Page]]`) resolve only if unambiguous.
- If a bare link matches multiple pages, it is treated as unresolved until you specify the folder path.

## Live examples

- Basic link: [[Documentation/Quickstart]]
- Aliased link: [[Documentation/Quickstart|Open Quickstart]]
- Path-qualified link: [[Documentation/Timeline Blocks]]
- Section anchor link: [[#Live examples]]
- Backlinks demo target: [[Documentation/Graph View]]
- Stub link example: [[Documentation/This Page Does Not Exist Yet]]

Image embed example:

![[/attachments/wikilink-demo.svg|WikiLink image embed demo]]

## Stub links

Unresolved links are rendered as stub links in the UI, so you can track unfinished pages.

## Best practices

- Use `[[Folder/Page]]` in large vaults.
- Keep folder names meaningful.
- Use display text (`|...`) for readability when paths are long.

## Link checks

`npm run test` validates content route collisions and ambiguous bare WikiLinks.
