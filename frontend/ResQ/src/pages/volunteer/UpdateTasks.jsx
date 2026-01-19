import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const UpdateTasks = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState({});

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers/my-tasks', {
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/volunteers/tasks/${taskId}/status`, {
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
        alert('Task updated successfully!');
        fetchAssignedTasks();
        setExpandedTaskId(null);
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      alert('Connection error');
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374]">Loading assigned tasks...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-[#BDE8F5] text-[#0F2854] border-l-4 border-[#4988C4]';
      case 'ASSIGNED':
        return 'bg-orange-100 text-orange-800';
      case 'AVAILABLE':
        return 'bg-[#EDEDCE] text-[#0F2854]';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#EDEDCE] text-[#0F2854]';
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Update Tasks</h1>
          <p className="text-[#BDE8F5]">Track your progress and update task statuses</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}

        {assignedTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mb-12">
            <p className="text-[#296374] text-lg font-bold">No assigned tasks</p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {assignedTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-[#F9FDFB] transition"
                  onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-[#0F2854]">{task.title}</h3>
                      <p className="text-[#296374] mb-3">{task.description}</p>
                      <div className="flex gap-4 text-sm flex-wrap">
                        <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(task.status)}`}>
                          {task.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[#296374]">
                          <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-[#4988C4]" />
                          {task.location || 'No location specified'}
                        </span>
                        <span className="text-[#296374]">
                          {task.taskType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[#296374]">
                          Priority: {task.priority}
                        </span>
                        {task.disaster?.name && (
                          <span className="text-[#296374]">
                            {task.disaster.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl text-[#296374]">
                      {expandedTaskId === task._id ? '▼' : '▶'}
                    </div>
                  </div>
                </div>

                {expandedTaskId === task._id && (
                  <div className="border-t-2 border-[#90AB8B] bg-[#F9FDFB] p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0F2854] mb-2">
                        Update Status *
                      </label>
                      <select
                        value={taskUpdates[task._id]?.status || task.status}
                        onChange={(e) =>
                          setTaskUpdates({
                            ...taskUpdates,
                            [task._id]: {
                              ...taskUpdates[task._id],
                              status: e.target.value
                            }
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-white text-[#0F2854] font-semibold"
                      >
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0F2854] mb-2">
                        Progress Notes
                      </label>
                      <textarea
                        rows="3"
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
                        className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-white text-[#0F2854]"
                        placeholder="Describe progress, issues, or completion details..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="flex-1 bg-[#5A7863] text-white py-3 rounded-xl hover:bg-[#3B4953] transition font-bold"
                      >
                        Save Update
                      </button>
                      <button
                        onClick={() => setExpandedTaskId(null)}
                        className="flex-1 bg-[#EDEDCE] text-[#0F2854] py-3 rounded-xl hover:bg-[#E0E1C7] transition font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTasks;
