import { createClient } from 'contentful';

export const spaceId =
  process.env.REACT_APP_CONTENTFUL_SPACE_ID || 'cyr29zumd8p1';
export const accessToken =
  process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN ||
  'i18XiorSbzHjLF_ipn219K-WNp9QkDjY40W1I5oUfzM';

const getContentfulFromm = async (artistId = null) => {
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

export default getContentfulFromm;
