# WikiLinks

Use Obsidian-style links and embeds in markdown content.

## Mental model

WikiLinks are converted to standard links/images before MDX rendering.
Unresolved targets render as stub links.

## Do this

Syntax reference:

```markdown
[[Page Name]]
[[Page Name|Display Text]]
[[Folder/Page Name]]
[[#Section Heading]]
![[image.png]]
![[path/to/image.png|Alt text]]
```

Demo links:

- Basic link: [[Documentation/Quickstart]]
- Aliased link: [[Documentation/Quickstart|Open Quickstart]]
- Path-qualified link: [[Documentation/Timeline Blocks]]
- Section anchor link: [[#Resolution rules]]
- Cross-page link for graph/backlinks demos: [[Documentation/Graph View]]
- Stub link example: [[Documentation/This Page Does Not Exist Yet]]

Demo image embed:

![[/attachments/wikilink-demo.svg|WikiLink image embed demo]]

## Verify

- Basic/aliased/path-qualified links navigate to expected pages.
- Section anchor link scrolls to heading.
- Stub link is visually marked and treated as unresolved.
- Embedded image renders in-page.

## Limits and rules

- Path-qualified links (`[[Folder/Page]]`) resolve directly.
- Bare links (`[[Page]]`) resolve only when unambiguous.
- Bare links matching multiple pages are unresolved until path-qualified.

## Authoring guidelines

- Use `[[Folder/Page]]` in larger vaults.
- Keep folder names meaningful.
- Use display text (`|...`) when path names are long.

`npm run test` validates route collisions and ambiguous bare WikiLinks.
