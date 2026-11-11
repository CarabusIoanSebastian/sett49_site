# sett49 — Official Website

> Echipa academică de securitate cibernetică și Capture The Flag (CTF) din cadrul **Academiei Tehnice Militare „Ferdinand I”** din București.

Site-ul oficial de prezentare al echipei, rezultate în competiții, membri și activitate academică. Construit pe o arhitectură **Static Site Generation (SSG)** cu **Astro**, concepută să ofere viteză maximă și **zero suprafață de atac** la runtime.

---

## ⚡ Stack Tehnic

- **Framework:** [Astro](https://astro.build/) (Static Output)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Limbaj:** TypeScript / JavaScript
- **Arhitectură:** SSG (generare 100% statică, securitate maximă pentru Docker / Nginx)

---

## 🚀 Comenzi de Dezvoltare

Toate comenzile se rulează din rădăcina proiectului:

```bash
# Instalare dependințe
npm install

# Pornire server de dezvoltare
npm run dev

# Sincronizare automată date CTFtime (membri, evenimente, rezultate)
npm run sync

# Build static pentru producție (generează în ./dist)
npm run build

# Preview build local
npm run preview
```

---

## 🔄 Flux de Lucru: Membri Noi & După Competiții

Datele site-ului sunt împărțite în două fișiere curate în `src/data/`:
1. `src/data/ctftime.json` — sincronizat automat de pe CTFtime.
2. `src/data/manual.json` — configurări manuale (roluri, membri fără CTFtime, concursuri locale).

### 1. După un CTF sau când intră un membru pe CTFtime

Pentru a aduce automat noile puncte, clasamente sau membri de pe profilul echipei:

```bash
npm run sync
```

Scriptul securizat (`scripts/sync-ctftime.mjs`):
- Se conectează la pagina echipei (`https://ctftime.org/team/422471`).
- Extrage lista de membri actualizată.
- Extrage evenimentele viitoare (*Plan to participate*).
- Extrage rezultatele oficiale cu puncte și rating.
- Sanitizează toate câmpurile împotriva atacurilor de tip injection / XSS și le salvează în `src/data/ctftime.json`.

---

### 2. Atribuirea rolului pentru un membru nou

CTFtime nu știe ce specializare joacă fiecare membru. După ce ai rulat `npm run sync`, deschide:

`src/data/manual.json` -> secțiunea `"memberRoles"`:

```json
"memberRoles": {
  "zetef": "Pwn & Reversing",
  "sayan9615_": "Web & Pwn",
  "membru_nou": "Forensics"
}
```

*Dacă un membru nu are încă un rol definit în fișier, site-ul va afișa automat `// ???` până când îi este atribuită o specializare.*

---

### 3. Dacă un membru nu are încă profil de CTFtime

Îl poți adăuga în `src/data/manual.json` în lista `"extraMembers"`:

```json
"extraMembers": [
  {
    "handle": "nume_membru",
    "ctftime": null
  }
]
```

Când își creează cont și se alătură echipei pe CTFtime, la următorul `npm run sync` va fi preluat automat, fără duplicate.

---

### 4. Adăugarea de competiții locale / speciale

Competițiile care nu sunt pe CTFtime (ex: *Cyberman*, *Cydex*, *SmartHack*, *Unbreakable*) se gestionează din `src/data/manual.json`:

- **Evenimente viitoare locale:** în `"localUpcoming"` (Nume, Dată).
- **Premii / Rezultate locale:** în `"localAchievements"` (Nume eveniment, Categorie, Winner / 2nd Place / Finalist).

---

## 🐳 Rulare în Docker (Gata de producție)

Containerul Docker rulează **Nginx** pentru servirea ultra-rapidă a paginilor statice și include un serviciu intern de **cron** care sincronizează automat datele de pe CTFtime de două ori pe zi (la 04:00 și 16:00) și re-generează paginile statice instant, fără downtime.

### Metoda 1: Cu Docker Compose (Recomandat)

```bash
docker compose up -d --build
```

### Metoda 2: Cu Docker CLI

```bash
docker build -t sett49-web .
docker run -d --name sett49-site --restart unless-stopped -p 80:80 sett49-web
```

### Funcționalități integrate în container:
- **Auto-Sync la fiecare 12 ore:** Preia automat noii membri și punctele din CTF-urile recente. Dacă CTFtime este temporar picat, containerul păstrează build-ul existent intact.
- **Sincronizare inițială la pornire:** La fiecare pornire a containerului pe server, se descarcă automat ultimele date live.
- **Sincronizare manuală la cerere (fără restart container):**
  ```bash
  docker exec -it sett49-web /app/scripts/docker-sync.sh
  ```
- **Verificare loguri de sincronizare:**
  ```bash
  docker exec -it sett49-web cat /var/log/cron-sync.log
  ```

---

## 🔒 Securitate

- **Zero SSRF la runtime:** Site-ul nu face request-uri externe în timpul vizitelor utilizatorilor.
- **Fără bază de date expusă:** Nu există risc de SQL Injection sau Remote Code Execution.
- **Output static:** Fișierele sunt pre-renderate la build time, garantând performanță și reziliență.
