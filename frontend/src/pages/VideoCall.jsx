import React from 'react';
import { useVideoCall } from '../hooks/useVideoCall/useVideoCall';
import VideoCallLanding from '../components/VideoCall/VideoCallLanding';
import ActiveCallRoom from '../components/VideoCall/ActiveCallRoom';

const VideoCallPage = () => {
    const videoCall = useVideoCall();

    if (videoCall.isInRoom) {
        return <ActiveCallRoom {...videoCall} />;
    }

    return <VideoCallLanding {...videoCall} />;
};

export default VideoCallPage;
