import { r2Url } from 'lib/assetUrl';

// Source Priority: R2 -> bundled file
const bundled = require.context('../assets/fab', true, /\.(jpe?g|mp4|m4a)$/i);

const local = (path) => {
  try {
    return bundled(`./${path}`);
  } catch (e) {
    return null;
  }
};

// Source Priority: R2 -> bundled file
export const fabSources = (path) =>
  [r2Url(`fab/${path}`), local(path)].filter(Boolean);
