import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Plus } from 'lucide-react';

const TeamSelector = ({
    teams,
    currentTeam,
    setCurrentTeamId,
    isAdmin,
    isTeamOwner,
    createTeam
}) => {
    const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);

    const handleCreateTeam = () => {
        const teamName = prompt("Enter new team name:");
        if (teamName) createTeam(teamName);
        setIsTeamMenuOpen(false);
    };

    return (
        <div className="relative inline-block">
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
                className="group flex items-center gap-3 mb-2"
            >
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                    {currentTeam?.name || 'My Team'}
                </h1>
                <div className="mt-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all">
                    <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
            </motion.button>

            {/* Team Dropdown */}
            <AnimatePresence>
                {isTeamMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Teams</h4>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-2">
                            {teams.map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => {
                                        setCurrentTeamId(team.id);
                                        setIsTeamMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all mb-1 ${currentTeam?.id === team.id
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <span className="font-semibold truncate">{team.name}</span>
                                    {currentTeam?.id === team.id && <Check size={18} className="text-indigo-600 dark:text-indigo-400" />}
                                </button>
                            ))}
                        </div>

                        {(isAdmin || isTeamOwner) && (
                            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                                <button
                                    onClick={handleCreateTeam}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all font-semibold"
                                >
                                    <Plus size={18} />
                                    <span>Create New Team</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamSelector;
