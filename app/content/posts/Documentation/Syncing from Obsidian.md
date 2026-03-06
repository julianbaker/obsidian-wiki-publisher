# Syncing from Obsidian

Copy markdown from an Obsidian vault into this project.

## Mental model

`npm run sync` copies vault content into `app/content/posts/` with specific exclusions.
You review the resulting git diff before publishing.

## Do this

1. Set the vault path:

```bash
export VAULT_PATH="/path/to/your/obsidian/vault"
```

2. Run sync:

```bash
npm run sync
```

3. Review changes:

```bash
git status
git diff
```

Excluded by default:
- `.obsidian/`
- `templates/`
- `.trash/`
- `6. Reference/`

## Verify

Run:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

Expected result: checks pass and imported pages resolve to expected routes.

## Notes

If your vault uses attachments, sync them into `public/attachments/` and reference with stable paths.
See comments in `sync-vault.sh` for optional attachment sync behavior.
