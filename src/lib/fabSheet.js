/**
 * Load fab chat data from a Google Sheet
 * - Chat tabs: fab-chat-<artist>, one row per bubble
 * - Columns: msg, type, text, reply, date
 * Groups rows into messages so the shape matches what the pages expect
 */

const SHEET = process.env.REACT_APP_SHEET_URL || '';
const API_KEY = process.env.REACT_APP_SHEETS_API_KEY || '';
const API = 'https://sheets.googleapis.com/v4/spreadsheets';
const CHAT_PREFIX = 'fab-chat-';
const PROFILE_TAB = 'fab-profile';

// Pull the spreadsheet id from a full url or a bare id
const sheetId = (value) => {
  const match = value.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : value;
};

// Turn a header into a camelCase key, matching the export script
const normalizeHeader = (header) => {
  const s = String(header);
  let key = '';
  let upper = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c === ' ' && key.length > 0) {
      upper = true;
      continue;
    }

    const digit = c >= '0' && c <= '9';
    const alpha = (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');

    if (!alpha && !digit) continue;
    if (key.length === 0 && digit) continue;

    if (upper) {
      key += c.toUpperCase();
      upper = false;
    } else {
      key += c.toLowerCase();
    }
  }

  return key;
};

// Rows to objects keyed by header, empty cells are skipped
const rowsToObjects = (values) => {
  if (!values || values.length === 0) {
    return [];
  }

  const headers = (values[0] || []).map(normalizeHeader);
  const objects = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r] || [];
    const obj = {};
    let hasData = false;

    for (let c = 0; c < headers.length; c++) {
      if (!headers[c]) continue;

      const cell = row[c];

      if (cell === undefined || cell === null || cell === '') {
        continue;
      }

      obj[headers[c]] = cell;
      hasData = true;
    }

    if (hasData) {
      objects.push(obj);
    }
  }

  return objects;
};

// Fetch the given tabs in one batch call, keyed by tab title
const batchGet = async (id, tabs) => {
  const ranges = tabs
    .map((t) => `ranges=${encodeURIComponent(`'${t}'`)}`)
    .join('&');
  const res = await fetch(
    `${API}/${id}/values:batchGet?${ranges}&key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`Sheets API ${res.status}`);
  }

  const data = await res.json();
  const byTitle = {};

  for (const vr of data.valueRanges || []) {
    const title = (vr.range || '').split('!')[0].replace(/^'|'$/g, '');
    byTitle[title] = vr.values || [];
  }

  return byTitle;
};

// Group rows into ordered messages, each holding its bubble lines
const groupFab = (rows) => {
  const messages = [];
  const indexOf = {};

  for (const row of rows) {
    const msg = String(row.msg || '');
    if (!msg) continue;

    if (!(msg in indexOf)) {
      indexOf[msg] = messages.length;
      messages.push({ msg, lines: [] });
    }

    messages[indexOf[msg]].lines.push({
      type: row.type || '',
      text: row.text || '',
      reply: row.reply || '',
      date: row.date || ''
    });
  }

  return messages;
};

// Group fab-profile rows into the current profile and bg per artist
const groupProfile = (rows) => {
  const byArtist = {};

  for (const row of rows) {
    const artist = String(row.artist || '');
    const raw = String(row.type || '').toLowerCase();
    const type = raw === 'background' ? 'bg' : raw;
    const filename = row.filename !== undefined ? String(row.filename) : '';
    const extension = String(row.extension || '');
    const current = String(row.isCurrent || '').toLowerCase() === 'yes';

    if (!artist || !filename || !extension) continue;
    if (type !== 'profile' && type !== 'bg') continue;

    if (!byArtist[artist]) {
      byArtist[artist] = { profile: null, bg: null };
    }

    // The latest row flagged current wins, else keep the first seen
    if (current || !byArtist[artist][type]) {
      byArtist[artist][type] = { filename, extension };
    }
  }

  return byArtist;
};

// Load every fab artist keyed by artist number
export const loadFabFromSheet = async () => {
  const id = sheetId(SHEET);
  const empty = { chat: {}, profile: {} };

  if (!id || !API_KEY) {
    return empty;
  }

  try {
    const metaRes = await fetch(
      `${API}/${id}?fields=sheets.properties.title&key=${API_KEY}`
    );

    if (!metaRes.ok) {
      console.warn('[fab] sheet request failed', metaRes.status);
      return empty;
    }

    const info = await metaRes.json();
    const titles = (info.sheets || []).map((s) => s.properties.title);
    const chatTabs = titles.filter((t) => t.startsWith(CHAT_PREFIX));

    if (chatTabs.length === 0) {
      console.warn('[fab] no fab-chat tabs found, sheet has:', titles);
      return empty;
    }

    const hasProfile = titles.includes(PROFILE_TAB);
    const tabs = hasProfile ? [...chatTabs, PROFILE_TAB] : chatTabs;

    const byTitle = await batchGet(id, tabs);
    const chat = {};

    for (const tab of chatTabs) {
      const artistId = tab.slice(CHAT_PREFIX.length);
      chat[artistId] = groupFab(rowsToObjects(byTitle[tab]));
    }

    const profile = hasProfile
      ? groupProfile(rowsToObjects(byTitle[PROFILE_TAB]))
      : {};

    return { chat, profile };
  } catch (e) {
    console.warn('[fab] load failed', e);
    return empty;
  }
};
