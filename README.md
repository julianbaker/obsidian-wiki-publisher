# Bob Loblore Lore Blog (Open‑Source Obsidian Publisher)

An open-source Obsidian publishing tool built with Next.js. Turn your Obsidian vault into a navigable web wiki with WikiLinks, backlinks, Dataview-like queries, and an optional graph view.

## ✨ Features

### Obsidian Integration
- **WikiLink Support** - `[[Page Name]]` and `[[Page Name|Display Text]]` syntax
- **Image Embeds** - `![[image.png]]` and `![[image.png|alt text]]` 
- **Stub Links** - Non-existent pages show in red (Wikipedia-style)
- **Backlinks** - Automatic "Linked References" section on each page
- **Folder Notes** - Click folders to view overview pages (Obsidian Folder Notes plugin compatible)
- **Dataview Queries** - Basic LIST and TABLE query support
- **Vault Sync** - Simple script to sync your Obsidian vault to the repo

### Wiki Features
- **Folder-based Navigation** - Hierarchical sidebar with collapsible folders
- **Responsive Design** - Mobile-friendly with slide-out menu
- **Dark Mode** - Automatic light/dark theme support
- **Wiki-style Typography** - Clean, readable layout with blue links
- **Table Support** - Markdown tables with proper styling

### Technical Stack
- **Next.js 14** - React framework with App Router
- **Shadcn/ui** - Modern, accessible component library
- **Tailwind CSS v4** - Utility-first styling
- **MDX/Markdown** - Rich content support with custom processing
- **Vercel** - Optimized for deployment

### SEO & Performance
- Sitemap generation
- RSS feed
- Dynamic OG images
- Optimized for search engines
- Vercel Speed Insights & Web Analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- An Obsidian vault (optional, for syncing content)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd obsidian-wiki-publisher
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your wiki.

## 📝 Content Management

### Syncing Your Obsidian Vault

1. **Configure the sync script**

Set `VAULT_PATH` in your environment (recommended) or edit `sync-vault.sh` default:
```bash
export VAULT_PATH="/path/to/your/obsidian/vault"
```

2. **Run the sync**
```bash
npm run sync
```

This copies your vault content to `app/content/posts/` while excluding Obsidian metadata.

### File Structure

Content lives in `app/content/posts/`:
```
app/content/posts/
├── index.md                # Homepage
├── 1. Core/
│   ├── 1. Core.md         # Folder note (overview page)
│   ├── Page 1.md
│   └── Page 2.md
└── ...
```

Note: The file named `index.md` is treated as the homepage and is hidden from the sidebar. All other root-level `.md` files will appear in the sidebar.

### Frontmatter (Optional)

While frontmatter is optional, you can include it for custom metadata:

```yaml
---
title: My Page Title
publishedAt: 2024-01-01
summary: A brief description
---
```

If omitted, the title is extracted from the first H1 heading.

## 📚 WikiLink Syntax

### Internal Links
```markdown
[[Page Name]]                    → Links to a page
[[Page Name|Display Text]]       → Link with custom text
[[Folder/Page Name]]             → Link with folder path
```

### Image Embeds
```markdown
![[image.png]]                   → Embed an image
![[image.png|Alt text]]          → Embed with alt text
```

### Stub Links
Links to non-existent pages appear in red, making it easy to track pages that need to be created.

## 🔗 Backlinks

Each page automatically shows "Linked References" - a list of all pages that link to the current page. This creates a networked, wiki-style knowledge base.

## 📊 Dataview Queries

Basic Dataview-like query support:

```markdown
\`\`\`dataview
LIST
FROM "Folder Name"
WHERE contains(file.name, "keyword")
SORT title
\`\`\`
```

```markdown
\`\`\`dataview
TABLE file.folder, summary
FROM "Civilizations"
\`\`\`
```

## 🎨 Styling

The wiki uses a clean, Wikipedia-inspired aesthetic:
- Blue links that underline on hover
- Section headings with bottom borders
- Responsive tables
- Syntax-highlighted code blocks
- Dark mode support

Customize styling in `app/global.css`.

## 📱 Mobile Support

- Hamburger menu for mobile navigation
- Responsive sidebar that slides in from the left
- Touch-friendly interface
- Optimized padding and spacing

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Import your repository at [vercel.com](https://vercel.com)
- Vercel will auto-detect Next.js settings
- Deploy!

3. **Sync Workflow**
```bash
# Update content
npm run sync

# Commit and deploy
git add app/content/posts
git commit -m "Update content"
git push
```

## 📄 License & Attribution

Code: MIT License (Open Source by Julian Baker)  
Content in your deployed site: choose your own license

## 🛠️ Tech Details

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4, Shadcn/ui
- **Content**: MDX with remark plugins
- **Fonts**: Geist Sans & Mono
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## 📖 Documentation

- [WikiLink Guide](./WIKILINK_GUIDE.md) - Detailed WikiLink implementation
- [Sync Guide](./OBSIDIAN_SYNC_GUIDE.md) - Vault syncing workflow

---

Built with ❤️ for worldbuilders and knowledge gardeners.
