import React from 'react';
import './Profile.css';
import { StarFilled } from '@ant-design/icons';
import profileImg from '../../assets/12/profile/0.jpg';

function Profile() {
    return (
        <div className="profile">
            {/* <div className="star"><StarFilled /></div> */}
            {/* <img src="/profile.png" /> */}
            <img src={profileImg} />
        </div>
    );
}

export default Profile;