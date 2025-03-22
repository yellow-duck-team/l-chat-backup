import { createClient } from 'contentful';

export const spaceId =
  process.env.REACT_APP_CONTENTFUL_SPACE_ID || 'cyr29zumd8p1';
export const accessToken =
  process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN ||
  'i18XiorSbzHjLF_ipn219K-WNp9QkDjY40W1I5oUfzM';

export const getContentfulFab = async (artistId = null) => {
  try {
    const contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken
    });

    if (contentfulClient) {
      let params = {
        include: 2,
        content_type: 'fab'
      };
      if (artistId === null) {
        params['fields.artistId'] = artistId;
      }
      // Request entries
      const entries = await contentfulClient.getEntries(params);
      // If entries exist
      if (entries && entries.total > 0) {
        const fabArtists = entries.items.map(({ fields }) => fields);
        return fabArtists;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getContentfulFromm = async (artistId = null) => {
  try {
    const contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken
    });

    if (contentfulClient) {
      let params = { content_type: 'fromm' };
      if (artistId === null) {
        params['fields.artistId'] = artistId;
        params.include = 1;
      }
      // const one = await contentfulClient.getAssets();
      // console.log(one);
      // Request entries
      const entries = await contentfulClient.getEntries(params);
      // If entries exist
      if (entries && entries.total > 0) {
        const frommArtists = entries.items.map(({ fields }) => fields);
        return frommArtists;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getContentfulMedia = async (mediaId = null) => {
  try {
    const contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken
    });

    if (contentfulClient) {
      let params = { id: mediaId };
      if (mediaId === null) {
        const one = await contentfulClient.getAssets();
        console.log(one);
        // params['fields.artistId'] = artistId;
        // params.include = 1;
      }
      // Request entries
      const entries = await contentfulClient.getEntry(mediaId);
      // const entries2 = await contentfulClient.getEntries(params);
      console.log(entries);
      return entries;
      // console.log(entries2);
      // // If entries exist
      // if (entries && entries.total > 0) {
      //   const frommArtists = entries.items.map(({ fields }) => fields);
      //   return frommArtists;
      // }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default getContentfulMedia;
