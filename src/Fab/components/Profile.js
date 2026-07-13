import React, { useState } from 'react';
import { useFabDataContext } from 'context/fabDataState';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImageMedia from 'components/ImageMedia';
import './Profile.css';

function Profile(props) {
  const { fabProfile } = useFabDataContext();
  const [isLoading, setIsLoading] = useState(true);

  const sources = fabProfile[props.artistNum]?.profile || [];

  // Show loading spinner until profile image is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="profile">
      {isLoading && <LoadingSpinner />}
      <ImageMedia
        className={isLoading ? 'hidden' : ''}
        sources={sources}
        alt=""
        onLoad={onMediaLoad}
        onError={onMediaLoad}
      />
    </div>
  );
}

export default Profile;
