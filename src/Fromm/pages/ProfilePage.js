import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtistInfo from 'assets/fromm/artist_info.json';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import './ProfilePage.css';

// List of artists in fromm
const artistList = [];
for (const artist in ArtistInfo) {
  artistList.push({ num: artist, ...ArtistInfo[artist] });
}

/**
 * Artitst list page component
 * @returns Artist list page component
 */
function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [Artist, setArtist] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isBgLoading, setIsBgLoading] = useState(true);

  useEffect(() => {
    if (!location.pathname) return;
    const artistNum = location.pathname.split('/')[3];
    for (let i = 0; i < artistList.length; i++) {
      if (artistList[i].num === artistNum) {
        setArtist(artistList[i]);
      }
    }
    setIsFetching(false);
  }, [location.pathname]);

  const onMediaLoad = (type) => {
    if (type === 0) setIsProfileLoading(false);
    if (type === 1) setIsBgLoading(false);
  };

  const onButton = () => {
    navigate(`/fromm/profile/${Artist.num}/history`);
  };

  const isLoading = isFetching || isProfileLoading || isBgLoading;

  return (
    <MobileLayout className="mobile-header fromm" headerUrl="/fromm">
      <div className="profile-page">
        {isLoading && <LoadingSpinner />}
        <div className={`profile-front ${isLoading && 'hidden'}`}>
          {Artist && (
            <div className="profile flex-col">
              <img
                src={require(`assets/fromm/${Artist.num}/profile/${Artist.profile}.PNG`)}
                alt=""
                className="profile-img"
                onLoad={() => onMediaLoad(0)}
              />
              <p className="profile-name">{Artist.name.slice(-1)}</p>
              <p className="profile-description">
                {Artist.description.slice(-1)}
              </p>
            </div>
          )}
          <div className="profile-button flex-center" onClick={onButton}>
            과거 프로필 보기
          </div>
        </div>
        {Artist && (
          <img
            src={require(`assets/fromm/${Artist.num}/background/${Artist.background}.PNG`)}
            alt=""
            className="bg-img"
            onLoad={() => onMediaLoad(1)}
          />
        )}
      </div>
    </MobileLayout>
  );
}

export default ProfilePage;
