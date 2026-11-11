# sett49 web

Site-ul oficial al echipei de CTF sett49 (Academia Tehnică Militară „Ferdinand I”).

## Production (Docker)

Pornire pe server:

```bash
docker compose up -d --build
```

Site-ul rulează pe portul `80`. Containerul rulează Nginx și un cron intern care sincronizează automat datele de pe CTFtime la fiecare 12 ore.

Dacă ai nevoie de alt port (ex: 8080):
```bash
PORT=8080 docker compose up -d --build
```

### Comenzi utile

```bash
# Sincronizare forțată manuală cu CTFtime
docker compose exec sett49-site /app/scripts/docker-sync.sh

# Loguri live
docker compose logs -f

# Verificare loguri de sync (cron)
docker compose exec sett49-site cat /var/log/cron-sync.log

# Oprire
docker compose down
```

## Local Dev

```bash
npm install
npm run dev      # dev server la http://localhost:4321
npm run sync     # sincronizează ctftime.json local
npm run build    # testează build-ul static (în ./dist)
```

## Configurare date

- `src/data/ctftime.json` — fișier generat automat de sync (nu se editează manual).
- `src/data/manual.json` — fișier de configurare:
  - `memberRoles`: adaugi rolul fiecărui membru (Pwn, Web, Crypto, Forensics etc.).
  - `localUpcoming`: concursuri locale viitoare (ex: SmartHack).
  - `localAchievements`: premii la competiții non-CTFtime (ex: Cyberman, Cydex, Unbreakable).
  - `extraMembers`: membri care nu au cont CTFtime.
