
import React from 'react';
import { UserPlus, Mail, User, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const InviteMember = ({ inviteEmail, setInviteEmail, inviteName, setInviteName, handleInvite, loading, error, success }) => {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl rounded-[2rem] p-8 sticky top-28 overflow-hidden">
            {/* Header Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-fuchsia-500/30 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invite Member</h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Expand Your Team</p>
                    </div>
                </div>

                {(error || success) && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${error ? 'bg-red-50/80 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        : 'bg-emerald-50/80 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                        }`}>
                        {error ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle size={20} className="shrink-0 mt-0.5" />}
                        <span className="text-sm font-medium leading-tight">{error || success}</span>
                    </div>
                )}

                <form onSubmit={handleInvite} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                            </div>
                            <input
                                type="email"
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                            </div>
                            <input
                                type="text"
                                value={inviteName}
                                onChange={(e) => setInviteName(e.target.value)}
                                placeholder="Optional"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-xl font-bold shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Send Invitation</span>
                                <Sparkles size={18} className="group-hover:text-amber-400 transition-colors duration-300" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InviteMember;
