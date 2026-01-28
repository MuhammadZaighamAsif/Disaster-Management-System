import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faClipboardCheck,
  faClock,
  faPlay,
  faBan,
  faChevronDown,
  faChevronRight,
  faSave,
  faTimes,
  faFire,
  faExclamationCircle,
  faTasks,
  faInbox,
  faStickyNote,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';

const UpdateTasks = () => {
  const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState({});

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/volunteers/my-tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setAssignedTasks(data);
        // Initialize task updates
        const updates = {};
        data.forEach((task) => {
          updates[task._id] = { status: task.status, notes: '' };
        });
        setTaskUpdates(updates);
      }
    } catch (error) {
      setError('Failed to load assigned tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId) => {
    setUpdating(taskId);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/volunteers/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: taskUpdates[taskId].status,
          notes: taskUpdates[taskId].notes
        })
      });

      if (response.ok) {
        setSuccess('Task updated successfully!');
        fetchAssignedTasks();
        setExpandedTaskId(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update task');
      }
    } catch (error) {
      setError('Connection error');
      console.error('Error updating task:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      COMPLETED: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/40',
        icon: faCheckCircle,
        label: 'Completed'
      },
      IN_PROGRESS: {
        bg: 'bg-[#4988C4]/20',
        text: 'text-[#4988C4]',
        border: 'border-[#4988C4]/40',
        icon: faPlay,
        label: 'In Progress'
      },
      ASSIGNED: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        icon: faClock,
        label: 'Assigned'
      },
      AVAILABLE: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/40',
        icon: faTasks,
        label: 'Available'
      },
      CANCELLED: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/40',
        icon: faBan,
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.AVAILABLE;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      URGENT: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/40',
        icon: faExclamationCircle
      },
      HIGH: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        icon: faExclamationTriangle
      },
      MEDIUM: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        icon: faFire
      },
      LOW: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/40',
        icon: faCheckCircle
      }
    };
    return configs[priority] || configs.MEDIUM;
  };

  // Calculate stats
  const stats = {
    total: assignedTasks.length,
    inProgress: assignedTasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: assignedTasks.filter(t => t.status === 'COMPLETED').length,
    assigned: assignedTasks.filter(t => t.status === 'ASSIGNED').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#4988C4] animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Loading your tasks...</p>
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
              <h1 className="text-3xl font-bold mb-2 text-white">Update Tasks</h1>
              <p className="text-gray-300 text-lg">Track your progress and update task statuses</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30 hidden md:block">
              <FontAwesomeIcon icon={faListCheck} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-5 border border-[#629FAD]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faTasks} className="text-lg text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Total</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-5 border border-orange-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="text-lg text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Assigned</p>
                <p className="text-xl font-bold text-white">{stats.assigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-5 border border-[#4988C4]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faPlay} className="text-lg text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">In Progress</p>
                <p className="text-xl font-bold text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-5 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Completed</p>
                <p className="text-xl font-bold text-white">{stats.completed}</p>
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

        {assignedTasks.length === 0 ? (
          /* Empty State */
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#629FAD]/30 shadow-lg">
            <div className="w-20 h-20 bg-[#629FAD]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faInbox} className="text-4xl text-[#629FAD]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Assigned Tasks</h3>
            <p className="text-gray-400 mb-6">You don't have any tasks assigned yet</p>
            <button
              onClick={() => navigate('/volunteer/tasks')}
              className="px-6 py-3 bg-[#4988C4] text-white rounded-xl font-bold hover:bg-[#3a7ab5] transition-colors"
            >
              Browse Available Tasks
            </button>
          </div>
        ) : (
          /* Task List */
          <div className="space-y-4">
            {assignedTasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);
              const isExpanded = expandedTaskId === task._id;

              return (
                <div
                  key={task._id}
                  className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 shadow-lg overflow-hidden transition-all duration-300"
                >
                  {/* Task Header - Clickable */}
                  <div
                    className="p-6 cursor-pointer hover:bg-[#0F2854]/80 transition-colors"
                    onClick={() => setExpandedTaskId(isExpanded ? null : task._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusConfig.bg}`}>
                            <FontAwesomeIcon icon={statusConfig.icon} className={`text-xl ${statusConfig.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{task.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{task.description}</p>

                            {/* Task Meta */}
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                <FontAwesomeIcon icon={statusConfig.icon} className="text-[10px]" />
                                {statusConfig.label}
                              </span>

                              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                                <FontAwesomeIcon icon={priorityConfig.icon} className="text-[10px]" />
                                {task.priority}
                              </span>

                              {task.location && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0a1628]/50 text-gray-400 flex items-center gap-1.5">
                                  <FontAwesomeIcon icon={faLocationDot} className="text-[#4988C4]" />
                                  {task.location}
                                </span>
                              )}

                              {task.disaster?.name && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0a1628]/50 text-gray-400 flex items-center gap-1.5">
                                  <FontAwesomeIcon icon={faFire} className="text-orange-400" />
                                  {task.disaster.name}
                                </span>
                              )}

                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0a1628]/50 text-gray-400">
                                {task.taskType?.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-[#4988C4]/20 rotate-0' : 'bg-[#0a1628]/50'}`}>
                          <FontAwesomeIcon
                            icon={isExpanded ? faChevronDown : faChevronRight}
                            className={`text-lg transition-colors ${isExpanded ? 'text-[#4988C4]' : 'text-gray-500'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Update Form */}
                  {isExpanded && (
                    <div className="border-t border-[#629FAD]/20 bg-[#0a1628]/50 p-6 space-y-5">
                      {/* Status Select */}
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                          <FontAwesomeIcon icon={faClipboardCheck} className="text-[#4988C4]" />
                          Update Status
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => {
                            const config = getStatusConfig(status);
                            const isSelected = taskUpdates[task._id]?.status === status;
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  setTaskUpdates({
                                    ...taskUpdates,
                                    [task._id]: {
                                      ...taskUpdates[task._id],
                                      status: status
                                    }
                                  })
                                }
                                className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${isSelected
                                    ? `${config.bg} ${config.text} ${config.border} shadow-lg`
                                    : 'bg-[#0a1628]/70 border-[#629FAD]/30 text-gray-400 hover:border-[#629FAD]/50'
                                  }`}
                              >
                                <FontAwesomeIcon icon={config.icon} />
                                <span className="font-medium text-sm">{config.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes Textarea */}
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                          <FontAwesomeIcon icon={faStickyNote} className="text-[#4988C4]" />
                          Progress Notes
                        </label>
                        <textarea
                          rows="4"
                          value={taskUpdates[task._id]?.notes || ''}
                          onChange={(e) =>
                            setTaskUpdates({
                              ...taskUpdates,
                              [task._id]: {
                                ...taskUpdates[task._id],
                                notes: e.target.value
                              }
                            })
                          }
                          className="w-full px-4 py-3 bg-[#0a1628]/70 border border-[#629FAD]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-colors resize-none"
                          placeholder="Describe your progress, any issues encountered, or completion details..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          disabled={updating === task._id}
                          className="flex-1 bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-3 px-6 rounded-xl font-bold hover:from-[#3a7ab5] hover:to-[#5490a0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/20 flex items-center justify-center gap-2"
                        >
                          {updating === task._id ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} />
                              Save Update
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setExpandedTaskId(null)}
                          className="flex-1 sm:flex-none sm:px-8 bg-[#0F2854]/60 text-gray-300 py-3 px-6 rounded-xl font-bold border border-[#629FAD]/30 hover:bg-[#0F2854] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTasks;
