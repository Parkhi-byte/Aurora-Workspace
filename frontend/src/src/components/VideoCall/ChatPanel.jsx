import React from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatPanel = ({
    showChat,
    setShowChat,
    messages,
    user,
    messageInput,
    setMessageInput,
    sendMessage,
    messagesEndRef
}) => {
    if (!showChat) return null;

    return (
        <div className="w-full lg:w-1/3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden shadow-2xl animate-slide-in-right transition-colors duration-300">
            <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Chat</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{messages.length} messages</p>
                        </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">
                        <X size={22} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No messages yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === user._id ? 'items-end' : 'items-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.senderId === user._id
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                                    }`}>
                                    {msg.senderId !== user._id && (
                                        <p className="text-xs font-bold mb-1.5 opacity-70 text-indigo-600 dark:text-indigo-400">{msg.sender}</p>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 px-1">{msg.timestamp}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="p-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-5 py-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none font-medium shadow-sm"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                        className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
