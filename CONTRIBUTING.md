# Cum îți completezi cardul pe site

Fiecare membru își editează doar propriile rânduri în `src/data/manual.json`. Nu modifica rândurile altora.

Handle-ul tău e numele exact din lista de pe pagina Team (ex: `zetef`, `m68k`). Se scrie la fel în toate secțiunile de mai jos.

## 1. Descriere și categorii

În secțiunea `memberRoles` găsești linia ta:

```json
"zetef": "hack/the/planet\nrev/pwn",
```

- `\n` începe un rând nou. Aici sunt două rânduri.
- Un rând cu categorii (separate prin `/`) se afișează ca celule colorate. Orice alt text rămâne text simplu.
- Folosește doar categorii din lista de mai jos, scrise cu litere mici. Dacă un rând conține o categorie necunoscută sau o greșeală de scriere, tot rândul devine text simplu.

| Categorie | Culoare |
|---|---|
| `pwn` | roșu |
| `rev` (sau `reversing`) | verde |
| `web` | albastru |
| `crypto` | mov |
| `forensics` | galben |
| `osint` | cyan |
| `hardware` | portocaliu |
| `mobile` | roz |
| `ai` | indigo |
| `stego` | turcoaz |
| `network` | lime |
| `misc` | gri |

Exemple:

```json
"m68k": "web/crypto",
"coswin": "pwn",
"Horea13": "student MTA\nweb/forensics/osint",
```

Lipsește categoria ta? Cere-i lui zetef s-o adauge în `categoryStyles` din `src/pages/team.astro`.

## 2. Contact

În secțiunea `memberContacts`, completezi doar ce vrei să arăți:

```json
"zetef": { "email": "nume@exemplu.ro", "github": "zetef", "instagram": "@zetef" },
```

Tipuri disponibile: `email`, `discord`, `instagram`, `github`, `linkedin`, `website`.

- Pentru `instagram`, `github` și `linkedin` scrii doar username-ul. Linkul se face singur.
- `discord` apare doar ca text, fără link.
- Câmpurile goale (`""`) nu se afișează.

## 3. Poză de profil

Salvează poza ca `src/assets/avatars/<handle>.png` (merge și `.jpg`, `.jpeg`, `.webp`). Exemplu: `src/assets/avatars/zetef.png`. Pozele pătrate arată cel mai bine. Fără poză se afișează inițialele.

## Atenție la formatul JSON

- Pui virgulă la finalul fiecărei linii, mai puțin la ultima dintr-un bloc.
- Folosești ghilimele duble `"`, nu simple.
- Un singur caracter greșit strică tot fișierul, așa că verifică înainte să salvezi.

## Cum verifici local

```
npm ci          # doar prima dată
npm run dev
```

Deschide http://localhost:4321/team și verifică cardul tău. Modificările apar automat, fără rebuild.

Când ești mulțumit, fă commit și trimite modificarea în repo, ca de obicei (push sau pull request).
