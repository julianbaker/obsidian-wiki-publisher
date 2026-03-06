# Syncing from Obsidian

Use the sync script to copy markdown from your vault into this repo.

## Configure

```bash
export VAULT_PATH="/path/to/your/obsidian/vault"
```

## Sync

```bash
npm run sync
```

This syncs into `app/content/posts/` and excludes:

- `.obsidian/`
- `templates/`
- `.trash/`
- `6. Reference/`

## Recommended workflow

1. Update notes in Obsidian.
2. Run `npm run sync`.
3. Review changes with `git status` and `git diff`.
4. Validate:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

5. Commit and push.

## Images and attachments

If your vault uses attachments, sync them into `public/attachments/` and reference them with stable paths.

See `sync-vault.sh` comments for the optional attachment sync command.
