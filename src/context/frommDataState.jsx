import { createContext, useContext, useEffect, useState } from 'react';
import { getFrommPromise } from 'api/getData';
import frommArtists from 'assets/fromm/artist_info.json';

const initialState = {
  frommData: [],
  setFrommData: () => {}
};

export const FrommDataContext = createContext(initialState);

export function FrommDataProvider({ children }) {
  const [frommData, setFrommData] = useState(null);

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

  return (
    <FrommDataContext.Provider value={{ frommData, setFrommData }}>
      {children}
    </FrommDataContext.Provider>
  );
}

export function useFrommDataContext() {
  return useContext(FrommDataContext);
}
