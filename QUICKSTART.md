# Quick Start Guide

Get your Obsidian wiki online in 5 minutes.

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Content Structure

### Homepage
- Edit `app/content/posts/index.md` to customize your homepage

### Adding Pages
Create markdown files in `app/content/posts/`:

```markdown
# My New Page

This is my content with [[WikiLinks]] and **formatting**.
```

### Organizing with Folders
```
app/content/posts/
├── index.md
├── 1. Category/
│   ├── 1. Category.md    ← Folder overview page
│   ├── Page 1.md
│   └── Page 2.md
└── 2. Another Category/
    └── ...
```

Note: `index.md` is your homepage and will not appear in the sidebar navigation. Other root-level pages will appear at the top of the sidebar.

## 🔗 WikiLink Examples

### Basic Links
```markdown
[[Page Name]]                # Link to a page
[[Page Name|Custom Text]]    # Custom link text
[[Folder/Page Name]]         # Include folder path
```

### Images
```markdown
![[image.png]]              # Embed image
![[image.png|Alt text]]     # With alt text
```

## 📊 Dataview Queries

### List Pages
```markdown
\`\`\`dataview
LIST
FROM "1. Category"
\`\`\`
```

### Create Tables
```markdown
\`\`\`dataview
TABLE file.folder, summary
FROM "2. Category"
WHERE contains(file.name, "keyword")
SORT title
\`\`\`
```

## 🔄 Sync from Obsidian

### One-Time Setup
Set your Obsidian vault path via environment variable (recommended):
```bash
export VAULT_PATH="/path/to/your/vault"
```
Or edit `sync-vault.sh` to set a default.

### Sync Content
```bash
npm run sync
```

This copies your vault to `app/content/posts/` (excludes `.obsidian/`)

## 🎨 Customization

### Site Name & URLs
Edit `lib/site-config.ts`:
```ts
export const siteConfig = {
  siteName: 'Bob Loblore Lore Blog',
  description: 'Your description',
  baseUrl: 'http://localhost:3000'
}
```

### Copyright
Edit `app/components/footer.tsx` to update your name and license

### Styling
Customize colors and fonts in `app/global.css`


## 📚 Features at a Glance

✅ WikiLinks (`[[Page Name]]`)  
✅ Backlinks (automatic)  
✅ Folder navigation  
✅ Mobile responsive  
✅ Dark mode  
✅ Dataview queries  
✅ Stub link detection (red links)  
✅ Markdown tables  
✅ Image embeds  
✅ Syntax highlighting  
✅ SEO optimized  

## 🆘 Troubleshooting

### Links Not Working?
- Ensure page exists in `app/content/posts/`
- Check file name matches WikiLink (case-insensitive)
- Slug is auto-generated from filename

### Sidebar Not Showing?
- Check folder structure has files
- Folder notes need matching filename (e.g., `1. Core.md` in `1. Core/`)

### Images Not Loading?
- Place images in `public/` folder
- Reference as `![[/image.png]]`

## 📖 More Help

- [Full README](./README.md)
- [WikiLink Guide](./WIKILINK_GUIDE.md)
- [Sync Guide](./OBSIDIAN_SYNC_GUIDE.md)

---

Need help? Check the guides or open an issue!

