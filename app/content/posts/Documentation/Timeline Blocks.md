# Timeline Blocks

Timeline blocks use the Obsidian Timeline plugin style and render as styled HTML on the site.

## Syntax

````markdown
```timeline
+ Date
+ Title
+ Description
```
````

Each event is 3 `+` lines:

1. Date/Time
2. Title
3. Description

## Example

````markdown
```timeline
+ 1492
+ First Contact
+ Initial contact is established.

+ 1500
+ Expansion
+ Major expansion period begins.
```
````

## Safety

Timeline text is HTML-escaped before rendering, while WikiLinks are converted to safe anchors.

## Related

- [[Documentation/WikiLinks]]
