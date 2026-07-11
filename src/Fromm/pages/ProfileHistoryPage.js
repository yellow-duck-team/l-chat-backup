import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFrommDataContext } from 'context/frommDataState';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import MediaSlide from 'components/MediaSlide/MediaSlide';
import ImageMedia from 'components/ImageMedia';
import './ProfileHistoryPage.css';

function ProfileText({ name, description }) {
  return (
    <div>
      <p className="profile-name flex-center">{name}</p>
      <p className="profile-description flex-row">{description}</p>
    </div>
  );
}

function ProfileMediaList({ type, media }) {
  const { onOpenMedia } = useFrommDataContext();

  if (!media || media.length === 0) {
    return null;
  }

  // Lazy load images
  return (
    <div className="profile-img-list">
      {media.map((sources, i) => (
        <div key={`profile-history-image-${type}-${i}`} className="profile-img">
          <ImageMedia
            sources={sources}
            width={400}
            loading="lazy"
            alt=""
            onClick={() => onOpenMedia(true, sources, null, null)}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Artitst list page component
 * @returns Artist list page component
 */
function ProfileHistoryPage() {
  const { profile, media, openMedia, onOpenMedia } = useFrommDataContext();
  const location = useLocation();

  const [Artist, setArtist] = useState(null);
  const [Media, setMedia] = useState(null);
  const [OpenMedia, setOpenMedia] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isFetching) return;
    if (!location.pathname) return;
    const artistNum = location.pathname.split('/')[3];
    if (profile && profile[artistNum]) {
      const artist = profile[artistNum];
      setArtist({
        num: artistNum,
        name: artist.name,
        description: artist.description,
        profileText: artist.profileText.toReversed(),
        profile: artist.profile,
        background: artist.background
      });
      setIsFetching(false);
    }
  }, [location.pathname, profile]);

  useEffect(() => {
    setMedia(media);
    setOpenMedia(openMedia);
  }, [media, openMedia]);

  return (
    <MobileLayout
      className="mobile-header profile-media fromm"
      headerUrl={Artist ? `/fromm/profile/${Artist.num}` : '/fromm'}
    >
      {OpenMedia && Media && onOpenMedia && (
        <MediaSlide openMedia={() => onOpenMedia()} media={Media} />
      )}
      <div className="profile-history">
        <div className="profile-block profile-text">
          <div className="profile-header">
            <h1>한 줄 소개</h1>
          </div>
          <div className="profile-body">
            {(isFetching || !Artist) && <LoadingSpinner />}
            <div
              className={`profile-text-list flex-col ${isFetching && 'hidden'}`}
            >
              {Artist?.profileText?.length > 0 &&
                Artist.profileText.map((a, index) => (
                  <ProfileText
                    key={`profile-history-text-${index}`}
                    name={Artist.name[a.name]}
                    description={Artist.description[a.description]}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="profile-block profile-profile">
          <div className="profile-header">
            <h1>프로필 사진</h1>
          </div>
          <div className="profile-body">
            {isFetching || !Artist?.num || !Artist.profile ? (
              <LoadingSpinner />
            ) : (
              <ProfileMediaList type="profile" media={Artist.profile} />
            )}
          </div>
        </div>
        <div className="profile-block profile-bg">
          <div className="profile-header">
            <h1>배경화면</h1>
          </div>
          <div className="profile-body">
            {isFetching || !Artist?.num || !Artist.background ? (
              <LoadingSpinner />
            ) : (
              <ProfileMediaList type="background" media={Artist.background} />
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default ProfileHistoryPage;
