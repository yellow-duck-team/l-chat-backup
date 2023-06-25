import React, { useEffect, useState } from 'react';
import './Profile.css';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

function Profile(props) {
  const [ProfileImg, setProfileImg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.artistNum) {
      const profileImg = require(`assets/fab/${props.artistNum}/profile/0.jpg`);
      setProfileImg(profileImg);
    }
  }, [props]);

  // Show loading spinner until profile image is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="profile">
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
