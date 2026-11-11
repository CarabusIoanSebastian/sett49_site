#!/bin/sh
set -e

echo "[sett49-docker] Initializing container..."

# Asigură directoarele necesare pentru Nginx
mkdir -p /run/nginx /var/log/nginx

# Încearcă un sync inițial de date la pornirea pe server
echo "[sett49-docker] Checking for fresh CTFtime data on startup..."
node /app/scripts/sync-ctftime.mjs || echo "[sett49-docker] Startup sync skipped, using bundled data."

# Construiește paginile statice
echo "[sett49-docker] Building static pages..."
npx astro build

# Configurează cron pentru actualizare automată continuă
# Rulează la 04:00 și 16:00 zilnic pentru a prelua rapid membrii noi și scorurile după CTF-uri
cat << 'EOF' > /etc/crontabs/root
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0 4 * * * /bin/sh /app/scripts/docker-sync.sh >> /var/log/cron-sync.log 2>&1
0 16 * * * /bin/sh /app/scripts/docker-sync.sh >> /var/log/cron-sync.log 2>&1
EOF

# Pornește cron daemon în fundal
echo "[sett49-docker] Starting cron service (auto-sync scheduled every 12h)..."
crond -b -l 2

# Pornește Nginx în prim-plan
echo "[sett49-docker] Starting Nginx on port 80..."
exec nginx -g "daemon off;"
