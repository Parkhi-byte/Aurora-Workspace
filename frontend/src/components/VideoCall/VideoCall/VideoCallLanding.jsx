import React from 'react';
import { Video, Loader, AlertCircle, X, Plus, LogIn, Copy, Sparkles, ArrowRight, MessageSquare, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoCallLanding = ({
    createRoom,
    isCreating,
    socketConnected,
    error,
    setError,
    inputRoomId,
    setInputRoomId,
    joinRoom,
    isJoining
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Elements - Exact match from PasswordManager */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-indigo-500/15 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <div className="max-w-6xl w-full relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-6"
                    >
                        <Video className="text-white" size={40} strokeWidth={2.5} />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                        Video Conferencing
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                        Secure, high-quality video meetings for your team.
                    </p>
                </motion.div>

                {/* Status Banners */}
                {!socketConnected && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto mb-8 bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-2xl p-4 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Loader className="text-yellow-600 dark:text-yellow-400 animate-spin" size={20} />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Connecting to server...</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto mb-8 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm"
                    >
                        <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-800 dark:text-red-200 flex-1 font-medium">{error}</p>
                        <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-lg transition-colors">
                            <X size={18} className="text-red-600 dark:text-red-400" />
                        </button>
                    </motion.div>
                )}

                {/* Main Action Cards */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16 px-4">
                    {/* Create Room Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Plus size={32} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                            </div>
                            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-800">
                                Instant
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Create Room</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                            Start a new secure meeting and invite others instantly.
                        </p>

                        <motion.button
                            onClick={createRoom}
                            disabled={!socketConnected || isCreating}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            {isCreating ? (
                                <>
                                    <Loader size={24} className="animate-spin" />
                                    <span>Creating Space...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={24} />
                                    <span>Create New Room</span>
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Join Room Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <LogIn size={32} className="text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
                            </div>
                            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-100 dark:border-purple-800">
                                Connect
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Join Room</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            Enter a room code to join an ongoing meeting.
                        </p>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Room ID (e.g. ABC-123-XYZ)"
                                    value={inputRoomId}
                                    onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && !isJoining && socketConnected && inputRoomId.trim() && joinRoom()}
                                    className="w-full px-6 py-5 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono text-center tracking-wider text-xl shadow-inner transition-all"
                                    maxLength={11}
                                    disabled={isJoining}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <Copy size={22} />
                                </div>
                            </div>

                            <motion.button
                                onClick={joinRoom}
                                disabled={!inputRoomId.trim() || !socketConnected || isJoining}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all"
                            >
                                {isJoining ? (
                                    <>
                                        <Loader size={24} className="animate-spin" />
                                        <span>Joining...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={24} />
                                        <span>Join Room</span>
                                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid - Clean & Minimal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                >
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-default">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <Video size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">HD Video</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Crystal clear quality</p>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-default">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400 shadow-sm">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Live Chat</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Built-in messaging</p>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-default">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
                            <Shield size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Secure</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">End-to-encrypted</p>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default VideoCallLanding;
