#!/bin/bash

# Sync script to copy content from Obsidian vault to blog repo
# Usage: ./sync-vault.sh

# Set your Obsidian vault path here or export VAULT_PATH before running
: "${VAULT_PATH:=/path/to/your/obsidian/vault}"
POSTS_DIR="app/content/posts"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Syncing Obsidian vault to blog...${NC}"

# Create posts directory if it doesn't exist
mkdir -p "$POSTS_DIR"

# Sync markdown files (excluding templates and .obsidian folder)
rsync -av \
  --exclude=".obsidian" \
  --exclude="templates" \
  --exclude=".trash" \
  --exclude="6. Reference" \
  --include="*/" \
  --include="*.md" \
  --exclude="*" \
  --delete \
  "$VAULT_PATH/" "$POSTS_DIR/"

# Optional: Sync images/attachments to public folder
# Uncomment and adjust path as needed
# rsync -av "$VAULT_PATH/attachments/" "public/attachments/"

echo -e "${GREEN}✅ Sync complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Test locally: npm run dev"
echo "  3. Commit: git add . && git commit -m 'content: sync vault'"

