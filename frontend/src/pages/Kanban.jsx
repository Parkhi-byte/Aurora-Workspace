
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useKanban } from '../hooks/useKanban/useKanban';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import TaskModal from '../components/Kanban/TaskModal';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Plus, Search, PieChart as PieChartIcon, CheckSquare, Clock, Filter, List, ChevronDown } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';

const Kanban = () => {
  const {
    loading, isModalOpen, editingTask, showAnalytics, setShowAnalytics, searchQuery, setSearchQuery, filterPriority, setFilterPriority, formData, setFormData,
    groupedTasks, stats, priorityData, statusData, teamMembers, teams, selectedTeam, setSelectedTeam,
    onDragEnd, handleDeleteTask, openModal, closeModal, handleSaveTask
  } = useKanban();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openNewTask) {
      openModal();
      // Clear state to prevent reopening on refresh (optional, but good practice, though React Router state handles this relatively well on refresh usually, but safer to just run once)
      window.history.replaceState({}, document.title);
    }
  }, [location, openModal]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center space-x-3 bg-gray-50 dark:bg-gray-900">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden animate-fade-in">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-transparent bg-clip-text">Task Board</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage projects and track progress</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <select
                value={selectedTeam?.id || ''}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  setSelectedTeam(team);
                }}
                className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm text-gray-700 dark:text-gray-300 min-w-[150px]"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-2.5 rounded-xl transition-all shadow-sm ${showAnalytics
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              title="Toggle Analytics"
            >
              <PieChartIcon size={20} />
            </button>

            <button
              onClick={openModal}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
          {/* Analytics Sidebar - Overlay on mobile/tablet, Sidebar on Large screens */}
          <div className={`
            absolute lg:relative inset-y-0 right-0 z-30 w-full lg:w-80 bg-white/95 dark:bg-gray-900/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-l border-gray-200 dark:border-gray-800 lg:border-none transition-transform duration-300 ease-in-out transform
            ${showAnalytics ? 'translate-x-0' : 'translate-x-full lg:hidden'}
          `}>
            <div className="h-full overflow-y-auto p-6 space-y-6">
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="text-xl font-bold">Analytics</h2>
                <button onClick={() => setShowAnalytics(false)} className="text-gray-500">Close</button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Total Tasks</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <h3 className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-2">Completed</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.done}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <PieChartIcon size={16} className="text-blue-500" /> Priority Distribution
                </h3>
                <div className="h-48 relative">
                  <Doughnut data={priorityData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } } }} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <List size={16} className="text-purple-500" /> Status Breakdown
                </h3>
                <div className="h-40 relative">
                  <Bar data={statusData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } } }} />
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Board */}


          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 lg:p-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full min-w-max pb-4">
                <KanbanColumn
                  title="To Do"
                  items={groupedTasks.todo}
                  status="To Do"
                  onAdd={openModal}
                  onEdit={openModal}
                  onDelete={handleDeleteTask}
                  icon={List}
                />
                <KanbanColumn
                  title="In Progress"
                  items={groupedTasks.inprogress}
                  status="In Progress"
                  onAdd={openModal}
                  onEdit={openModal}
                  onDelete={handleDeleteTask}
                  icon={Clock}
                />
                <KanbanColumn
                  title="Done"
                  items={groupedTasks.done}
                  status="Done"
                  onAdd={openModal}
                  onEdit={openModal}
                  onDelete={handleDeleteTask}
                  icon={CheckSquare}
                />
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Floating Operations Button for Mobile */}
      <button
        onClick={() => openModal()}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        formData={formData}
        setFormData={setFormData}
        handleSaveTask={handleSaveTask}
        editingTask={editingTask}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default Kanban;
