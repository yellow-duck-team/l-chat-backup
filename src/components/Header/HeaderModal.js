import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import DateInput from 'components/DateInput/DateInput';

/**
 * App header modal component
 * @param {string} actions: actions for each menu
 * @param {Function} showModal
 * @returns App header modal component
 */
function HeaderModal({ actions, showModal }) {
  const navigate = useNavigate();

  const [ShowDateInput, setShowDateInput] = useState(false);

  const onCloseModal = () => {
    showModal(null);
    setShowDateInput(false);
  };

  const onAction = (e, action) => {
    // Prevent bubbling
    e.preventDefault();
    e.stopPropagation();
    // Action
    if (action.action === 'navigate') {
      if (action.url) navigate(action.url);
    } else if (action.action === 'dateSelect') {
      setShowDateInput(true);
      // if (action.url) return;
    }
  };

  return (
    <div className="header-modal-bg flex-center" onClick={onCloseModal}>
      <div className="header-modal flex-col">
        {actions &&
          actions.length > 0 &&
          (ShowDateInput ? (
            <div
              className="header-modal-btn flex-col"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DateInput />
              <button>이동</button>
            </div>
          ) : (
            actions.map((action, index) => (
              <div
                key={`header-modal-${index}`}
                className="header-modal-btn flex-center"
                onClick={(e) => onAction(e, action)}
              >
                {action.text}
              </div>
            ))
          ))}
      </div>
    </div>
  );
}

export default HeaderModal;
