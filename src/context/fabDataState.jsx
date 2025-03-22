import { createContext, useContext, useEffect, useState } from 'react';
import { getFabPromise } from 'api/getData';
import fabArtists from 'assets/fab/artist_info.json';
import { getContentfulFab } from 'contentful/contentfulApi';

const initialState = {
  fabData: [],
  setFabData: () => {},
  fabMediaData: [],
  onOpenMedia: () => {},
  media: null,
  openMedia: false
};

export const FabDataContext = createContext(initialState);

export function FabDataProvider({ children }) {
  const [fabData, setFabData] = useState(null);
  const [fabMediaData, setFabMediaData] = useState([]);
  const [media, setMedia] = useState(null);
  const [openMedia, setOpenMedia] = useState(false);

  // Text data load
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

  // useEffect(() => {
  //   const media = require(`../assets/fab/fabData.json`);
  //   setFabMediaData(media);
  // }, []);

  // Contentful load
  useEffect(() => {
    // Create a controller
    const controller = new AbortController();
    // Get Fromm Data
    let data = {};
    try {
      getContentfulFab().then((res) => {
        for (let i = 0; i < res.length; i++) {
          const artistData = res[i];
          // Profile and message images
          const profileImage = [];
          const messageImage = {};
          for (let j = 0; j < res[i].profileImage.length; j++) {
            const url = res[i].profileImage[j].fields.media.fields.file.url;
            profileImage.push(`https:${url}`);
          }
          for (let j = 0; j < res[i].messages.length; j++) {
            const msgImg = [];
            const msgData = res[i].messages[j].fields;
            for (let k = 0; k < msgData.messageMedia.length; k++) {
              const url = msgData.messageMedia[k].fields.media.fields.file.url;
              msgImg.push(`https:${url}`);
            }
            messageImage[msgData.messageId] = msgImg;
          }
          data[artistData.artistId] = {
            profile: profileImage,
            messageImage: messageImage,
            ...artistData
          };
        }
        console.log('-');
        setFabMediaData(data);
      });
    } catch (e) {
      setFabMediaData([]);
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
    <FabDataContext.Provider
      value={{
        fabData,
        setFabData,
        fabMediaData,
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
