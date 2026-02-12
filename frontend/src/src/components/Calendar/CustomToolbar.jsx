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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-2 px-2">

            {/* Left: Navigation & Date */}
            <div className="flex items-center gap-6">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={goToBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        title="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToCurrent}
                        className="px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                        title="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                    {moment(date).format('MMMM YYYY')}
                </h2>
            </div>

            {/* Right: View Switcher */}
            <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                {viewButtons.map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => onView(btn.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                            ${view === btn.id
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-200'}
                        `}
                    >
                        {btn.icon}
                        <span className="hidden sm:inline-block">{btn.label}</span>
                    </button>
                ))}
            </div>

        </div>
    );
};

export default CustomToolbar;
