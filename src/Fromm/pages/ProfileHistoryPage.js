import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ArtistInfo from 'assets/fromm/artist_info.json';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import './ProfileHistoryPage.css';
import { useFrommDataContext } from 'context/frommDataState';
import MediaSlide from 'components/MediaSlide/MediaSlide';

// List of artists in fromm
const artistList = [];
for (const artist in ArtistInfo) {
  artistList.push({ num: artist, ...ArtistInfo[artist] });
}

function ProfileText({ name, description }) {
  return (
    <div>
      <p className="profile-name flex-center">{name}</p>
      <p className="profile-description flex-row">{description}</p>
    </div>
  );
}

function ProfileMediaList({ artistNum, type, mediaNum }) {
  const { onOpenMedia } = useFrommDataContext();
  let fetchedMedia = 0;

  const [MediaList, setMediaList] = useState(null);
  const [FetchedMedia, setFetchedMedia] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const onMediaLoad = () => {
    setFetchedMedia(fetchedMedia + 1);
    fetchedMedia++;
  };

  useEffect(() => {
    if (!artistNum || !type || mediaNum === undefined || mediaNum === null)
      return;
    let i = 0;
    const images = [];
    while (i < mediaNum + 1) {
      const imgPath = `assets/fromm/${artistNum}/${type}/${
        i < 10 ? `0${i}` : `${i}`
      }.PNG`;
      const image = require(`assets/fromm/${artistNum}/${type}/${
        i < 10 ? `0${i}` : `${i}`
      }.PNG`);
      images.push(
        <div
          key={`profile-history-image-${type}-${i}`}
          className={`profile-img ${isLoading && 'hidden'}`}
        >
          <img
            src={image}
            alt=""
            onLoad={onMediaLoad}
            onClick={() => onOpenMedia(true, image, imgPath, null, null)}
          />
        </div>
      );
      i++;
    }
    setMediaList(images);
  }, [artistNum, type, mediaNum, isLoading]);

  useEffect(() => {
    if (
      !artistNum ||
      !type ||
      mediaNum === undefined ||
      mediaNum === null ||
      !isLoading ||
      !MediaList
    )
      return;
    setIsLoading(FetchedMedia !== MediaList.length);
  }, [artistNum, type, mediaNum, MediaList, FetchedMedia]);

  return (
    <div className="profile-img-list">
      {isLoading && <LoadingSpinner />}
      {MediaList}
    </div>
  );
}

/**
 * Artitst list page component
 * @returns Artist list page component
 */
function ProfileHistoryPage() {
  const { media, openMedia, onOpenMedia } = useFrommDataContext();
  const location = useLocation();

  const [Artist, setArtist] = useState(null);
  const [Media, setMedia] = useState(null);
  const [OpenMedia, setOpenMedia] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

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
                Artist.profileText
                  .toReversed()
                  .map((a, index) => (
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
              <ProfileMediaList
                artistNum={Artist.num}
                type="profile"
                mediaNum={Artist?.profile ? Number(Artist.profile) : -1}
              />
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
              <ProfileMediaList
                artistNum={Artist.num}
                type="background"
                mediaNum={Artist?.background ? Number(Artist.background) : -1}
              />
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default ProfileHistoryPage;
