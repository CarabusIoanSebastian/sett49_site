#!/bin/sh

echo "[$(date)] Running CTFtime sync..."
cd /app

if node scripts/sync-ctftime.mjs; then
    echo "[$(date)] Sync successful. Rebuilding static pages..."
    npx astro build
    echo "[$(date)] Rebuild complete."
else
    echo "[$(date)] WARNING: Sync failed (CTFtime may be temporarily unreachable). Keeping current build."
fi

