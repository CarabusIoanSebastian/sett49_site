import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'ctftime.json');
const TEAM_ID = '422471';
const TEAM_URL = `https://ctftime.org/team/${TEAM_ID}`;

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .trim();
}

async function sync() {
  console.log(`[sync-ctftime] Fetching data from ${TEAM_URL}...`);

  const response = await fetch(TEAM_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`CTFtime returned status HTTP ${response.status}`);
  }

  const html = await response.text();

  // 1. Parse Members from Team members section
  const members = [];
  const seenUsers = new Set();
  const membersSection = html.slice(html.indexOf('<h3>Team members</h3>'));
  const userRegex = /<a\s+href="\/user\/(\d+)">([^<]+)<\/a>/g;
  let userMatch;
  while ((userMatch = userRegex.exec(membersSection)) !== null) {
    const id = userMatch[1];
    const handle = decodeHtml(userMatch[2]);
    if (!seenUsers.has(id)) {
      seenUsers.add(id);
      members.push({
        id,
        handle,
        ctftime: `https://ctftime.org/user/${id}`,
      });
    }
  }

  // 2. Parse Upcoming Events ("Plan to participate in CTF events")
  const upcoming = [];
  const upcomingSectionMatch = html.match(/Plan to participate in CTF events[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/i);
  if (upcomingSectionMatch) {
    const upcomingTable = upcomingSectionMatch[1];
    const rows = upcomingTable.split(/<\/?tr[^>]*>/i);
    for (const row of rows) {
      if (!row.includes('<td')) continue;
      const eventMatch = row.match(/<a\s+href="\/event\/(\d+)">([^<]+)<\/a>/i);
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
      if (eventMatch && cells.length >= 2) {
        const eventId = eventMatch[1];
        const name = decodeHtml(eventMatch[2]);
        const date = decodeHtml(cells[cells.length - 1]);
        upcoming.push({
          name,
          date,
          url: `https://ctftime.org/event/${eventId}`,
        });
      }
    }
  }

  // 3. Parse Participated Events (Current Season / rating_2026)
  const results = [];
  const ratingSectionMatch = html.match(/id="rating_\d+"[^>]*>[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/i);
  if (ratingSectionMatch) {
    const ratingTable = ratingSectionMatch[1];
    const rows = ratingTable.split(/<\/?tr[^>]*>/i);
    for (const row of rows) {
      if (!row.includes('<td')) continue;

      const placeMatch = row.match(/class="place"[^>]*>(\d+)</i) || row.match(/<td[^>]*>(\d+)<\/td>/i);
      const eventMatch = row.match(/<a\s+href="\/event\/(\d+)">([^<]+)<\/a>/i);
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);

      if (placeMatch && eventMatch && cells.length >= 4) {
        const place = parseInt(placeMatch[1], 10);
        const eventId = eventMatch[1];
        const name = decodeHtml(eventMatch[2]);

        const ctfPtsRaw = cells[cells.length - 2] ? decodeHtml(cells[cells.length - 2]) : '0';
        const ratingPtsRaw = cells[cells.length - 1] ? decodeHtml(cells[cells.length - 1]) : '0';

        const ctfPtsMatch = ctfPtsRaw.match(/[\d.]+/);
        const ratingPtsMatch = ratingPtsRaw.match(/[\d.]+/);

        const ctfPts = ctfPtsMatch ? parseFloat(ctfPtsMatch[0]).toFixed(2) : '0.00';
        const ratingPts = ratingPtsMatch ? parseFloat(ratingPtsMatch[0]).toFixed(3) : '0.000';

        results.push({
          place,
          name,
          url: `https://ctftime.org/event/${eventId}`,
          ctfPts,
          ratingPts,
        });
      }
    }
  }

  // Sort results by place ascending
  results.sort((a, b) => a.place - b.place);

  const data = {
    lastSyncedAt: new Date().toISOString(),
    teamId: TEAM_ID,
    teamUrl: TEAM_URL,
    members,
    upcoming,
    results,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[sync-ctftime] Successfully synced:`);
  console.log(`  - ${members.length} members`);
  console.log(`  - ${upcoming.length} upcoming events`);
  console.log(`  - ${results.length} participated events`);
  console.log(`  Saved to ${OUTPUT_FILE}`);
}

sync().catch(err => {
  console.error('[sync-ctftime] ERROR:', err.message);
  process.exit(1);
});
