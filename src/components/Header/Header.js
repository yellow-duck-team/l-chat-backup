import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';
import HeaderModal from './HeaderModal';

/**
 * App header component
 * @param {string} url: url to navigate when the left button is clicked
 * @param {} moreButtonAction
 * @returns App header component
 */
function Header({ url, moreButtonAction }) {
  const navigate = useNavigate();

  const [IsModalHidden, setIsModalHidden] = useState(true);

  const onNavigate = () => {
    navigate(url);
  };

  const onMoreButton = () => {
    setIsModalHidden(!IsModalHidden);
  };

  const showModal = (artistNum) => {
    if (artistNum === null) {
      setIsModalHidden(true);
    } else {
      setIsModalHidden(false);
    }
  };

  return (
    <div className="header flex-row">
      <div className="top-icon">
        <ArrowLeftOutlined onClick={onNavigate} />
      </div>
      {moreButtonAction && !IsModalHidden && (
        <HeaderModal actions={moreButtonAction} showModal={showModal} />
      )}
      {moreButtonAction ? (
        <div className="top-icon active" onClick={onMoreButton}>
          <MoreOutlined />
        </div>
      ) : (
        <div className="top-icon">
          <MoreOutlined />
        </div>
      )}
    </div>
  );
}

export default Header;
