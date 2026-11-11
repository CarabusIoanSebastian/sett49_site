#!/bin/sh
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
export NODE_ENV=production

echo "[$(date)] Starting scheduled CTFtime sync..."
cd /app

if node scripts/sync-ctftime.mjs; then
    echo "[$(date)] CTFtime data synced successfully. Rebuilding static site..."
    npx astro build
    echo "[$(date)] Site updated successfully."
else
    echo "[$(date)] WARNING: Sync failed (CTFtime may be temporarily unreachable). Keeping current build."
fi
