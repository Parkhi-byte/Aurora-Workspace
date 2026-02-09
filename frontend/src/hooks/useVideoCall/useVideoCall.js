import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { logger } from '../../utils/logger';

export const useVideoCall = () => {
    const { user, socketRef, socketConnected } = useChatContext();
    const [roomId, setRoomId] = useState('');
    const [inputRoomId, setInputRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [copied, setCopied] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [stream, setStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasMedia, setHasMedia] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Connection state tracking
    const [peerStates, setPeerStates] = useState(new Map());

    // Loading and error states
    const [isJoining, setIsJoining] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [mediaError, setMediaError] = useState(null);
    const [socketError, setSocketError] = useState(null);

    const myVideoRef = useRef();
    const peersRef = useRef(new Map());
    const streamRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isInRoomRef = useRef(false);
    const roomIdRef = useRef('');
    const makingOfferRef = useRef(new Map()); // Map of userId -> boolean
    const ignoreOfferRef = useRef(new Map()); // Map of userId -> boolean
    const initiatorsRef = useRef(new Map()); // Map of userId -> boolean

    useEffect(() => {
        isInRoomRef.current = isInRoom;
        roomIdRef.current = roomId;
    }, [isInRoom, roomId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!socketConnected) {
            setSocketError('Socket disconnected. Trying to reconnect...');
        } else {
            setSocketError(null);
        }
    }, [socketConnected]);

    // Automatically attach stream to local video ref
    useEffect(() => {
        if (myVideoRef.current && stream) {
            myVideoRef.current.srcObject = stream;
        }
    }, [stream, myVideoRef]);

    const generateRoomId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 9; i++) {
            if (i === 3 || i === 6) id += '-';
            else id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getUserMedia = async () => {
        try {
            setMediaError(null);
            // Try getting both video and audio
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: { echoCancellation: true, noiseSuppression: true }
            });
            setStream(mediaStream);
            streamRef.current = mediaStream;
            setHasMedia(true);
            setIsVideoOff(false);
            return mediaStream;
        } catch (err) {
            logger.warn('Initial media access failed, trying audio only:', err);

            try {
                // Fallback to audio only
                const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: { echoCancellation: true, noiseSuppression: true }
                });
                setStream(audioOnlyStream);
                streamRef.current = audioOnlyStream;
                setHasMedia(true);
                setIsVideoOff(true);
                return audioOnlyStream;
            } catch (audioErr) {
                logger.error('Final media error:', audioErr);
                let errorMessage = 'Camera/microphone not available';

                if (audioErr.name === 'NotAllowedError' || audioErr.name === 'PermissionDeniedError') {
                    errorMessage = 'Camera/microphone permission denied. Please allow access in your browser settings.';
                } else if (audioErr.name === 'NotFoundError' || audioErr.name === 'DevicesNotFoundError') {
                    errorMessage = 'No camera or microphone found on this device.';
                }

                setMediaError(errorMessage);
                setHasMedia(false);
                return null;
            }
        }
    };

    const enableMedia = async () => {
        const mediaStream = await getUserMedia();
        if (mediaStream && peersRef.current.size > 0) {
            peersRef.current.forEach(peer => {
                mediaStream.getTracks().forEach(track => {
                    const sender = peer.getSenders().find(s => s.track?.kind === track.kind);
                    if (sender) {
                        sender.replaceTrack(track);
                    } else {
                        peer.addTrack(track, mediaStream);
                    }
                });
            });
        }
    };

    const createRoom = async () => {
        if (!socketRef.current || !socketConnected) {
            setError('Socket not connected. Please wait...');
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            const newRoomId = generateRoomId();
            await getUserMedia();

            setRoomId(newRoomId);
            setIsInRoom(true);
            isInRoomRef.current = true;
            roomIdRef.current = newRoomId;

            socketRef.current.emit('joinRoom', {
                roomId: newRoomId,
                userId: user._id,
                userName: user.name
            });
        } catch (err) {
            logger.error('Error creating room:', err);
            setError('Failed to create room. Please try again.');
            setIsInRoom(false);
        } finally {
            setIsCreating(false);
        }
    };

    const joinRoom = async () => {
        if (!inputRoomId.trim()) {
            setError('Please enter a room ID');
            return;
        }

        if (!socketRef.current || !socketConnected) {
            setError('Socket not connected. Please wait...');
            return;
        }

        setIsJoining(true);
        setError(null);

        try {
            await getUserMedia();

            const normalizedRoomId = inputRoomId.toUpperCase();
            setRoomId(normalizedRoomId);
            setIsInRoom(true);
            isInRoomRef.current = true;
            roomIdRef.current = normalizedRoomId;

            socketRef.current.emit('joinRoom', {
                roomId: normalizedRoomId,
                userId: user._id,
                userName: user.name
            });
        } catch (err) {
            logger.error('Error joining room:', err);
            setError('Failed to join room. Please try again.');
            setIsInRoom(false);
        } finally {
            setIsJoining(false);
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim()) return;
        if (!socketRef.current) {
            logger.error('Socket not initialized');
            return;
        }

        const message = {
            id: Date.now(),
            text: messageInput,
            sender: user.name,
            senderId: user._id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, message]);

        socketRef.current.emit('roomMessage', {
            roomId,
            message
        });

        setMessageInput('');
    };

    const stopStreamTracks = (mediaStream) => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => {
                track.stop();
                logger.log(`Stopped ${track.kind} track`);
            });
        }
    };

    const leaveRoom = () => {
        logger.log('Leaving room...');

        if (streamRef.current) {
            stopStreamTracks(streamRef.current);
        }

        peersRef.current.forEach((peer, userId) => {
            peer.close();
            const remoteStreamData = remoteStreams.get(userId);
            if (remoteStreamData?.stream) {
                stopStreamTracks(remoteStreamData.stream);
            }
        });
        peersRef.current.clear();

        if (socketRef.current && roomId) {
            socketRef.current.emit('leaveRoom', { roomId, userId: user._id });
        }

        setIsInRoom(false);
        setRoomId('');
        setInputRoomId('');
        setParticipants([]);
        setStream(null);
        setRemoteStreams(new Map());
        setMessages([]);
        setHasMedia(false);
        setPeerStates(new Map());
        setError(null);
        setMediaError(null);
    };

    const toggleMute = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const retryConnection = (userId, userName) => {
        logger.log(`Retrying connection to ${userName}...`);

        const existingPeer = peersRef.current.get(userId);
        if (existingPeer) {
            existingPeer.close();
            peersRef.current.delete(userId);
        }

        setRemoteStreams(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
        });

        setTimeout(() => {
            createPeerConnection(userId, userName, true);
        }, 1000);
    };

    const createPeerConnection = (userId, userName, isInitiator) => {
        if (peersRef.current.has(userId)) {
            logger.log('Peer connection already exists for:', userName);
            return peersRef.current.get(userId);
        }

        logger.log(`Creating ${isInitiator ? 'initiator' : 'receiver'} peer connection for:`, userName);

        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ],
            iceCandidatePoolSize: 10
        });

        peersRef.current.set(userId, peer);
        initiatorsRef.current.set(userId, isInitiator);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, streamRef.current);
            });
        }

        peer.onconnectionstatechange = () => {
            logger.log(`Peer connection state for ${userName}:`, peer.connectionState);
            setPeerStates(prev => new Map(prev).set(userId, peer.connectionState));

            if (peer.connectionState === 'failed') {
                logger.log(`Connection failed for ${userName}, will retry...`);
                setError(`Connection to ${userName} failed. Retrying...`);

                setTimeout(() => {
                    if (peersRef.current.has(userId)) {
                        retryConnection(userId, userName);
                    }
                }, 3000);
            } else if (peer.connectionState === 'disconnected') {
                logger.log(`Connection disconnected for ${userName}`);
                setTimeout(() => {
                    if (peer.connectionState === 'disconnected') {
                        logger.log(`Cleaning up disconnected peer for ${userName}`);
                        peer.close();
                        peersRef.current.delete(userId);
                        setRemoteStreams(prev => {
                            const newMap = new Map(prev);
                            const streamData = newMap.get(userId);
                            if (streamData?.stream) {
                                stopStreamTracks(streamData.stream);
                            }
                            newMap.delete(userId);
                            return newMap;
                        });
                    }
                }, 5000);
            } else if (peer.connectionState === 'connected') {
                logger.log(`Successfully connected to ${userName}`);
                setError(null);
            }
        };

        peer.oniceconnectionstatechange = () => {
            logger.log(`ICE connection state for ${userName}:`, peer.iceConnectionState);

            if (peer.iceConnectionState === 'failed') {
                logger.log(`ICE connection failed for ${userName}, attempting ICE restart`);
                peer.restartIce();
            }
        };

        peer.onnegotiationneeded = async () => {
            try {
                if (!isInitiator) return;

                const makingOffer = makingOfferRef.current.get(userId);
                if (makingOffer) return;

                if (socketRef.current && peer.signalingState === 'stable') {
                    logger.log(`Negotiation needed for ${userName}, creating offer`);
                    makingOfferRef.current.set(userId, true);
                    const offer = await peer.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true
                    });

                    // Check if signaling state is still stable before setting local description
                    if (peer.signalingState !== 'stable') return;

                    await peer.setLocalDescription(offer);
                    socketRef.current.emit('sendOffer', {
                        to: userId,
                        offer: peer.localDescription,
                        roomId: roomIdRef.current
                    });
                }
            } catch (err) {
                logger.error(`Error during renegotiation for ${userName}:`, err);
            } finally {
                makingOfferRef.current.set(userId, false);
            }
        };

        peer.ontrack = (event) => {
            logger.log('Received remote track from:', userName, 'kind:', event.track.kind);
            setRemoteStreams(prev => new Map(prev).set(userId, {
                stream: event.streams[0],
                name: userName
            }));
        };

        peer.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('sendIceCandidate', {
                    to: userId,
                    candidate: event.candidate,
                    roomId
                });
            }
        };

        // Manual offer creation removed in favor of onnegotiationneeded

        return peer;
    };

    useEffect(() => {
        if (!socketRef.current) return;

        const socket = socketRef.current;

        const handleRoomJoined = ({ participants }) => {
            if (!isInRoomRef.current) return;
            logger.log('Successfully joined room with participants:', participants);
            setParticipants(participants);
            setError(null);

            participants.forEach(p => {
                if (p.id !== user._id) {
                    logger.log('Creating peer connection for existing user:', p.name);
                    createPeerConnection(p.id, p.name, true);
                }
            });
        };

        const handleUserJoinedRoom = ({ userId, userName, participants: roomParticipants }) => {
            if (!isInRoomRef.current) return;
            logger.log('User joined:', userName, 'Total participants:', roomParticipants.length);
            setParticipants(roomParticipants);

            if (userId !== user._id) {
                logger.log('New user will initiate connection to us');
            }
        };

        const handleUserLeftRoom = ({ userId, participants: roomParticipants }) => {
            if (!isInRoomRef.current) return;
            logger.log('User left:', userId);
            setParticipants(roomParticipants);

            const peer = peersRef.current.get(userId);
            if (peer) {
                peer.close();
                peersRef.current.delete(userId);
            }

            setRemoteStreams(prev => {
                const newMap = new Map(prev);
                const streamData = newMap.get(userId);
                if (streamData?.stream) {
                    stopStreamTracks(streamData.stream);
                }
                newMap.delete(userId);
                return newMap;
            });

            setPeerStates(prev => {
                const newMap = new Map(prev);
                newMap.delete(userId);
                return newMap;
            });

            initiatorsRef.current.delete(userId);
            makingOfferRef.current.delete(userId);
            ignoreOfferRef.current.delete(userId);
        };

        const handleReceiveOffer = async ({ from, fromName, offer }) => {
            if (!isInRoomRef.current) return;
            logger.log('Received offer from:', fromName);
            const peer = createPeerConnection(from, fromName, false);

            try {
                // Tracking role for "polite" peer negotiation
                const isLocalInitiator = initiatorsRef.current.get(from) || false;
                const makingOffer = makingOfferRef.current.get(from) || false;
                const offerCollision = makingOffer || peer.signalingState !== 'stable';

                const shouldIgnore = !isLocalInitiator && offerCollision;
                ignoreOfferRef.current.set(from, shouldIgnore);

                if (shouldIgnore) {
                    logger.log('Ignoring offer collision for:', fromName);
                    return;
                }

                await peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);

                socket.emit('sendAnswer', {
                    to: from,
                    answer: peer.localDescription,
                    roomId: roomIdRef.current
                });
            } catch (err) {
                logger.error('Error handling offer:', err);
                setError(`Failed to connect with ${fromName}`);
            }
        };

        const handleReceiveAnswer = async ({ from, answer }) => {
            if (!isInRoomRef.current) return;
            logger.log('Received answer from:', from);
            const peer = peersRef.current.get(from);

            if (peer) {
                try {
                    await peer.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                    logger.error('Error setting remote description:', err);
                    setError('Connection error occurred');
                }
            }
        };

        const handleReceiveIceCandidate = async ({ from, candidate }) => {
            if (!isInRoomRef.current) return;
            const peer = peersRef.current.get(from);

            if (peer && peer.remoteDescription) {
                try {
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    logger.error('Error adding ICE candidate:', err);
                }
            }
        };

        const handleRoomMessage = ({ message }) => {
            if (!isInRoomRef.current) return;
            setMessages(prev => [...prev, message]);
            if (!showChat) {
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on('roomJoined', handleRoomJoined);
        socket.on('userJoinedRoom', handleUserJoinedRoom);
        socket.on('userLeftRoom', handleUserLeftRoom);
        socket.on('receiveOffer', handleReceiveOffer);
        socket.on('receiveAnswer', handleReceiveAnswer);
        socket.on('receiveIceCandidate', handleReceiveIceCandidate);
        socket.on('roomMessage', handleRoomMessage);

        return () => {
            socket.off('roomJoined', handleRoomJoined);
            socket.off('userJoinedRoom', handleUserJoinedRoom);
            socket.off('userLeftRoom', handleUserLeftRoom);
            socket.off('receiveOffer', handleReceiveOffer);
            socket.off('receiveAnswer', handleReceiveAnswer);
            socket.off('receiveIceCandidate', handleReceiveIceCandidate);
            socket.off('roomMessage', handleRoomMessage);
        };
    }, [socketConnected, user._id]); // Add user._id for stable dependencies

    useEffect(() => {
        if (showChat) {
            setUnreadCount(0);
        }
    }, [showChat]);

    useEffect(() => {
        return () => {
            logger.log('Component unmounting, cleaning up...');

            if (isInRoomRef.current && socketRef.current && roomIdRef.current) {
                socketRef.current.emit('leaveRoom', {
                    roomId: roomIdRef.current,
                    userId: user._id
                });
            }

            if (streamRef.current) {
                stopStreamTracks(streamRef.current);
            }

            peersRef.current.forEach((peer, userId) => {
                peer.close();
            });
            peersRef.current.clear();
            initiatorsRef.current.clear();
            makingOfferRef.current.clear();
            ignoreOfferRef.current.clear();
        };
    }, []);

    return {
        user,
        socketConnected,
        roomId,
        setRoomId,
        inputRoomId,
        setInputRoomId,
        isInRoom,
        copied,
        copyRoomId,
        participants,
        stream,
        remoteStreams,
        isMuted,
        toggleMute,
        isVideoOff,
        toggleVideo,
        hasMedia,
        enableMedia,
        messages,
        messageInput,
        setMessageInput,
        sendMessage,
        unreadCount,
        setUnreadCount,
        showChat,
        setShowChat,
        peerStates,
        retryConnection,
        isJoining,
        joinRoom,
        isCreating,
        createRoom,
        leaveRoom,
        error,
        setError,
        mediaError,
        setMediaError,
        socketError,
        setSocketError,
        myVideoRef,
        messagesEndRef
    };
};
