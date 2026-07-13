// Public R2 url for a key - R2 serves by path so the key is the url
const R2_BASE = (process.env.REACT_APP_R2_BASE || '').replace(/\/+$/, '');
export const r2Url = (key) => (R2_BASE && key ? `${R2_BASE}/${key}` : null);
