import { createContext, useContext, useEffect, useState } from 'react';
import { getFabPromise } from 'api/getData';
import fabArtists from 'assets/fab/artist_info.json';

const initialState = {
  fabData: [],
  setFabData: () => {}
};

export const FabDataContext = createContext(initialState);

export function FabDataProvider({ children }) {
  const [fabData, setFabData] = useState(null);

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

  return (
    <FabDataContext.Provider value={{ fabData, setFabData }}>
      {children}
    </FabDataContext.Provider>
  );
}

export function useFabDataContext() {
  return useContext(FabDataContext);
}
