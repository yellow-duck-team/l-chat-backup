import { createContext, useContext, useEffect, useState } from 'react';
import { getFrommPromise } from 'api/getData';
import frommArtists from 'assets/fromm/artist_info.json';
import getContentfulFromm from 'contentful/contentfulApi';

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
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    // Create a controller
    const controller = new AbortController();
    // Get Fromm Data
    let data = {};
    try {
      getContentfulFromm().then((res) => {
        let profile = {};
        for (let i = 0; i < res.length; i++) {
          const artistData = res[i];
          data[artistData.artistId] = artistData.chatData;
          // Profile and background images
          const profileImage = [];
          const backgroundImage = [];
          for (let j = 0; j < res[i].profileImage.length; j++) {
            profileImage.push(
              `https:${res[i].profileImage[j].fields.media.fields.file.url}`
            );
          }
          for (let j = 0; j < res[i].backgroundImage.length; j++) {
            backgroundImage.push(
              `https:${res[i].backgroundImage[j].fields.media.fields.file.url}`
            );
          }
          profile[artistData.artistId] = {
            name: res[i].artistName,
            description: res[i].artistDescription,
            profileText: res[i].profileText,
            profile: profileImage,
            background: backgroundImage
          };
        }
        console.log('-');
        setFrommData(data);
        setProfile(profile);
      });
    } catch (e) {
      for (const artist in frommArtists) {
        getFrommPromise(artist).then((res) => {
          const fromm = JSON.parse(JSON.stringify(res));
          if (fromm && fromm.length > 0) {
            data[artist] = fromm;
          }
        });
      }
      setFrommData(data);
    }
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
      value={{
        frommData,
        setFrommData,
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
