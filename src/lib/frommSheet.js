/**
 * Load fromm chat data and metadata from a Google Sheet
 * - Chat tabs: fromm-chat-<artist>
 * - Metadata tab (all artists): fromm-meta
 * Reproduces the sheet to json export so the shape matches the old Contentful data
 */

const SHEET = process.env.REACT_APP_SHEET_URL_CONTENT || '';
const API_KEY = process.env.REACT_APP_SHEETS_API_KEY || '';
const API = 'https://sheets.googleapis.com/v4/spreadsheets';
const CHAT_PREFIX = 'fromm-chat-';
const META_TAB = 'fromm-meta';

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

// Rows to objects keyed by header, empty cells are skipped like the script
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

// Group the metadata rows into per artist name and description history
const groupMeta = (rows) => {
  const byArtist = {};
  const last = {};
  let lastArtist = '';

  // A blank cell inherits the row above, a dash forces an empty value
  const carry = (value, prev) => (value === '-' ? '' : value || prev || '');

  for (const row of rows) {
    const id = String(row.artist || '') || lastArtist;

    if (!id) continue;

    lastArtist = id;

    if (!byArtist[id]) {
      byArtist[id] = { name: [], description: [], profileText: [] };
    }
    if (!last[id]) {
      last[id] = { name: '', description: '' };
    }

    const name = carry(row.name, last[id].name);
    const description = carry(row.description, last[id].description);
    last[id] = { name, description };

    const m = byArtist[id];
    m.name.push(name);
    m.description.push(description);
    m.profileText.push({
      name: m.name.length - 1,
      description: m.description.length - 1
    });
  }

  return byArtist;
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

// Load every artist as an entry shaped like the old Contentful data
export const loadFrommFromSheet = async () => {
  const id = sheetId(SHEET);

  if (!id || !API_KEY) {
    return [];
  }

  try {
    const metaRes = await fetch(
      `${API}/${id}?fields=sheets.properties.title&key=${API_KEY}`
    );

    if (!metaRes.ok) {
      console.warn('[fromm] sheet request failed', metaRes.status);
      return [];
    }

    const info = await metaRes.json();
    const titles = (info.sheets || []).map((s) => s.properties.title);
    const chatTabs = titles.filter((t) => t.startsWith(CHAT_PREFIX));
    const hasMeta = titles.includes(META_TAB);

    if (chatTabs.length === 0) {
      return [];
    }

    const tabs = hasMeta ? [...chatTabs, META_TAB] : chatTabs;
    const byTitle = await batchGet(id, tabs);
    const metaByArtist = hasMeta
      ? groupMeta(rowsToObjects(byTitle[META_TAB]))
      : {};

    return chatTabs.map((tab) => {
      const artistId = tab.slice(CHAT_PREFIX.length);
      const meta = metaByArtist[artistId] || {
        name: [],
        description: [],
        profileText: []
      };

      return {
        artistId,
        chatData: rowsToObjects(byTitle[tab]),
        artistName: meta.name,
        artistDescription: meta.description,
        profileText: meta.profileText
      };
    });
  } catch (e) {
    return [];
  }
};
