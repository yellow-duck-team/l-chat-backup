import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFrommDataContext } from 'context/frommDataState';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImageMedia from 'components/ImageMedia';
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
        profile: artist.profileCurrent,
        background: artist.backgroundCurrent
      });
      setIsFetching(false);
    }
  }, [location.pathname, profile]);

  const onMediaLoad = () => {
    setIsProfileLoading(false);
  };

  const onButton = () => {
    navigate(`/fromm/profile/${Artist.num}/history`);
  };

  // Background loads on its own so the profile and button do not wait for it
  const isLoading = isFetching || isProfileLoading;

  return (
    <MobileLayout className="mobile-header fromm" headerUrl="/fromm">
      <div className="profile-page">
        {isLoading && <LoadingSpinner />}
        <div className={`profile-front ${isLoading && 'hidden'}`}>
          {Artist && (
            <div className="profile flex-col">
              <ImageMedia
                sources={Artist.profile || []}
                width={600}
                alt=""
                className="profile-img"
                onLoad={onMediaLoad}
                onError={onMediaLoad}
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
          <ImageMedia
            sources={Artist.background || []}
            width={800}
            alt=""
            className="bg-img"
          />
        )}
      </div>
    </MobileLayout>
  );
}

export default ProfilePage;
