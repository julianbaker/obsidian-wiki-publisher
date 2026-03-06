# Timeline Blocks

Render Obsidian Timeline-style events as structured HTML blocks.

## Mental model

A `timeline` block is parsed in groups of three `+` lines:
1. date/time
2. title
3. description

## Do this

Input format:

````markdown
```timeline
+ Date
+ Title
+ Description
```
````

Demo input:

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

Rendered output:

```timeline
+ 1492
+ First Contact
+ Initial contact is established.

+ 1500
+ Expansion
+ Major expansion period begins.
```

## Verify

- Events appear in order with date/title/description grouping.
- Blank lines between events do not break parsing.
- WikiLinks inside timeline entries resolve correctly.

## Limits

- Timeline text is HTML-escaped before rendering.
- WikiLinks in title/description are converted to safe links.
- Non-3-line event groups are ignored.

See [[Documentation/WikiLinks]].
