#!/bin/sh
set -e

echo "[sett49-docker] Initializing container..."

# Asigură directoarele necesare pentru Nginx
mkdir -p /run/nginx /var/log/nginx

# Dacă din orice motiv nu există build-ul inițial, rulează-l
if [ ! -d "/app/dist" ]; then
    echo "[sett49-docker] dist directory missing, running initial build..."
    npx astro build
fi

# Configurează cron săptămânal (în fiecare luni la 03:00 dimineața)
echo "0 3 * * 1 /bin/sh /app/scripts/docker-sync.sh >> /var/log/cron-sync.log 2>&1" > /etc/crontabs/root

# Pornește cron daemon în fundal
echo "[sett49-docker] Starting cron service for weekly sync..."
crond -b -l 2

# Pornește Nginx în prim-plan
echo "[sett49-docker] Starting Nginx on port 80..."
exec nginx -g "daemon off;"

