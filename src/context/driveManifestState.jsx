import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadDriveManifest } from 'lib/driveSheet';
import { imageUrl, previewUrl, downloadUrl } from 'lib/assetUrl';

const DriveManifestContext = createContext({});

export function DriveManifestProvider({ children }) {
  const [manifest, setManifest] = useState({});

  useEffect(() => {
    // Fetch the sheet once on startup
    let active = true;

    loadDriveManifest().then((m) => {
      if (active) setManifest(m);
    });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => {
    // Look up the Drive id for a manifest key
    const idFor = (key) => (key ? manifest[key.toLowerCase()] : null) || null;

    return {
      driveImageUrl: (key, width) => imageUrl(idFor(key), width),
      drivePreviewUrl: (key) => previewUrl(idFor(key)),
      driveDownloadUrl: (key) => downloadUrl(idFor(key))
    };
  }, [manifest]);

  return (
    <DriveManifestContext.Provider value={value}>
      {children}
    </DriveManifestContext.Provider>
  );
}

export function useDriveManifest() {
  return useContext(DriveManifestContext);
}
