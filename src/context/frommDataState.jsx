import { createContext, useContext, useEffect, useState } from 'react';
import { loadFrommFromSheet } from 'lib/frommSheet';
import { loadDriveManifest } from 'lib/driveSheet';
import { imageUrl, r2Url } from 'lib/driveAsset';

const initialState = {
  frommData: [],
  onOpenMedia: () => {},
  media: null,
  openMedia: false
};

export const FrommDataContext = createContext(initialState);

export function FrommDataProvider({ children }) {
  const [frommData, setFrommData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let data = {};

    try {
      Promise.all([loadFrommFromSheet(), loadDriveManifest()])
        .then(([res, manifest]) => {
          // Get source in order: R2 -> Drive -> Contentful
          const imagesFor = (artistId, folder) => {
            const prefix = `fromm/${artistId}/${folder}/`.toLowerCase();

            return Object.keys(manifest)
              .filter((k) => k.startsWith(prefix))
              .sort()
              .map((k) => {
                // R2 path is the key itself - try the extension as is and uppercased
                const upper = k.replace(/\.[^.]+$/, (m) => m.toUpperCase());
                const r2 = [...new Set([k, upper])].map(r2Url);
                return [...r2, imageUrl(manifest[k])].filter(Boolean);
              });
          };

          let profile = {};

          for (let i = 0; i < res.length; i++) {
            const artistData = res[i];
            const artistId = artistData.artistId;
            data[artistId] = artistData.chatData;

            profile[artistId] = {
              name: artistData.artistName,
              description: artistData.artistDescription,
              profileText: artistData.profileText,
              profile: imagesFor(artistId, 'profile'),
              background: imagesFor(artistId, 'background')
            };
          }

          setFrommData(data);
          setProfile(profile);
        })
        .catch(() => setFrommData([]));
    } catch (e) {
      setFrommData([]);
    }

    // Aborts the request when the component umounts
    return () => controller?.abort();
  }, []);

  const onOpenMedia = (open, m, currImg, imgCount) => {
    if (open && m) {
      setMedia({ media: m, currImg, imgCount });
    } else {
      setMedia(null);
    }
    setOpenMedia(open);
  };

  return (
    <FrommDataContext.Provider
      value={{
        frommData,
        profile,
        media,
        openMedia,
        onOpenMedia
      }}
    >
      {children}
    </FrommDataContext.Provider>
  );
}

export function useFrommDataContext() {
  return useContext(FrommDataContext);
}
