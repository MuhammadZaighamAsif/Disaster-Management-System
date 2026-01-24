import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faArrowLeft, 
  faUserNurse, 
  faLaptop,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faExclamationCircle,
  faFire,
  faClipboardCheck,
  faSearch,
  faFilter,
  faInbox
} from '@fortawesome/free-solid-svg-icons';

const ChooseTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'on-field', 'off-field'
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchAvailableTasks();
  }, []);

  const fetchAvailableTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers/tasks/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setTasks(result.data || []);
      } else {
        setError('Failed to load tasks');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = async (e) => {
    e.preventDefault();

    if (!selectedTaskId) {
      setError('Please select a task');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/volunteers/tasks/${selectedTaskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Task assigned successfully! Redirecting...');
        setTimeout(() => {
          navigate('/volunteer/dashboard');
        }, 1500);
      } else {
        setError(result.message || 'Failed to assign task');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error assigning task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const onFieldTasks = tasks.filter(task => task.fieldType === 'ON_FIELD');
  const offFieldTasks = tasks.filter(task => task.fieldType === 'OFF_FIELD');

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (filter === 'on-field') {
      filtered = onFieldTasks;
    } else if (filter === 'off-field') {
      filtered = offFieldTasks;
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const getPriorityConfig = (priority) => {
    const configs = {
      URGENT: { 
        bg: 'bg-red-500/20', 
        text: 'text-red-400', 
        border: 'border-red-500/40',
        icon: faExclamationCircle,
        glow: 'shadow-red-500/20'
      },
      HIGH: { 
        bg: 'bg-orange-500/20', 
        text: 'text-orange-400', 
        border: 'border-orange-500/40',
        icon: faExclamationTriangle,
        glow: 'shadow-orange-500/20'
      },
      MEDIUM: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-400', 
        border: 'border-yellow-500/40',
        icon: faFire,
        glow: 'shadow-yellow-500/20'
      },
      LOW: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-400', 
        border: 'border-green-500/40',
        icon: faCheckCircle,
        glow: 'shadow-green-500/20'
      }
    };
    return configs[priority] || configs.MEDIUM;
  };

  const renderTaskCard = (task) => {
    const spotsLeft = task.volunteersRequired - task.volunteersAssigned;
    const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0;
    const isFull = spotsLeft <= 0;
    const priorityConfig = getPriorityConfig(task.priority);
    const isSelected = selectedTaskId === task._id;
    const isOnField = task.fieldType === 'ON_FIELD';
    
    return (
      <label
        key={task._id}
        className={`block cursor-pointer transition-all duration-300 ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="radio"
          name="task"
          value={task._id}
          checked={isSelected}
          onChange={(e) => !isFull && setSelectedTaskId(e.target.value)}
          disabled={isFull}
          className="sr-only"
        />
        <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
          isSelected 
            ? `bg-[#4988C4]/20 border-[#4988C4] shadow-lg shadow-[#4988C4]/20` 
            : `bg-[#0a1628]/50 border-[#629FAD]/30 hover:border-[#4988C4]/50 hover:bg-[#0a1628]/70`
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isOnField ? 'bg-[#4988C4]/20' : 'bg-[#629FAD]/20'
              }`}>
                <FontAwesomeIcon 
                  icon={isOnField ? faUserNurse : faLaptop} 
                  className={`text-xl ${isOnField ? 'text-[#4988C4]' : 'text-[#629FAD]'}`} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{task.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{task.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                <FontAwesomeIcon icon={priorityConfig.icon} className="text-[10px]" />
                {task.priority}
              </span>
              {isAlmostFull && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  Almost Full
                </span>
              )}
              {isSelected && (
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#4988C4] text-lg" />
              )}
            </div>
          </div>
          
          {/* Task Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-[#0a1628]/50 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Type</p>
              <p className="text-white text-sm font-medium truncate">{task.taskType?.replace(/_/g, ' ') || 'General'}</p>
            </div>
            {task.location && (
              <div className="bg-[#0a1628]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" />
                  Location
                </p>
                <p className="text-white text-sm font-medium truncate">{task.location}</p>
              </div>
            )}
            {task.disaster?.name && (
              <div className="bg-[#0a1628]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faFire} className="text-[10px]" />
                  Disaster
                </p>
                <p className="text-white text-sm font-medium truncate">{task.disaster.name}</p>
              </div>
            )}
            {task.estimatedDuration && (
              <div className="bg-[#0a1628]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                  Duration
                </p>
                <p className="text-white text-sm font-medium">{task.estimatedDuration}h</p>
              </div>
            )}
          </div>

          {/* Footer - Volunteer Count */}
          <div className="flex items-center justify-between pt-4 border-t border-[#629FAD]/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-[#4988C4]" />
                <span className="text-white font-semibold">
                  {task.volunteersAssigned} / {task.volunteersRequired}
                </span>
                <span className="text-gray-400 text-sm">volunteers</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-[#0a1628] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    isFull ? 'bg-gray-500' : isAlmostFull ? 'bg-orange-500' : 'bg-[#4988C4]'
                  }`}
                  style={{ width: `${Math.min((task.volunteersAssigned / task.volunteersRequired) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${
                isFull ? 'text-gray-500' : spotsLeft <= 2 ? 'text-orange-400' : 'text-green-400'
              }`}>
                {isFull ? 'Full' : `${spotsLeft} left`}
              </span>
            </div>
          </div>
        </div>
      </label>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#4988C4] animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Loading available tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/volunteer/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Choose a Task</h1>
              <p className="text-gray-300 text-lg">Select a task that matches your availability and skills</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30 hidden md:block">
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#629FAD]/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faClipboardCheck} className="text-xl text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Available</p>
                <p className="text-2xl font-bold text-white">{tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#4988C4]/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUserNurse} className="text-xl text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">On-Field Tasks</p>
                <p className="text-2xl font-bold text-white">{onFieldTasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#629FAD]/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#629FAD]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faLaptop} className="text-xl text-[#629FAD]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Off-Field Tasks</p>
                <p className="text-2xl font-bold text-white">{offFieldTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/40 shadow-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-400" />
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-green-500/40 shadow-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-400" />
              <p className="text-green-300 font-medium">{success}</p>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          /* Empty State */
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#629FAD]/30 shadow-lg">
            <div className="w-20 h-20 bg-[#629FAD]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faInbox} className="text-4xl text-[#629FAD]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Tasks Available</h3>
            <p className="text-gray-400 mb-6">Check back later for new volunteer opportunities</p>
            <button
              onClick={() => navigate('/volunteer/dashboard')}
              className="px-6 py-3 bg-[#4988C4] text-white rounded-xl font-bold hover:bg-[#3a7ab5] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSelectTask}>
            {/* Filters */}
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 mb-6 border border-[#629FAD]/30 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faFilter} className="text-[#4988C4]" />
                  <span className="text-gray-400 font-medium">Filter by:</span>
                </div>
                
                {/* Field Type Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'all' 
                        ? 'bg-[#4988C4] text-white' 
                        : 'bg-[#0a1628]/50 text-gray-400 hover:text-white border border-[#629FAD]/30'
                    }`}
                  >
                    All Tasks
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('on-field')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      filter === 'on-field' 
                        ? 'bg-[#4988C4] text-white' 
                        : 'bg-[#0a1628]/50 text-gray-400 hover:text-white border border-[#629FAD]/30'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserNurse} />
                    On-Field
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('off-field')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      filter === 'off-field' 
                        ? 'bg-[#629FAD] text-white' 
                        : 'bg-[#0a1628]/50 text-gray-400 hover:text-white border border-[#629FAD]/30'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLaptop} />
                    Off-Field
                  </button>
                </div>

                <div className="md:ml-auto flex flex-wrap gap-2">
                  {['all', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => {
                    const config = priority !== 'all' ? getPriorityConfig(priority) : null;
                    return (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setPriorityFilter(priority)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          priorityFilter === priority 
                            ? priority === 'all' 
                              ? 'bg-[#4988C4] text-white' 
                              : `${config.bg} ${config.text} border ${config.border}`
                            : 'bg-[#0a1628]/50 text-gray-500 hover:text-gray-300 border border-[#629FAD]/20'
                        }`}
                      >
                        {priority === 'all' ? 'All Priorities' : priority}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 mb-6 border border-[#629FAD]/30 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <FontAwesomeIcon icon={faClipboardList} className="text-[#4988C4]" />
                  Available Tasks
                </h2>
                <span className="text-gray-400 text-sm">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </span>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-600 mb-4" />
                  <p className="text-gray-400">No tasks match your filters</p>
                  <button
                    type="button"
                    onClick={() => { setFilter('all'); setPriorityFilter('all'); }}
                    className="mt-4 text-[#4988C4] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map(renderTaskCard)}
                </div>
              )}
            </div>

            {/* Action Buttons - Sticky */}
            <div className=" bottom-4 bg-[#0F2854]/95 backdrop-blur-md p-6 rounded-2xl border border-[#4988C4]/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={!selectedTaskId || submitting}
                  className="flex-1 bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-[#3a7ab5] hover:to-[#5490a0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/20 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      Assigning Task...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Confirm Task Selection
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/volunteer/dashboard')}
                  className="flex-1 sm:flex-none sm:px-8 bg-[#0a1628] text-gray-300 py-4 px-6 rounded-xl font-bold text-lg border border-[#629FAD]/30 hover:bg-[#0F2854] hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
              {selectedTaskId && (
                <p className="text-center text-gray-400 text-sm mt-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#4988C4] mr-2" />
                  Task selected - Click confirm to proceed
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChooseTask;
