import { createContext, useContext, useEffect, useState } from 'react';
import { loadFabFromSheet } from 'lib/fabSheet';
import { fabSources } from 'lib/fabMedia';

const initialState = {
  fabData: [],
  setFabData: () => {},
  onOpenMedia: () => {},
  media: null,
  openMedia: false
};

export const FabDataContext = createContext(initialState);

export function FabDataProvider({ children }) {
  const [fabData, setFabData] = useState(null);
  const [fabProfile, setFabProfile] = useState({});
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    loadFabFromSheet()
      .then(({ chat, profile }) => {
        setFabData(chat);

        // Current profile and bg sources per artist, 0.jpg as fallback
        const sourcesFor = (artist, folder, info) =>
          info
            ? fabSources(
                `${artist}/${folder}/${info.filename}.${info.extension}`
              )
            : fabSources(`${artist}/${folder}/0.jpg`);

        const built = {};
        for (const artist in chat) {
          const info = profile[artist] || {};
          built[artist] = {
            profile: sourcesFor(artist, 'profile', info.profile),
            background: sourcesFor(artist, 'bg', info.bg)
          };
        }
        setFabProfile(built);
      })
      .catch(() => {
        setFabData({});
        setFabProfile({});
      });

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
    <FabDataContext.Provider
      value={{
        fabData,
        setFabData,
        fabProfile,
        media,
        openMedia,
        onOpenMedia
      }}
    >
      {children}
    </FabDataContext.Provider>
  );
}

export function useFabDataContext() {
  return useContext(FabDataContext);
}
