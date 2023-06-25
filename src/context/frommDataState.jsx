import { createContext, useContext, useEffect, useState } from 'react';
import { getFrommPromise } from 'api/getData';
import frommArtists from 'assets/fromm/artist_info.json';

const initialState = {
  frommData: [],
  setFrommData: () => {},
  onOpenMedia: () => {},
  media: null,
  openMedia: false
};

export const FrommDataContext = createContext(initialState);

export function FrommDataProvider({ children }) {
  const [frommData, setFrommData] = useState(null);
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    // Create a controller
    const controller = new AbortController();
    // Get Fromm Data
    let data = {};
    for (const artist in frommArtists) {
      getFrommPromise(artist).then((res) => {
        const fromm = JSON.parse(JSON.stringify(res));
        if (fromm && fromm.length > 0) {
          data[artist] = fromm;
        }
      });
    }
    setFrommData(data);
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
    <FrommDataContext.Provider
      value={{ frommData, setFrommData, media, openMedia, onOpenMedia }}
    >
      {children}
    </FrommDataContext.Provider>
  );
}

export function useFrommDataContext() {
  return useContext(FrommDataContext);
}
