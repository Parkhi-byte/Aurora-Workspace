import React, { useRef, useState, useEffect } from 'react';
import { Loader, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

const RemoteVideo = ({ userId, stream, name, connectionState, onRetry }) => {
    const videoRef = useRef();
    const [hasVideo, setHasVideo] = useState(false);

    useEffect(() => {
        if (!stream) return;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        const checkVideo = () => {
            const videoTracks = stream.getVideoTracks();
            setHasVideo(videoTracks.length > 0 && videoTracks[0].enabled);
        };

        checkVideo();

        const handleTrackChange = () => {
            checkVideo();
        };

        // Listen for tracks being added or removed from the stream
        stream.addEventListener('addtrack', handleTrackChange);
        stream.addEventListener('removetrack', handleTrackChange);

        // Listen for mute/unmute/ended on existing tracks
        const videoTracks = stream.getVideoTracks();
        const handleTrackMute = () => checkVideo();
        const handleTrackUnmute = () => checkVideo();
        const handleTrackEnded = () => checkVideo();

        videoTracks.forEach(track => {
            track.addEventListener('ended', handleTrackEnded);
            track.addEventListener('mute', handleTrackMute);
            track.addEventListener('unmute', handleTrackUnmute);
        });

        return () => {
            stream.removeEventListener('addtrack', handleTrackChange);
            stream.removeEventListener('removetrack', handleTrackChange);

            videoTracks.forEach(track => {
                track.removeEventListener('ended', handleTrackEnded);
                track.removeEventListener('mute', handleTrackMute);
                track.removeEventListener('unmute', handleTrackUnmute);
            });
        };
    }, [stream, hasVideo]);

    const isConnecting = connectionState === 'new' || connectionState === 'checking' || connectionState === 'connecting';
    const isFailed = connectionState === 'failed';
    const isDisconnected = connectionState === 'disconnected';

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl group hover:border-indigo-500/50 transition-all duration-300 aspect-video">
            {isConnecting && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <Loader className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                    <p className="text-sm text-gray-600 dark:text-indigo-200 font-medium">Connecting to {name}...</p>
                </div>
            )}

            {isFailed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-50/90 dark:bg-red-900/90 backdrop-blur-sm">
                    <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
                    <p className="text-sm text-red-600 dark:text-red-200 mb-4 font-medium">Connection Failed</p>
                    <button
                        onClick={onRetry}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg"
                    >
                        <RefreshCw size={16} />
                        Retry Connection
                    </button>
                </div>
            )}

            {isDisconnected && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-yellow-50/90 dark:bg-yellow-900/90 backdrop-blur-sm">
                    <WifiOff className="w-10 h-10 text-yellow-500 dark:text-yellow-400 mb-3" />
                    <p className="text-sm text-yellow-600 dark:text-yellow-200 font-medium">Disconnected</p>
                </div>
            )}

            {!hasVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 shadow-lg shadow-indigo-500/30">
                            {name?.[0]?.toUpperCase()}
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg mb-1">{name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No Camera</p>
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
            )}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 shadow-lg z-10">
                <span className="font-bold text-gray-900 dark:text-white">{name}</span>
            </div>
        </div>
    );
};

export default RemoteVideo;
