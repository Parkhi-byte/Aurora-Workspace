import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import { useCalendar } from '../hooks/useCalendar/useCalendar';
import { useTeamManagement } from '../hooks/useTeamManagement/useTeamManagement';
import EventModal from '../components/Calendar/EventModal';
import CalendarSidebar from '../components/Calendar/CalendarSidebar';
import CustomToolbar from '../components/Calendar/CustomToolbar';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendar();
    const { currentTeam } = useTeamManagement();
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);

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
            backgroundColor: event.color || '#3b82f6',
            borderRadius: '6px',
            opacity: 1,
            color: 'white',
            border: 'none',
            display: 'block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            fontSize: '0.85rem',
            fontWeight: '500',
            padding: '2px 5px'
        };
        return {
            style: style
        };
    };

    const filteredEvents = useMemo(() => {
        if (!events) return [];
        if (activeFilters.length === 0) return events;
        return events.filter(evt => activeFilters.includes(evt.color));
    }, [events, activeFilters]);

    if (loading) return <PageLoader />;

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">

            <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col min-h-0">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <CalendarIcon size={24} />
                            </div>
                            Calendar
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Manage your schedule and upcoming events
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            handleSelectSlot({
                                start: new Date(),
                                end: new Date(new Date().setHours(new Date().getHours() + 1))
                            });
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create Event</span>
                    </button>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">

                    {/* Sidebar */}
                    <div className="lg:col-span-3 xl:col-span-2 hidden lg:block h-full overflow-hidden">
                        <CalendarSidebar
                            events={events}
                            onSelectEvent={handleSelectEvent}
                            activeFilters={activeFilters}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Calendar Area */}
                    <div className="lg:col-span-9 xl:col-span-10 h-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative">
                        <BigCalendar
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            selectable
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            eventPropGetter={eventStyleGetter}
                            views={['month', 'week', 'day', 'agenda']}
                            components={{
                                toolbar: CustomToolbar
                            }}
                            className="text-gray-900 dark:text-gray-200 custom-calendar"
                        />
                    </div>
                </div>

            </div>

            <EventModal
                show={showModal}
                onClose={() => setShowModal(false)}
                event={selectedEvent}
                onSave={handleSave}
                onDelete={selectedEvent && selectedEvent._id ? handleDelete : null}
            />

            {/* Premium Calendar Styles */}
            <style>{`
                .custom-calendar {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                
                /* Removing default borders for a cleaner look */
                .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
                    border: none;
                }
                .rbc-header {
                    border-bottom: 1px solid #f3f4f6;
                    padding: 12px 0;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #9ca3af;
                }
                .dark .rbc-header {
                    border-bottom-color: #374151;
                    color: #6b7280;
                }

                /* Month View Cells */
                .rbc-month-row {
                    border-top: 1px solid #f3f4f6;
                }
                .dark .rbc-month-row {
                    border-top-color: #374151;
                }
                .rbc-day-bg + .rbc-day-bg {
                    border-left: 1px solid #f3f4f6;
                }
                .dark .rbc-day-bg + .rbc-day-bg {
                    border-left-color: #374151;
                }
                
                /* Date indicator */
                .rbc-date-cell {
                    padding: 8px;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #4b5563;
                }
                .dark .rbc-date-cell {
                    color: #9ca3af;
                }
                
                /* Current Day Highlight - Circle Style */
                .rbc-now.rbc-date-cell {
                    color: #4f46e5; /* indigo-600 */
                    font-weight: 700;
                    position: relative;
                }
                .rbc-now.rbc-date-cell > a {
                    background: #eef2ff;
                    color: #4f46e5;
                    width: 28px;
                    height: 28px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .dark .rbc-now.rbc-date-cell > a {
                    background: #312e81;
                    color: #818cf8;
                }

                /* Off-range dates */
                .rbc-off-range-bg {
                    background: #f9fafb;
                }
                .dark .rbc-off-range-bg {
                    background: #111827;
                }

                /* Events */
                .rbc-event {
                    border-radius: 6px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                /* Time Grid / Week View */
                .rbc-time-header-content {
                    border-left: 1px solid #f3f4f6;
                }
                .dark .rbc-time-header-content {
                    border-left-color: #374151;
                }
                .rbc-time-content {
                    border-top: 1px solid #f3f4f6;
                }
                .dark .rbc-time-content {
                    border-top-color: #374151;
                }
                .rbc-timeslot-group {
                    border-bottom: 1px solid #f9fafb;
                }
                .dark .rbc-timeslot-group {
                    border-bottom-color: #1f2937;
                }
                .rbc-time-gutter .rbc-timeslot-group {
                    border-bottom: 1px solid #f3f4f6;
                }
                .dark .rbc-time-gutter .rbc-timeslot-group {
                    border-bottom-color: #374151;
                }
                
                /* Today column highlight in week view */
                .rbc-day-slot.rbc-today {
                    background-color: transparent !important; /* Managed by day-bg usually, keeping simple */
                }
                
                /* Current time indicator line */
                .rbc-current-time-indicator {
                    background-color: #ef4444;
                    height: 2px;
                }
            `}</style>
        </div>
    );
};

export default CalendarPage;
