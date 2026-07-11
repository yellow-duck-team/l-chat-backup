import React, { useEffect, useState } from 'react';
import { useFrommDataContext } from 'context/frommDataState';
import CategorizeModal from 'Fromm/components/CategorizeModal';
import MobileLayout from 'components/MobileLayout';
import ImageMedia from 'components/ImageMedia';
import './ArtistListPage.css';

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
      <ImageMedia sources={artist.profile || []} width={200} alt="" />
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

  const [ArtistList, setArtistList] = useState([]);
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
          profile: value.profileCurrent
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
