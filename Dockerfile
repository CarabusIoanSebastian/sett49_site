FROM node:22-alpine

WORKDIR /app

# Instalează Nginx
RUN apk add --no-cache nginx && \
    mkdir -p /run/nginx /var/log/nginx

# Copiază dependințele și instalează-le
COPY package*.json ./
RUN npm ci

# Copiază fișierele proiectului
COPY . .

# Copiază configurația optimizată de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Generează build-ul static inițial
RUN npm run build

# Permisiuni de execuție pentru scripturile de sync și pornire
RUN chmod +x /app/scripts/docker-sync.sh /app/scripts/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
