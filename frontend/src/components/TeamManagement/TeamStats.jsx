
import React from 'react';
import { Users, TrendingUp, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamStats = ({ stats, activities }) => {
    const { total, adminCount, memberCount } = stats;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {/* Stat Card 1: Total Members */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-2 border-violet-200/50 dark:border-violet-500/30 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 p-6"
            >
                {/* Background Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

                {/* Large Background Icon */}
                <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <Users size={140} className="text-violet-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-violet-500/40">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Members</span>
                    </div>

                    <h3 className="text-5xl font-black bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">{total}</h3>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300/50 dark:border-emerald-600/50 shadow-sm">
                            {memberCount} Active
                        </span>
                        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-700 dark:text-violet-300 font-bold border border-violet-300/50 dark:border-violet-600/50 shadow-sm">
                            {adminCount} Admins
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stat Card 2: Team Performance */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-2 border-orange-200/50 dark:border-orange-500/30 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 p-6"
            >
                {/* Background Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-orange-500/5 pointer-events-none" />

                {/* Decorative Background Element */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl text-white shadow-lg shadow-rose-500/40">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Performance</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-2xl border border-white/60 dark:border-gray-600/40 backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                <Clock size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Efficiency</span>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{stats.productivity}%</span>
                        </div>
                        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-2xl border border-white/60 dark:border-gray-600/40 backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                                <CheckCircle size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Tasks</span>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{stats.completedTasks}/{stats.totalTasks}</span>
                        </div>
                    </div>

                    <div className="relative w-full bg-gray-200/60 dark:bg-gray-700/60 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.productivity}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 shadow-lg relative overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Stat Card 3: Recent Activity */}
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-2 border-cyan-200/50 dark:border-cyan-500/30 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 p-6 flex flex-col"
            >
                {/* Background Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

                {/* Decorative Background Element */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/40">
                                <Activity size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Activity</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[140px]">
                        {activities && activities.length > 0 ? (
                            activities.map((act, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="flex gap-3 items-start group/item hover:bg-white/40 dark:hover:bg-gray-700/30 p-2 rounded-xl transition-colors duration-200"
                                >
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-lg ${act.type === 'member_add' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-blue-500 shadow-blue-500/50'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug font-medium">
                                            {act.text}
                                        </p>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                            {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-8">
                                <Activity size={32} className="text-gray-400 mb-3" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No recent updates</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeamStats;
