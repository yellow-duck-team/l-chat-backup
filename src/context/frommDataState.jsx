import { createContext, useContext, useEffect, useState } from 'react';
import getContentfulFromm from 'contentful/contentfulApi';
import { loadDriveManifest } from 'lib/driveSheet';
import { imageUrl } from 'lib/driveAsset';

// Zero pad an index to two digits like 00 01
const pad = (n) => String(n).padStart(2, '0');

// Extension from a url like file.png
const extOf = (url) => url.split('?')[0].split('.').pop();

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
    // Create a controller
    const controller = new AbortController();
    // Get Fromm Data
    let data = {};
    try {
      Promise.all([getContentfulFromm(), loadDriveManifest()])
        .then(([res, manifest]) => {
          // Drive url from a key or the Contentful url when not migrated
          const resolve = (key, cf) =>
            imageUrl(manifest[key.toLowerCase()]) || cf;
          let profile = {};

          for (let i = 0; i < res.length; i++) {
            const artistData = res[i];
            const artistId = artistData.artistId;
            data[artistId] = artistData.chatData;

            // Profile and background images
            const profileImage = [];
            const backgroundImage = [];

            for (let j = 0; j < res[i].profileImage.length; j++) {
              const cf = `https:${res[i].profileImage[j].fields.media.fields.file.url}`;
              const key = `fromm/${artistId}/profile/${pad(j)}.${extOf(cf)}`;
              profileImage.push(resolve(key, cf));
            }

            for (let j = 0; j < res[i].backgroundImage.length; j++) {
              const cf = `https:${res[i].backgroundImage[j].fields.media.fields.file.url}`;
              const key = `fromm/${artistId}/background/${pad(j)}.${extOf(cf)}`;
              backgroundImage.push(resolve(key, cf));
            }

            profile[artistId] = {
              name: res[i].artistName,
              description: res[i].artistDescription,
              profileText: res[i].profileText,
              profile: profileImage,
              background: backgroundImage
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
