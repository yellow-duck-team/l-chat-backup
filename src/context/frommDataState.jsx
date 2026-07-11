import { createContext, useContext, useEffect, useState } from 'react';
import { loadFrommFromSheet } from 'lib/frommSheet';
import { r2Url } from 'lib/assetUrl';

// Shown when an artist has no profile or background image
const PLACEHOLDER_PROFILE = '/fromm/default_profile.png';
const PLACEHOLDER_BG = '/fromm/default_bg.jpg';

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
      loadFrommFromSheet()
        .then((res) => {
          // Profile and background have their own placeholder
          const placeholderFor = (type) =>
            type === 'background' ? PLACEHOLDER_BG : PLACEHOLDER_PROFILE;

          // R2 url for one image with the placeholder as the last fallback
          const chainFor = (artistId, type, img) =>
            [
              r2Url(
                `fromm/${artistId}/${type}/${img.filename}.${img.extension}`
              ),
              placeholderFor(type)
            ].filter(Boolean);

          // Current image is the latest one flagged current, else the placeholder
          const currentChain = (artistId, type, images) => {
            const flagged = images.filter((img) => img.current);
            const pick =
              flagged.length > 0 ? flagged[flagged.length - 1] : null;
            return pick
              ? chainFor(artistId, type, pick)
              : [placeholderFor(type)];
          };

          let profile = {};

          for (let i = 0; i < res.length; i++) {
            const artistData = res[i];
            const artistId = artistData.artistId;
            data[artistId] = artistData.chatData;

            const profileImages = artistData.profileImages || [];
            const backgroundImages = artistData.backgroundImages || [];

            profile[artistId] = {
              name: artistData.artistName,
              description: artistData.artistDescription,
              profileText: artistData.profileText,
              profile: profileImages.map((img) =>
                chainFor(artistId, 'profile', img)
              ),
              background: backgroundImages.map((img) =>
                chainFor(artistId, 'background', img)
              ),
              profileCurrent: currentChain(artistId, 'profile', profileImages),
              backgroundCurrent: currentChain(
                artistId,
                'background',
                backgroundImages
              )
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
