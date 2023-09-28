import { createContext, useContext, useEffect, useState } from 'react';
import getContentfulFromm from 'contentful/contentfulApi';

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
