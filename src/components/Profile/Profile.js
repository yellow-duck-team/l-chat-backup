import React, { useEffect, useState } from 'react';
import './Profile.css';

function Profile(props) {
    const [ProfileImg, setProfileImg] = useState("");

    useEffect(() => {
        if (props.artistNum) {
            const profileImg = require(`../../assets/${props.artistNum}/profile/0.jpg`);
            setProfileImg(profileImg);
        }
    }, [props]);

    return (
        <div className="profile">
            <img src={ProfileImg} />
        </div>
    );
}

export default Profile;