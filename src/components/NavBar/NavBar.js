import React from 'react';
import { useNavigate } from 'react-router';
import './NavBar.css';

const platforms = [
  { name: 'vlive', text: 'Loona+' },
  { name: 'fab', text: 'Fab' },
  { name: 'fromm', text: 'Fromm' }
];

/**
 * Navigation bar between platform options.
 * @returns Navigation bar component
 */
function NavBar() {
  const navigate = useNavigate();

  const onPlatform = (platform) => {
    navigate(`/${platform}`);
  };

  return (
    <div className="navbar flex-row select-none">
      {platforms.map((platform, index) => (
        <div
          key={`nav-${index}`}
          className={`navbar-menu flex-center menu-${platform.name}`}
          onClick={() => onPlatform(platform.name)}
        >
          <h3>{platform.text}</h3>
        </div>
      ))}
    </div>
  );
}

export default NavBar;
