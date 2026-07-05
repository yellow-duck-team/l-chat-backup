// Load the Drive manifest from a public Google Sheet
// Each Tab Name: <service>-<artist>
// Each Tab Columns: filename, Drive ID

const SHEET = process.env.REACT_APP_SHEET_URL_MEDIA || '';
const API_KEY = process.env.REACT_APP_SHEETS_API_KEY || '';
const SERVICES = ['fromm', 'fab', 'vlive'];
const API = 'https://sheets.googleapis.com/v4/spreadsheets';

// Pull the spreadsheet id from a full url or a bare id
const sheetId = (value) => {
  const match = value.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : value;
};

// A tab is a manifest when it starts with a known service name
const isManifestTab = (title) =>
  SERVICES.some((s) => title.toLowerCase().startsWith(`${s}-`));

// Tab fromm-9 becomes the key prefix fromm/9
const prefixFor = (title) => {
  const i = title.indexOf('-');
  return `${title.slice(0, i)}/${title.slice(i + 1)}`;
};

// Fetch all manifest tabs and build the lowercase key to id map
export const loadDriveManifest = async () => {
  const id = sheetId(SHEET);

  if (!id || !API_KEY) {
    return {};
  }

  try {
    // List every tab title
    const metaUrl = `${API}/${id}?fields=sheets.properties.title&key=${API_KEY}`;
    const metaRes = await fetch(metaUrl);

    if (!metaRes.ok) {
      // Log Google's reason so auth sharing or quota issues are obvious
      const detail = await metaRes.text();
      console.warn('[drive] sheet request failed', metaRes.status, detail);
      return {};
    }

    const meta = await metaRes.json();
    const tabs = (meta.sheets || [])
      .map((s) => s.properties.title)
      .filter(isManifestTab);

    if (tabs.length === 0) {
      return {};
    }

    // Read all manifest tabs in one batch call
    const ranges = tabs
      .map((t) => `ranges=${encodeURIComponent(`'${t}'`)}`)
      .join('&');
    const valUrl = `${API}/${id}/values:batchGet?${ranges}&key=${API_KEY}`;
    const valRes = await fetch(valUrl);

    if (!valRes.ok) {
      return {};
    }

    const val = await valRes.json();

    // Build <service>/<artist>/<filename> to id, header rows skip themselves
    const manifest = {};
    (val.valueRanges || []).forEach((vr) => {
      const title = (vr.range || '').split('!')[0].replace(/^'|'$/g, '');
      const prefix = prefixFor(title);
      (vr.values || []).forEach((row) => {
        const file = row[0];
        const driveId = row[1];

        // A real row has a filename with an extension and an id
        if (file && driveId && file.includes('.')) {
          manifest[`${prefix}/${file}`.toLowerCase()] = driveId;
        }
      });
    });

    return manifest;
  } catch (e) {
    return {};
  }
};
