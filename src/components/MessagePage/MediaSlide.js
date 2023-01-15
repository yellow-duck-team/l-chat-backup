import react from 'react';
// Style
import { CloseOutlined } from '@ant-design/icons';
import './MessagePage.css';

function MediaSlide(props) {
    const onCloseMedia = () => {
        if (props.openMedia) {
            props.openMedia(false, null, "", 0, 0);
        }
    };

    return (
        <div className="msg-img">
            {props.media && <img src={props.media.media} />}
            <button onClick={onCloseMedia}>
                <CloseOutlined />
            </button>
        </div>
    );
}

export default MediaSlide;