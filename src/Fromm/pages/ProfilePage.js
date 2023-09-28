import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useFrommDataContext } from 'context/frommDataState';
import './ProfilePage.css';

/**
 * Artitst list page component
 * @returns Artist list page component
 */
function ProfilePage() {
  const { profile } = useFrommDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [Artist, setArtist] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isBgLoading, setIsBgLoading] = useState(true);

  useEffect(() => {
    if (!isFetching) return;
    if (!location.pathname) return;
    const artistNum = location.pathname.split('/')[3];
    if (profile && profile[artistNum]) {
      const artist = profile[artistNum];
      setArtist({
        num: artistNum,
        name: artist.name.slice(-1),
        description: artist.description.slice(-1),
        profile: artist.profile.slice(-1),
        background: artist.background.slice(-1)
      });
      setIsFetching(false);
    }
  }, [location.pathname, profile]);

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
                src={Artist.profile}
                alt=""
                className="profile-img"
                onLoad={() => onMediaLoad(0)}
              />
              <p className="profile-name">{Artist.name}</p>
              <p className="profile-description">{Artist.description}</p>
            </div>
          )}
          <div className="profile-button flex-center" onClick={onButton}>
            과거 프로필 보기
          </div>
        </div>
        {Artist && (
          <img
            src={Artist.background}
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
