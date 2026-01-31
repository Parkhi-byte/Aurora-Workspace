import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';

export const useDirectCall = ({
    isIncoming,
    callerSignal,
    callerId,
    userToCall,
    onEndCall,
    onAnswer,
    isVideoCall = true
}) => {
    const { socketRef, user } = useChatContext();
    const [stream, setStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(!isVideoCall);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [mediaError, setMediaError] = useState(null);
    const [connectionState, setConnectionState] = useState('connecting');
    const [callDuration, setCallDuration] = useState(0);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const streamRef = useRef();
    const candidateQueue = useRef([]);
    const callStartTime = useRef(null);
    const durationInterval = useRef(null);

    // Cleanup function
    const cleanup = () => {
        console.log("Cleaning up resources");

        if (durationInterval.current) {
            clearInterval(durationInterval.current);
            durationInterval.current = null;
        }

        if (connectionRef.current) {
            connectionRef.current.close();
            connectionRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log(`Stopped ${track.kind} track`);
            });
            streamRef.current = null;
        }

        setStream(null);
        setRemoteStream(null);
    };

    // Get media function
    const getMedia = async () => {
        setMediaError(null);
        try {
            const constraints = {
                video: isVideoCall ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } : false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            };

            const currentStream = await navigator.mediaDevices.getUserMedia(constraints);

            console.log("Media stream obtained");
            setStream(currentStream);
            streamRef.current = currentStream;

            if (myVideo.current && isVideoCall) {
                myVideo.current.srcObject = currentStream;
            }

            return currentStream;
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setMediaError(
                err.name === 'NotReadableError'
                    ? "Microphone (or Camera) is in use by another app."
                    : err.name === 'NotAllowedError'
                        ? "Please allow microphone (and camera) access."
                        : "Could not access media devices. Please check your device."
            );
            throw err;
        }
    };

    // Process queued ICE candidates
    const processCandidateQueue = () => {
        const peer = connectionRef.current;
        if (!peer || !peer.remoteDescription) return;

        console.log(`Processing ${candidateQueue.current.length} queued candidates`);
        while (candidateQueue.current.length > 0) {
            const candidate = candidateQueue.current.shift();
            peer.addIceCandidate(candidate)
                .catch(e => console.error("Error processing queued candidate:", e));
        }
    };

    // Create peer connection
    const createPeerConnection = (mediaStream) => {
        console.log("Creating new peer connection");

        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" }
            ],
            iceCandidatePoolSize: 10
        });

        connectionRef.current = peer;

        // Add local tracks
        mediaStream.getTracks().forEach(track => {
            console.log(`Adding ${track.kind} track to peer connection`);
            peer.addTrack(track, mediaStream);
        });

        // Handle remote stream
        peer.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0]);
            setRemoteStream(event.streams[0]);
            if (userVideo.current && event.streams[0]) {
                userVideo.current.srcObject = event.streams[0];
            }
        };

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate");
                socketRef.current.emit("ice-candidate", {
                    to: isIncoming ? callerId : userToCall,
                    candidate: event.candidate
                });
            }
        };

        // Handle connection state changes
        peer.onconnectionstatechange = () => {
            console.log("Connection state:", peer.connectionState);
            setConnectionState(peer.connectionState);

            if (peer.connectionState === 'connected') {
                console.log("Peer connection established!");
                if (!callStartTime.current) {
                    callStartTime.current = Date.now();
                    durationInterval.current = setInterval(() => {
                        const elapsed = Math.floor((Date.now() - callStartTime.current) / 1000);
                        setCallDuration(elapsed);
                    }, 1000);
                }
            } else if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
                console.log("Connection failed or disconnected");
                setConnectionState('failed');
            }
        };

        peer.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", peer.iceConnectionState);
        };

        return peer;
    };

    // Initialize media and socket listeners
    useEffect(() => {
        let mounted = true;

        const initializeCall = async () => {
            try {
                const mediaStream = await getMedia();

                if (!mounted) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                const socket = socketRef.current;

                // Socket event listeners
                socket.on("callAccepted", async (signal) => {
                    console.log("Call accepted, setting remote description");
                    setCallAccepted(true);
                    const peer = connectionRef.current;

                    if (peer && signal) {
                        try {
                            await peer.setRemoteDescription(new RTCSessionDescription(signal));
                            console.log("Remote description set, processing candidates");
                            processCandidateQueue();
                        } catch (e) {
                            console.error("Error setting remote description:", e);
                        }
                    }
                });

                socket.on("callEnded", () => {
                    console.log("Call ended by remote peer");
                    if (mounted) {
                        setCallEnded(true);
                        cleanup();
                        if (onEndCall) onEndCall();
                    }
                });

                socket.on("ice-candidate", (candidate) => {
                    console.log("Received ICE candidate");
                    const peer = connectionRef.current;

                    if (peer) {
                        const iceCandidate = new RTCIceCandidate(candidate);

                        if (peer.remoteDescription && peer.remoteDescription.type) {
                            console.log("Adding ICE candidate immediately");
                            peer.addIceCandidate(iceCandidate)
                                .catch(e => console.error("Error adding ICE candidate:", e));
                        } else {
                            console.log("Queueing ICE candidate");
                            candidateQueue.current.push(iceCandidate);
                        }
                    }
                });

                // Create peer connection after media is ready
                const peer = createPeerConnection(mediaStream);

                // If outgoing call, create and send offer
                if (!isIncoming && userToCall) {
                    console.log("Creating offer for outgoing call");
                    try {
                        const offer = await peer.createOffer({
                            offerToReceiveAudio: true,
                            offerToReceiveVideo: true
                        });
                        await peer.setLocalDescription(offer);

                        console.log("Sending offer to", userToCall);
                        socket.emit("callUser", {
                            userToCall: userToCall,
                            signalData: peer.localDescription,
                            from: user._id || user.id,
                            name: user.name,
                            isVideo: isVideoCall // Pass isVideo flag
                        });
                    } catch (err) {
                        console.error("Error creating offer:", err);
                        setMediaError("Failed to initiate call. Please try again.");
                    }
                }
            } catch (err) {
                console.error("Failed to initialize call:", err);
            }
        };

        initializeCall();

        return () => {
            mounted = false;
            const socket = socketRef.current;
            if (socket) {
                socket.off("callAccepted");
                socket.off("callEnded");
                socket.off("ice-candidate");
            }
            cleanup();
        };
    }, []);

    // Answer incoming call
    const answerCall = async () => {
        console.log("Answering call");
        setCallAccepted(true);
        if (onAnswer) onAnswer(); // Trigger context update for ringtone
        const peer = connectionRef.current;

        if (!peer) {
            console.error("No peer connection available");
            return;
        }

        try {
            await peer.setRemoteDescription(new RTCSessionDescription(callerSignal));
            console.log("Remote offer set, processing candidates");
            processCandidateQueue();

            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            console.log("Sending answer to", callerId);
            socketRef.current.emit("answerCall", {
                signal: peer.localDescription,
                to: callerId
            });
        } catch (e) {
            console.error("Error answering call:", e);
            setMediaError("Failed to answer call. Please try again.");
        }
    };

    // Leave call
    const leaveCall = () => {
        console.log("Leaving call");
        setCallEnded(true);
        cleanup();

        socketRef.current.emit("endCall", {
            to: isIncoming ? callerId : userToCall
        });

        if (onEndCall) onEndCall();
    };

    // Toggle mute
    const toggleMute = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    // Toggle screen sharing
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: "always" },
                    audio: false
                });

                const screenTrack = screenStream.getVideoTracks()[0];
                const peer = connectionRef.current;

                if (peer) {
                    const sender = peer.getSenders().find(s => s.track?.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(screenTrack);
                    }
                }

                // When screen sharing stops
                screenTrack.onended = () => {
                    const videoTrack = streamRef.current?.getVideoTracks()[0];
                    if (videoTrack && peer) {
                        const sender = peer.getSenders().find(s => s.track?.kind === 'video');
                        if (sender) {
                            sender.replaceTrack(videoTrack);
                        }
                    }
                    setIsScreenSharing(false);
                };

                setIsScreenSharing(true);
            } catch (err) {
                console.error("Error sharing screen:", err);
            }
        } else {
            const videoTrack = streamRef.current?.getVideoTracks()[0];
            const peer = connectionRef.current;

            if (videoTrack && peer) {
                const sender = peer.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            }
            setIsScreenSharing(false);
        }
    };

    return {
        stream,
        callAccepted,
        callEnded,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        mediaError,
        connectionState,
        callDuration,
        myVideoRef: myVideo,
        userVideoRef: userVideo,
        answerCall,
        leaveCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        getMedia
    };
};
