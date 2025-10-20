#!/bin/bash
set -euo pipefail

# Go to repo root (this script lives there)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping any running Next.js dev servers..."
# Kill by known port (3000) if in use
if lsof -ti tcp:3000 >/dev/null 2>&1; then
  lsof -ti tcp:3000 | xargs kill -9 || true
fi
# Kill any lingering next dev processes
pkill -f "next dev" >/dev/null 2>&1 || true

echo "Starting Next.js dev server..."
if command -v pnpm >/dev/null 2>&1; then
  exec pnpm dev
elif command -v yarn >/dev/null 2>&1; then
  exec yarn dev
else
  exec npm run dev
fi


