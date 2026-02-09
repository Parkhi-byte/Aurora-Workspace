
import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import { useCalendar } from '../hooks/useCalendar/useCalendar';
import { useTeamManagement } from '../hooks/useTeamManagement/useTeamManagement';
import EventModal from '../components/Calendar/EventModal';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendar();
    const { currentTeam } = useTeamManagement();
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectSlot = ({ start, end }) => {
        setSelectedEvent({
            start: start,
            end: end,
            allDay: false
        });
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleSave = async (eventData) => {
        let success;
        if (selectedEvent && selectedEvent._id) {
            success = await updateEvent(selectedEvent._id, eventData);
        } else {
            success = await createEvent(eventData, currentTeam?.id);
        }

        if (success) {
            setShowModal(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent || !selectedEvent._id) return;
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        const success = await deleteEvent(selectedEvent._id);
        if (success) {
            setShowModal(false);
        }
    };

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.color,
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 flex items-center gap-3">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-indigo-500/10 dark:shadow-none border border-gray-100 dark:border-gray-700">
                            <CalendarIcon className="text-indigo-600 dark:text-indigo-400" size={32} />
                        </div>
                        Calendar
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 font-medium">Manage your schedule and events efficiently</p>
                </div>
                <button
                    onClick={() => {
                        handleSelectSlot({
                            start: new Date(),
                            end: new Date(new Date().setHours(new Date().getHours() + 1))
                        });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                    <Plus size={22} strokeWidth={2.5} />
                    New Event
                </button>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700 p-6 h-[calc(100vh-220px)] min-h-[600px]">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day', 'agenda']}
                    className="text-gray-900 dark:text-gray-200 custom-calendar"
                />
            </div>

            <EventModal
                show={showModal}
                onClose={() => setShowModal(false)}
                event={selectedEvent}
                onSave={handleSave}
                onDelete={selectedEvent && selectedEvent._id ? handleDelete : null}
            />

            {/* Custom CSS overrides for React Big Calendar Dark Mode */}
            <style>{`
                /* General Calendar Styles */
                .rbc-calendar {
                    font-family: inherit;
                    color: inherit;
                }
                
                /* Header / Toolbar */
                .rbc-toolbar {
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .rbc-toolbar-label {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827; /* gray-900 */
                }
                .dark .rbc-toolbar-label {
                    color: #f9fafb; /* gray-50 */
                }
                .rbc-btn-group {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border-radius: 0.75rem;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .dark .rbc-btn-group {
                    border-color: #374151;
                }
                .rbc-btn-group button {
                    border: none;
                    padding: 10px 16px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: #4b5563; /* gray-600 */
                    background-color: white;
                    border-right: 1px solid #e5e7eb;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .dark .rbc-btn-group button {
                    background-color: #1f2937; /* gray-800 */
                    color: #9ca3af; /* gray-400 */
                    border-right-color: #374151;
                }
                .rbc-btn-group button:last-child {
                    border-right: none;
                }
                .rbc-btn-group button:hover {
                    background-color: #f3f4f6;
                    color: #111827;
                }
                .dark .rbc-btn-group button:hover {
                    background-color: #374151;
                    color: white;
                }
                .rbc-btn-group button.rbc-active {
                    background-color: #4f46e5; /* indigo-600 */
                    color: white;
                    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.1);
                }
                .dark .rbc-btn-group button.rbc-active {
                    background-color: #6366f1; /* indigo-500 */
                    color: white;
                }

                /* Month View */
                .rbc-header {
                    padding: 16px 0;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    color: #6b7280; /* gray-500 */
                    border-bottom: 2px solid #e5e7eb;
                }
                .dark .rbc-header {
                    color: #9ca3af; /* gray-400 */
                    border-bottom-color: #374151;
                }
                .rbc-month-view {
                    border: 1px solid #e5e7eb;
                    border-radius: 1rem;
                    overflow: hidden;
                    background-color: white;
                }
                .dark .rbc-month-view {
                    border-color: #374151;
                    background-color: #1f2937;
                }
                .rbc-day-bg {
                    background-color: white;
                }
                .dark .rbc-day-bg {
                    background-color: #1f2937;
                }
                .rbc-off-range-bg {
                    background-color: #f9fafb;
                }
                .dark .rbc-off-range-bg {
                    background-color: #111827; /* gray-900 */
                }
                .rbc-day-bg + .rbc-day-bg {
                    border-left: 1px solid #e5e7eb;
                }
                .dark .rbc-day-bg + .rbc-day-bg {
                    border-left-color: #374151;
                }
                .rbc-month-row + .rbc-month-row {
                    border-top: 1px solid #e5e7eb;
                }
                .dark .rbc-month-row + .rbc-month-row {
                    border-top-color: #374151;
                }

                /* Dates */
                .rbc-date-cell {
                    padding: 8px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: #374151;
                }
                .dark .rbc-date-cell {
                    color: #d1d5db;
                }
                .rbc-today {
                    background-color: #e0e7ff !important; /* indigo-50 */
                }
                .dark .rbc-today {
                    background-color: rgba(99, 102, 241, 0.15) !important; /* indigo-500/15 */
                }
                .rbc-now {
                    font-weight: 700;
                    color: #4f46e5;
                }
                .dark .rbc-now {
                    color: #818cf8;
                }

                /* Events */
                .rbc-event {
                    border: none;
                    border-radius: 6px;
                    padding: 2px 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }
                .rbc-event:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                }
                .rbc-event-label {
                    display: none; /* simpler look */
                }

                /* Time View / Agenda */
                .rbc-time-view {
                    border: 1px solid #e5e7eb;
                    border-radius: 1rem;
                    overflow: hidden;
                    background-color: white;
                }
                .dark .rbc-time-view {
                    border-color: #374151;
                    background-color: #1f2937;
                }
                .rbc-time-header-content {
                    border-left: 1px solid #e5e7eb;
                }
                .dark .rbc-time-header-content {
                    border-left-color: #374151;
                }
                .rbc-time-content {
                    border-top: 1px solid #e5e7eb;
                }
                .dark .rbc-time-content {
                    border-top-color: #374151;
                }
                .rbc-timeslot-group {
                    border-bottom: 1px solid #f3f4f6;
                }
                .dark .rbc-timeslot-group {
                    border-bottom-color: #374151;
                }
                .rbc-day-slot .rbc-time-slot {
                    border-top: 1px solid #f9fafb;
                }
                .dark .rbc-day-slot .rbc-time-slot {
                    border-top-color: rgba(55, 65, 81, 0.5);
                }
                .rbc-time-gutter .rbc-timeslot-group {
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 0.75rem;
                    color: #9ca3af;
                }
                .dark .rbc-time-gutter .rbc-timeslot-group {
                    border-bottom-color: #374151;
                    color: #6b7280;
                }
                .rbc-current-time-indicator {
                    background-color: #ef4444; /* red-500 */
                    height: 2px;
                }`}</style>
        </div>
    );
};

export default CalendarPage;
