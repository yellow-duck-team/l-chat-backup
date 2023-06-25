import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import './HomePage.css';

const platforms = [
  { name: 'vlive', icon: require('assets/logo_vlive.png') },
  { name: 'fab', icon: require('assets/logo_fab.png') },
  { name: 'fromm', icon: require('assets/logo_fromm.png') }
];

/**
 * Home page where users can select the platform.
 * @returns Home page component
 */
function HomePage() {
  const navigate = useNavigate();

  const onPlatform = (platform) => {
    navigate(`/${platform}`);
  };

  return (
    <MobileLayout className="flex-col select-none" isHeader={false}>
      {platforms.map((platform, index) => (
        <div
          key={`platform-logo-${index}`}
          className="platform-logo flex-center"
          onClick={() => onPlatform(platform.name)}
        >
          <div className="flex-center">
            <img src={platform.icon} alt="" />
          </div>
        </div>
      ))}
    </MobileLayout>
  );
}

export default HomePage;
