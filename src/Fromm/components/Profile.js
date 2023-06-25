import React, { useEffect, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import '../pages/ChatPage.css';

/**
 * Profile image component for Fromm chat bubble.
 * @param {number} artistNum
 * @param {number} imgNum
 * @returns Profile image component
 */
function Profile({ artistNum, imgNum }) {
  const [ProfileImg, setProfileImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artistNum || !imgNum) return;
    const profileImg = require(`assets/fromm/${artistNum}/profile/${imgNum}.PNG`);
    setProfileImg(profileImg);
  }, [artistNum, imgNum]);

  // Show loading spinner until profile image is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="profile select-none">
      {isLoading && <LoadingSpinner />}
      <img
        className={isLoading ? 'hidden' : ''}
        src={ProfileImg}
        alt=""
        onLoad={onMediaLoad}
      />
    </div>
  );
}

export default Profile;
