import React, { useEffect, useState } from 'react';
import ArtistInfo from 'assets/fromm/artist_info.json';
import CategorizeModal from 'Fromm/components/CategorizeModal';
import MobileLayout from 'components/MobileLayout';
import './ArtistListPage.css';
import { useFrommDataContext } from 'context/frommDataState';

// List of artists in fromm
const artistList = [];
for (const artist in ArtistInfo) {
  artistList.push({
    num: artist,
    profile: require(`assets/fromm/${artist}/profile/${ArtistInfo[artist].profile}.PNG`),
    ...ArtistInfo[artist]
  });
}

/**
 * Artist profile component
 * @param {Object} artist: artist information to display
 * @param {Function} showModal: function to display categorize modal
 * @returns Artist profile component
 */
function Artist({ artist, showModal }) {
  const onArtist = () => {
    showModal(artist.num);
  };

  return (
    <div className="fromm-artist" onClick={onArtist}>
      <img src={artist.profile} alt="" />
      <div className="from-artist-info flex-col">
        <p>{artist.name && artist.name.length > 0 && artist.name.slice(-1)}</p>
        {artist.description &&
          artist.description.length > 0 &&
          artist.description.slice(-1) && (
            <p className="description">{artist.description.slice(-1)}</p>
          )}
      </div>
    </div>
  );
}

/**
 * Artitst list page component
 * @returns Artist list page component
 */
function ArtistListPage() {
  const { profile } = useFrommDataContext();

  const [ArtistList, setArtistList] = useState(artistList);
  const [ArtistNum, setArtistNum] = useState(null);
  const [ShowModal, setShowModal] = useState(false);

  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      const artists = [];
      for (let [key, value] of Object.entries(profile)) {
        artists.push({
          num: key,
          name: value.name,
          description: value.description,
          profile: value.profile.slice(-1)
        });
      }
      setArtistList(artists);
    }
  }, [profile]);

  const showModal = (artistNum) => {
    if (artistNum === null) {
      setShowModal(false);
    } else {
      setArtistNum(artistNum);
      setShowModal(true);
    }
  };

  return (
    <MobileLayout className="mobile-header fromm" headerUrl="/">
      <div className="fromm-artist-list flex-col">
        <CategorizeModal
          artistNum={ArtistNum}
          showModal={showModal}
          isHidden={!ShowModal}
        />
        {ArtistList.map((artist, index) => (
          <Artist key={index} artist={artist} showModal={showModal} />
        ))}
      </div>
    </MobileLayout>
  );
}

export default ArtistListPage;
