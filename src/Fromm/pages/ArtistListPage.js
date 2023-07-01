import React, { useState } from 'react';
import ArtistInfo from 'assets/fromm/artist_info.json';
import CategorizeModal from 'Fromm/components/CategorizeModal';
import MobileLayout from 'components/MobileLayout';
import './ArtistListPage.css';

// List of artists in fromm
const artistList = [];
for (const artist in ArtistInfo) {
  artistList.push({ num: artist, ...ArtistInfo[artist] });
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
      <img
        src={require(`assets/fromm/${artist.num}/profile/${artist.profile}.PNG`)}
        alt=""
      />
      <div className="from-artist-info flex-col">
        <p>{artist.name}</p>
        {artist.description && artist.description.length > 0 && artist.description.slice(-1) && (
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
  const [ArtistNum, setArtistNum] = useState(null);
  const [ShowModal, setShowModal] = useState(false);

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
        {artistList.map((artist, index) => (
          <Artist key={index} artist={artist} showModal={showModal} />
        ))}
      </div>
    </MobileLayout>
  );
}

export default ArtistListPage;
