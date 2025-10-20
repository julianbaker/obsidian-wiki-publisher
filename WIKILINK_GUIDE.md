# WikiLink Implementation Guide

## Overview

WikiLink support has been added to allow Obsidian-style linking within your markdown files. This enables a more natural writing flow and makes it easier to migrate content from Obsidian.

## Supported Syntax

### Basic Page Links

```markdown
[[Page Name]]
```
Converts to: `[Page Name](/page-name)`

### Links with Custom Display Text

```markdown
[[Page Name|Click here]]
```
Converts to: `[Click here](/page-name)`

### Image Links

```markdown
![[image.png]]
```
Converts to: `![image](image.png)`

### Images with Alt Text

```markdown
![[path/to/image.png|Custom alt text]]
```
Converts to: `![Custom alt text](path/to/image.png)`

## How It Works

1. **WikiLinks are preprocessed** - Before MDX processes your content, WikiLinks are converted to standard markdown links
2. **Page names become slugs** - "My Character Name" → "my-character-name"
3. **All links point to `/${slug}`** - Links route to page slugs at the site root
4. **Automatic conversion** - No manual conversion needed; just write WikiLinks naturally

## Implementation Details

The conversion happens in `app/components/mdx.tsx`:

- `convertWikiLinks()` function preprocesses markdown content
- Image WikiLinks are processed first (to avoid conflicts)
- Regular WikiLinks are processed second
- The `slugify()` function ensures consistent URL formatting

## Testing

A demo file has been created at `app/content/posts/wikilink-demo.md` that demonstrates:
- Basic WikiLinks
- WikiLinks with custom text
- Multiple links in paragraphs
- Various use cases

## Next Steps for Full Obsidian Integration

### 1. Subdirectory Support
Currently all pages route to `/${slug}`. For worldbuilding, you might want:
- `/characters/character-name`
- `/locations/location-name`
- `/factions/faction-name`

This requires updating the WikiLink converter to be context-aware or use a different routing structure.

### 2. Backlinks
Obsidian shows backlinks automatically. To implement:
- Parse all files during build
- Track which pages link to each page
- Display backlinks at the bottom of each page

### 3. Graph View
For a full Obsidian experience:
- Generate a JSON graph of all page connections
- Use a library like D3.js or Force-Graph to visualize
- Make it interactive (click nodes to navigate)

### 4. Aliases
Obsidian supports aliases in frontmatter:
```yaml
aliases:
  - Alternative Name
  - Short Name
```

Update WikiLink resolution to check aliases when finding target pages.

### 5. Tags
Convert Obsidian tags (`#tag`) to:
- Frontmatter tags array
- Clickable tag links
- Tag index pages

### 6. Unresolved Links
Handle cases where WikiLinks point to pages that don't exist:
- Style them differently (red/dashed)
- Show a list of broken links
- Optionally create placeholder pages

## Image Handling

For images in your Obsidian vault:
1. Copy your Obsidian attachments folder to `/public/`
2. Update WikiLink paths if needed
3. Images will be served from the public directory

Example:
```markdown
![[attachments/map.png]]
```

Place the file at: `/public/attachments/map.png`

## Example Workflow

1. Write in Obsidian as normal using WikiLinks
2. Copy your `.md` files to `app/content/posts/`
3. WikiLinks are automatically converted when the page renders
4. No manual link conversion needed!

## Limitations

- WikiLinks must use exact page names (case-insensitive after slugification)
- Links always route to `/${slug}` (can be customized)
- Block references (`[[Page#Section]]`) not yet supported
- Embed syntax (`![[Page]]`) treats it as an image

## Customization

To change where WikiLinks route to, modify the `convertWikiLinks()` function in `app/components/mdx.tsx`:

```typescript
// Current:
return `[${linkText.trim()}](/${slug})`

// For worldbuilding structure:
return `[${linkText.trim()}](/wiki/${slug})`
```

## Questions?

The WikiLink implementation is designed to be simple and extensible. Feel free to modify the regex patterns or slug generation to match your specific needs.

