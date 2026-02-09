import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Clock, Sun } from 'lucide-react';
import moment from 'moment';

const CustomToolbar = ({ date, view, views, label, onNavigate, onView }) => {

    const goToBack = () => {
        onNavigate('PREV');
    };

    const goToNext = () => {
        onNavigate('NEXT');
    };

    const goToCurrent = () => {
        onNavigate('TODAY');
    };

    const viewButtons = [
        { id: 'month', label: 'Month', icon: <Calendar size={18} /> },
        { id: 'week', label: 'Week', icon: <List size={18} /> },
        { id: 'day', label: 'Day', icon: <Sun size={18} /> },
        { id: 'agenda', label: 'Agenda', icon: <Clock size={18} /> },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 rounded-t-3xl px-6 py-4 backdrop-blur-md sticky top-0 z-20 shadow-sm">

            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl shadow-inner">
                    <button
                        onClick={goToBack}
                        className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-all hover:shadow-md"
                        title="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToCurrent}
                        className="px-4 py-2 font-bold text-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all hover:shadow-md"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-all hover:shadow-md"
                        title="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 min-w-[200px] text-center md:text-left">
                    {moment(date).format('MMMM YYYY')}
                </h2>
            </div>

            {/* Right: View Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl shadow-inner overflow-hidden mt-4 md:mt-0">
                {viewButtons.map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => onView(btn.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                            ${view === btn.id
                                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'}
                        `}
                    >
                        <span className="hidden sm:inline-block">{btn.icon}</span>
                        <span>{btn.label}</span>
                    </button>
                ))}
            </div>

        </div>
    );
};

export default CustomToolbar;
