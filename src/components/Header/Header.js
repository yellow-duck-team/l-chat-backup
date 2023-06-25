import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';

/**
 * App header component
 * @param {string} url: url to navigate when the left button is clicked
 * @returns App header component
 */
function Header({ url }) {
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(url);
  };

  return (
    <div className="header flex-row">
      <div className="top-icon">
        <ArrowLeftOutlined onClick={onNavigate} />
      </div>
      <div className="top-icon">
        <MoreOutlined />
      </div>
    </div>
  );
}

export default Header;
