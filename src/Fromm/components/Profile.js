import React, { useEffect, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImageMedia from 'components/ImageMedia';
import { useFrommDataContext } from 'context/frommDataState';
import '../pages/ChatPage.css';

/**
 * Profile image component for Fromm chat bubble.
 * @param {number} artistNum
 * @param {string} imgNum
 * @returns Profile image component
 */
function Profile({ artistNum, imgNum }) {
  const { profile } = useFrommDataContext();

  const [ProfileImg, setProfileImg] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artistNum || !imgNum) return;
    if (profile && profile[artistNum] && profile[artistNum].profile) {
      setProfileImg(profile[artistNum].profile[Number(imgNum)]);
      setIsFetching(false);
    }
  }, [artistNum, imgNum, profile]);

  // Show loading spinner until profile image is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="profile select-none">
      {(isFetching || isLoading) && <LoadingSpinner />}
      <ImageMedia
        className={isLoading ? 'hidden' : ''}
        sources={ProfileImg || []}
        width={200}
        alt=""
        onLoad={onMediaLoad}
        onError={onMediaLoad}
      />
    </div>
  );
}

export default Profile;
