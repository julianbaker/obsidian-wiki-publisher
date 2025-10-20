# Obsidian Vault → Vercel Deployment Guide

## Setup (One Time)

### 1. Configure Your Vault Path

Set your vault path via environment variable (recommended) or edit the script default:

```bash
VAULT_PATH="/path/to/your/obsidian/vault"
```

**Examples:**
- macOS: `/Users/yourusername/Documents/ObsidianVault`
- Dropbox: `/Users/yourusername/Dropbox/ObsidianVault`
- iCloud: `/Users/yourusername/Library/Mobile Documents/iCloud~md~obsidian/Documents/VaultName`

### 2. Test the Sync

```bash
npm run sync
```

This will copy all `.md` files from your vault to `app/content/posts/`.

### 3. Review What Got Synced

```bash
git status
```

Check that:
- ✅ Markdown files are present
- ✅ No `.obsidian` folders (excluded via .gitignore)
- ✅ No files you want to keep private

## Daily Workflow

### Option A: Manual Sync (Recommended)

```bash
# 1. Write in Obsidian
# 2. When ready to publish:
npm run sync

# 3. Review changes
git status
git diff

# 4. Test locally
npm run dev
# Visit http://localhost:3000 to check your pages

# 5. Commit and push
git add .
git commit -m "content: update posts"
git push

# Vercel will auto-deploy!
```

### Option B: Automated Sync

If you want automatic syncing when your vault changes, you could:
1. Use a file watcher (like `fswatch` on macOS)
2. Run the sync script automatically
3. Auto-commit (optional, but riskier)

Let me know if you want me to set this up!

## What Gets Synced

### ✅ Included
- All `.md` files
- Subdirectory structure
- WikiLinks (automatically converted)

### ❌ Excluded
- `.obsidian/` folder (workspace/config files)
- `templates/` folder (if you have one)
- `.trash/` folder

### Images & Attachments

If you have images referenced in your vault:

1. **Find your attachments folder** (usually something like `attachments/` or `assets/`)

2. **Uncomment the image sync line** in `sync-vault.sh`:
```bash
rsync -av "$VAULT_PATH/attachments/" "public/attachments/"
```

3. **Update image paths** if needed. Obsidian images like:
```markdown
![[attachments/map.png]]
```

Will become:
```markdown
![map](attachments/map.png)
```

And will be served from `public/attachments/map.png`

## Selective Publishing

### Method 1: Use `published` Frontmatter

Add to your markdown files:
```yaml
---
title: My Post
published: true  # Only sync posts with this flag
---
```

Then update `sync-vault.sh` to only copy published posts (I can help with this).

### Method 2: Dedicated "Publish" Folder

Organize your vault:
```
ObsidianVault/
├── Private Notes/
├── Drafts/
└── Publish/        ← Only sync this folder
    ├── Characters/
    ├── Locations/
    └── Story/
```

Update `sync-vault.sh`:
```bash
VAULT_PATH="/path/to/vault/Publish"
```

### Method 3: Manual Selection

Just manually copy the files you want:
```bash
cp ~/vault/specific-file.md app/content/posts/
```

## Vercel Deployment

### First Deploy

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings
5. Deploy! 🚀

### Environment Variables (Optional)

If you need any secrets:
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add variables
3. Redeploy

### Automatic Deploys

After setup, every time you:
```bash
git push
```

Vercel automatically:
1. Pulls your code
2. Runs `npm run build`
3. Deploys the new version
4. Usually takes 30-60 seconds

## Troubleshooting

### "Permission denied" when running sync

```bash
chmod +x sync-vault.sh
```

### Sync script not finding files

Check your path:
```bash
ls -la /your/vault/path
```

### Images not showing

1. Make sure images are in `public/` folder
2. Check image paths in markdown
3. Images should use relative paths: `/attachments/image.png`

### Git tracking too many files

Update `.gitignore`:
```
app/content/posts/drafts/
app/content/posts/private/
```

## Advanced: Pre-Deploy Sync

To sync automatically before every deploy, create `vercel.json`:

```json
{
  "buildCommand": "npm run sync && next build"
}
```

⚠️ **Note:** This only works if your vault is accessible from Vercel's build server (not recommended for private vaults).

## Best Practices

1. **Always review before committing** - Use `git diff` to see what changed
2. **Test locally first** - Run `npm run dev` before pushing
3. **Use frontmatter flags** - Control what's published with `published: true`
4. **Backup your vault** - Obsidian has built-in backup, use it!
5. **Separate repos** - Keep vault and blog separate (what you're doing ✅)

## Questions?

- **Q: Can I edit files directly in the repo?**  
  A: Yes, but changes won't sync back to your vault automatically.

- **Q: What about Obsidian plugins?**  
  A: Plugins won't work on the published site. The site only shows markdown content.

- **Q: Can I use Obsidian themes?**  
  A: No, but you can customize the site's CSS in `app/global.css`.

- **Q: Do tags work?**  
  A: Obsidian tags (#tag) are just text. We can add tag support if needed!

## Next Steps

Once syncing works well, you might want to add:
- [ ] Backlinks (see which pages link to each other)
- [ ] Tag pages (organize by tags)
- [ ] Search functionality
- [ ] Graph view of your worldbuilding connections

Let me know what you'd like to tackle next! 🎯

