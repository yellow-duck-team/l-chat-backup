import { createContext, useContext, useEffect, useState } from 'react';
import { getFabPromise } from 'api/getData';
import fabArtists from 'assets/fab/artist_info.json';

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
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    // Create a controller
    const controller = new AbortController();
    // Get Fab Data
    let data = {};
    for (const artist in fabArtists) {
      getFabPromise(artist).then((res) => {
        const fab = JSON.parse(JSON.stringify(res));
        if (fab && fab.length > 0) {
          data[artist] = fab;
        }
      });
    }
    setFabData(data);
    // Aborts the request when the component umounts
    return () => controller?.abort();
  }, []);

  const onOpenMedia = (open, m, path, currImg, imgCount) => {
    if (open && path && path !== '') {
      setMedia({ media: m, path, currImg, imgCount });
    } else {
      setMedia(null);
    }
    setOpenMedia(open);
  };

  return (
    <FabDataContext.Provider
      value={{ fabData, setFabData, media, openMedia, onOpenMedia }}
    >
      {children}
    </FabDataContext.Provider>
  );
}

export function useFabDataContext() {
  return useContext(FabDataContext);
}
