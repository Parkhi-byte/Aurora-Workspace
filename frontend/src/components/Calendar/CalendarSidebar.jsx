import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Filter, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import moment from 'moment';

const CalendarSidebar = ({ events, onSelectEvent, activeFilters, onFilterChange }) => {

    // Sort and filter upcoming events (next 14 days)
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        return events
            .filter(evt => new Date(evt.start) >= now && new Date(evt.start) <= twoWeeksLater)
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5); // Show top 5
    }, [events]);

    const colors = [
        { color: '#3b82f6', label: 'Blue' },
        { color: '#10b981', label: 'Green' },
        { color: '#ef4444', label: 'Red' },
        { color: '#f59e0b', label: 'Orange' },
        { color: '#8b5cf6', label: 'Purple' },
        { color: '#ec4899', label: 'Pink' },
        { color: '#6366f1', label: 'Indigo' }
    ];

    const toggleFilter = (color) => {
        if (activeFilters.includes(color)) {
            onFilterChange(activeFilters.filter(c => c !== color));
        } else {
            onFilterChange([...activeFilters, color]);
        }
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 p-6 h-full flex flex-col gap-8 animate-fade-in-up">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Your Schedule
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Manage your upcoming events
                </p>
            </div>

            {/* Upcoming Events */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 font-semibold px-1">
                    <Clock size={16} className="text-indigo-500" />
                    <span>Upcoming</span>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="space-y-3">
                        {upcomingEvents.map(evt => (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={evt._id || evt.id}
                                onClick={() => onSelectEvent(evt)}
                                className="p-3 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-1.5 h-10 rounded-full shrink-0"
                                        style={{ backgroundColor: evt.color || '#3b82f6' }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                                            {evt.title || 'Untitled Event'}
                                        </h4>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                                            <span>{moment(evt.start).format('MMM D')}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                            <span>{moment(evt.start).format('h:mm A')}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors self-center opacity-0 group-hover:opacity-100" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <CalendarIcon size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No upcoming events</p>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div>
                <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 font-semibold px-1">
                    <Filter size={16} className="text-purple-500" />
                    <span>Filter by Color</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                        <button
                            key={c.color}
                            onClick={() => toggleFilter(c.color)}
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                                ${activeFilters.length === 0 || activeFilters.includes(c.color)
                                    ? 'opacity-100 scale-100 shadow-sm'
                                    : 'opacity-40 scale-90 grayscale'}
                                hover:opacity-100 hover:scale-105
                            `}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                        >
                            {activeFilters.includes(c.color) && (
                                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => onFilterChange([])}
                        className={`
                            px-3 py-1.5 text-xs font-semibold rounded-lg transition-all
                            ${activeFilters.length === 0
                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
                        `}
                        disabled={activeFilters.length === 0}
                    >
                        Reset
                    </button>
                </div>
            </div>

        </div>
    );
};

export default CalendarSidebar;
