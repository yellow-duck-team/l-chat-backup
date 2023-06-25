import { createContext, useContext, useEffect, useState } from 'react';
import { getVlivePromise } from 'api/getData';

const initialState = {
  vliveData: [],
  setVliveData: () => {}
};

export const VliveDataContext = createContext(initialState);

export function VliveDataProvider({ children }) {
  const [vliveData, setVliveData] = useState([]);

  useEffect(() => {
    // Create a controller
    const controller = new AbortController();
    // Get vlive data
    getVlivePromise().then((res) => {
      if (res && res.length > 0) setVliveData(res);
    });
    // Aborts the request when the component umounts
    return () => controller?.abort();
  }, []);

  return (
    <VliveDataContext.Provider value={{ vliveData, setVliveData }}>
      {children}
    </VliveDataContext.Provider>
  );
}

export function useVliveDataContext() {
  return useContext(VliveDataContext);
}
