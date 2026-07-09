/**
 * Report the total size of a Google Drive folder without downloading it
 * Usage: node scripts/driveFolderSize.mjs <folderUrlOrId> <apiKey>
 * The folder must be shared Anyone with the link for an api key to read it
 * The api key needs the Google Drive API enabled in its Cloud project
 */

const API = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

const arg = process.argv[2] || '';
const API_KEY = process.argv[3] || process.env.DRIVE_API_KEY || '';

// Pull the folder id from a share url or use the value as an id
const folderId = (() => {
  const m =
    arg.match(/folders\/([a-zA-Z0-9_-]+)/) ||
    arg.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : arg;
})();

if (!folderId || !API_KEY) {
  console.error(
    'Usage: node scripts/driveFolderSize.mjs <folderUrlOrId> <apiKey>'
  );
  process.exit(1);
}

// List every child of a folder, following pagination
const listChildren = async (id) => {
  const files = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      q: `'${id}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, size)',
      pageSize: '1000',
      key: API_KEY
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const res = await fetch(`${API}?${params}`);

    if (!res.ok) {
      throw new Error(`Drive API ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return files;
};

// Walk the tree summing file bytes
const walk = async (id) => {
  let total = 0;
  let count = 0;

  for (const f of await listChildren(id)) {
    if (f.mimeType === FOLDER_MIME) {
      const sub = await walk(f.id);
      total += sub.total;
      count += sub.count;
    } else {
      total += Number(f.size || 0);
      count += 1;
    }
  }

  return { total, count };
};

const human = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = bytes;
  let i = 0;

  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }

  return `${n.toFixed(2)} ${units[i]}`;
};

// Print a per subfolder breakdown then the grand total
const main = async () => {
  const top = await listChildren(folderId);
  let grand = 0;
  let grandCount = 0;

  for (const f of top) {
    if (f.mimeType === FOLDER_MIME) {
      const { total, count } = await walk(f.id);
      grand += total;
      grandCount += count;

      console.log(`${f.name}: ${human(total)} (${count} files)`);
    } else {
      grand += Number(f.size || 0);
      grandCount += 1;
    }
  }

  console.log('---');
  console.log(`TOTAL: ${human(grand)} (${grandCount} files)`);
};

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
